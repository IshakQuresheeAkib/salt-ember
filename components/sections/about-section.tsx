import Image from "next/image";

import { restaurantDetails } from "@/lib/constants/restaurant";

export function AboutSection() {
  return (
    <section id="about" className="section-shell about-section" aria-labelledby="about-title">
      <div className="content-shell about-grid">
        <div className="about-image-wrap">
          <Image
            src={restaurantDetails.aboutImage.src}
            alt={restaurantDetails.aboutImage.alt}
            width={1000}
            height={1350}
            sizes="(max-width: 767px) 100vw, 46vw"
            className="h-full w-full object-cover"
          />
          <p>Provisional image · kitchen photography pending</p>
        </div>

        <div className="about-copy">
          <p className="mb-5 text-xs font-semibold tracking-[0.2em] text-amber uppercase">
            Our approach
          </p>
          <h2
            id="about-title"
            className="font-heading text-[clamp(3.4rem,7vw,6.8rem)] leading-[0.84] font-semibold tracking-[-0.055em] text-bone"
          >
            Heat is only the beginning.
          </h2>
          <div className="mt-10 grid gap-6 border-t border-ash pt-7 text-sm leading-7 text-smoke sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <p>
              Salt & Ember is imagined as a place where the fire is visible, the room
              feels generous, and every plate earns its space at the table.
            </p>
            <p>
              The current story and imagery are design fixtures. They set the tone
              without presenting unconfirmed restaurant claims as fact.
            </p>
          </div>
          <a className="text-link mt-10" href="#reservations">
            Plan an evening
            <span aria-hidden="true">↘</span>
          </a>
        </div>
      </div>
    </section>
  );
}
