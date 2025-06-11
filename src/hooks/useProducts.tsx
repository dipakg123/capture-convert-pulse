
import { useState, useEffect } from 'react';

export interface Product {
  id: string;
  robot: string;
  controller: string;
  reach: number;
  payload: number;
  brand: string;
  image?: File | string;
  created_at: string;
  updated_at: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    robot: 'R-2000iA/100P',
    controller: 'RJ3iB',
    reach: 3500,
    payload: 100,
    brand: 'Fanuc',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    robot: 'IRB 6700',
    controller: 'IRC5',
    reach: 3200,
    payload: 150,
    brand: 'ABB',
    created_at: '2024-01-16T11:20:00Z',
    updated_at: '2024-01-16T11:20:00Z',
  },
];

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(mockProducts);
  }, []);

  const addProduct = (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    const newProduct: Product = {
      ...productData,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, ...productData, updated_at: new Date().toISOString() }
        : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
  };
};
