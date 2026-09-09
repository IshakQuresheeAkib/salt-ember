import Image from "next/image";

import { menuItems } from "@/lib/constants/menu";
import { SectionHeading } from "@/components/shared/section-heading";

const bdtFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

export function MenuSection() {
  return (
    <section id="menu" className="section-shell menu-section" aria-labelledby="menu-title">
      <div className="content-shell">
        <SectionHeading
          id="menu-title"
          eyebrow="Sample menu"
          title="The Salt & Ember menu."
          intro="Fire-led plates, bright sides, quiet desserts, and drinks made for long evenings."
        />

        <p className="menu-notice">
          Sample menu — dishes, dietary details, availability, and prices are awaiting
          restaurant confirmation.
        </p>

        <div className="menu-list" aria-label="Complete sample menu">
          {menuItems.map((item) => (
            <article className="menu-item" key={item.id}>
              <div className="menu-item-image">
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={320}
                  height={320}
                  sizes="(max-width: 639px) 28vw, 144px"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-heading text-[clamp(1.65rem,3vw,2.35rem)] leading-none text-bone">
                    {item.name}
                  </h3>
                  <p className="shrink-0 text-sm font-semibold text-amber">
                    {bdtFormatter.format(item.priceBdt)}
                  </p>
                </div>
                <p className="mt-3 max-w-xl text-sm leading-6 text-smoke">{item.description}</p>
                <p className="mt-4 text-[0.65rem] font-semibold tracking-[0.14em] text-smoke uppercase">
                  {item.category} · {item.tags.join(" · ")} · Spice {item.spiceLevel}/3
                  {item.isAvailable ? "" : " · Currently unavailable"}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
