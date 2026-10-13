"use client";

/* eslint-disable @next/next/no-img-element */

import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
  type TouchEvent,
} from "react";
import { getMenuPageSwipeDirection } from "@/lib/menu-page-viewer-gesture.mjs";
import { cn } from "@/lib/utils";

const preloadedUrls = new Set<string>();
const preloadedImages = new Map<string, HTMLImageElement>();

function preloadImage(url: string, priority: "high" | "low" = "low"): void {
  if (typeof window === "undefined" || !url || preloadedUrls.has(url)) return;

  const img = new Image();
  if (priority === "high") {
    img.fetchPriority = "high";
  } else {
    img.fetchPriority = "low";
  }
  img.decoding = "async";
  img.src = url;
  preloadedImages.set(url, img);

  if (img.complete) {
    preloadedUrls.add(url);
  } else if (typeof img.decode === "function") {
    img
      .decode()
      .then(() => {
        preloadedUrls.add(url);
      })
      .catch(() => {
        preloadedUrls.add(url);
      });
  } else {
    img.onload = () => {
      preloadedUrls.add(url);
    };
  }
}

type MenuPage = {
  alt?: string;
  imgUrl: string;
};

interface MenuPageViewerProps {
  onPageChange: (index: number) => void;
  onRequestClose: () => void;
  pages: MenuPage[];
  returnFocusRef: MutableRefObject<HTMLElement | null>;
  selectedPageIndex: number | null;
  shouldAnimate: boolean;
}

export default function MenuPageViewer({
  onPageChange,
  onRequestClose,
  pages,
  returnFocusRef,
  selectedPageIndex,
  shouldAnimate,
}: MenuPageViewerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const exitTimerRef = useRef<number | null>(null);
  const scrollPosition = useRef(0);
  const touchGesture = useRef({
    hasMultipleTouches: false,
    startedAt: 0,
    x: 0,
    y: 0,
  });
  const [imageAttempt, setImageAttempt] = useState(0);
  const [imageState, setImageState] = useState<"error" | "loaded">("loaded");
  const [isClosing, setIsClosing] = useState(false);

  const activePageIndex = selectedPageIndex ?? 0;
  const page = selectedPageIndex === null ? undefined : pages[activePageIndex];
  const isOpen = Boolean(page);
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const [displayedPage, setDisplayedPage] = useState<MenuPage | null>(null);
  const isImageLoaded = page
    ? preloadedUrls.has(page.imgUrl) || loadedUrl === page.imgUrl
    : false;

  const closeDialog = useCallback(() => {
    const dialog = dialogRef.current;

    if (dialog?.open) dialog.close();
  }, []);

  const requestClose = useCallback(() => {
    if (isClosing) return;

    if (!shouldAnimate) {
      closeDialog();
      return;
    }

    setIsClosing(true);
    exitTimerRef.current = window.setTimeout(closeDialog, 150);
  }, [closeDialog, isClosing, shouldAnimate]);

  const changePage = useCallback(
    (direction: "next" | "previous") => {
      if (selectedPageIndex === null || !pages.length) return;

      onPageChange(
        direction === "next"
          ? (selectedPageIndex + 1) % pages.length
          : (selectedPageIndex - 1 + pages.length) % pages.length,
      );
    },
    [onPageChange, pages.length, selectedPageIndex],
  );

  const handleTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;

    touchGesture.current = {
      hasMultipleTouches: event.touches.length !== 1,
      startedAt: Date.now(),
      x: touch.clientX,
      y: touch.clientY,
    };
  }, []);

  const handleTouchMove = useCallback((event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 1) {
      touchGesture.current.hasMultipleTouches = true;
    }
  }, []);

  const handleTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const gesture = touchGesture.current;
      const touch = event.changedTouches[0];
      if (!touch) return;

      const direction = getMenuPageSwipeDirection({
        endX: touch.clientX,
        endY: touch.clientY,
        hasMultipleTouches: gesture.hasMultipleTouches,
        startedAt: gesture.startedAt,
        startX: gesture.x,
        startY: gesture.y,
      });

      if (direction) changePage(direction);
    },
    [changePage],
  );

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (!isOpen) {
      if (dialog.open) dialog.close();
      return;
    }

    if (!dialog.open) dialog.showModal();
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const body = document.body;
    const originalStyles = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    scrollPosition.current = window.scrollY;
    body.style.overflow = "hidden";
    body.style.paddingRight = `${parseFloat(window.getComputedStyle(body).paddingRight) + scrollbarWidth}px`;
    body.style.position = "fixed";
    body.style.top = `-${scrollPosition.current}px`;
    body.style.width = "100%";

    return () => {
      body.style.overflow = originalStyles.overflow;
      body.style.paddingRight = originalStyles.paddingRight;
      body.style.position = originalStyles.position;
      body.style.top = originalStyles.top;
      body.style.width = originalStyles.width;
      window.scrollTo(0, scrollPosition.current);
    };
  }, [isOpen]);

  /* ── Preload initial carousel pages immediately, then remaining in idle ── */
  useEffect(() => {
    if (!pages.length) return;

    // Elevate only the initial carousel cover page to avoid network contention
    if (pages[3]) preloadImage(pages[3].imgUrl, "high");

    const isSaveData =
      typeof navigator !== "undefined" &&
      // @ts-expect-error Connection saveData is non-standard Chromium API
      Boolean(navigator.connection?.saveData);

    if (isSaveData) return;

    const schedule =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback
        : (cb: () => void) => window.setTimeout(cb, 200);

    const cancelSchedule =
      typeof window.cancelIdleCallback === "function"
        ? window.cancelIdleCallback
        : (id: number) => clearTimeout(id);

    const id = schedule(() => {
      for (let i = 0; i < pages.length; i++) {
        if (i !== 3) {
          preloadImage(pages[i].imgUrl, "low");
        }
      }
    });

    return () => {
      cancelSchedule(id as number);
    };
  }, [pages]);

  /* ── On page change / open: preload active & adjacent pages ── */
  useEffect(() => {
    if (!isOpen || !page) return;

    // Elevate active page with high priority
    preloadImage(page.imgUrl, "high");

    // Preload immediate neighbors (+1, -1) with high priority
    const next1 = (activePageIndex + 1) % pages.length;
    const prev1 = (activePageIndex - 1 + pages.length) % pages.length;
    if (pages[next1]) preloadImage(pages[next1].imgUrl, "high");
    if (pages[prev1]) preloadImage(pages[prev1].imgUrl, "high");

    // Preload remaining neighbors (+2..+5) with low priority to avoid network contention
    for (let offset = 2; offset <= 5; offset++) {
      const nextIdx = (activePageIndex + offset) % pages.length;
      const prevIdx = (activePageIndex - offset + pages.length) % pages.length;
      if (pages[nextIdx]) preloadImage(pages[nextIdx].imgUrl, "low");
      if (pages[prevIdx]) preloadImage(pages[prevIdx].imgUrl, "low");
    }
  }, [isOpen, page, activePageIndex, pages]);

  useEffect(
    () => () => {
      if (exitTimerRef.current !== null) clearTimeout(exitTimerRef.current);
    },
    [],
  );

  return (
    <dialog
      aria-labelledby="menu-viewer-title"
      className={cn(
        "fixed inset-0 m-0 h-dvh max-h-none w-dvw max-w-none border-0 bg-transparent p-0 text-silver backdrop:bg-[color:color-mix(in_srgb,var(--midnight-shadow)_100%,transparent)]",
        shouldAnimate && !isClosing && "animate-in fade-in zoom-in-95 duration-200 ease-out",
        shouldAnimate && isClosing && "animate-out fade-out zoom-out-95 duration-150 ease-in",
      )}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClose={() => {
        setIsClosing(false);
        setLoadedUrl(null);
        setDisplayedPage(null);
        onRequestClose();
        window.requestAnimationFrame(() => returnFocusRef.current?.focus());
      }}
      onKeyDown={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

        event.stopPropagation();
        event.preventDefault();
        changePage(event.key === "ArrowRight" ? "next" : "previous");
      }}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          event.currentTarget.dataset.backdropPointer = "true";
        }
      }}
      onClick={(event) => {
        const startedOnBackdrop =
          event.currentTarget.dataset.backdropPointer === "true";

        delete event.currentTarget.dataset.backdropPointer;
        if (startedOnBackdrop && event.target === event.currentTarget) requestClose();
      }}
      ref={dialogRef}
    >
      {page ? (
        <section
          className="pointer-events-none mx-auto grid h-full w-full grid-rows-[auto_minmax(0,1fr)_auto] gap-y-3 px-3 py-3 sm:gap-y-4 sm:px-6 sm:py-6"
        >
          <header className="pointer-events-auto mx-auto flex w-full items-center justify-between gap-3 border-b border-orange/50 pb-3 sm:max-w-[calc((100dvh-12.25rem)*0.792)]">
            <p
              className="min-w-0 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
              id="menu-viewer-title"
            >
              <span className="text-silver">Menu</span>
              <span aria-hidden="true" className="mx-2 text-orange">
                /
              </span>
              <span className="tabular-nums">
                {String(activePageIndex + 1).padStart(2, "0")} of {pages.length}
              </span>
            </p>
            <button
              aria-label="Close menu viewer"
              className="flex min-h-11 items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-silver transition-colors hover:text-orange focus-visible:outline-silver"
              onClick={requestClose}
              ref={closeButtonRef}
              type="button"
            >
              <span className="hidden sm:inline">Close</span>
              <X aria-hidden="true" className="size-5" />
            </button>
          </header>

          <div
            aria-busy={!isImageLoaded}
            className="pointer-events-auto relative mx-auto aspect-[811/1024] min-h-0 w-full self-center overflow-hidden border border-orange/40 bg-midnight-shadow sm:max-w-[calc((100dvh-12.25rem)*0.792)]"
          >
            {imageState === "error" ? (
              <div className="grid h-full place-items-center p-4">
                <div className="grid max-w-sm place-items-center gap-3 rounded-lg border border-orange/40 bg-surface p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    This menu page could not be loaded.
                  </p>
                  <button
                    className="flex min-h-11 items-center gap-2 rounded-md bg-orange px-4 py-2 text-sm font-semibold text-midnight-shadow transition-colors hover:bg-silver focus-visible:outline-orange"
                    onClick={() => {
                      if (page) preloadedUrls.delete(page.imgUrl);
                      setLoadedUrl(null);
                      setImageAttempt((attempt) => attempt + 1);
                      setImageState("loaded");
                    }}
                    type="button"
                  >
                    <RotateCcw aria-hidden="true" className="size-4" />
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="relative flex h-full w-full items-center justify-center p-4 sm:p-8"
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
                onTouchStart={handleTouchStart}
              >
                {/* Fallback image: retains previous page so the screen is NEVER blank while loading */}
                {displayedPage && displayedPage.imgUrl !== page.imgUrl && !isImageLoaded ? (
                  <img
                    alt={displayedPage.alt ?? ""}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 block h-full w-full select-none object-contain p-4 shadow-[0_18px_50px_color-mix(in_srgb,var(--midnight-shadow)_75%,transparent)] sm:p-8"
                    decoding="async"
                    draggable={false}
                    height={2048}
                    src={displayedPage.imgUrl}
                    width={1622}
                  />
                ) : null}

                {/* Loading indicator on cold first open */}
                {!isImageLoaded && (!displayedPage || displayedPage.imgUrl === page.imgUrl) ? (
                  <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
                    <div className="size-8 animate-spin rounded-full border-2 border-orange/20 border-t-orange" />
                  </div>
                ) : null}

                {/* Active page image */}
                <img
                  alt={page.alt ?? `Menu page ${activePageIndex + 1}`}
                  className={cn(
                    "block h-full w-full select-none object-contain shadow-[0_18px_50px_color-mix(in_srgb,var(--midnight-shadow)_75%,transparent)] transition-opacity duration-200 ease-out motion-reduce:transition-none",
                    isImageLoaded ? "opacity-100" : "opacity-0",
                  )}
                  decoding="async"
                  draggable={false}
                  fetchPriority="high"
                  height={2048}
                  key={`${page.imgUrl}-${imageAttempt}`}
                  loading="eager"
                  onError={() => setImageState("error")}
                  onLoad={() => {
                    preloadedUrls.add(page.imgUrl);
                    setLoadedUrl(page.imgUrl);
                    setDisplayedPage(page);
                    setImageState("loaded");
                  }}
                  src={page.imgUrl}
                  width={1622}
                />
              </div>
            )}
          </div>

          <footer className="pointer-events-auto mx-auto flex w-full items-center justify-between gap-3 border-t border-orange/50 pt-3 sm:max-w-[calc((100dvh-12.25rem)*0.792)]">
            <button
              aria-label="Previous menu page"
              className="flex size-11 shrink-0 items-center justify-center rounded-md border border-orange/60 text-silver transition-colors hover:bg-orange hover:text-midnight-shadow focus-visible:border-silver sm:w-auto sm:gap-2 sm:px-3"
              onClick={() => changePage("previous")}
              type="button"
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            <p className="hidden text-center text-xs leading-5 text-muted-foreground sm:block">
              Swipe or use arrows to change pages
            </p>
            <button
              aria-label="Next menu page"
              className="flex size-11 shrink-0 items-center justify-center rounded-md border border-orange/60 text-silver transition-colors hover:bg-orange hover:text-midnight-shadow focus-visible:border-silver sm:w-auto sm:gap-2 sm:px-3"
              onClick={() => changePage("next")}
              type="button"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight aria-hidden="true" className="size-5" />
            </button>
          </footer>
        </section>
      ) : null}
    </dialog>
  );
}
