import React, { CSSProperties, ReactElement } from "react";
import { cn } from "@/lib/utils";

interface Sparkle {
  id: string;
  x: string;
  y: string;
  color: string;
  delay: number;
  scale: number;
  lifespan: number;
}

interface SparklesTextProps {
  /**
   * 要显示的文本内容
   */
  children: string;
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 闪烁粒子的颜色数组
   * @default ["#ffaa40", "#9c40ff", "#ffdd40", "#4d9aff"]
   */
  colors?: {
    first: string;
    second: string;
  };
  /**
   * 闪烁粒子的数量
   * @default 10
   */
  sparklesCount?: number;
}

/**
 * SparklesText - Magic UI 风格闪烁文字
 * 
 * 带有动态闪烁粒子效果的文字组件，适合用于标题、重点文字等
 * 
 * @example
 * <SparklesText>Hello World</SparklesText>
 * <SparklesText colors={{ first: "#ff0080", second: "#0080ff" }}>
 *   彩色闪烁
 * </SparklesText>
 */
export function SparklesText({
  children,
  className,
  colors = {
    first: "#9E7AFF",
    second: "#FE8BBB",
  },
  sparklesCount = 10,
  ...props
}: SparklesTextProps) {
  const [sparkles, setSparkles] = React.useState<Sparkle[]>([]);

  React.useEffect(() => {
    const generateStar = (): Sparkle => {
      const starX = `${Math.random() * 100}%`;
      const starY = `${Math.random() * 100}%`;
      const color = Math.random() > 0.5 ? colors.first : colors.second;
      const delay = Math.random() * 2;
      const scale = Math.random() * 1 + 0.3;
      const lifespan = Math.random() * 10 + 5;
      const id = `${starX}-${starY}-${Date.now()}`;
      return { id, x: starX, y: starY, color, delay, scale, lifespan };
    };

    const initializeStars = () => {
      const newSparkles = Array.from({ length: sparklesCount }, generateStar);
      setSparkles(newSparkles);
    };

    initializeStars();

    const interval = setInterval(() => {
      setSparkles((currentSparkles) => {
        return currentSparkles.map((star) => {
          if (Math.random() > 0.8) {
            return generateStar();
          }
          return star;
        });
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [colors.first, colors.second, sparklesCount]);

  return (
    <div
      className={cn("relative inline-block", className)}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 z-0" aria-hidden="true">
        {sparkles.map((sparkle) => (
          <Sparkle key={sparkle.id} {...sparkle} />
        ))}
      </span>
    </div>
  );
}

const Sparkle: React.FC<Sparkle> = ({ id, x, y, color, delay, scale, lifespan }) => {
  return (
    <span
      className="absolute pointer-events-none z-20 animate-sparkle"
      style={
        {
          left: x,
          top: y,
          "--sparkle-color": color,
          "--sparkle-delay": `${delay}s`,
          "--sparkle-scale": scale,
          "--sparkle-lifespan": `${lifespan}s`,
        } as CSSProperties
      }
    >
      <svg
        width="21"
        height="21"
        viewBox="0 0 21 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-sparkle-rotate"
        style={{
          animation: `sparkle-rotate var(--sparkle-lifespan) linear infinite`,
          animationDelay: `var(--sparkle-delay)`,
        }}
      >
        <path
          d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 13.3916 5.46298 14.7 6.34896L16.3262 7.46366C16.9096 7.84873 16.9096 8.65127 16.3262 9.03634L14.7 10.151C13.3916 11.037 12.4006 12.3077 11.8618 13.7797L11.1746 15.6562C10.9446 16.2848 10.0553 16.2848 9.82531 15.6562L9.13812 13.7797C8.59935 12.3077 7.60836 11.037 6.29997 10.151L4.67376 9.03634C4.09039 8.65127 4.09039 7.84873 4.67376 7.46366L6.29997 6.34896C7.60836 5.46298 8.59935 4.19229 9.13812 2.72026L9.82531 0.843845Z"
          fill="var(--sparkle-color)"
          style={{
            transform: `scale(var(--sparkle-scale))`,
            animation: `sparkle-pulse var(--sparkle-lifespan) ease-in-out infinite`,
            animationDelay: `var(--sparkle-delay)`,
          }}
        />
      </svg>
    </span>
  );
};
