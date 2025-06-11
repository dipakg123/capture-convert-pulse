
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Proposal {
  id: string;
  title: string;
  client: string;
  status: string;
  value: number;
  description: string;
  created_at: string;
}

interface ProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposal?: Proposal | null;
  onSave: (proposalData: Omit<Proposal, 'id' | 'created_at'>) => void;
}

const ProposalDialog = ({ open, onOpenChange, proposal, onSave }: ProposalDialogProps) => {
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    status: 'draft',
    value: 0,
    description: '',
  });

  useEffect(() => {
    if (proposal) {
      setFormData({
        title: proposal.title,
        client: proposal.client,
        status: proposal.status,
        value: proposal.value,
        description: proposal.description,
      });
    } else {
      setFormData({
        title: '',
        client: '',
        status: 'draft',
        value: 0,
        description: '',
      });
    }
  }, [proposal, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
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

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

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
