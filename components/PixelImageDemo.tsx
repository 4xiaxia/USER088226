import React from 'react';
import { PixelImage } from './ui/pixel-image';

/**
 * PixelImage 旅游导览演示
 * 
 * 展示不同的像素化效果配置，适用于：
 * - 景点预览
 * - 图片画廊
 * - 创意展示
 */
export function PixelImageDemo() {
  return (
    <div className="space-y-8 p-6">
      {/* 标准像素化效果 - 适合小图标/缩略图 */}
      <div>
        <h3 className="text-lg font-bold text-stone-800 mb-3">标准像素化（10x10）</h3>
        <PixelImage
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300"
          alt="山景风光"
          customGrid={{ rows: 10, cols: 10 }}
          className="w-64"
        />
      </div>

      {/* 低分辨率像素化 - 复古风格 */}
      <div>
        <h3 className="text-lg font-bold text-stone-800 mb-3">低像素风格（4x6）- 复古感</h3>
        <PixelImage
          src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=300"
          alt="中国传统建筑"
          customGrid={{ rows: 4, cols: 6 }}
          className="w-80"
        />
      </div>

      {/* 灰度动画效果 - 悬停彩色化 */}
      <div>
        <h3 className="text-lg font-bold text-stone-800 mb-3">灰度动画（悬停显示彩色）</h3>
        <p className="text-sm text-stone-500 mb-2">鼠标悬停在像素块上查看彩色效果</p>
        <PixelImage
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300"
          alt="中国园林"
          customGrid={{ rows: 8, cols: 12 }}
          grayscaleAnimation
          className="w-96"
        />
      </div>

      {/* 高清像素化 - 更接近原图 */}
      <div>
        <h3 className="text-lg font-bold text-stone-800 mb-3">高清像素化（20x30）</h3>
        <PixelImage
          src="https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=600&h=400"
          alt="长城风光"
          customGrid={{ rows: 20, cols: 30 }}
          pixelDelay={20}
          className="w-full max-w-2xl"
        />
      </div>
    </div>
  );
}

export default PixelImageDemo;
