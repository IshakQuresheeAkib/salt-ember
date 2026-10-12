"use client";

import CardCarousel from "@/components/ui/card-carousel";
import MenuPageViewer from "@/components/ui/menu-page-viewer";
import TextBlockAnimation from "@/components/ui/text-block-animation";
import {
  contentShellClassName,
  highlightedTextClassName,
  sectionHeadingClassName,
} from "@/lib/tailwind";
import { useRef, useState } from "react";
import { menuPages } from "@/lib/constants/menu";

export function Menu() {
  const cardTriggerRef = useRef<HTMLElement | null>(null);
  const [selectedPageIndex, setSelectedPageIndex] = useState<number | null>(null);
  const [shouldAnimateViewer, setShouldAnimateViewer] = useState(true);

  return (
    <section
      aria-labelledby="heritage-menu-title"
      className={`${contentShellClassName} my-20 md:my-28`}
      id="menu"
    >
      <div className="mx-auto max-w-155 text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.16em] text-orange">
          From our kitchen
        </p>
        <TextBlockAnimation blockColor="var(--orange)">
          <h2 id="heritage-menu-title" className={sectionHeadingClassName}>
            Our <em className={highlightedTextClassName}>Heritage</em> Menu
          </h2>
        </TextBlockAnimation>
        <p className="mt-[15px] mb-0 text-[clamp(11.2px,10.56px+0.14vw,13px)] text-muted-foreground">
          Browse every page of our menu. Use the arrows to browse, then click a
          page to open it in full.
        </p>
      </div>
      <CardCarousel
        cards={menuPages}
        initialIndex={3}
        onCardActivate={(index, trigger) => {
          cardTriggerRef.current = trigger;
          setShouldAnimateViewer(!trigger.matches(":focus-visible"));
          setSelectedPageIndex(index);
        }}
      />
      <MenuPageViewer
        onPageChange={setSelectedPageIndex}
        onRequestClose={() => setSelectedPageIndex(null)}
        pages={menuPages}
        returnFocusRef={cardTriggerRef}
        selectedPageIndex={selectedPageIndex}
        shouldAnimate={shouldAnimateViewer}
      />
    </section>
  );
}
