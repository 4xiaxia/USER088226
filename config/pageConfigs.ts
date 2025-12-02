import { PageLayoutConfig, BlockType } from '../components/blocks/blockTypes';

/**
 * 用户自定义页面配置示例
 * 展示如何通过修改配置来个性化页面布局
 */

// 示例1: 简洁版首页 - 只保留核心功能
export const MINIMAL_HOME_CONFIG: PageLayoutConfig = {
  id: 'minimal-home',
  name: '简洁首页',
  description: '精简版首页，只显示核心功能',
  blocks: [
    {
      id: 'function-grid-1',
      type: BlockType.FUNCTION_GRID,
      visible: true,
      order: 1,
    },
    {
      id: 'routes-list-1',
      type: BlockType.ROUTES_LIST,
      title: '推荐路线',
      visible: true,
      order: 2,
      settings: {
        showTitle: true,
        titleAlign: 'center',
      },
    },
  ],
  meta: {
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    author: 'user123',
  },
};

// 示例2: 文化主题页面 - 突出名人堂和风物志
export const CULTURE_THEME_CONFIG: PageLayoutConfig = {
  id: 'culture-theme',
  name: '文化主题页',
  description: '突出展示文化内容',
  blocks: [
    {
      id: 'info-banner-1',
      type: BlockType.INFO_BANNER,
      visible: true,
      order: 1,
    },
    {
      id: 'celebrity-grid-1',
      type: BlockType.CELEBRITY_GRID,
      title: '名人堂',
      visible: true,
      order: 2,
      settings: {
        columns: 4,
        showTitle: true,
        titleAlign: 'center',
      },
      style: {
        background: 'linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%)',
        padding: '2rem 0',
      },
    },
    {
      id: 'specials-grid-1',
      type: BlockType.SPECIALS_GRID,
      title: '风物志',
      visible: true,
      order: 3,
      settings: {
        columns: 3,
        showTitle: true,
        titleAlign: 'center',
      },
      style: {
        background: 'linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%)',
        padding: '2rem 0',
      },
    },
    {
      id: 'routes-list-1',
      type: BlockType.ROUTES_LIST,
      title: '相关路线',
      visible: true,
      order: 4,
      settings: {
        showTitle: true,
        titleAlign: 'center',
      },
    },
  ],
  meta: {
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    author: 'admin',
  },
};

// 示例3: 旅游导览页面 - 以路线为主
export const TOUR_GUIDE_CONFIG: PageLayoutConfig = {
  id: 'tour-guide',
  name: '旅游导览页',
  description: '专注于路线推荐和地图导航',
  blocks: [
    {
      id: 'banner-1',
      type: BlockType.IMAGE_BANNER,
      visible: true,
      order: 1,
      data: {
        imageUrl: '/assets/welcome-banner.jpg',
        alt: '欢迎来到东里村',
      },
    },
    {
      id: 'function-grid-1',
      type: BlockType.FUNCTION_GRID,
      visible: true,
      order: 2,
    },
    {
      id: 'routes-list-1',
      type: BlockType.ROUTES_LIST,
      title: '精选路线',
      visible: true,
      order: 3,
      settings: {
        layout: 'carousel',
        showTitle: true,
        titleAlign: 'center',
      },
      style: {
        background: 'white',
        padding: '2rem 0',
      },
    },
    {
      id: 'map-button-1',
      type: BlockType.MAP_BUTTON,
      visible: true,
      order: 4,
    },
    {
      id: 'specials-preview',
      type: BlockType.SPECIALS_GRID,
      title: '当地特色',
      visible: true,
      order: 5,
      settings: {
        columns: 3,
        showTitle: true,
        titleAlign: 'center',
      },
    },
  ],
  meta: {
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    author: 'tour-admin',
  },
};

/**
 * 配置管理工具函数
 */

// 从 localStorage 加载用户配置
export const loadUserConfig = (userId: string): PageLayoutConfig | null => {
  try {
    const saved = localStorage.getItem(`page-config-${userId}`);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load user config:', error);
    return null;
  }
};

// 保存用户配置到 localStorage
export const saveUserConfig = (userId: string, config: PageLayoutConfig): boolean => {
  try {
    localStorage.setItem(`page-config-${userId}`, JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Failed to save user config:', error);
    return false;
  }
};

// 重置为默认配置
export const resetToDefaultConfig = (userId: string): void => {
  localStorage.removeItem(`page-config-${userId}`);
};

// 获取所有预设配置
export const getPresetConfigs = () => {
  return [
    { id: 'default', name: '默认布局', config: null }, // null 表示使用 DEFAULT_PAGE_CONFIG
    { id: 'minimal', name: '简洁版', config: MINIMAL_HOME_CONFIG },
    { id: 'culture', name: '文化主题', config: CULTURE_THEME_CONFIG },
    { id: 'tour', name: '旅游导览', config: TOUR_GUIDE_CONFIG },
  ];
};
