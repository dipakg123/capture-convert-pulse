
import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales_engineer' | 'manager';
  status: string;
  last_login: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@company.com',
    role: 'admin',
    status: 'active',
    last_login: '2024-01-18',
  },
  {
    id: '2',
    name: 'Jane Engineer',
    email: 'engineer@company.com',
    role: 'sales_engineer',
    status: 'active',
    last_login: '2024-01-18',
  },
  {
    id: '3',
    name: 'Mike Manager',
    email: 'manager@company.com',
    role: 'manager',
    status: 'active',
    last_login: '2024-01-17',
  },
];

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setUsers(mockUsers);
  }, []);

  const addUser = (userData: Omit<User, 'id' | 'last_login'>) => {
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      last_login: new Date().toISOString().split('T')[0],
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id 
        ? { ...user, ...userData }
        : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  return {
    users,
    addUser,
    updateUser,
    deleteUser,
  };
};
