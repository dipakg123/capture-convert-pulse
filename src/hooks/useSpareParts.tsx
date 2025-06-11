
import { useState, useEffect } from 'react';

export interface SparePart {
  id: string;
  name: string;
  partNumber: string;
  description: string;
  brand: string;
  price: number;
  stock: number;
  category: string;
  image?: File | string;
  created_at: string;
  updated_at: string;
}

const mockSpareParts: SparePart[] = [
  {
    id: '1',
    name: 'Servo Motor',
    partNumber: 'A06B-0034-B075',
    description: 'AC Servo Motor for Fanuc Robot',
    brand: 'Fanuc',
    price: 2500,
    stock: 15,
    category: 'Motors',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Controller Board',
    partNumber: 'A20B-8200-0540',
    description: 'Main Controller Board',
    brand: 'Fanuc',
    price: 3200,
    stock: 8,
    category: 'Electronics',
    created_at: '2024-01-16T11:20:00Z',
    updated_at: '2024-01-16T11:20:00Z',
  },
];

export const useSpareParts = () => {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);

  useEffect(() => {
    setSpareParts(mockSpareParts);
  }, []);

  const addSparePart = (sparePartData: Omit<SparePart, 'id' | 'created_at' | 'updated_at'>) => {
    const newSparePart: SparePart = {
      ...sparePartData,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setSpareParts(prev => [...prev, newSparePart]);
  };

  const updateSparePart = (id: string, sparePartData: Partial<SparePart>) => {
    setSpareParts(prev => prev.map(sparePart => 
      sparePart.id === id 
        ? { ...sparePart, ...sparePartData, updated_at: new Date().toISOString() }
        : sparePart
    ));
  };

  const deleteSparePart = (id: string) => {
    setSpareParts(prev => prev.filter(sparePart => sparePart.id !== id));
  };

  const getSparePartById = (id: string) => {
    return spareParts.find(sparePart => sparePart.id === id);
  };

  return {
    spareParts,
    addSparePart,
    updateSparePart,
    deleteSparePart,
    getSparePartById,
  };
};
