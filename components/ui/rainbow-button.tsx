import React from "react";
import { cn } from "@/lib/utils";

interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

/**
 * RainbowButton - Magic UI 风格渐变彩虹按钮
 * 
 * 特性：
 * - 动态彩虹渐变效果
 * - 支持 default 和 outline 两种变体
 * - 平滑的悬停动画
 * - 无障碍支持
 * 
 * @example
 * <RainbowButton>点击我</RainbowButton>
 * <RainbowButton variant="outline">轮廓样式</RainbowButton>
 */
export function RainbowButton({
  children,
  className,
  variant = "default",
  ...props
}: RainbowButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center",
        "px-6 py-2.5 rounded-lg",
        "text-sm font-medium",
        "transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "overflow-hidden",
        variant === "default" && [
          "text-white",
          "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
          "hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600",
          "hover:shadow-lg hover:scale-105",
          "active:scale-95",
          "focus:ring-purple-500",
        ],
        variant === "outline" && [
          "text-transparent bg-clip-text",
          "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
          "border-2 border-transparent",
          "hover:scale-105",
          "active:scale-95",
          "focus:ring-purple-500",
          "before:absolute before:inset-0",
          "before:rounded-lg before:p-[2px]",
          "before:bg-gradient-to-r before:from-pink-500 before:via-purple-500 before:to-indigo-500",
          "before:-z-10",
          "after:absolute after:inset-[2px]",
          "after:rounded-[6px] after:bg-white",
          "after:-z-10",
          "hover:after:bg-opacity-90",
        ],
        className
      )}
      {...props}
    >
      {/* 动态渐变背景层 */}
      <span
        className={cn(
          "absolute inset-0 -z-20",
          "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
          "animate-shimmer bg-[length:200%_100%]",
          variant === "outline" && "opacity-0 group-hover:opacity-20"
        )}
      />
      
      {/* 悬停光晕效果 */}
      <span
        className={cn(
          "absolute inset-0 -z-10",
          "bg-gradient-to-r from-pink-400/50 via-purple-400/50 to-indigo-400/50",
          "blur-xl opacity-0 group-hover:opacity-100",
          "transition-opacity duration-500"
        )}
      />
      
      {/* 按钮内容 */}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
