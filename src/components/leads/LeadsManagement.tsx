import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter } from 'lucide-react';
import LeadDialog from './LeadDialog';
import { useLeads } from '@/hooks/useLeads';

const LeadsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNegotiationOnly, setShowNegotiationOnly] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  
  const { leads, addLead, updateLead, deleteLead, getNegotiationLeads, addMemo, addFollowUp } = useLeads();

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.contact_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesNegotiation = !showNegotiationOnly || lead.negotiation === true;
    return matchesSearch && matchesStatus && matchesNegotiation;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800',
      'contacted': 'bg-yellow-100 text-yellow-800',
      'proposal_sent': 'bg-purple-100 text-purple-800',
      'negotiation': 'bg-orange-100 text-orange-800',
      'won': 'bg-green-100 text-green-800',
      'lost': 'bg-red-100 text-red-800',
      'hold': 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const negotiationLeads = getNegotiationLeads();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
          <p className="text-gray-600">Manage and track your sales leads</p>
        </div>
        <Button onClick={() => { setSelectedLead(null); setShowDialog(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Negotiation Summary */}
      {negotiationLeads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">Leads in Negotiation ({negotiationLeads.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {negotiationLeads.slice(0, 3).map((lead) => (
                <div key={lead.id} className="p-3 border border-orange-200 rounded-md bg-orange-50">
                  <div className="font-medium">{lead.company}</div>
                  <div className="text-sm text-gray-600">{lead.contact_name}</div>
                  <div className="text-sm font-medium text-orange-600">
                    ${lead.estimated_value?.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="mt-3"
              onClick={() => setShowNegotiationOnly(true)}
            >
              View All Negotiation Leads
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="proposal_sent">Proposal Sent</option>
              <option value="negotiation">Negotiation</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
              <option value="hold">Hold</option>
            </select>
            <Button
              variant={showNegotiationOnly ? "default" : "outline"}
              onClick={() => setShowNegotiationOnly(!showNegotiationOnly)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showNegotiationOnly ? 'Show All' : 'Negotiation Only'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Leads ({filteredLeads.length})
            {showNegotiationOnly && ' - Negotiation Filter Active'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Company</th>
                  <th className="text-left p-3">Contact</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Application</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Source</th>
                  <th className="text-left p-3">Value</th>
                  <th className="text-left p-3">Memos</th>
                  <th className="text-left p-3">Follow-ups</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-medium">{lead.company}</div>
                      {lead.negotiation && (
                        <Badge className="bg-orange-100 text-orange-800 text-xs mt-1">
                          Negotiation
                        </Badge>
                      )}
                    </td>
                    <td className="p-3">{lead.contact_name}</td>
                    <td className="p-3">{lead.email}</td>
                    <td className="p-3 text-xs">{lead.application}</td>
                    <td className="p-3">
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-3">{lead.source}</td>
                    <td className="p-3">${lead.estimated_value?.toLocaleString()}</td>
                    <td className="p-3">
                      {lead.memos && lead.memos.length > 0 && (
                        <Badge variant="outline">
                          {lead.memos.length} memo{lead.memos.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </td>
                    <td className="p-3">
                      {lead.followUpHistory && lead.followUpHistory.length > 0 && (
                        <Badge variant="outline">
                          {lead.followUpHistory.length} follow-up{lead.followUpHistory.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setSelectedLead(lead); setShowDialog(true); }}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <LeadDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        lead={selectedLead}
        onSave={(leadData) => {
          if (selectedLead) {
            updateLead(selectedLead.id, leadData);
          } else {
            addLead(leadData);
          }
          setShowDialog(false);
        }}
        onAddMemo={addMemo}
        onAddFollowUp={addFollowUp}
      />
    </div>
  );
};

export default LeadsManagement;
