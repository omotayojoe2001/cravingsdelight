import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface StatusHistory {
  id: string;
  old_status: string | null;
  new_status: string;
  changed_by: string;
  notes: string | null;
  created_at: string;
}

interface InvoiceStatusHistoryProps {
  invoiceId: string | null;
  open: boolean;
  onClose: () => void;
}

export function InvoiceStatusHistory({ invoiceId, open, onClose }: InvoiceStatusHistoryProps) {
  const [history, setHistory] = useState<StatusHistory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (invoiceId && open) {
      fetchStatusHistory();
    }
  }, [invoiceId, open]);

  async function fetchStatusHistory() {
    if (!invoiceId) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('invoice_status_history')
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching status history:', error);
    } else {
      setHistory(data || []);
    }
    setLoading(false);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Invoice Status History</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Loading history...</p>
          ) : history.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No status changes recorded</p>
          ) : (
            history.map((entry, index) => (
              <div key={entry.id} className="border rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {entry.old_status && (
                      <>
                        <Badge className={getStatusColor(entry.old_status)}>
                          {entry.old_status.replace('_', ' ')}
                        </Badge>
                        <span className="text-muted-foreground">→</span>
                      </>
                    )}
                    <Badge className={getStatusColor(entry.new_status)}>
                      {entry.new_status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                  </span>
                </div>
                
                <div className="text-sm text-muted-foreground mb-1">
                  Changed by: {entry.changed_by}
                </div>
                
                {entry.notes && (
                  <div className="text-sm bg-gray-50 p-2 rounded mt-2">
                    <strong>Notes:</strong> {entry.notes}
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground mt-2">
                  {new Date(entry.created_at).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}