import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Trash2, Phone, Share2, Settings, MapPin } from 'lucide-react';

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
      <div className="space-y-6">
        {/* Modern Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your restaurant configuration and preferences</p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card className="shadow-sm border-l-4 border-l-blue-500">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {settingGroups.contact.map((setting) => (
                  <div key={setting.id} className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">{setting.description}</Label>
                    <div className="flex gap-3">
                      <Input
                        value={values[setting.setting_key] || ''}
                        onChange={(e) => setValues({ ...values, [setting.setting_key]: e.target.value })}
                        className="flex-1"
                        placeholder={`Enter ${setting.description.toLowerCase()}`}
                      />
                      <Button 
                        onClick={() => updateSetting(setting.setting_key)} 
                        size="sm" 
                        className="px-4 shadow-sm"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="shadow-sm border-l-4 border-l-purple-500">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-white">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-purple-600" />
                  Social Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {settingGroups.social.map((setting) => (
                  <div key={setting.id} className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">{setting.description}</Label>
                    <div className="flex gap-3">
                      <Input
                        value={values[setting.setting_key] || ''}
                        onChange={(e) => setValues({ ...values, [setting.setting_key]: e.target.value })}
                        className="flex-1"
                        placeholder={`Enter ${setting.description.toLowerCase()}`}
                      />
                      <Button 
                        onClick={() => updateSetting(setting.setting_key)} 
                        size="sm" 
                        className="px-4 shadow-sm"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Operations */}
            <Card className="lg:col-span-2 shadow-sm border-l-4 border-l-green-500">
              <CardHeader className="bg-gradient-to-r from-green-50 to-white">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5 text-green-600" />
                  Operations & Delivery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {settingGroups.operations.map((setting) => (
                    <div key={setting.id} className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">{setting.description}</Label>
                      <div className="flex gap-3">
                        {setting.setting_key === 'shipping_note' ? (
                          <Textarea
                            value={values[setting.setting_key] || ''}
                            onChange={(e) => setValues({ ...values, [setting.setting_key]: e.target.value })}
                            className="flex-1"
                            rows={3}
                            placeholder="Enter shipping notes"
                          />
                        ) : setting.setting_key.includes('delivery_fee') ? (
                          <div className="flex gap-2 flex-1">
                            <div className="relative flex-1">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={values[setting.setting_key] || ''}
                                onChange={(e) => setValues({ ...values, [setting.setting_key]: e.target.value })}
                                className="pl-8"
                                placeholder={setting.setting_key === 'delivery_fee_hull' ? '10.00' : '20.00'}
                              />
                            </div>
                          </div>
                        ) : (
                          <Input
                            value={values[setting.setting_key] || ''}
                            onChange={(e) => setValues({ ...values, [setting.setting_key]: e.target.value })}
                            className="flex-1"
                            placeholder={`Enter ${setting.description.toLowerCase()}`}
                          />
                        )}
                        <Button 
                          onClick={() => updateSetting(setting.setting_key)} 
                          size="sm" 
                          className="px-4 shadow-sm"
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Zones Management */}
            <Card className="lg:col-span-2 shadow-sm border-l-4 border-l-orange-500">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-white">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-600" />
                  Delivery Zones
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Add New Zone */}
                <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                  <Label className="text-sm font-medium mb-3 block text-orange-800">Add New Delivery Zone</Label>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Input
                      placeholder="Postcode (e.g., HU1)"
                      value={newZone.postcode_prefix}
                      onChange={(e) => setNewZone({ ...newZone, postcode_prefix: e.target.value.toUpperCase() })}
                      className="bg-white"
                    />
                    <Input
                      placeholder="Area name"
                      value={newZone.area_name}
                      onChange={(e) => setNewZone({ ...newZone, area_name: e.target.value })}
                      className="bg-white"
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Fee"
                        value={newZone.delivery_fee || ''}
                        onChange={(e) => setNewZone({ ...newZone, delivery_fee: parseFloat(e.target.value) || 0 })}
                        className="pl-8 bg-white"
                      />
                    </div>
                    <Button onClick={addDeliveryZone} className="shadow-sm">
                      <Plus className="h-4 w-4 mr-2" /> Add Zone
                    </Button>
                  </div>
                </div>

                {/* Existing Zones */}
                <div className="space-y-3 max-h-80 overflow-auto">
                  {deliveryZones.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                      <p>No delivery zones configured</p>
                      <p className="text-sm">Add zones above to manage delivery pricing</p>
                    </div>
                  ) : (
                    deliveryZones.map((zone) => (
                      <div key={zone.id} className="flex items-center gap-3 p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow">
                        <div className="w-20">
                          <Input
                            value={zone.postcode_prefix}
                            onChange={(e) => updateDeliveryZone(zone.id, 'postcode_prefix', e.target.value.toUpperCase())}
                            className="text-center font-mono text-sm"
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            value={zone.area_name}
                            onChange={(e) => updateDeliveryZone(zone.id, 'area_name', e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div className="w-24 relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">£</span>
                          <Input
                            type="number"
                            step="0.01"
                            value={zone.delivery_fee}
                            onChange={(e) => updateDeliveryZone(zone.id, 'delivery_fee', parseFloat(e.target.value))}
                            className="pl-8 text-sm"
                          />
                        </div>
                        <Button
                          onClick={() => deleteDeliveryZone(zone.id)}
                          variant="destructive"
                          size="sm"
                          className="h-9 w-9 p-0 shadow-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
