/**
 * 区块系统导出
 * 为可视化页面编辑器提供完整的区块管理能力
 */

export { default as BlockWrapper } from './BlockWrapper';
export { default as BlockRenderer } from './BlockRenderer';
export { default as DynamicPageBuilder } from './DynamicPageBuilder';

export * from './blockTypes';
export type { BlockConfig } from './BlockWrapper';
