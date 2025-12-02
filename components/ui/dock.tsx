import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

export interface DockProps extends VariantProps<typeof dockVariants> {
  className?: string;
  children: React.ReactNode;
  direction?: "top" | "middle" | "bottom";
}

const dockVariants = cva(
  "mx-auto w-max h-full p-2 flex items-end gap-2 rounded-2xl border backdrop-blur-sm",
  {
    variants: {
      direction: {
        top: "items-start",
        middle: "items-center",
        bottom: "items-end",
      },
    },
    defaultVariants: {
      direction: "middle",
    },
  }
);

/**
 * Dock - Magic UI 风格灵动岛容器
 * 
 * 类似 macOS Dock 的悬浮容器，支持图标放大效果
 * 
 * @example
 * <Dock direction="middle">
 *   <DockIcon><Icon name="user" /></DockIcon>
 *   <DockIcon><Icon name="bell" /></DockIcon>
 * </Dock>
 */
const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  ({ className, children, direction, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          dockVariants({ direction }),
          "bg-white/80 border-stone-200/60 shadow-premium-lg",
          className
        )}
      >
        {children}
      </div>
    );
  }
);
Dock.displayName = "Dock";

export interface DockIconProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

/**
 * DockIcon - Dock 中的图标项
 * 
 * 悬停时自动放大，具有平滑的过渡动画
 */
const DockIcon = React.forwardRef<HTMLButtonElement, DockIconProps>(
  ({ className, children, onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        aria-label="Dock icon"
        className={cn(
          "relative flex items-center justify-center",
          "w-12 h-12 rounded-xl",
          "bg-stone-100/50 hover:bg-stone-200/60",
          "border border-stone-200/40",
          "transition-all duration-300 ease-out",
          "hover:scale-125 hover:-translate-y-2",
          "active:scale-110",
          "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
          "cursor-pointer",
          "group",
          className
        )}
        {...props}
      >
        <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
          {children}
        </div>
        
        {/* 悬停光晕效果 */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-100/0 to-teal-100/0 group-hover:from-emerald-100/30 group-hover:to-teal-100/30 transition-all duration-300" />
      </button>
    );
  }
);
DockIcon.displayName = "DockIcon";

export { Dock, DockIcon, dockVariants };
