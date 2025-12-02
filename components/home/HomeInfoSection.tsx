import React from 'react';
import FunctionEntryGrid, { InfoSection } from '../FunctionEntryGrid';

interface HomeInfoSectionProps {
  onNavigate: (id: string) => void;
}

/**
 * 首页信息区块
 * 包含：时间信息、天气、公告、功能入口网格
 */
const HomeInfoSection: React.FC<HomeInfoSectionProps> = ({ onNavigate }) => {
  return (
    <section className="home-info-section">
      <InfoSection />
      <FunctionEntryGrid onNavigate={onNavigate} />
    </section>
  );
};

export default HomeInfoSection;
