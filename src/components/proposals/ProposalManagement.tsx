
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Download } from 'lucide-react';
import ProposalDialog from './ProposalDialog';
import { useProposals } from '@/hooks/useProposals';

const ProposalManagement = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const { proposals, addProposal, updateProposal } = useProposals();

  const getStatusColor = (status: string) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-800',
      'sent': 'bg-blue-100 text-blue-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proposal Management</h1>
          <p className="text-gray-600">Create and manage client proposals</p>
        </div>
        <Button onClick={() => { setSelectedProposal(null); setShowDialog(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Create Proposal
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Proposals ({proposals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Title</th>
                  <th className="text-left p-3">Client</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Value</th>
                  <th className="text-left p-3">Created</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((proposal) => (
                  <tr key={proposal.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{proposal.title}</td>
                    <td className="p-3">{proposal.client}</td>
                    <td className="p-3">
                      <Badge className={getStatusColor(proposal.status)}>
                        {proposal.status}
                      </Badge>
                    </td>
                    <td className="p-3">${proposal.value.toLocaleString()}</td>
                    <td className="p-3">{proposal.created_at}</td>
                    <td className="p-3 space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => { setSelectedProposal(proposal); setShowDialog(true); }}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        PDF
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ProposalDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        proposal={selectedProposal}
        onSave={(proposalData) => {
          if (selectedProposal) {
            updateProposal(selectedProposal.id, proposalData);
          } else {
            addProposal(proposalData);
          }
          setShowDialog(false);
        }}
      />
    </div>
  );
};

export default ProposalManagement;
