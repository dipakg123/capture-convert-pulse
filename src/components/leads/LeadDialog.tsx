import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/ui/file-upload';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProducts } from '@/hooks/useProducts';
import { useSpareParts } from '@/hooks/useSpareParts';
import { useUsers } from '@/hooks/useUsers';
import { useAuth } from '@/hooks/useAuth';

interface FollowUpHistory {
  id: string;
  date: string;
  action: string;
  notes: string;
  created_by: string;
}

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
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  attachments?: File[];
  memos?: Memo[];
  negotiation?: boolean;
  productId?: string;
  sparePartIds?: string[];
  followUpHistory?: FollowUpHistory[];
}

interface LeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: any | null;
  onSave: (leadData: any) => void;
  onAddMemo?: (leadId: string, memo: any) => void;
  onAddFollowUp?: (leadId: string, followUp: any) => void;
}

const LeadDialog = ({ open, onOpenChange, lead, onSave, onAddMemo, onAddFollowUp }: LeadDialogProps) => {
  const { user } = useAuth();
  const { products } = useProducts();
  const { spareParts } = useSpareParts();
  const { users } = useUsers();

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
    assigned_to: '',
    productId: '',
    sparePartIds: [] as string[],
  });

  const [attachments, setAttachments] = useState<File[]>([]);
  const [newMemo, setNewMemo] = useState({
    category: 'spare' as 'spare' | 'project' | 'service_provided' | 'key_account',
    content: '',
    created_by: user?.name || 'Current User',
  });

  const [newFollowUp, setNewFollowUp] = useState({
    action: '',
    notes: '',
    created_by: user?.name || 'Current User',
    date: new Date().toISOString(),
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

  const salesEngineers = users.filter(u => u.role === 'sales_engineer' || u.role === 'manager');

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
        assigned_to: lead.assigned_to || '',
        productId: lead.productId || '',
        sparePartIds: lead.sparePartIds || [],
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
        assigned_to: '',
        productId: '',
        sparePartIds: [],
      });
      setAttachments([]);
    }
  }, [lead, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, attachments, memos: lead?.memos || [], followUpHistory: lead?.followUpHistory || [] });
  };

  const handleAddMemo = () => {
    if (lead && onAddMemo && newMemo.content.trim()) {
      onAddMemo(lead.id, newMemo);
      setNewMemo({
        category: 'spare',
        content: '',
        created_by: user?.name || 'Current User',
      });
    }
  };

  const handleAddFollowUp = () => {
    if (lead && onAddFollowUp && newFollowUp.action.trim()) {
      onAddFollowUp(lead.id, newFollowUp);
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

  const getMemoColor = (category: string) => {
    const colors = {
      'spare': 'bg-blue-100 text-blue-800',
      'project': 'bg-green-100 text-green-800',
      'service_provided': 'bg-purple-100 text-purple-800',
      'key_account': 'bg-orange-100 text-orange-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const selectedProduct = products.find(p => p.id === formData.productId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
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

          {/* Assignment (Admin only) */}
          {user?.role === 'admin' && (
            <div>
              <Label htmlFor="assigned_to">Assign To</Label>
              <select
                id="assigned_to"
                value={formData.assigned_to}
                onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Unassigned</option>
                {salesEngineers.map((engineer) => (
                  <option key={engineer.id} value={engineer.id}>
                    {engineer.name} ({engineer.role})
                  </option>
                ))}
              </select>
            </div>
          )}

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

          {/* Customer History & Memos Section */}
          {lead && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Follow-up History */}
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
                    {(lead.followUpHistory || []).map((followUp: any) => (
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

              {/* Memos */}
              <Card>
                <CardHeader>
                  <CardTitle>Memos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Memo */}
                  <div className="space-y-2">
                    <select
                      value={newMemo.category}
                      onChange={(e) => setNewMemo({ ...newMemo, category: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
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
                    />
                    <Button type="button" onClick={handleAddMemo} size="sm">
                      Add Memo
                    </Button>
                  </div>

                  {/* Display Memos */}
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {(lead.memos || []).map((memo: any) => (
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
                </CardContent>
              </Card>
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
