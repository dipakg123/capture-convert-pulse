
import { useState, useEffect } from 'react';

interface Lead {
  id: string;
  company: string;
  contact_name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  estimated_value: number;
  notes: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
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
    estimated_value: 50000,
    notes: 'Interested in our enterprise solution',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    company: 'Global Manufacturing',
    contact_name: 'Sarah Johnson',
    email: 'sarah@globalmfg.com',
    phone: '+1-234-567-8902',
    status: 'contacted',
    source: 'referral',
    estimated_value: 75000,
    notes: 'Follow up next week for proposal discussion',
    created_at: '2024-01-14T14:20:00Z',
    updated_at: '2024-01-16T09:15:00Z',
  },
  {
    id: '3',
    company: 'Innovation Labs',
    contact_name: 'Mike Chen',
    email: 'mike@innovationlabs.com',
    phone: '+1-234-567-8903',
    status: 'proposal_sent',
    source: 'email',
    estimated_value: 120000,
    notes: 'Proposal sent on Monday, awaiting response',
    created_at: '2024-01-10T16:45:00Z',
    updated_at: '2024-01-17T11:30:00Z',
  },
];

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    // Simulate loading from API
    setLeads(mockLeads);
  }, []);

  const addLead = (leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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

  return {
    leads,
    addLead,
    updateLead,
    deleteLead,
    getLeadsByStatus,
  };
};
