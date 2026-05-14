import { ReactNode } from "react";
import { cn } from "@/src/lib/utils";
import { motion } from "motion/react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={cn("px-4 py-6 flex flex-col gap-6", className)}
    >
      {children}
    </motion.div>
  );
}
