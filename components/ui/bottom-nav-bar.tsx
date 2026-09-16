"use client";

import { useEffect, useState } from "react";

import { motion, useReducedMotion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

import { defaultNavItems } from "@/lib/constants/default-nav-items";
import { cn } from "@/lib/utils";

const MOBILE_LABEL_WIDTH = 72;

export type BottomNavBarItem = {
  external?: boolean;
  href?: string;
  icon: LucideIcon;
  isActive?: boolean;
  label: string;
};

type BottomNavBarProps = {
  className?: string;
  defaultIndex?: number;
  items?: readonly BottomNavBarItem[];
  stickyBottom?: boolean;
};

const getActiveIndexForHash = (
  items: readonly BottomNavBarItem[],
  hash: string,
  fallbackIndex: number,
) => {
  const hashIndex = items.findIndex((item) => item.href === hash);
  if (hashIndex >= 0) return hashIndex;

  const configuredIndex = items.findIndex((item) => item.isActive);
  return configuredIndex >= 0 ? configuredIndex : fallbackIndex;
};

export function BottomNavBar({
  className,
  defaultIndex = 0,
  items = defaultNavItems,
  stickyBottom = false,
}: BottomNavBarProps) {
  const prefersReducedMotion = useReducedMotion();
  const initialIndex = Math.min(
    Math.max(defaultIndex, 0),
    Math.max(items.length - 1, 0),
  );
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    const syncActiveIndex = () => {
      setActiveIndex(
        getActiveIndexForHash(items, window.location.hash, initialIndex),
      );
    };

    syncActiveIndex();
    window.addEventListener("hashchange", syncActiveIndex);
    return () => window.removeEventListener("hashchange", syncActiveIndex);
  }, [initialIndex, items]);

  if (items.length === 0) {
    return null;
  }

  const itemClassName = (isActive: boolean) =>
    cn(
      "relative flex min-h-11 min-w-11 items-center rounded-full py-2 transition-colors duration-200 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-silver",
      isActive ? "gap-2 bg-primary/10 px-2.5 text-primary" : "bg-transparent px-2 text-muted-foreground hover:bg-muted",
    );

  const itemContent = (item: BottomNavBarItem, isActive: boolean) => {
    const Icon = item.icon;

    return (
      <>
        <Icon
          size={20}
          strokeWidth={2}
          aria-hidden="true"
          className="shrink-0 transition-colors duration-200"
        />
        <motion.span
          initial={false}
          animate={{
            width: isActive ? `${MOBILE_LABEL_WIDTH}px` : "0px",
            opacity: isActive ? 1 : 0,
            marginLeft: isActive ? "0px" : "0px",
          }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : {
                  width: { type: "spring", stiffness: 350, damping: 32 },
                  opacity: { duration: 0.19 },
                }
          }
          className="flex max-w-[72px] items-center overflow-hidden"
        >
          <span
            className={cn(
              "select-none overflow-hidden text-ellipsis whitespace-nowrap text-xs leading-[1.9] font-medium transition-opacity duration-200",
              isActive ? "text-primary" : "opacity-0",
            )}
            title={item.label}
          >
            {item.label}
          </span>
        </motion.span>
      </>
    );
  };

  return (
    <motion.nav
      initial={prefersReducedMotion ? false : { scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 300, damping: 26 }
      }
      role="navigation"
      aria-label="Bottom navigation"
      className={cn(
        "flex h-[52px] min-w-[280px] max-w-[95vw] items-center gap-1 rounded-full border border-border bg-card p-1 shadow-xl",
        stickyBottom &&
          "fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-20 mx-auto w-fit",
        className,
      )}
    >
      {items.map((item, index) => {
        const isActive = activeIndex === index;
        const sharedProps = {
          "aria-current": isActive ? ("location" as const) : undefined,
          "aria-label": item.label,
          className: itemClassName(isActive),
          onClick: () => setActiveIndex(index),
          whileTap: prefersReducedMotion ? undefined : { scale: 0.97 },
        };

        return item.href ? (
          <motion.a
            key={item.label}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            {...sharedProps}
          >
            {itemContent(item, isActive)}
          </motion.a>
        ) : (
          <motion.button key={item.label} type="button" {...sharedProps}>
            {itemContent(item, isActive)}
          </motion.button>
        );
      })}
    </motion.nav>
  );
}

export default BottomNavBar;
