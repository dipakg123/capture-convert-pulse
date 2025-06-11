
import { useState, useEffect } from 'react';

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

// Mock data for demonstration
const mockLeads: Lead[] = [
  {
    id: '1',
    company: 'Tech Solutions Inc',
    contact_name: 'John Smith',
    email: 'john@techsolutions.com',
    phone: '+1-234-567-8901',
    status: 'new',
    source: 'website',
    application: 'Material & Warehouse Material Handling',
    estimated_value: 50000,
    notes: 'Interested in our enterprise solution',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    memos: [],
    negotiation: false,
    followUpHistory: [
      {
        id: '1',
        date: '2024-01-16T09:00:00Z',
        action: 'Initial Contact',
        notes: 'First call made to discuss requirements',
        created_by: 'Jane Engineer'
      }
    ],
    sparePartIds: [],
  },
  {
    id: '2',
    company: 'Global Manufacturing',
    contact_name: 'Sarah Johnson',
    email: 'sarah@globalmfg.com',
    phone: '+1-234-567-8902',
    status: 'contacted',
    source: 'referral',
    application: 'Robotic AGV / AMR',
    estimated_value: 75000,
    notes: 'Follow up next week for proposal discussion',
    assigned_to: '2',
    created_at: '2024-01-14T14:20:00Z',
    updated_at: '2024-01-16T09:15:00Z',
    memos: [],
    negotiation: true,
    followUpHistory: [
      {
        id: '2',
        date: '2024-01-15T14:00:00Z',
        action: 'Follow-up Call',
        notes: 'Discussed technical requirements',
        created_by: 'Jane Engineer'
      },
      {
        id: '3',
        date: '2024-01-16T10:00:00Z',
        action: 'Email Sent',
        notes: 'Sent product catalog and pricing',
        created_by: 'Jane Engineer'
      }
    ],
    sparePartIds: ['1'],
  },
  {
    id: '3',
    company: 'Innovation Labs',
    contact_name: 'Mike Chen',
    email: 'mike@innovationlabs.com',
    phone: '+1-234-567-8903',
    status: 'proposal_sent',
    source: 'email',
    application: 'Vision System',
    estimated_value: 120000,
    notes: 'Proposal sent on Monday, awaiting response',
    assigned_to: '3',
    created_at: '2024-01-10T16:45:00Z',
    updated_at: '2024-01-17T11:30:00Z',
    memos: [],
    negotiation: false,
    followUpHistory: [
      {
        id: '4',
        date: '2024-01-17T11:30:00Z',
        action: 'Proposal Sent',
        notes: 'Comprehensive proposal with technical specifications',
        created_by: 'Mike Manager'
      }
    ],
    sparePartIds: [],
  },
];

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    setLeads(mockLeads);
  }, []);

  const addLead = (leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      followUpHistory: [],
    };
    setLeads(prev => [...prev, newLead]);
  };

  const updateLead = (id: string, leadData: Partial<Lead>) => {
    setLeads(prev => prev.map(lead => 
      lead.id === id 
        ? { ...lead, ...leadData, updated_at: new Date().toISOString() }
        : lead
    ));
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== id));
  };

  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status);
  };

  const getNegotiationLeads = () => {
    return leads.filter(lead => lead.negotiation === true);
  };

  const getLeadsByUser = (userId: string) => {
    return leads.filter(lead => lead.assigned_to === userId);
  };

  const addMemo = (leadId: string, memo: Omit<Memo, 'id' | 'created_at'>) => {
    const newMemo: Memo = {
      ...memo,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };
    
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { ...lead, memos: [...(lead.memos || []), newMemo], updated_at: new Date().toISOString() }
        : lead
    ));
  };

  const addFollowUp = (leadId: string, followUp: Omit<FollowUpHistory, 'id'>) => {
    const newFollowUp: FollowUpHistory = {
      ...followUp,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { 
            ...lead, 
            followUpHistory: [...(lead.followUpHistory || []), newFollowUp],
            updated_at: new Date().toISOString() 
          }
        : lead
    ));
  };

  const assignLead = (leadId: string, userId: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { ...lead, assigned_to: userId, updated_at: new Date().toISOString() }
        : lead
    ));
  };

  return {
    leads,
    addLead,
    updateLead,
    deleteLead,
    getLeadsByStatus,
    getNegotiationLeads,
    getLeadsByUser,
    addMemo,
    addFollowUp,
    assignLead,
  };
};
