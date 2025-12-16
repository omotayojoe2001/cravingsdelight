import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { setupInvoiceSystem } from '@/utils/setup-invoices';
import { toast } from 'sonner';
import { Database, CheckCircle, AlertCircle } from 'lucide-react';

export default function DatabaseSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);

  const handleSetup = async () => {
    setIsLoading(true);
    try {
      const success = await setupInvoiceSystem();
      if (success) {
        setSetupComplete(true);
        toast.success('Invoice system setup completed successfully!');
      } else {
        toast.error('Setup failed. Please check console for details.');
      }
    } catch (error) {
      console.error('Setup error:', error);
      toast.error('Setup failed with error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Database Setup</h1>
          <p className="text-muted-foreground">Setup required database tables for the invoice system</p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Invoice System Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                This will create the following database tables:
              </p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• <code>invoices</code> - Store invoice data</li>
                <li>• <code>payment_settings</code> - Payment method configuration</li>
              </ul>
            </div>

            {setupComplete ? (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">Setup completed successfully!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <span className="text-yellow-800">Database tables need to be created</span>
              </div>
            )}

            <Button 
              onClick={handleSetup} 
              disabled={isLoading || setupComplete}
              className="w-full"
            >
              {isLoading ? 'Setting up...' : setupComplete ? 'Setup Complete' : 'Setup Database Tables'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}