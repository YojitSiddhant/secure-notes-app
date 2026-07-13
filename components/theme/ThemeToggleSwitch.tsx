"use client";

import { cn } from "@/lib/cn";
import { useTheme } from "@/components/theme/ThemeProvider";
import styles from "@/components/theme/ThemeToggleSwitch.module.css";

type ThemeToggleSwitchProps = {
  className?: string;
};

export function ThemeToggleSwitch({ className }: ThemeToggleSwitchProps) {
  const { theme, mounted, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <label
      className={cn(styles.switch, className, !mounted && "opacity-0")}
      aria-label="Toggle dark mode"
    >
      <input
        className={styles.input}
        type="checkbox"
        checked={isDark}
        onChange={toggleTheme}
        aria-label="Toggle dark mode"
      />
      <span className={styles.slider} aria-hidden="true">
        <span className={styles.sunMoon}>
          <svg className={cn(styles.moonDot, styles.moonDot1)} viewBox="0 0 100 100">
            <circle cx={50} cy={50} r={50} />
          </svg>
          <svg className={cn(styles.moonDot, styles.moonDot2)} viewBox="0 0 100 100">
            <circle cx={50} cy={50} r={50} />
          </svg>
          <svg className={cn(styles.moonDot, styles.moonDot3)} viewBox="0 0 100 100">
            <circle cx={50} cy={50} r={50} />
          </svg>

          <svg className={cn(styles.lightRay, styles.lightRay1)} viewBox="0 0 100 100">
            <circle cx={50} cy={50} r={50} />
          </svg>
          <svg className={cn(styles.lightRay, styles.lightRay2)} viewBox="0 0 100 100">
            <circle cx={50} cy={50} r={50} />
          </svg>
          <svg className={cn(styles.lightRay, styles.lightRay3)} viewBox="0 0 100 100">
            <circle cx={50} cy={50} r={50} />
          </svg>

          <svg className={cn(styles.cloudDark, styles.cloud1)} viewBox="0 0 100 100">
            <circle cx={50} cy={50} r={50} />
          </svg>
          <svg className={cn(styles.cloudDark, styles.cloud2)} viewBox="0 0 100 100">
            <circle cx={50} cy={50} r={50} />
          </svg>
          <svg className={cn(styles.cloudDark, styles.cloud3)} viewBox="0 0 100 100">
            <circle cx={50} cy={50} r={50} />
          </svg>

          <svg className={cn(styles.cloudLight, styles.cloud4)} viewBox="0 0 100 100">
            <circle cx={50} cy={50} r={50} />
          </svg>
          <svg className={cn(styles.cloudLight, styles.cloud5)} viewBox="0 0 100 100">
            <circle cx={50} cy={50} r={50} />
          </svg>
          <svg className={cn(styles.cloudLight, styles.cloud6)} viewBox="0 0 100 100">
            <circle cx={50} cy={50} r={50} />
          </svg>
        </span>

        <span className={styles.stars}>
          <svg className={cn(styles.star, styles.star1)} viewBox="0 0 20 20">
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
          </svg>
          <svg className={cn(styles.star, styles.star2)} viewBox="0 0 20 20">
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
          </svg>
          <svg className={cn(styles.star, styles.star3)} viewBox="0 0 20 20">
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
          </svg>
          <svg className={cn(styles.star, styles.star4)} viewBox="0 0 20 20">
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
          </svg>
        </span>
      </span>
    </label>
  );
}
