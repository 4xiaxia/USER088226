import React from 'react';
import { Route, Spot } from '../../types';
import SpotList from '../SpotList';
import ModuleTitle from '../common/ModuleTitle';
import { Icon } from '../common/Icon';

interface RoutesModuleProps {
  routes: Route[] | null;
  onSelectSpot: (spot: Spot, category: Route['category']) => void;
  onViewMap: () => void;
  onActiveRouteChanged?: (route: Route) => void;
  onViewRouteList?: () => void; // 查看路线列表详情
}

/**
 * 推荐路线模块
 * 包含：路线列表、地图总览按钮
 */
const RoutesModule: React.FC<RoutesModuleProps> = ({
  routes,
  onSelectSpot,
  onViewMap,
  onActiveRouteChanged,
  onViewRouteList
}) => {
  return (
    <section id="routes-section" className="routes-module mt-6">
      {/* 标题区域 */}
      <ModuleTitle 
        title="推荐路线" 
        subtitle="红色之旅 不忘时代精神"
        onMoreClick={onViewRouteList}
        announcement={{
          text: "新活动上线  点击跳转",
          onClick: () => {
            // TODO: 跳转到活动页面
            console.log('跳转到活动页面');
          }
        }}
      />

      {/* 路线列表 */}
      {routes && (
        <SpotList 
          routes={routes} 
          onSelectSpot={onSelectSpot} 
          onViewMap={onViewMap}
          onActiveRouteChanged={onActiveRouteChanged}
        />
      )}
    </section>
  );
};

export default RoutesModule;
