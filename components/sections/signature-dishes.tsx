import Image from "next/image";

import { featuredMenuItems } from "@/lib/constants/menu";
import { SectionHeading } from "@/components/shared/section-heading";

const bdtFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

export function SignatureDishes() {
  return (
    <section className="section-shell overflow-hidden" aria-labelledby="signature-title">
      <div className="content-shell">
        <SectionHeading
          id="signature-title"
          eyebrow="A first look"
          title="From the fire."
          intro="A small selection of sample plates shaped by smoke, bright ingredients, and the energy of the open flame."
        />
      </div>

      <div className="signature-rail" aria-label="Featured sample dishes">
        {featuredMenuItems.map((item, index) => (
          <article className="signature-dish" key={item.id}>
            <figure className="signature-image">
              <Image
                src={item.image}
                alt={item.alt}
                width={900}
                height={1100}
                sizes="(max-width: 767px) 82vw, 34vw"
                className="h-full w-full object-cover"
              />
              <figcaption>Sample plate {String(index + 1).padStart(2, "0")}</figcaption>
            </figure>
            <div className="grid gap-3 border-t border-ash pt-5 sm:grid-cols-[1fr_auto] sm:items-start">
              <div>
                <h3 className="font-heading text-3xl leading-none text-bone">{item.name}</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-smoke">{item.description}</p>
              </div>
              <p className="text-sm font-semibold text-amber">{bdtFormatter.format(item.priceBdt)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
