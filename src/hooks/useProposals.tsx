
import { useState, useEffect } from 'react';

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

const mockProposals: Proposal[] = [
  {
    id: '1',
    title: 'Enterprise Software Solution',
    client: 'Tech Solutions Inc',
    status: 'draft',
    value: 50000,
    description: 'Complete enterprise software solution for manufacturing',
    created_at: '2024-01-15',
    assigned_to: '2',
    followUpHistory: [
      {
        id: '1',
        date: '2024-01-15T10:00:00Z',
        action: 'Proposal Created',
        notes: 'Initial proposal draft completed',
        created_by: 'Jane Engineer'
      }
    ],
    sparePartIds: [],
  },
  {
    id: '2',
    title: 'Manufacturing System Upgrade',
    client: 'Global Manufacturing',
    status: 'sent',
    value: 75000,
    description: 'Upgrade existing manufacturing systems with automation',
    created_at: '2024-01-14',
    assigned_to: '2',
    followUpHistory: [
      {
        id: '2',
        date: '2024-01-16T11:00:00Z',
        action: 'Proposal Sent',
        notes: 'Proposal sent to client for review',
        created_by: 'Jane Engineer'
      }
    ],
    sparePartIds: ['1'],
  },
  {
    id: '3',
    title: 'Innovation Platform Development',
    client: 'Innovation Labs',
    status: 'approved',
    value: 120000,
    description: 'Development of new innovation platform',
    created_at: '2024-01-10',
    assigned_to: '3',
    followUpHistory: [
      {
        id: '3',
        date: '2024-01-17T15:00:00Z',
        action: 'Proposal Approved',
        notes: 'Client approved the proposal with minor modifications',
        created_by: 'Mike Manager'
      }
    ],
    sparePartIds: [],
  },
];

export const useProposals = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    setProposals(mockProposals);
  }, []);

  const addProposal = (proposalData: Omit<Proposal, 'id' | 'created_at'>) => {
    const newProposal: Proposal = {
      ...proposalData,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString().split('T')[0],
      followUpHistory: [],
    };
    setProposals(prev => [...prev, newProposal]);
  };

  const updateProposal = (id: string, proposalData: Partial<Proposal>) => {
    setProposals(prev => prev.map(proposal => 
      proposal.id === id 
        ? { ...proposal, ...proposalData }
        : proposal
    ));
  };

  const deleteProposal = (id: string) => {
    setProposals(prev => prev.filter(proposal => proposal.id !== id));
  };

  const getProposalsByUser = (userId: string) => {
    return proposals.filter(proposal => proposal.assigned_to === userId);
  };

  const addFollowUp = (proposalId: string, followUp: Omit<FollowUpHistory, 'id'>) => {
    const newFollowUp: FollowUpHistory = {
      ...followUp,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    setProposals(prev => prev.map(proposal => 
      proposal.id === proposalId 
        ? { 
            ...proposal, 
            followUpHistory: [...(proposal.followUpHistory || []), newFollowUp]
          }
        : proposal
    ));
  };

  return {
    proposals,
    addProposal,
    updateProposal,
    deleteProposal,
    getProposalsByUser,
    addFollowUp,
  };
};
