"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type ReactNode } from "react";

import { gsap, SplitText } from "@/lib/gsap";

type TextBlockAnimationProps = {
  children: ReactNode;
  animateOnScroll?: boolean;
  delay?: number;
  blockColor?: string;
  stagger?: number;
  duration?: number;
};

export default function TextBlockAnimation({
  children,
  animateOnScroll = true,
  delay = 0,
  blockColor = "var(--sunset-orange)",
  stagger = 0.08,
  duration = 0.6,
}: TextBlockAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const target = container?.firstElementChild;

      if (!container || !target) {
        return;
      }

      const shouldAnimate =
        window.matchMedia("(min-width: 768px)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!shouldAnimate) {
        return;
      }

      const split = new SplitText(target, {
        type: "lines",
        tag: "span",
        linesClass: "text-block-animation__line",
      });
      const blocks = split.lines.map((line) => {
        const parent = line.parentNode;

        if (!parent) {
          return null;
        }

        const wrapper = document.createElement("span");
        wrapper.className = "text-block-animation__mask";

        const block = document.createElement("span");
        block.className = "text-block-animation__block";
        block.style.backgroundColor = blockColor;

        parent.insertBefore(wrapper, line);
        wrapper.appendChild(line);
        wrapper.appendChild(block);

        gsap.set(line, { autoAlpha: 0 });

        return block;
      });
      const revealBlocks = blocks.filter(
        (block): block is HTMLSpanElement => block !== null,
      );

      if (revealBlocks.length === 0) {
        return;
      }

      const timeline = gsap.timeline({
        defaults: { ease: "expo.inOut" },
        delay,
        ...(animateOnScroll
          ? {
              scrollTrigger: {
                trigger: container,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          : {}),
      });

      timeline
        .to(revealBlocks, {
          scaleX: 1,
          duration,
          stagger,
          transformOrigin: "left center",
        })
        .set(
          split.lines,
          {
            autoAlpha: 1,
            stagger,
          },
          `<${duration / 2}`,
        )
        .to(
          revealBlocks,
          {
            scaleX: 0,
            duration,
            stagger,
            transformOrigin: "right center",
          },
          `<${duration * 0.4}`,
        );
    },
    {
      scope: containerRef,
      dependencies: [animateOnScroll, blockColor, delay, duration, stagger],
      revertOnUpdate: true,
    },
  );

  return <div ref={containerRef}>{children}</div>;
}
