import React from 'react';
import { Route, Spot, Celebrity } from '../../types';
import DynamicPageBuilder from '../blocks/DynamicPageBuilder';
import { DEFAULT_PAGE_CONFIG } from '../blocks/blockTypes';
import './HomeModules.css';

interface HomeViewProps {
  routes: Route[] | null;
  onNavigate: (id: string) => void;
  onSelectSpot: (spot: Spot, category: Route['category']) => void;
  onViewMap: () => void;
  onNavigateToArticle: (celebrity: Celebrity) => void;
  onInteraction: (text: string) => void;
  onViewRouteList?: () => void; // 查看路线列表详情
  onViewCelebrityList?: () => void; // 查看名人堂列表
  onViewSpecialsList?: () => void; // 查看风物志列表
}

/**
 * 首页视图 - 模块化组合
 * 支持动态配置，为可视化编辑器做准备
 * 用户可以通过修改 pageConfig 来自定义页面布局
 */
const HomeView: React.FC<HomeViewProps> = ({
  routes,
  onNavigate,
  onSelectSpot,
  onViewMap,
  onNavigateToArticle,
  onInteraction,
  onViewRouteList,
  onViewCelebrityList,
  onViewSpecialsList
}) => {
  // TODO: 未来从 API 或 localStorage 加载用户自定义配置
  const pageConfig = DEFAULT_PAGE_CONFIG;

  return (
    <DynamicPageBuilder
      config={pageConfig}
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
  );
};

export default HomeView;
