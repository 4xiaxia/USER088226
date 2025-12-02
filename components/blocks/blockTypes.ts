import { BlockConfig } from './BlockWrapper';

/**
 * 标准化区块类型枚举
 */
export enum BlockType {
  INFO_BANNER = 'info-banner',           // 信息横幅（时间、天气、公告）
  FUNCTION_GRID = 'function-grid',       // 功能入口网格
  ROUTES_LIST = 'routes-list',           // 路线列表
  CELEBRITY_GRID = 'celebrity-grid',     // 名人堂网格
  SPECIALS_GRID = 'specials-grid',       // 风物志网格
  MAP_BUTTON = 'map-button',             // 地图按钮
  CUSTOM_HTML = 'custom-html',           // 自定义HTML
  IMAGE_BANNER = 'image-banner',         // 图片横幅
  TEXT_SECTION = 'text-section',         // 文本区块
}

/**
 * 区块配置接口扩展
 */
export interface ExtendedBlockConfig extends BlockConfig {
  // 区块特定数据
  data?: any;
  // 区块特定配置
  settings?: {
    columns?: number;
    layout?: 'grid' | 'list' | 'carousel';
    showTitle?: boolean;
    titleAlign?: 'left' | 'center' | 'right';
    cardVariant?: 'portrait' | 'square' | 'landscape';
  };
  // 交互配置
  interactions?: {
    clickable?: boolean;
    onClickAction?: string;
  };
}

/**
 * 页面布局配置
 */
export interface PageLayoutConfig {
  id: string;
  name: string;
  description?: string;
  blocks: ExtendedBlockConfig[];
  meta?: {
    created: string;
    modified: string;
    author?: string;
  };
}

/**
 * 默认页面配置
 * 用户可以基于此进行个性化定制
 */
export const DEFAULT_PAGE_CONFIG: PageLayoutConfig = {
  id: 'default-home',
  name: '默认首页布局',
  description: '村官智能体默认首页配置',
  blocks: [
    {
      id: 'info-banner-1',
      type: BlockType.INFO_BANNER,
      visible: true,
      order: 1,
      settings: {
        showTitle: false,
      },
    },
    {
      id: 'function-grid-1',
      type: BlockType.FUNCTION_GRID,
      visible: true,
      order: 2,
      settings: {
        columns: 3,
        layout: 'grid',
      },
    },
    {
      id: 'routes-list-1',
      type: BlockType.ROUTES_LIST,
      title: '推荐路线',
      visible: true,
      order: 3,
      settings: {
        layout: 'carousel',
        showTitle: true,
        titleAlign: 'center',
      },
      style: {
        background: 'white',
        padding: '1rem 0 1.5rem',
        margin: '1.5rem 0',
        borderRadius: '1.5rem 1.5rem 0 0',
      },
    },
    {
      id: 'map-button-1',
      type: BlockType.MAP_BUTTON,
      visible: true,
      order: 4,
    },
    {
      id: 'celebrity-grid-1',
      type: BlockType.CELEBRITY_GRID,
      title: '名人堂',
      visible: true,
      order: 5,
      settings: {
        columns: 5,
        layout: 'grid',
        showTitle: true,
        titleAlign: 'center',
        cardVariant: 'portrait',
      },
      style: {
        background: 'linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%)',
        padding: '2rem 0',
        margin: '2rem 0',
      },
    },
    {
      id: 'specials-grid-1',
      type: BlockType.SPECIALS_GRID,
      title: '风物志',
      visible: true,
      order: 6,
      settings: {
        columns: 5,
        layout: 'grid',
        showTitle: true,
        titleAlign: 'center',
        cardVariant: 'portrait',
      },
      style: {
        background: 'linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%)',
        padding: '2rem 0 3rem',
        margin: '2rem 0 0',
        borderRadius: '0 0 1.5rem 1.5rem',
      },
    },
  ],
  meta: {
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  },
};

/**
 * 区块注册表
 * 用于页面编辑器展示可用的区块类型
 */
export const BLOCK_REGISTRY = [
  {
    type: BlockType.INFO_BANNER,
    name: '信息横幅',
    description: '显示时间、天气、公告信息',
    icon: 'bell',
    category: '信息展示',
  },
  {
    type: BlockType.FUNCTION_GRID,
    name: '功能入口',
    description: '快速导航功能模块',
    icon: 'grid',
    category: '导航',
  },
  {
    type: BlockType.ROUTES_LIST,
    name: '路线列表',
    description: '展示推荐旅游路线',
    icon: 'map',
    category: '内容展示',
  },
  {
    type: BlockType.CELEBRITY_GRID,
    name: '名人堂',
    description: '展示历史名人信息',
    icon: 'user',
    category: '内容展示',
  },
  {
    type: BlockType.SPECIALS_GRID,
    name: '风物志',
    description: '展示地方特产和风物',
    icon: 'bag',
    category: '内容展示',
  },
  {
    type: BlockType.MAP_BUTTON,
    name: '地图按钮',
    description: '跳转到地图总览',
    icon: 'map',
    category: '导航',
  },
  {
    type: BlockType.IMAGE_BANNER,
    name: '图片横幅',
    description: '展示图片宣传内容',
    icon: 'camera',
    category: '媒体',
  },
  {
    type: BlockType.TEXT_SECTION,
    name: '文本区块',
    description: '自定义文本内容',
    icon: 'edit',
    category: '内容展示',
  },
  {
    type: BlockType.CUSTOM_HTML,
    name: '自定义HTML',
    description: '高级用户自定义内容',
    icon: 'code',
    category: '高级',
  },
];
