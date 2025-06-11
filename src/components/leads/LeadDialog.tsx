import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/ui/file-upload';
import { Badge } from '@/components/ui/badge';

interface Memo {
  id: string;
  category: 'spare' | 'project' | 'service_provided' | 'key_account';
  content: string;
  created_at: string;
  created_by: string;
}

interface Lead {
  id: string;
  company: string;
  contact_name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  application: string;
  estimated_value: number;
  notes: string;
  attachments?: File[];
  memos?: Memo[];
  negotiation?: boolean;
}

interface LeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead | null;
  onSave: (leadData: Omit<Lead, 'id'>) => void;
  onAddMemo?: (leadId: string, memo: Omit<Memo, 'id' | 'created_at'>) => void;
}

const LeadDialog = ({ open, onOpenChange, lead, onSave, onAddMemo }: LeadDialogProps) => {
  const [formData, setFormData] = useState({
    company: '',
    contact_name: '',
    email: '',
    phone: '',
    status: 'new',
    source: 'website',
    application: 'Material & Warehouse Material Handling',
    estimated_value: 0,
    notes: '',
    negotiation: false,
  });

  const [attachments, setAttachments] = useState<File[]>([]);
  const [newMemo, setNewMemo] = useState({
    category: 'spare' as 'spare' | 'project' | 'service_provided' | 'key_account',
    content: '',
    created_by: 'Current User',
  });

  const applicationOptions = [
    'Material & Warehouse Material Handling',
    'Fluid Dispensing System',
    'Foundry Automation System',
    'Vision System',
    'Robotic AGV / AMR',
    'Robotic 3D Manufacturing',
    'Robots In Assembly lines',
    'Welding Automation'
  ];

  useEffect(() => {
    if (lead) {
      setFormData({
        company: lead.company,
        contact_name: lead.contact_name,
        email: lead.email,
        phone: lead.phone,
        status: lead.status,
        source: lead.source,
        application: lead.application || 'Material & Warehouse Material Handling',
        estimated_value: lead.estimated_value,
        notes: lead.notes,
        negotiation: lead.negotiation || false,
      });
      setAttachments(lead.attachments || []);
    } else {
      setFormData({
        company: '',
        contact_name: '',
        email: '',
        phone: '',
        status: 'new',
        source: 'website',
        application: 'Material & Warehouse Material Handling',
        estimated_value: 0,
        notes: '',
        negotiation: false,
      });
      setAttachments([]);
    }
  }, [lead, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, attachments, memos: lead?.memos || [] });
  };

  const handleAddMemo = () => {
    if (lead && onAddMemo && newMemo.content.trim()) {
      onAddMemo(lead.id, newMemo);
      setNewMemo({
        category: 'spare',
        content: '',
        created_by: 'Current User',
      });
    }
  };

  const getMemoColor = (category: string) => {
    const colors = {
      'spare': 'bg-blue-100 text-blue-800',
      'project': 'bg-green-100 text-green-800',
      'service_provided': 'bg-purple-100 text-purple-800',
      'key_account': 'bg-orange-100 text-orange-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{lead ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="contact_name">Contact Name</Label>
              <Input
                id="contact_name"
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="proposal_sent">Proposal Sent</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
                <option value="hold">Hold</option>
              </select>
            </div>
            <div>
              <Label htmlFor="source">Source</Label>
              <select
                id="source"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="website">Website</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="referral">Referral</option>
                <option value="social_media">Social Media</option>
                <option value="trade_show">Trade Show</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="application">Application</Label>
              <select
                id="application"
                value={formData.application}
                onChange={(e) => setFormData({ ...formData, application: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {applicationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="estimated_value">Estimated Value ($)</Label>
              <Input
                id="estimated_value"
                type="number"
                value={formData.estimated_value}
                onChange={(e) => setFormData({ ...formData, estimated_value: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="negotiation"
              checked={formData.negotiation}
              onChange={(e) => setFormData({ ...formData, negotiation: e.target.checked })}
            />
            <Label htmlFor="negotiation">Mark for Negotiation</Label>
          </div>

          <FileUpload
            files={attachments}
            onFilesChange={setAttachments}
            label="Lead Attachments"
            maxFiles={5}
          />

          {/* Memos Section */}
          {lead && (
            <div className="space-y-4">
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Memos</h3>
                
                {/* Add New Memo */}
                <div className="space-y-3 mb-4">
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={newMemo.category}
                      onChange={(e) => setNewMemo({ ...newMemo, category: e.target.value as any })}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="spare">Spare</option>
                      <option value="project">Project</option>
                      <option value="service_provided">Service Provided</option>
                      <option value="key_account">Key Account</option>
                    </select>
                    <Textarea
                      placeholder="Add memo..."
                      value={newMemo.content}
                      onChange={(e) => setNewMemo({ ...newMemo, content: e.target.value })}
                      rows={2}
                      className="col-span-2"
                    />
                  </div>
                  <Button type="button" onClick={handleAddMemo} size="sm">
                    Add Memo
                  </Button>
                </div>

                {/* Display Existing Memos */}
                <div className="space-y-2">
                  {(lead.memos || []).map((memo) => (
                    <div key={memo.id} className="p-3 border rounded-md bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getMemoColor(memo.category)}>
                          {memo.category.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(memo.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{memo.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {lead ? 'Update Lead' : 'Add Lead'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDialog;
