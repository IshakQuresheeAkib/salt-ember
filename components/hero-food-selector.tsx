"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { gsap } from "@/lib/gsap";
import { canScheduleHeroRotation } from "@/lib/hero-food-autoplay-state";
import { cn } from "@/lib/utils";

const foodStates = [
  { id: "dishes", label: "Dishes", icon: "◉", image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=90", alt: "A fresh bowl of noodles topped with herbs and egg" },
  { id: "dessert", label: "Dessert", icon: "▱", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=90", alt: "A plated dessert with berries and cream" },
  { id: "drinks", label: "Drinks", icon: "♧", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=90", alt: "Colorful handcrafted drinks with fresh citrus" },
  { id: "platter", label: "Platter", icon: "◉", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=90", alt: "A fire-roasted platter of vegetables and grilled food" },
] as const;

type FoodId = (typeof foodStates)[number]["id"];
type Direction = 1 | -1;

interface HeroTransition {
  activeIndex: number;
  outgoingIndex: number | null;
  outgoingMotion: SceneMotionState | null;
  direction: Direction;
  revision: number;
}

interface SceneMotionState {
  opacity: number;
  pathProgress: number;
}

const DISH_MOTION_SECONDS = 0.8;
const DISH_FADE_SECONDS = 0.6;
const OUTGOING_FADE_START_SECONDS =
  DISH_MOTION_SECONDS - DISH_FADE_SECONDS;
const AUTOPLAY_DWELL_MS = 500;
const HERO_ARC_PATH =
  "M 54 0 C 24.177 0 0 26.863 0 60 C 0 93.137 24.177 120 54 120";
const HERO_CURVE_FILL_PATH =
  "M 100 0 H 54 C 24.177 0 0 26.863 0 60 C 0 93.137 24.177 120 54 120 H 100 Z";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const ARC_MIDPOINT = 0.5;
const heroArtClassName =
  "hero-art max-tablet:pb-[clamp(84px,18vw,108px)] max-mobile:min-h-[400px]";
const categoryControlsClassName =
  "absolute top-1/2 right-[8vw] min-desktop:right-[clamp(28px,2vw,40px)] z-3 flex -translate-y-1/2 flex-col gap-2.5 ";
const categoryButtonClassName =
  "min-h-8 min-w-8 rounded-[10px] border border-transparent px-[clamp(10px,1.1vw,14.4px)] py-2 text-[clamp(11.2px,10.56px+0.14vw,12.8px)] active:scale-[0.97] max-mobile:py-1.5";
const activeCategoryButtonClassName = "bg-silver-mist text-midnight-shadow";
const inactiveCategoryButtonClassName =
  "bg-midnight-shadow text-silver-mist transition-[background,border-color,color,scale] duration-200 hover:border-silver-mist hover:bg-silver-mist hover:text-midnight-shadow";
function subscribeToReducedMotion(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", onStoreChange);

  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return true;
}

function subscribeToVisibility(onStoreChange: () => void) {
  document.addEventListener("visibilitychange", onStoreChange);

  return () => document.removeEventListener("visibilitychange", onStoreChange);
}

function getVisibilitySnapshot() {
  return document.visibilityState === "visible";
}

function getVisibilityServerSnapshot() {
  return false;
}

export function HeroFoodSelector() {
  const [transition, setTransition] = useState<HeroTransition>({
    activeIndex: 0,
    outgoingIndex: null,
    outgoingMotion: null,
    direction: 1,
    revision: 0,
  });
  const [manualAnnouncement, setManualAnnouncement] = useState("");
  const [geometryRevision, setGeometryRevision] = useState(0);
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const isDocumentVisible = useSyncExternalStore(
    subscribeToVisibility,
    getVisibilitySnapshot,
    getVisibilityServerSnapshot,
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const arcPathRef = useRef<SVGPathElement>(null);
  const sceneRefs = useRef(new Map<FoodId, HTMLDivElement>());
  const sceneMotionRef = useRef(new Map<FoodId, SceneMotionState>());
  const categoryButtonRefs = useRef(new Map<FoodId, HTMLButtonElement>());
  const autoplayTimerRef = useRef<number | null>(null);
  const geometryFrameRef = useRef<number | null>(null);
  const previousReducedMotionRef = useRef(reducedMotion);
  const renderedTransitionRevisionRef = useRef<number | null>(null);
  const activeFood = foodStates[transition.activeIndex];
  const shouldScheduleRotation = canScheduleHeroRotation({
    isDocumentVisible,
    reducedMotion,
  });

  const captureSceneMotion = useCallback(
    (index: number): SceneMotionState | null => {
      const food = foodStates[index];
      const scene = sceneRefs.current.get(food.id);
      const existingMotion = sceneMotionRef.current.get(food.id);
      if (!scene || !existingMotion) return null;

      const opacity = Number(window.getComputedStyle(scene).opacity);
      const capturedMotion = {
        ...existingMotion,
        opacity: Number.isFinite(opacity) ? opacity : existingMotion.opacity,
      };
      sceneMotionRef.current.set(food.id, capturedMotion);

      return capturedMotion;
    },
    [],
  );

  const selectFood = useCallback((requestedIndex: number | null) => {
    if (requestedIndex !== null) {
      setManualAnnouncement(foodStates[requestedIndex].alt);
    }

    setTransition((current) => {
      const nextIndex =
        requestedIndex ?? (current.activeIndex + 1) % foodStates.length;
      if (current.activeIndex === nextIndex) return current;

      return {
        activeIndex: nextIndex,
        outgoingIndex: current.activeIndex,
        outgoingMotion: captureSceneMotion(current.activeIndex),
        direction: 1,
        revision: current.revision + 1,
      };
    });
  }, [captureSceneMotion]);

  useEffect(() => {
    if (autoplayTimerRef.current !== null) {
      window.clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }

    if (!shouldScheduleRotation || transition.outgoingIndex !== null) return;

    autoplayTimerRef.current = window.setTimeout(() => {
      autoplayTimerRef.current = null;
      selectFood(null);
    }, AUTOPLAY_DWELL_MS);

    return () => {
      if (autoplayTimerRef.current !== null) {
        window.clearTimeout(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    };
  }, [selectFood, shouldScheduleRotation, transition.activeIndex, transition.outgoingIndex]);

  useEffect(() => {
    const activeButton = categoryButtonRefs.current.get(activeFood.id);
    const categoryRow = rootRef.current?.querySelector<HTMLDivElement>(
      ".hero-categories",
    );
    if (!activeButton || !categoryRow || !window.matchMedia("(max-width: 800px)").matches) {
      return;
    }

    const buttonBounds = activeButton.getBoundingClientRect();
    const rowBounds = categoryRow.getBoundingClientRect();
    const centeredLeft =
      categoryRow.scrollLeft +
      buttonBounds.left -
      rowBounds.left -
      categoryRow.clientLeft +
      (buttonBounds.width - categoryRow.clientWidth) / 2;

    categoryRow.scrollTo({
      left: Math.max(0, Math.min(centeredLeft, categoryRow.scrollWidth - categoryRow.clientWidth)),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [activeFood.id, reducedMotion]);

  useLayoutEffect(() => {
    const reducedMotionWasEnabled = previousReducedMotionRef.current;
    previousReducedMotionRef.current = reducedMotion;

    if (!reducedMotion || reducedMotionWasEnabled) return;

    setTransition((current) => {
      if (current.outgoingIndex === null) return current;

      return {
        ...current,
        outgoingIndex: null,
        outgoingMotion: null,
        revision: current.revision + 1,
      };
    });
  }, [reducedMotion]);

  useEffect(() => {
    const stage = rootRef.current?.querySelector<HTMLDivElement>(
      ".hero-dish-stage",
    );
    const arcPath = arcPathRef.current;
    if (!stage || !arcPath) return;

    const refreshGeometry = () => {
      if (geometryFrameRef.current !== null) {
        window.cancelAnimationFrame(geometryFrameRef.current);
      }

      geometryFrameRef.current = window.requestAnimationFrame(() => {
        foodStates.forEach((_, index) => captureSceneMotion(index));
        geometryFrameRef.current = null;
        setGeometryRevision((current) => current + 1);
      });
    };
    const observer = new ResizeObserver(refreshGeometry);
    observer.observe(stage);
    observer.observe(arcPath);
    window.addEventListener("orientationchange", refreshGeometry);

    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", refreshGeometry);
      if (geometryFrameRef.current !== null) {
        window.cancelAnimationFrame(geometryFrameRef.current);
      }
    };
  }, [captureSceneMotion]);

  useGSAP(
    () => {
      const arcPath = arcPathRef.current;
      const activeScene = sceneRefs.current.get(activeFood.id);
      if (!arcPath || !activeScene) return;

      rootRef.current?.classList.add("hero-art--gsap-ready");

      const motionPathAt = (progress: number) => ({
        path: arcPath,
        align: arcPath,
        alignOrigin: [0.5, 0.5] as [number, number],
        autoRotate: false,
        start: progress,
        end: progress,
      });
      const setSceneMotion = (
        foodId: FoodId,
        pathProgress: number,
        opacity: number,
      ) => {
        sceneMotionRef.current.set(foodId, { opacity, pathProgress });
      };
      const pathProgressForTween = (
        start: number,
        end: number,
        progress: number,
      ) => start + (end - start) * gsap.parseEase("ember-in-out")(progress);
      const allScenes = Array.from(sceneRefs.current.values());
      const outgoingScene =
        transition.outgoingIndex === null
          ? null
          : sceneRefs.current.get(foodStates[transition.outgoingIndex].id) ?? null;
      const isResumingTransition =
        renderedTransitionRevisionRef.current === transition.revision;
      renderedTransitionRevisionRef.current = transition.revision;
      const activeMotion = sceneMotionRef.current.get(activeFood.id);
      const outgoingFood =
        transition.outgoingIndex === null
          ? null
          : foodStates[transition.outgoingIndex];
      const outgoingMotion = transition.outgoingMotion;

      gsap.set(allScenes, { autoAlpha: 0, zIndex: 0 });
      gsap.set(activeScene, {
        autoAlpha: 1,
        zIndex: 1,
        motionPath: motionPathAt(
          isResumingTransition && activeMotion
            ? activeMotion.pathProgress
            : ARC_MIDPOINT,
        ),
      });

      if (!outgoingScene) {
        setSceneMotion(activeFood.id, ARC_MIDPOINT, 1);
        return;
      }

      gsap.set(outgoingScene, {
        autoAlpha: outgoingMotion?.opacity ?? 1,
        zIndex: 1,
        motionPath: motionPathAt(outgoingMotion?.pathProgress ?? ARC_MIDPOINT),
      });
      if (outgoingFood) {
        setSceneMotion(
          outgoingFood.id,
          outgoingMotion?.pathProgress ?? ARC_MIDPOINT,
          outgoingMotion?.opacity ?? 1,
        );
      }

      if (reducedMotion) {
        gsap
          .timeline({
            onComplete: () => {
              setSceneMotion(activeFood.id, ARC_MIDPOINT, 1);
              setTransition((current) =>
                current.revision === transition.revision
                  ? { ...current, outgoingIndex: null, outgoingMotion: null }
                  : current,
              );
            },
          })
          .set(activeScene, { autoAlpha: 0, zIndex: 2 })
          .to(activeScene, { autoAlpha: 1, duration: DISH_FADE_SECONDS, ease: "ember-out" }, 0)
          .to(outgoingScene, { autoAlpha: 0, duration: DISH_FADE_SECONDS, ease: "ember-out" }, 0);
        return;
      }

      const incomingStart = transition.direction === 1 ? 1 : 0;
      const outgoingEnd = transition.direction === 1 ? 0 : 1;
      const activeStart =
        isResumingTransition && activeMotion
          ? activeMotion.pathProgress
          : incomingStart;
      const activeOpacity =
        isResumingTransition && activeMotion ? activeMotion.opacity : 0;
      const outgoingStart = outgoingMotion?.pathProgress ?? ARC_MIDPOINT;
      const timeline = gsap.timeline({
        paused: true,
        onComplete: () => {
          setSceneMotion(activeFood.id, ARC_MIDPOINT, 1);
          if (outgoingFood) {
            setSceneMotion(outgoingFood.id, outgoingEnd, 0);
          }
          setTransition((current) =>
            current.revision === transition.revision
              ? { ...current, outgoingIndex: null, outgoingMotion: null }
              : current,
          );
        },
      });

      gsap.set(activeScene, {
        autoAlpha: activeOpacity,
        zIndex: 2,
        motionPath: motionPathAt(activeStart),
      });
      setSceneMotion(activeFood.id, activeStart, activeOpacity);

      timeline
        .to(
          activeScene,
          {
            duration: DISH_MOTION_SECONDS,
            ease: "ember-in-out",
            motionPath: { ...motionPathAt(activeStart), end: ARC_MIDPOINT },
            onUpdate: () => {
              setSceneMotion(
                activeFood.id,
                pathProgressForTween(
                  activeStart,
                  ARC_MIDPOINT,
                  timeline.progress(),
                ),
                Number(gsap.getProperty(activeScene, "opacity")),
              );
            },
          },
          0,
        )
        .to(
          outgoingScene,
          {
            duration: DISH_MOTION_SECONDS,
            ease: "ember-in-out",
            motionPath: { ...motionPathAt(outgoingStart), end: outgoingEnd },
            onUpdate: () => {
              if (!outgoingFood) return;

              setSceneMotion(
                outgoingFood.id,
                pathProgressForTween(
                  outgoingStart,
                  outgoingEnd,
                  timeline.progress(),
                ),
                Number(gsap.getProperty(outgoingScene, "opacity")),
              );
            },
          },
          0,
        )
        .to(activeScene, { autoAlpha: 1, duration: DISH_FADE_SECONDS, ease: "ember-out" }, 0)
        .to(
          outgoingScene,
          { autoAlpha: 0, duration: DISH_FADE_SECONDS, ease: "ember-out" },
          OUTGOING_FADE_START_SECONDS,
        )
        .play(0);
    },
    {
      scope: rootRef,
      dependencies: [geometryRevision, transition.revision, reducedMotion],
      revertOnUpdate: true,
    },
  );

  return (
    <div
      ref={rootRef}
      className={heroArtClassName}
    >
      <div className="hero-dish-stage" aria-hidden="true">
        <svg
          className="hero-dish-curve"
          viewBox="0 0 100 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="hero-dish-curve-gradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              
              <stop offset="10%" stopColor="#e4e4e4" />
              <stop offset="35%" stopColor="#ffae17" />
              <stop offset="40%" stopColor="#ff7510" />
              <stop offset="50%" stopColor="#da500b" />
            </linearGradient>
          </defs>
          <path className="hero-dish-curve-fill" d={HERO_CURVE_FILL_PATH} />
          <path
            ref={arcPathRef}
            className="hero-dish-arc"
            d={HERO_ARC_PATH}
            pathLength="1"
          />
        </svg>
        {foodStates.map((food) => (
          <div
            key={food.id}
            ref={(element) => {
              if (element) {
                sceneRefs.current.set(food.id, element);
              } else {
                sceneRefs.current.delete(food.id);
              }
            }}
            className={`hero-dish-scene ${food.id === "dishes" ? "is-initial" : ""}`}
          >
            <Image
              src={food.image}
              alt=""
              width={900}
              height={900}
              className="hero-dish"
              priority={food.id === "dishes"}
            />
          </div>
        ))}
      </div>
      <span className="sr-only" aria-live="polite">
        {manualAnnouncement}
      </span>
      <div className={categoryControlsClassName}>
        <div className="hero-categories flex flex-col justify-start gap-2.5" aria-label="Food categories">
          {foodStates.map((food, index) => (
            <button
              type="button"
              key={food.id}
              ref={(element) => {
                if (element) {
                  categoryButtonRefs.current.set(food.id, element);
                } else {
                  categoryButtonRefs.current.delete(food.id);
                }
              }}
              className={cn(
                categoryButtonClassName,
                index === transition.activeIndex
                  ? activeCategoryButtonClassName
                  : inactiveCategoryButtonClassName,
              )}
              aria-pressed={index === transition.activeIndex}
              onClick={() => selectFood(index)}
            >
              <span aria-hidden="true">{food.icon}</span> {food.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeroFoodSelector;
