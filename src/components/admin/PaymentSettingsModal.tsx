import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Building, CreditCard, Save } from 'lucide-react';

interface PaymentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentSettingsModal({ isOpen, onClose }: PaymentSettingsModalProps) {
  const [bankSettings, setBankSettings] = useState({
    account_name: 'Cravings Delight Ltd',
    account_number: '',
    sort_code: '',
    bank_name: '',
    iban: '',
    swift: ''
  });
  
  const [paypalSettings, setPaypalSettings] = useState({
    email: '',
    business_name: 'Cravings Delight'
  });
  
  const [stripeSettings, setStripeSettings] = useState({
    publishable_key: '',
    webhook_endpoint: ''
  });
  
  const [activeSettings, setActiveSettings] = useState({
    bank_transfer: true,
    paypal: false,
    stripe: false
  });
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  async function loadSettings() {
    const { data } = await supabase.from('payment_settings').select('*');
    if (data) {
      data.forEach(setting => {
        setActiveSettings(prev => ({ ...prev, [setting.method_type]: setting.is_active }));
        
        if (setting.method_type === 'bank_transfer') {
          setBankSettings({ ...bankSettings, ...setting.settings });
        } else if (setting.method_type === 'paypal') {
          setPaypalSettings({ ...paypalSettings, ...setting.settings });
        } else if (setting.method_type === 'stripe') {
          setStripeSettings({ ...stripeSettings, ...setting.settings });
        }
      });
    }
  }

  async function saveSettings() {
    setIsLoading(true);
    try {
      const updates = [
        {
          method_type: 'bank_transfer',
          is_active: activeSettings.bank_transfer,
          settings: bankSettings
        },
        {
          method_type: 'paypal',
          is_active: activeSettings.paypal,
          settings: paypalSettings
        },
        {
          method_type: 'stripe',
          is_active: activeSettings.stripe,
          settings: stripeSettings
        }
      ];

      for (const update of updates) {
        await supabase
          .from('payment_settings')
          .upsert(update, { onConflict: 'method_type' });
      }

      toast.success('Payment settings saved successfully');
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payment Method Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="bank" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
            <TabsTrigger value="paypal">PayPal</TabsTrigger>
            <TabsTrigger value="stripe">Stripe</TabsTrigger>
          </TabsList>

          <TabsContent value="bank">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Bank Transfer Settings
                  </div>
                  <Switch
                    checked={activeSettings.bank_transfer}
                    onCheckedChange={(checked) => 
                      setActiveSettings(prev => ({ ...prev, bank_transfer: checked }))
                    }
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bank-account-name">Account Name</Label>
                    <Input
                      id="bank-account-name"
                      value={bankSettings.account_name}
                      onChange={(e) => setBankSettings({...bankSettings, account_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank-account-number">Account Number</Label>
                    <Input
                      id="bank-account-number"
                      value={bankSettings.account_number}
                      onChange={(e) => setBankSettings({...bankSettings, account_number: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank-sort-code">Sort Code</Label>
                    <Input
                      id="bank-sort-code"
                      value={bankSettings.sort_code}
                      onChange={(e) => setBankSettings({...bankSettings, sort_code: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank-name">Bank Name</Label>
                    <Input
                      id="bank-name"
                      value={bankSettings.bank_name}
                      onChange={(e) => setBankSettings({...bankSettings, bank_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank-iban">IBAN (Optional)</Label>
                    <Input
                      id="bank-iban"
                      value={bankSettings.iban}
                      onChange={(e) => setBankSettings({...bankSettings, iban: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank-swift">SWIFT Code (Optional)</Label>
                    <Input
                      id="bank-swift"
                      value={bankSettings.swift}
                      onChange={(e) => setBankSettings({...bankSettings, swift: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="paypal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    PayPal Settings
                  </div>
                  <Switch
                    checked={activeSettings.paypal}
                    onCheckedChange={(checked) => 
                      setActiveSettings(prev => ({ ...prev, paypal: checked }))
                    }
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="paypal-email">PayPal Business Email</Label>
                  <Input
                    id="paypal-email"
                    type="email"
                    value={paypalSettings.email}
                    onChange={(e) => setPaypalSettings({...paypalSettings, email: e.target.value})}
                    placeholder="business@cravingsdelight.co.uk"
                  />
                </div>
                <div>
                  <Label htmlFor="paypal-business-name">Business Name</Label>
                  <Input
                    id="paypal-business-name"
                    value={paypalSettings.business_name}
                    onChange={(e) => setPaypalSettings({...paypalSettings, business_name: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stripe">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Stripe Settings
                  </div>
                  <Switch
                    checked={activeSettings.stripe}
                    onCheckedChange={(checked) => 
                      setActiveSettings(prev => ({ ...prev, stripe: checked }))
                    }
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="stripe-publishable-key">Publishable Key</Label>
                  <Input
                    id="stripe-publishable-key"
                    value={stripeSettings.publishable_key}
                    onChange={(e) => setStripeSettings({...stripeSettings, publishable_key: e.target.value})}
                    placeholder="pk_live_..."
                  />
                </div>
                <div>
                  <Label htmlFor="stripe-webhook">Webhook Endpoint</Label>
                  <Input
                    id="stripe-webhook"
                    value={stripeSettings.webhook_endpoint}
                    onChange={(e) => setStripeSettings({...stripeSettings, webhook_endpoint: e.target.value})}
                    placeholder="https://your-domain.com/api/stripe-webhook"
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                  <p className="text-sm text-blue-800">
                    Stripe payment links will be automatically generated for invoices. 
                    Make sure your Stripe account is properly configured for payment links.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={saveSettings} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}