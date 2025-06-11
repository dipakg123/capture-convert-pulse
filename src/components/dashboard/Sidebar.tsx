
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  UserPlus, 
  FileText, 
  Settings,
  Package,
  Wrench,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const { user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['admin', 'sales_engineer', 'manager'] },
    { id: 'leads', label: 'Leads', icon: UserPlus, roles: ['admin', 'sales_engineer', 'manager'] },
    { id: 'proposals', label: 'Proposals', icon: FileText, roles: ['admin', 'sales_engineer', 'manager'] },
    { id: 'products', label: 'Products', icon: Package, roles: ['admin'] },
    { id: 'spareparts', label: 'Spare Parts', icon: Wrench, roles: ['admin'] },
    { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['admin'] },
    { id: 'users', label: 'Users', icon: Users, roles: ['admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary">CRM System</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                activeTab === item.id && "bg-primary text-primary-foreground"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
