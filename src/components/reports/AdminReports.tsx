
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Download, Filter } from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';
import { useProposals } from '@/hooks/useProposals';
import { useUsers } from '@/hooks/useUsers';

const AdminReports = () => {
  const [selectedUser, setSelectedUser] = useState('all');
  const [reportType, setReportType] = useState('leads');
  
  const { leads } = useLeads();
  const { proposals } = useProposals();
  const { users } = useUsers();

  const filteredLeads = selectedUser === 'all' 
    ? leads 
    : leads.filter(lead => lead.assigned_to === selectedUser);

  const filteredProposals = selectedUser === 'all' 
    ? proposals 
    : proposals.filter(proposal => proposal.assigned_to === selectedUser);

  const getStatusColor = (status: string) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800',
      'contacted': 'bg-yellow-100 text-yellow-800',
      'proposal_sent': 'bg-purple-100 text-purple-800',
      'negotiation': 'bg-orange-100 text-orange-800',
      'won': 'bg-green-100 text-green-800',
      'lost': 'bg-red-100 text-red-800',
      'hold': 'bg-gray-100 text-gray-800',
      'draft': 'bg-gray-100 text-gray-800',
      'sent': 'bg-blue-100 text-blue-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unassigned';
  };

  const downloadReport = () => {
    const data = reportType === 'leads' ? filteredLeads : filteredProposals;
    const csvContent = "data:text/csv;charset=utf-8," + 
      [
        Object.keys(data[0] || {}).join(","),
        ...data.map(row => Object.values(row).join(","))
      ].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${reportType}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Reports</h1>
          <p className="text-gray-600">View and download comprehensive reports</p>
        </div>
        <Button onClick={downloadReport}>
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="reportType">Report Type</Label>
              <select
                id="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="leads">Leads Report</option>
                <option value="proposals">Proposals Report</option>
              </select>
            </div>
            <div className="flex-1">
              <Label htmlFor="userFilter">Filter by User</Label>
              <select
                id="userFilter"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Users</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads Report */}
      {reportType === 'leads' && (
        <Card>
          <CardHeader>
            <CardTitle>
              Leads Report ({filteredLeads.length})
              {selectedUser !== 'all' && ` - ${getUserName(selectedUser)}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Company</th>
                    <th className="text-left p-3">Contact</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Assigned To</th>
                    <th className="text-left p-3">Value</th>
                    <th className="text-left p-3">Source</th>
                    <th className="text-left p-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{lead.company}</td>
                      <td className="p-3">{lead.contact_name}</td>
                      <td className="p-3">
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-3">{getUserName(lead.assigned_to || '')}</td>
                      <td className="p-3">${lead.estimated_value?.toLocaleString()}</td>
                      <td className="p-3">{lead.source}</td>
                      <td className="p-3">{new Date(lead.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Proposals Report */}
      {reportType === 'proposals' && (
        <Card>
          <CardHeader>
            <CardTitle>
              Proposals Report ({filteredProposals.length})
              {selectedUser !== 'all' && ` - ${getUserName(selectedUser)}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Title</th>
                    <th className="text-left p-3">Client</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Assigned To</th>
                    <th className="text-left p-3">Value</th>
                    <th className="text-left p-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProposals.map((proposal) => (
                    <tr key={proposal.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{proposal.title}</td>
                      <td className="p-3">{proposal.client}</td>
                      <td className="p-3">
                        <Badge className={getStatusColor(proposal.status)}>
                          {proposal.status}
                        </Badge>
                      </td>
                      <td className="p-3">{getUserName(proposal.assigned_to || '')}</td>
                      <td className="p-3">${proposal.value?.toLocaleString()}</td>
                      <td className="p-3">{new Date(proposal.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminReports;
