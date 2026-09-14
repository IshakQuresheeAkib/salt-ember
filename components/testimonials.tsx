"use client";

import Image from "next/image";
import {
  MotionConfig,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";

import TextBlockAnimation from "@/components/ui/text-block-animation";
import { testimonials } from "@/lib/constants/testimonials";
import type { Testimonial } from "@/lib/types";

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

type TestimonialsColumnProps = {
  className?: string;
  testimonials: Testimonial[];
  duration: number;
  isPaused: boolean;
};

function TestimonialCard({
  testimonial,
  duplicate,
}: {
  testimonial: Testimonial;
  duplicate: boolean;
}) {
  return (
    <li
      aria-hidden={duplicate || undefined}
      data-testimonial-card={duplicate ? "duplicate" : "primary"}
      className="group w-80 max-w-full rounded-lg border border-border bg-card p-6 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-flameburst-orange"
    >
      <figure className="m-0">
        <div
          className="text-xs tracking-[0.18em] text-flameburst-orange"
          aria-label="5 out of 5 stars"
        >
          ★★★★★
        </div>
        <blockquote className="mt-5 font-heading text-2xl leading-snug text-card-foreground">
          “{testimonial.text}”
        </blockquote>
        <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
          <Image
            src={testimonial.image}
            alt=""
            width={44}
            height={44}
            sizes="44px"
            className="size-11 rounded-full object-cover ring-1 ring-flameburst-orange/40 transition group-hover:ring-flameburst-orange"
          />
          <span className="flex min-w-0 flex-col">
            <cite className="not-italic font-semibold text-card-foreground">
              {testimonial.name}
            </cite>
            <span className="mt-0.5 text-xs tracking-wide text-muted-foreground">
              {testimonial.role}
            </span>
          </span>
        </figcaption>
      </figure>
    </li>
  );
}

function TestimonialsColumn({
  className,
  testimonials: columnTestimonials,
  duration,
  isPaused,
}: TestimonialsColumnProps) {
  const elapsedTime = useRef(0);
  const translateY = useMotionValue("0%");

  useAnimationFrame((_time, delta) => {
    if (isPaused) {
      return;
    }

    const durationInMilliseconds = duration * 1000;
    elapsedTime.current =
      (elapsedTime.current + delta) % durationInMilliseconds;
    const progress = elapsedTime.current / durationInMilliseconds;
    translateY.set(`${progress * -50}%`);
  });

  return (
    <div className={className}>
      <motion.ul
        style={{ y: translateY }}
        className="m-0 flex list-none flex-col gap-5 bg-transparent p-0 pb-5 will-change-transform"
      >
        {[false, true].map((duplicate) =>
          columnTestimonials.map((testimonial) => (
            <TestimonialCard
              key={`${duplicate ? "duplicate" : "primary"}-${testimonial.name}`}
              testimonial={testimonial}
              duplicate={duplicate}
            />
          )),
        )}
      </motion.ul>
    </div>
  );
}

export default function Testimonials() {
  const shouldReduceMotion = useReducedMotion();
  const motionIsPaused = shouldReduceMotion === true;

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="testimonials"
        aria-labelledby="testimonials-heading"
        className="testimonial-section section content-shell content-shell--comfort"
      >
        <div className="testimonial-section__heading">
          <div>
            <TextBlockAnimation blockColor="var(--flameburst-orange)">
              <h2
                id="testimonials-heading"
                className="bracket-title font-heading display-title text-balance"
              >
                What they <em>say</em>
              </h2>
            </TextBlockAnimation>
            <p className="testimonial-section__intro">
              Notes from guests
            </p>
          </div>
        </div>

        {shouldReduceMotion ? (
          <ul
            className="testimonial-static-grid mt-12"
            aria-label="Guest testimonials"
          >
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.name}
                testimonial={testimonial}
                duplicate={false}
              />
            ))}
          </ul>
        ) : (
          <div
            className="testimonial-columns mt-12 flex max-h-200 justify-center gap-5 overflow-hidden"
            role="region"
            aria-label="Guest testimonials"
          >
            <TestimonialsColumn
              testimonials={firstColumn}
              duration={15}
              isPaused={motionIsPaused}
            />
            <TestimonialsColumn
              testimonials={secondColumn}
              className="hidden md:block"
              duration={19}
              isPaused={motionIsPaused}
            />
            <TestimonialsColumn
              testimonials={thirdColumn}
              className="hidden lg:block"
              duration={17}
              isPaused={motionIsPaused}
            />
          </div>
        )}
      </section>
    </MotionConfig>
  );
}
