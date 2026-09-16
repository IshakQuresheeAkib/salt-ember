"use client";

import CardCarousel, { type CardItem } from "@/components/ui/card-carousel";
import TextBlockAnimation from "@/components/ui/text-block-animation";
import {
  contentShellClassName,
  highlightedTextClassName,
  sectionHeadingClassName,
} from "@/lib/tailwind";

const menuPageNames = [
  "718174826_122132414409161286_343033684358365820_n.jpg",
  "718190680_122132413767161286_7654096250232741609_n.jpg",
  "718204025_122132413539161286_688450090359965079_n.jpg",
  "middle.jpg",
  "1.jpg",
  "2.jpg",
  "718204025_122132413599161286_2521099691469240578_n.jpg",
  "718204025_122132414319161286_99081618114908965_n.jpg",
  "718221956_122132414265161286_8931308670791313504_n.jpg",
  "718296521_122132414013161286_5662676464652194707_n.jpg",
  "718314834_122132413905161286_8436691967879702742_n.jpg",
  "718318489_122132414217161286_8904567683720636025_n.jpg",
  "718744573_122132414625161286_4053402117406301464_n.jpg",
  "718777164_122132413725161286_5260076824641002721_n.jpg",
  "718792242_122132413395161286_7540068954091055116_n.jpg",
  "718792248_122132414451161286_3535992131666826892_n.jpg",
  "718792990_122132413821161286_3406031361915741478_n.jpg",
  "718816246_122132414067161286_6768096711618002859_n.jpg",
  "718894432_122132413965161286_7265357915511886068_n.jpg",
  "718895739_122132414169161286_7018089502648193477_n.jpg",
  "719009974_122132414499161286_4873848084012011035_n.jpg",
  "719068500_122132413665161286_504820364162658866_n.jpg",
  "719068771_122132414367161286_5129346587719079190_n.jpg",
  "719127559_122132414121161286_9030078855108927897_n.jpg",
  "719161221_122132414547161286_5747180975288204175_n.jpg",
  "719532900_122132413863161286_8849917445959065355_n.jpg",
  "719782557_122132413311161286_2111139795614795123_n.jpg",
  "720292996_122132413491161286_7501462188157293249_n.jpg",
] as const;

const menuPages: CardItem[] = menuPageNames.map((name, index) => ({
  alt:
    name === "middle.jpg"
      ? "Menu cover page"
      : `Salt & Ember menu page ${index + 1}`,
  imgUrl: `/menu-images/${name}`,
}));

export function Menu() {
  return (
    <section
      aria-labelledby="heritage-menu-title"
      className={contentShellClassName}
      id="menu"
    >
      <div className="mx-auto max-w-155 text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.16em] text-orange">
          From our kitchen
        </p>
        <TextBlockAnimation blockColor="var(--orange)">
          <h2 id="heritage-menu-title" className={sectionHeadingClassName}>
            Our <em className={highlightedTextClassName}>Heritage</em> Menu
          </h2>
        </TextBlockAnimation>
        <p className="mt-[15px] mb-0 text-[clamp(11.2px,10.56px+0.14vw,13px)] text-muted-foreground">
          Browse every page of our menu. Use the arrows or select a page to
          bring it forward.
        </p>
      </div>
      <CardCarousel cards={menuPages} initialIndex={3} />
    </section>
  );
}
