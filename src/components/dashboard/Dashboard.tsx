
import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardHome from './DashboardHome';
import LeadsManagement from '../leads/LeadsManagement';
import ProposalManagement from '../proposals/ProposalManagement';
import UserManagement from '../users/UserManagement';
import ProductMaster from '../products/ProductMaster';
import SparePartsMaster from '../spareparts/SparePartsMaster';
import AdminReports from '../reports/AdminReports';
import { useAuth } from '@/hooks/useAuth';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome />;
      case 'leads':
        return <LeadsManagement />;
      case 'proposals':
        return <ProposalManagement />;
      case 'products':
        return user?.role === 'admin' ? <ProductMaster /> : <div>Access denied</div>;
      case 'spareparts':
        return user?.role === 'admin' ? <SparePartsMaster /> : <div>Access denied</div>;
      case 'reports':
        return user?.role === 'admin' ? <AdminReports /> : <div>Access denied</div>;
      case 'users':
        return user?.role === 'admin' ? <UserManagement /> : <div>Access denied</div>;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
