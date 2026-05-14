import * as React from "react";
import { cn } from "@/src/lib/utils";
import { motion, HTMLMotionProps } from "motion/react";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "accent" | "emergency" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "xl" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }: ButtonProps, ref) => {
    const variants = {
      primary: "bg-primary text-primary-foreground shadow-sm active:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground shadow-sm active:bg-secondary/90",
      accent: "bg-accent text-accent-foreground shadow-sm active:bg-accent/90",
      emergency: "bg-red-600 text-white shadow-lg active:bg-red-700 animate-pulse font-bold uppercase tracking-wider",
      ghost: "bg-transparent hover:bg-muted text-foreground",
      outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/5",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm rounded-sm",
      md: "px-4 py-2 text-base rounded-md",
      lg: "px-6 py-3 text-lg rounded-lg font-medium",
      xl: "px-8 py-6 text-xl rounded-xl font-bold min-h-[64px]",
      icon: "p-2 rounded-full",
    };

    return (
      <motion.button
        whileTap={{ scale: 0.97 }}
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 touch-manipulation",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {children as any}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button };
