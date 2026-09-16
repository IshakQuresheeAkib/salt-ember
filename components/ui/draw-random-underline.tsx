"use client";

import { useEffect, useRef, useState, type AnchorHTMLAttributes, type ReactNode} from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type PathData = {
  d: string;
  viewBox: string;
};

const pathDataVariants: readonly PathData[] = [
  {
    d: "M5 29.5014C9.61174 24.4515 12.9521 17.9873 20.9532 17.5292C23.7742 17.3676 27.0987 17.7897 29.6575 19.0014C33.2644 20.7093 35.6481 24.0004 39.4178 25.5014C48.3911 29.0744 55.7503 25.7731 63.3048 21.0292C67.9902 18.0869 73.7668 16.1366 79.3721 17.8903C85.1682 19.7036 88.2173 26.2464 94.4121 27.2514C102.584 28.5771 107.023 25.5064 113.276 20.6125C119.927 15.4067 128.83 12.3333 137.249 15.0014C141.418 16.3225 143.116 18.7528 146.581 21.0014C149.621 22.9736 152.78 23.6197 156.284 24.2514C165.142 25.8479 172.315 17.5185 179.144 13.5014C184.459 10.3746 191.785 8.74853 195.868 14.5292C199.252 19.3205 205.597 22.9057 211.621 22.5014C215.553 22.2374 220.183 17.8356 222.979 15.5569C225.4 13.5845 227.457 11.1105 230.742 10.5292C232.718 10.1794 234.784 12.9691 236.164 14.0014C238.543 15.7801 240.717 18.4775 243.356 19.8903C249.488 23.1729 255.706 21.2551 261.079 18.0014C266.571 14.6754 270.439 11.5202 277.146 13.6125C280.725 14.7289 283.221 17.209 286.393 19.0014C292.321 22.3517 298.255 22.5014 305 22.5014",
    viewBox: "0 0 310 40",
  },
];

let nextVariantIndex: number | null = null;

function getNextVariant() {
  nextVariantIndex =
    nextVariantIndex === null
      ? Math.floor(Math.random() * pathDataVariants.length)
      : (nextVariantIndex + 1) % pathDataVariants.length;

  return pathDataVariants[nextVariantIndex];
}

type AnimatedUnderlineLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "children"
> & {
  active?: boolean;
  children: ReactNode;
};

export function AnimatedUnderlineLink({
  active = false,
  children,
  className,
  onBlur,
  onFocus,
  onMouseEnter,
  onMouseLeave,
  ...props
}: AnimatedUnderlineLinkProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const enterTweenRef = useRef<gsap.core.Tween | null>(null);
  const leaveTweenRef = useRef<gsap.core.Tween | null>(null);
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);
  const [interactionPathData, setInteractionPathData] =
    useState<PathData | null>(null);
  const pathData = active
    ? interactionPathData ?? pathDataVariants[0]
    : interactionPathData;

  const shouldShow = () =>
    active || isHoveredRef.current || isFocusedRef.current;

  useEffect(() => {
    const path = pathRef.current;

    if (!path || !pathData) {
      return;
    }

    if (active && !isHoveredRef.current && !isFocusedRef.current) {
      gsap.set(path, { drawSVG: "100%" });
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(path, { drawSVG: "100%" });
      return;
    }

    leaveTweenRef.current?.kill();
    gsap.set(path, { drawSVG: "0%" });
    enterTweenRef.current = gsap.to(path, {
      drawSVG: "100%",
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        enterTweenRef.current = null;
      },
    });
  }, [active, pathData]);

  const showUnderline = () => {
    leaveTweenRef.current?.kill();

    if (enterTweenRef.current?.isActive()) {
      enterTweenRef.current.eventCallback("onComplete", () => {
        enterTweenRef.current = null;
      });
      return;
    }

    setInteractionPathData(getNextVariant());
  };

  const hideUnderline = () => {
    if (shouldShow() || active) {
      return;
    }

    const path = pathRef.current;

    if (!path || leaveTweenRef.current?.isActive()) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInteractionPathData(null);
      return;
    }

    const removePath = () => {
      leaveTweenRef.current = gsap.to(path, {
        drawSVG: "100% 100%",
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          leaveTweenRef.current = null;
          setInteractionPathData(null);
        },
      });
    };

    if (enterTweenRef.current?.isActive()) {
      enterTweenRef.current.eventCallback("onComplete", removePath);
      return;
    }

    removePath();
  };

  useEffect(
    () => () => {
      enterTweenRef.current?.kill();
      leaveTweenRef.current?.kill();
    },
    [],
  );

  return (
    <a
      {...props}
      aria-current={active ? "page" : props["aria-current"]}
      className={cn(
        "relative inline-flex min-h-8 min-w-8 items-center justify-center pb-1",
        className,
      )}
      onMouseEnter={(event) => {
        isHoveredRef.current = true;
        showUnderline();
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        isHoveredRef.current = false;
        hideUnderline();
        onMouseLeave?.(event);
      }}
      onFocus={(event) => {
        isFocusedRef.current = true;
        showUnderline();
        onFocus?.(event);
      }}
      onBlur={(event) => {
        isFocusedRef.current = false;
        hideUnderline();
        onBlur?.(event);
      }}
    >
      {children}
      {pathData ? (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[0.42em] w-full overflow-visible"
          fill="none"
          preserveAspectRatio="none"
          viewBox={pathData.viewBox}
        >
          <path
            ref={pathRef}
            d={pathData.d}
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="10"
          />
        </svg>
      ) : null}
    </a>
  );
}
