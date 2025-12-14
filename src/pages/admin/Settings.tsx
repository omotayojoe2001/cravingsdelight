import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

interface Setting {
  id: string;
  setting_key: string;
  setting_value: string;
  description: string;
}

interface DeliveryZone {
  id: number;
  postcode_prefix: string;
  area_name: string;
  delivery_fee: number;
  is_active: boolean;
}

export default function Settings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [newZone, setNewZone] = useState({ postcode_prefix: '', area_name: '', delivery_fee: 0 });

  useEffect(() => {
    fetchSettings();
    fetchDeliveryZones();
  }, []);

  async function fetchSettings() {
    const { data } = await supabase.from('site_settings').select('*').order('setting_key');
    if (data) {
      setSettings(data);
      const vals = data.reduce((acc, s) => ({ ...acc, [s.setting_key]: s.setting_value }), {});
      setValues(vals);
    }
  }

  async function fetchDeliveryZones() {
    const { data } = await supabase.from('delivery_zones').select('*').order('postcode_prefix');
    if (data) setDeliveryZones(data);
  }

  async function addDeliveryZone() {
    if (!newZone.postcode_prefix || !newZone.area_name || newZone.delivery_fee <= 0) {
      toast.error('Please fill all fields');
      return;
    }

    const { error } = await supabase.from('delivery_zones').insert(newZone);
    if (error) {
      toast.error('Failed to add zone');
    } else {
      toast.success('Delivery zone added');
      setNewZone({ postcode_prefix: '', area_name: '', delivery_fee: 0 });
      fetchDeliveryZones();
    }
  }

  async function deleteDeliveryZone(id: number) {
    const { error } = await supabase.from('delivery_zones').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete zone');
    } else {
      toast.success('Delivery zone deleted');
      fetchDeliveryZones();
    }
  }

  async function updateDeliveryZone(id: number, field: string, value: any) {
    const { error } = await supabase.from('delivery_zones').update({ [field]: value }).eq('id', id);
    if (error) {
      toast.error('Failed to update zone');
    } else {
      toast.success('Zone updated');
      fetchDeliveryZones();
    }
  }

  async function updateSetting(key: string) {
    // Check if setting exists, if not create it
    const { data: existing } = await supabase
      .from('site_settings')
      .select('id')
      .eq('setting_key', key)
      .single();

    let error;
    if (existing) {
      const { error: updateError } = await supabase
        .from('site_settings')
        .update({ setting_value: values[key] })
        .eq('setting_key', key);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('site_settings')
        .insert({
          setting_key: key,
          setting_value: values[key],
          description: key === 'delivery_fee' ? 'Delivery fee per order (£)' : key.replace('_', ' ').toUpperCase()
        });
      error = insertError;
    }

    if (error) {
      toast.error('Failed to update');
    } else {
      toast.success('Setting updated');
      fetchSettings();
    }
  }

  const settingGroups = {
    contact: settings.filter(s => ['contact_email', 'whatsapp_number', 'business_location'].includes(s.setting_key)),
    social: settings.filter(s => ['instagram_handle', 'instagram_url'].includes(s.setting_key)),
    operations: settings.filter(s => ['order_processing_time', 'shipping_note', 'delivery_fee_hull', 'delivery_fee_outside'].includes(s.setting_key))
  };

  return (
    <AdminLayout>
      <div className="h-full max-h-screen overflow-hidden flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <h1 className="font-display text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage website configuration</p>
        </div>

        {/* Settings Grid */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Contact Information */}
            <Card className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Contact Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {settingGroups.contact.map((setting) => (
                  <div key={setting.id}>
                    <Label className="text-xs font-medium mb-1 block">{setting.description}</Label>
                    <div className="flex gap-2">
                      <Input
                        value={values[setting.setting_key] || ''}
                        onChange={(e) => setValues({ ...values, [setting.setting_key]: e.target.value })}
                        className="flex-1 h-8 text-sm"
                      />
                      <Button onClick={() => updateSetting(setting.setting_key)} size="sm" className="h-8 px-3">
                        Save
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Social Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {settingGroups.social.map((setting) => (
                  <div key={setting.id}>
                    <Label className="text-xs font-medium mb-1 block">{setting.description}</Label>
                    <div className="flex gap-2">
                      <Input
                        value={values[setting.setting_key] || ''}
                        onChange={(e) => setValues({ ...values, [setting.setting_key]: e.target.value })}
                        className="flex-1 h-8 text-sm"
                      />
                      <Button onClick={() => updateSetting(setting.setting_key)} size="sm" className="h-8 px-3">
                        Save
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Operations */}
            <Card className="lg:col-span-2 h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Operations & Delivery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {settingGroups.operations.map((setting) => (
                  <div key={setting.id}>
                    <Label className="text-xs font-medium mb-1 block">{setting.description}</Label>
                    <div className="flex gap-2">
                      {setting.setting_key === 'shipping_note' ? (
                        <Textarea
                          value={values[setting.setting_key] || ''}
                          onChange={(e) => setValues({ ...values, [setting.setting_key]: e.target.value })}
                          className="flex-1 text-sm"
                          rows={2}
                        />
                      ) : setting.setting_key.includes('delivery_fee') ? (
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={values[setting.setting_key] || ''}
                          onChange={(e) => setValues({ ...values, [setting.setting_key]: e.target.value })}
                          className="flex-1 h-8 text-sm"
                          placeholder={setting.setting_key === 'delivery_fee_hull' ? '10.00' : '20.00'}
                        />
                      ) : (
                        <Input
                          value={values[setting.setting_key] || ''}
                          onChange={(e) => setValues({ ...values, [setting.setting_key]: e.target.value })}
                          className="flex-1 h-8 text-sm"
                        />
                      )}
                      <Button onClick={() => updateSetting(setting.setting_key)} size="sm" className="h-8 px-3">
                        Save
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Delivery Zones Management */}
            <Card className="lg:col-span-2 h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Delivery Zones</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add New Zone */}
                <div className="mb-4 p-3 bg-muted rounded-lg">
                  <Label className="text-sm font-medium mb-2 block">Add New Delivery Zone</Label>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <Input
                      placeholder="Postcode (e.g., HU1)"
                      value={newZone.postcode_prefix}
                      onChange={(e) => setNewZone({ ...newZone, postcode_prefix: e.target.value.toUpperCase() })}
                      className="h-8 text-sm"
                    />
                    <Input
                      placeholder="Area name"
                      value={newZone.area_name}
                      onChange={(e) => setNewZone({ ...newZone, area_name: e.target.value })}
                      className="h-8 text-sm"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Fee (£)"
                      value={newZone.delivery_fee || ''}
                      onChange={(e) => setNewZone({ ...newZone, delivery_fee: parseFloat(e.target.value) || 0 })}
                      className="h-8 text-sm"
                    />
                    <Button onClick={addDeliveryZone} size="sm" className="h-8">
                      <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                  </div>
                </div>

                {/* Existing Zones */}
                <div className="space-y-2 max-h-60 overflow-auto">
                  {deliveryZones.map((zone) => (
                    <div key={zone.id} className="flex items-center gap-2 p-2 border rounded">
                      <Input
                        value={zone.postcode_prefix}
                        onChange={(e) => updateDeliveryZone(zone.id, 'postcode_prefix', e.target.value.toUpperCase())}
                        className="w-20 h-7 text-xs"
                      />
                      <Input
                        value={zone.area_name}
                        onChange={(e) => updateDeliveryZone(zone.id, 'area_name', e.target.value)}
                        className="flex-1 h-7 text-xs"
                      />
                      <Input
                        type="number"
                        step="0.01"
                        value={zone.delivery_fee}
                        onChange={(e) => updateDeliveryZone(zone.id, 'delivery_fee', parseFloat(e.target.value))}
                        className="w-20 h-7 text-xs"
                      />
                      <Button
                        onClick={() => deleteDeliveryZone(zone.id)}
                        variant="destructive"
                        size="sm"
                        className="h-7 w-7 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
