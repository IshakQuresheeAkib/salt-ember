"use client";

/* The viewer deliberately requests the original artwork instead of an optimized derivative. */
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
  const [imageState, setImageState] = useState<
    "error" | "loaded" | "loading"
  >("loading");
  const [isClosing, setIsClosing] = useState(false);

  const activePageIndex = selectedPageIndex ?? 0;
  const page = selectedPageIndex === null ? undefined : pages[activePageIndex];
  const isOpen = Boolean(page);

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

  useEffect(() => {
    if (!isOpen) return;

    const resetFrame = window.requestAnimationFrame(() => {
      setImageState("loading");
    });

    return () => window.cancelAnimationFrame(resetFrame);
  }, [isOpen, selectedPageIndex]);

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
          aria-busy={imageState === "loading"}
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
            className="pointer-events-auto relative mx-auto aspect-[811/1024] min-h-0 w-full self-center overflow-hidden border border-orange/40 bg-midnight-shadow sm:max-w-[calc((100dvh-12.25rem)*0.792)]"
          >
            {imageState === "loading" ? (
              <div className="absolute inset-0 z-10 grid place-items-center" role="status">
                <span className="rounded-full border border-orange/60 bg-surface px-4 py-2 text-sm text-muted-foreground">
                  Loading menu page…
                </span>
              </div>
            ) : null}
            {imageState === "error" ? (
              <div className="grid h-full place-items-center p-4">
                <div className="grid max-w-sm place-items-center gap-3 rounded-lg border border-orange/40 bg-surface p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    This menu page could not be loaded.
                  </p>
                  <button
                    className="flex min-h-11 items-center gap-2 rounded-md bg-orange px-4 py-2 text-sm font-semibold text-midnight-shadow transition-colors hover:bg-silver focus-visible:outline-orange"
                    onClick={() => {
                      setImageAttempt((attempt) => attempt + 1);
                      setImageState("loading");
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
                className="flex h-full w-full items-center justify-center p-4 sm:p-8"
                key={`${page.imgUrl}-${imageAttempt}`}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
                onTouchStart={handleTouchStart}
              >
                <img
                  alt={page.alt ?? `Menu page ${activePageIndex + 1}`}
                  className={cn(
                    "block h-full w-full select-none object-contain shadow-[0_18px_50px_color-mix(in_srgb,var(--midnight-shadow)_75%,transparent)]",
                    imageState === "loaded" ? "opacity-100" : "opacity-0",
                  )}
                  draggable={false}
                  onError={() => setImageState("error")}
                  onLoad={() => setImageState("loaded")}
                  src={page.imgUrl}
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
