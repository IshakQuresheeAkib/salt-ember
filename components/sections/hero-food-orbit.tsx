"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { HeroOrbitItem } from "@/lib/types";

interface HeroFoodOrbitProps {
  items: HeroOrbitItem[];
}

export function HeroFoodOrbit({ items }: HeroFoodOrbitProps) {
  const [paused, setPaused] = useState(false);

  return (
    <figure
      aria-label="A rotating selection of Salt & Ember dishes"
      className="hero-orbit-figure"
      data-paused={paused}
    >
      <div className="hero-orbit-stage">
        <div className="hero-heat" aria-hidden="true" />
        <div className="ember-seam" aria-hidden="true" />
        <div className="hero-orbit-ring" aria-hidden="true" />

        <div className="hero-orbit-track">
          <ul className="hero-orbit-list">
            {items.map((item, index) => (
              <li className="hero-orbit-item" key={item.id}>
                <div className="hero-orbit-card">
                  <div className="hero-orbit-thumb">
                    <Image
                      alt={item.alt}
                      className="h-full w-full object-cover"
                      height={320}
                      loading={index === 0 ? "eager" : "lazy"}
                      sizes="(max-width: 639px) 22vw, 112px"
                      src={item.src}
                      width={320}
                    />
                  </div>
                  <span className="hero-orbit-label">{item.label}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-orbit-center" aria-hidden="true">
          {items.map((item, index) => (
            <div className="hero-orbit-center-frame" key={item.id}>
              <Image
                alt=""
                className="h-full w-full object-cover"
                fill
                loading={index === 0 ? "eager" : "lazy"}
                sizes="(max-width: 767px) 58vw, 27vw"
                src={item.src}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="hero-orbit-footer">
        <figcaption>Provisional imagery · final photography pending</figcaption>
        <Button
          aria-label={paused ? "Resume food orbit" : "Pause food orbit"}
          aria-pressed={paused}
          className="hero-orbit-control"
          size="sm"
          type="button"
          variant="outline"
          onClick={() => setPaused((current) => !current)}
        >
          {paused ? (
            <PlayIcon data-icon="inline-start" />
          ) : (
            <PauseIcon data-icon="inline-start" />
          )}
          {paused ? "Resume" : "Pause"}
        </Button>
      </div>
    </figure>
  );
}
