"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const announcement = "Flavour meets fire · Salt & Ember · Sylhet ·";

export function MarqueeStrip() {
  const [paused, setPaused] = useState(false);

  return (
    <section
      className="marquee-strip"
      aria-label="Salt & Ember introduction"
      data-paused={paused}
    >
      <p className="sr-only">{announcement}</p>
      <div className="marquee-viewport" aria-hidden="true">
        <div className="marquee-track">
          <span className="marquee-message">{announcement}</span>
          <span className="marquee-message">{announcement}</span>
        </div>
      </div>
      <Button
        aria-label={paused ? "Resume announcement" : "Pause announcement"}
        className="marquee-control"
        size="sm"
        type="button"
        onClick={() => setPaused((current) => !current)}
      >
        {paused ? (
          <PlayIcon data-icon="inline-start" />
        ) : (
          <PauseIcon data-icon="inline-start" />
        )}
        {paused ? "Resume" : "Pause"}
      </Button>
    </section>
  );
}
