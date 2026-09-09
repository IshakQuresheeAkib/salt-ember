import Image from "next/image";

import { galleryItems } from "@/lib/constants/gallery";
import { SectionHeading } from "@/components/shared/section-heading";

export function GallerySection() {
  return (
    <section id="gallery" className="section-shell gallery-section" aria-labelledby="gallery-title">
      <div className="content-shell">
        <SectionHeading
          id="gallery-title"
          eyebrow="A sense of place"
          title="Around the table."
          intro="A provisional view of the room, the pass, and the shared-table energy the final photography will capture."
        />

        <div className="gallery-grid">
          {galleryItems.map((item) => (
            <figure className={`gallery-item gallery-item--${item.layout}`} key={item.id}>
              <Image
                src={item.src}
                alt={item.alt}
                width={item.layout === "landscape" ? 1400 : 900}
                height={item.layout === "portrait" ? 1300 : 900}
                sizes="(max-width: 767px) 100vw, 50vw"
                className="h-full w-full object-cover"
              />
              <figcaption>
                {item.caption}
                <span>Provisional image</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
