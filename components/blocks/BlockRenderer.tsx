import React from 'react';
import { ExtendedBlockConfig, BlockType } from './blockTypes';
import BlockWrapper from './BlockWrapper';
import HomeInfoSection from '../home/HomeInfoSection';
import RoutesModule from '../home/RoutesModule';
import CelebritySection from '../CelebritySection';
import LocalSpecialsModule from '../home/LocalSpecialsModule';
import { Route, Spot, Celebrity } from '../../types';

interface BlockRendererProps {
  config: ExtendedBlockConfig;
  // 数据和回调函数
  routes?: Route[] | null;
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
 * 区块渲染器
 * 根据配置动态渲染不同类型的区块
 * 这是可视化编辑器的核心组件
 */
const BlockRenderer: React.FC<BlockRendererProps> = ({
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
  const renderBlockContent = () => {
    switch (config.type) {
      case BlockType.INFO_BANNER:
        return onNavigate ? <HomeInfoSection onNavigate={onNavigate} /> : null;

      case BlockType.FUNCTION_GRID:
        return onNavigate ? <HomeInfoSection onNavigate={onNavigate} /> : null;

      case BlockType.ROUTES_LIST:
        return routes && onSelectSpot && onViewMap ? (
          <RoutesModule
            routes={routes}
            onSelectSpot={onSelectSpot}
            onViewMap={onViewMap}
            onActiveRouteChanged={(r) => onInteraction?.(`正在看：${r.name}`)}
            onViewRouteList={onViewRouteList}
          />
        ) : null;

      case BlockType.CELEBRITY_GRID:
        return onNavigateToArticle ? (
          <CelebritySection
            id="celebrity-section"
            className="celebrity-module"
            onNavigateToArticle={onNavigateToArticle}
            onInteraction={(name) => onInteraction?.(`了解先辈:${name}`)}
            onViewCelebrityList={onViewCelebrityList}
          />
        ) : null;

      case BlockType.SPECIALS_GRID:
        return (
          <LocalSpecialsModule
            onInteraction={(item) => onInteraction?.(`查看特产：${item}`)}
            onViewSpecialsList={onViewSpecialsList}
          />
        );

      case BlockType.MAP_BUTTON:
        return onViewMap ? (
          <div className="px-6 my-8">
            <button
              onClick={onViewMap}
              className="w-full bg-stone-800 text-white font-bold py-4 rounded-2xl shadow-xl flex items-center justify-center space-x-2 hover:bg-black transition transform active:scale-95 border border-stone-700"
            >
              <span>路线地图总览</span>
            </button>
          </div>
        ) : null;

      case BlockType.IMAGE_BANNER:
        return (
          <div className="px-6 my-4">
            <div className="bg-stone-200 rounded-2xl overflow-hidden aspect-video">
              {config.data?.imageUrl ? (
                <img
                  src={config.data.imageUrl}
                  alt={config.data.alt || ''}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400">
                  图片区块
                </div>
              )}
            </div>
          </div>
        );

      case BlockType.TEXT_SECTION:
        return (
          <div className="px-6 my-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div
                className="prose prose-stone max-w-none"
                dangerouslySetInnerHTML={{ __html: config.data?.content || '文本区块' }}
              />
            </div>
          </div>
        );

      case BlockType.CUSTOM_HTML:
        return (
          <div
            className="px-6 my-4"
            dangerouslySetInnerHTML={{ __html: config.data?.html || '' }}
          />
        );

      default:
        return (
          <div className="px-6 my-4 text-center text-stone-400">
            未知区块类型: {config.type}
          </div>
        );
    }
  };

  const content = renderBlockContent();
  if (!content) return null;

  return (
    <BlockWrapper config={config} className={`block-${config.type}`}>
      {content}
    </BlockWrapper>
  );
};

export default BlockRenderer;
