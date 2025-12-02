import React from 'react';
import { Dock, DockIcon } from './ui/dock';
import { Icon } from './common/Icon';

interface AgentDockProps {
  onChatClick?: () => void;
  onVoiceClick?: () => void;
  onMapClick?: () => void;
  onMenuClick?: () => void;
  className?: string;
}

/**
 * AgentDock - AI 助手灵动岛
 * 
 * 悬浮在页面底部的快捷操作栏，提供：
 * - 聊天对话
 * - 语音交互
 * - 地图导航
 * - 更多菜单
 */
export const AgentDock: React.FC<AgentDockProps> = ({
  onChatClick,
  onVoiceClick,
  onMapClick,
  onMenuClick,
  className,
}) => {
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-fixed ${className}`}>
      <Dock direction="middle">
        {/* 聊天对话 */}
        <DockIcon onClick={onChatClick} aria-label="打开聊天">
          <Icon name="message-circle" className="w-6 h-6 text-emerald-600" />
        </DockIcon>
        
        {/* 语音交互 */}
        <DockIcon onClick={onVoiceClick} aria-label="语音交互">
          <Icon name="mic" className="w-6 h-6 text-teal-600" />
        </DockIcon>
        
        {/* 地图导航 */}
        <DockIcon onClick={onMapClick} aria-label="打开地图">
          <Icon name="map" className="w-6 h-6 text-cyan-600" />
        </DockIcon>
        
        {/* 更多菜单 */}
        <DockIcon onClick={onMenuClick} aria-label="更多选项">
          <Icon name="menu" className="w-6 h-6 text-stone-600" />
        </DockIcon>
      </Dock>
    </div>
  );
};

export default AgentDock;
