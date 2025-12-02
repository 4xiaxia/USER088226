import React, { useMemo } from 'react';
import { PageLayoutConfig } from './blockTypes';
import BlockRenderer from './BlockRenderer';
import { Route, Spot, Celebrity } from '../../types';
import './blocks.css';

interface DynamicPageBuilderProps {
  config: PageLayoutConfig;
  // 数据源
  routes?: Route[] | null;
  // 回调函数
  onNavigate?: (id: string) => void;
  onSelectSpot?: (spot: Spot, category: Route['category']) => void;
  onViewMap?: () => void;
  onNavigateToArticle?: (celebrity: Celebrity) => void;
  onInteraction?: (text: string) => void;
  onViewRouteList?: () => void; // 查看路线列表详情
  onViewCelebrityList?: () => void; // 查看名人堂列表
  onViewSpecialsList?: () => void; // 查看风物志列表
}

/**
 * 动态页面构建器
 * 根据配置文件动态渲染整个页面
 * 用户可以通过修改配置来自定义页面布局
 */
const DynamicPageBuilder: React.FC<DynamicPageBuilderProps> = ({
  config,
  routes,
  onNavigate,
  onSelectSpot,
  onViewMap,
  onNavigateToArticle,
  onInteraction,
  onViewRouteList,
  onViewCelebrityList,
  onViewSpecialsList,
}) => {
  // 按 order 排序并过滤可见区块
  const sortedBlocks = useMemo(() => {
    return config.blocks
      .filter((block) => block.visible !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [config.blocks]);

  return (
    <div className="dynamic-page-builder pt-4 pb-24">
      {sortedBlocks.map((blockConfig) => (
        <BlockRenderer
          key={blockConfig.id}
          config={blockConfig}
          routes={routes}
          onNavigate={onNavigate}
          onSelectSpot={onSelectSpot}
          onViewMap={onViewMap}
          onNavigateToArticle={onNavigateToArticle}
          onInteraction={onInteraction}
          onViewRouteList={onViewRouteList}
          onViewCelebrityList={onViewCelebrityList}
          onViewSpecialsList={onViewSpecialsList}
        />
      ))}
    </div>
  );
};

export default DynamicPageBuilder;
