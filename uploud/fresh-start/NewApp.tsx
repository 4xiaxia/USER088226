import React, { useState, useEffect } from 'react';
// 使用相对路径导入本地组件
import NewLogin from './NewLogin';
import WelcomeDialog from './WelcomeDialog';
import TourGuide from '../components/TourGuide';
import UISwitch from './UISwitch';
import { getCurrentSkin, getSkinConfig } from '../utils/skinManager';

interface User {
  id: string;
  name: string;
  avatar?: string;
}

const NewApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'login' | 'welcome' | 'main'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [skinConfig, setSkinConfig] = useState(getSkinConfig(getCurrentSkin()));

  // 检查是否已登录
  useEffect(() => {
    const storedUser = localStorage.getItem('village_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setCurrentPage('main');
    }
    
    // 获取当前皮肤配置
    const currentSkin = getCurrentSkin();
    setSkinConfig(getSkinConfig(currentSkin));
  }, []);

  const handleLogin = (userData: User) => {
    setIsLoading(true);
    // 模拟登录过程
    setTimeout(() => {
      localStorage.setItem('village_user', JSON.stringify(userData));
      setUser(userData);
      setCurrentPage('welcome');
      setIsLoading(false);
    }, 800);
  };

  const handleWelcomeComplete = () => {
    setCurrentPage('main');
  };

  const handleLogout = () => {
    localStorage.removeItem('village_user');
    setUser(null);
    setCurrentPage('login');
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-${skinConfig.gradientFrom} via-white to-${skinConfig.gradientTo}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-${skinConfig.primary}-500`}></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-${skinConfig.gradientFrom} via-white to-${skinConfig.gradientTo}`}>
      <UISwitch />
      {currentPage === 'login' && <NewLogin onLogin={handleLogin} skinConfig={skinConfig} />}
      {currentPage === 'welcome' && <WelcomeDialog onComplete={handleWelcomeComplete} user={user} skinConfig={skinConfig} />}
      {currentPage === 'main' && user && (
        <TourGuide 
          userId={user.id}
          onLogout={handleLogout}
          coordinates={null}
          geoLoading={false}
          geoError={null}
          initialView={null}
        />
      )}
    </div>
  );
};

export default NewApp;