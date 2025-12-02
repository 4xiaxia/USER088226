import React from 'react';
import LocalSpecialsSection from '../LocalSpecialsSection';

interface LocalSpecialsModuleProps {
  onInteraction?: (item: string) => void;
  onViewSpecialsList?: () => void; // 查看风物志列表
}

/**
 * 风物志模块
 * 展示地方特产和风物
 */
const LocalSpecialsModule: React.FC<LocalSpecialsModuleProps> = ({ onInteraction, onViewSpecialsList }) => {
  return (
    <section className="local-specials-module">
      <LocalSpecialsSection onInteraction={onInteraction} onViewSpecialsList={onViewSpecialsList} />
    </section>
  );
};

export default LocalSpecialsModule;
