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
import {
  contentShellClassName,
  highlightedTextClassName,
  sectionHeadingClassName,
} from "@/lib/tailwind";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/lib/types";

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);
const testimonialCardClassName =
  "group w-80 max-w-full rounded-lg border border-border bg-card p-6 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-flameburst-orange";
const testimonialSectionClassName = "relative py-[var(--space-xl)]";
const testimonialStaticGridClassName =
  "mt-12 grid list-none grid-cols-1 gap-[clamp(12px,1.5vw,20px)] p-0 desktop:grid-cols-3";
const testimonialColumnsClassName =
  "testimonial-columns mt-12 flex max-h-200 justify-center gap-[clamp(12px,1.5vw,20px)] overflow-hidden";
const testimonialAvatarClassName =
  "size-11 rounded-full object-cover ring-1 ring-flameburst-orange/40 transition group-hover:ring-flameburst-orange";
const testimonialIntroClassName =
  "mt-[22px] mb-0 max-w-[470px] text-[clamp(14px,13.12px+0.18vw,16px)] leading-[1.7] text-muted-foreground";

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
      className={testimonialCardClassName}
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
            className={testimonialAvatarClassName}
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
        className={cn(contentShellClassName, testimonialSectionClassName)}
      >
        <div className="flex items-end justify-between gap-8 max-tablet:flex-col max-tablet:items-start">
          <div>
            <TextBlockAnimation blockColor="var(--flameburst-orange)">
              <h2
                id="testimonials-heading"
                className={sectionHeadingClassName}
              >
                What they <em className={highlightedTextClassName}>say</em>
              </h2>
            </TextBlockAnimation>
            <p className={testimonialIntroClassName}>
              Notes from guests
            </p>
          </div>
        </div>

        {shouldReduceMotion ? (
          <ul
            className={testimonialStaticGridClassName}
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
            className={testimonialColumnsClassName}
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
