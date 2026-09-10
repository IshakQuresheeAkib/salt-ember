import { featuredMenuItems } from "@/lib/constants/menu";
import { MenuCard } from "@/components/shared/menu-card";
import { SectionHeading } from "@/components/shared/section-heading";

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
        {featuredMenuItems.map((item) => (
          <MenuCard
            item={item}
            headingIdPrefix="signature-dish"
            imageSizes="(max-width: 767px) 64vw, (max-width: 1279px) 28vw, 304px"
            className="signature-dish"
            key={item.id}
          />
        ))}
      </div>
    </section>
  );
}
