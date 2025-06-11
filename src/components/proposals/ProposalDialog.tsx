import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/ui/file-upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProducts } from '@/hooks/useProducts';
import { useSpareParts } from '@/hooks/useSpareParts';
import { useAuth } from '@/hooks/useAuth';

interface FollowUpHistory {
  id: string;
  date: string;
  action: string;
  notes: string;
  created_by: string;
}

interface Proposal {
  id: string;
  title: string;
  client: string;
  status: string;
  value: number;
  description: string;
  created_at: string;
  attachments?: File[];
  productId?: string;
  sparePartIds?: string[];
  followUpHistory?: FollowUpHistory[];
  assigned_to?: string;
}

interface ProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposal?: any | null;
  onSave: (proposalData: any) => void;
  onAddFollowUp?: (proposalId: string, followUp: any) => void;
}

const ProposalDialog = ({ open, onOpenChange, proposal, onSave, onAddFollowUp }: ProposalDialogProps) => {
  const { user } = useAuth();
  const { products } = useProducts();
  const { spareParts } = useSpareParts();

  const [formData, setFormData] = useState({
    title: '',
    client: '',
    status: 'draft',
    value: 0,
    description: '',
    productId: '',
    sparePartIds: [] as string[],
  });

  const [attachments, setAttachments] = useState<File[]>([]);
  const [newFollowUp, setNewFollowUp] = useState({
    action: '',
    notes: '',
    created_by: user?.name || 'Current User',
    date: new Date().toISOString(),
  });

  useEffect(() => {
    if (proposal) {
      setFormData({
        title: proposal.title,
        client: proposal.client,
        status: proposal.status,
        value: proposal.value,
        description: proposal.description,
        productId: proposal.productId || '',
        sparePartIds: proposal.sparePartIds || [],
      });
      setAttachments(proposal.attachments || []);
    } else {
      setFormData({
        title: '',
        client: '',
        status: 'draft',
        value: 0,
        description: '',
        productId: '',
        sparePartIds: [],
      });
      setAttachments([]);
    }
  }, [proposal, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, attachments, followUpHistory: proposal?.followUpHistory || [] });
  };

  const handleAddFollowUp = () => {
    if (proposal && onAddFollowUp && newFollowUp.action.trim()) {
      onAddFollowUp(proposal.id, newFollowUp);
      setNewFollowUp({
        action: '',
        notes: '',
        created_by: user?.name || 'Current User',
        date: new Date().toISOString(),
      });
    }
  };

  const handleSparePartChange = (sparePartId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        sparePartIds: [...prev.sparePartIds, sparePartId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        sparePartIds: prev.sparePartIds.filter(id => id !== sparePartId)
      }));
    }
  };

  const selectedProduct = products.find(p => p.id === formData.productId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{proposal ? 'Edit Proposal' : 'Create New Proposal'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Proposal Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="client">Client</Label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <Label htmlFor="value">Value ($)</Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* Product Selection */}
          <div>
            <Label htmlFor="productId">Select Product</Label>
            <select
              id="productId"
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a product...</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.robot} - {product.brand}
                </option>
              ))}
            </select>
            {selectedProduct && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>Robot:</strong> {selectedProduct.robot}</div>
                  <div><strong>Controller:</strong> {selectedProduct.controller}</div>
                  <div><strong>Reach:</strong> {selectedProduct.reach}mm</div>
                  <div><strong>Payload:</strong> {selectedProduct.payload}kg</div>
                </div>
              </div>
            )}
          </div>

          {/* Spare Parts Selection */}
          <div>
            <Label>Select Spare Parts</Label>
            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
              {spareParts.map((sparePart) => (
                <div key={sparePart.id} className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    checked={formData.sparePartIds.includes(sparePart.id)}
                    onChange={(e) => handleSparePartChange(sparePart.id, e.target.checked)}
                  />
                  <span className="text-sm">
                    {sparePart.name} - {sparePart.partNumber} (${sparePart.price})
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <FileUpload
            files={attachments}
            onFilesChange={setAttachments}
            label="Proposal Documents"
            maxFiles={10}
            acceptedTypes=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
          />

          {/* Follow-up History for Proposals */}
          {proposal && (
            <Card>
              <CardHeader>
                <CardTitle>Follow-up History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Follow-up */}
                <div className="space-y-2">
                  <Input
                    placeholder="Follow-up action"
                    value={newFollowUp.action}
                    onChange={(e) => setNewFollowUp({ ...newFollowUp, action: e.target.value })}
                  />
                  <Textarea
                    placeholder="Notes"
                    value={newFollowUp.notes}
                    onChange={(e) => setNewFollowUp({ ...newFollowUp, notes: e.target.value })}
                    rows={2}
                  />
                  <Button type="button" onClick={handleAddFollowUp} size="sm">
                    Add Follow-up
                  </Button>
                </div>

                {/* Display History */}
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {(proposal.followUpHistory || []).map((followUp: any) => (
                    <div key={followUp.id} className="p-3 border rounded-md bg-gray-50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{followUp.action}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(followUp.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{followUp.notes}</p>
                      <p className="text-xs text-gray-500">by {followUp.created_by}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {proposal ? 'Update Proposal' : 'Create Proposal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProposalDialog;
