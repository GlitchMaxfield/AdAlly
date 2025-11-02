import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import BrandManager from '../components/dashboard/BrandManager';
import ChatAgent from '../components/dashboard/ChatAgent';
import Downloads from '../components/dashboard/Downloads';
import UserProfile from '../components/dashboard/UserProfile';
import AdminPanel from '../components/dashboard/AdminPanel';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('brands');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;
    setIsAdmin(user.email?.includes('admin') || false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'brands':
        return <BrandManager />;
      case 'chat':
        return <ChatAgent />;
      case 'downloads':
        return <Downloads />;
      case 'profile':
        return <UserProfile />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <BrandManager />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default DashboardPage;