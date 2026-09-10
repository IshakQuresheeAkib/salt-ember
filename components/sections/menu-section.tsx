import { menuItems } from "@/lib/constants/menu";
import { MenuCard } from "@/components/shared/menu-card";
import { SectionHeading } from "@/components/shared/section-heading";

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
          Sample menu. Dishes, dietary details, availability, and prices are awaiting
          restaurant confirmation.
        </p>

        <div className="menu-list" aria-label="Complete sample menu">
          {menuItems.map((item) => (
            <MenuCard
              item={item}
              headingIdPrefix="menu-item"
              imageSizes="(max-width: 767px) 78vw, (max-width: 1279px) 34vw, 304px"
              key={item.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
