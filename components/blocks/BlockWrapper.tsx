import React from 'react';

export interface BlockConfig {
  id: string;
  type: string;
  title?: string;
  visible?: boolean;
  order?: number;
  style?: {
    background?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
  };
}

interface BlockWrapperProps {
  config: BlockConfig;
  children: React.ReactNode;
  className?: string;
}

/**
 * 区块包装器
 * 为所有可视化模块提供统一的容器和配置接口
 * 支持：显示/隐藏、排序、自定义样式
 */
const BlockWrapper: React.FC<BlockWrapperProps> = ({ 
  config, 
  children,
  className = '' 
}) => {
  if (config.visible === false) return null;

  const customStyle: React.CSSProperties = {
    background: config.style?.background,
    padding: config.style?.padding,
    margin: config.style?.margin,
    borderRadius: config.style?.borderRadius,
  };

  return (
    <section 
      id={`block-${config.id}`}
      className={`page-block ${className}`}
      data-block-type={config.type}
      data-block-order={config.order}
      style={customStyle}
    >
      {children}
    </section>
  );
};

export default BlockWrapper;
