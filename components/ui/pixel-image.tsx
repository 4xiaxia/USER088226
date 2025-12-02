import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface PixelImageProps {
  /**
   * 图片源地址
   */
  src: string;
  /**
   * 图片替代文本（无障碍支持）
   */
  alt?: string;
  /**
   * 自定义网格配置
   */
  customGrid?: {
    rows: number;
    cols: number;
  };
  /**
   * 是否启用灰度动画
   * @default false
   */
  grayscaleAnimation?: boolean;
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 像素块动画延迟（毫秒）
   * @default 50
   */
  pixelDelay?: number;
}

/**
 * PixelImage - Magic UI 风格像素化图片
 * 
 * 将图片分解为像素块网格，支持渐进式显示动画和灰度效果
 * 
 * @example
 * <PixelImage 
 *   src="/image.jpg" 
 *   alt="风景照片"
 *   customGrid={{ rows: 4, cols: 6 }}
 *   grayscaleAnimation 
 * />
 */
export function PixelImage({
  src,
  alt = "图片",
  customGrid = { rows: 10, cols: 10 },
  grayscaleAnimation = false,
  className,
  pixelDelay = 50,
}: PixelImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pixels, setPixels] = useState<{ color: string; index: number }[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      // 设置 canvas 尺寸
      canvas.width = img.width;
      canvas.height = img.height;

      // 绘制图片
      ctx.drawImage(img, 0, 0);

      // 计算像素块大小
      const pixelWidth = Math.floor(img.width / customGrid.cols);
      const pixelHeight = Math.floor(img.height / customGrid.rows);

      // 提取像素块颜色
      const pixelData: { color: string; index: number }[] = [];
      
      for (let row = 0; row < customGrid.rows; row++) {
        for (let col = 0; col < customGrid.cols; col++) {
          const x = col * pixelWidth + pixelWidth / 2;
          const y = row * pixelHeight + pixelHeight / 2;
          
          const imageData = ctx.getImageData(x, y, 1, 1);
          const [r, g, b, a] = imageData.data;
          
          const color = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
          pixelData.push({
            color,
            index: row * customGrid.cols + col,
          });
        }
      }

      setPixels(pixelData);
      setIsLoaded(true);
    };

    img.onerror = () => {
      console.error("Failed to load image:", src);
    };

    img.src = src;
  }, [src, customGrid.rows, customGrid.cols]);

  return (
    <div className={cn("relative inline-block", className)}>
      {/* 隐藏的 canvas 用于提取颜色 */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 像素网格显示 */}
      <div
        className="grid gap-0.5 bg-stone-100 p-1 rounded-lg overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${customGrid.cols}, 1fr)`,
          gridTemplateRows: `repeat(${customGrid.rows}, 1fr)`,
        }}
      >
        {pixels.map((pixel, index) => (
          <div
            key={pixel.index}
            className={cn(
              "aspect-square rounded-sm transition-all duration-500",
              grayscaleAnimation && "grayscale hover:grayscale-0",
              isLoaded && "animate-scale-in"
            )}
            style={{
              backgroundColor: pixel.color,
              animationDelay: `${index * pixelDelay}ms`,
            }}
          />
        ))}
      </div>

      {/* 原图作为 alt 备用 */}
      <img 
        src={src} 
        alt={alt} 
        className="sr-only" 
        aria-hidden="true"
      />
    </div>
  );
}

export default PixelImage;
