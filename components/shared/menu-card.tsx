import Image from "next/image";

import type { MenuItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const bdtFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

type MenuCardProps = {
  item: MenuItem;
  headingIdPrefix: string;
  imageSizes: string;
  className?: string;
};

export function MenuCard({
  item,
  headingIdPrefix,
  imageSizes,
  className,
}: MenuCardProps) {
  const headingId = `${headingIdPrefix}-${item.id}`;

  return (
    <article
      className={cn(
        "menu-card",
        !item.isAvailable && "menu-card--unavailable",
        className,
      )}
      aria-labelledby={headingId}
    >
      <figure className="menu-card-media">
        <Image
          src={item.image}
          alt={item.alt}
          width={640}
          height={640}
          sizes={imageSizes}
          className="menu-card-image"
        />
      </figure>

      <div className="menu-card-surface">
        <div className="menu-card-kicker">
          <p>{item.category.replace("-", " ")}</p>
          {item.isAvailable ? null : (
            <p className="menu-card-status">Currently unavailable</p>
          )}
        </div>

        <h3 id={headingId} className="menu-card-title">
          {item.name}
        </h3>
        <p className="menu-card-description">{item.description}</p>

        <div className="menu-card-footer">
          <p
            className="menu-card-price"
            aria-label={`Price ${item.priceBdt} Bangladeshi taka`}
          >
            {bdtFormatter.format(item.priceBdt)}
          </p>
          <p className="menu-card-spice">Spice {item.spiceLevel} of 3</p>
        </div>

        <ul className="menu-card-tags" aria-label={`${item.name} dietary details`}>
          {item.tags.map((tag) => (
            <li key={tag}>{tag.replace("-", " ")}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
