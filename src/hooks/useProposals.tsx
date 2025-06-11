
import { useState, useEffect } from 'react';

interface Proposal {
  id: string;
  title: string;
  client: string;
  status: string;
  value: number;
  description: string;
  created_at: string;
  attachments?: File[];
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
  },
  {
    id: '2',
    title: 'Manufacturing System Upgrade',
    client: 'Global Manufacturing',
    status: 'sent',
    value: 75000,
    description: 'Upgrade existing manufacturing systems with automation',
    created_at: '2024-01-14',
  },
  {
    id: '3',
    title: 'Innovation Platform Development',
    client: 'Innovation Labs',
    status: 'approved',
    value: 120000,
    description: 'Development of new innovation platform',
    created_at: '2024-01-10',
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

  return {
    proposals,
    addProposal,
    updateProposal,
    deleteProposal,
  };
};
