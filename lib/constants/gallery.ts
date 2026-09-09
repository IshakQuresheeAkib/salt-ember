import type { GalleryItem } from "@/lib/types";

export const galleryItems = [
  {
    id: "open-fire-pass",
    src: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1400&q=88",
    alt: "A warmly lit restaurant dining room prepared for evening service",
    caption: "The dining room before service",
    layout: "landscape",
    isProvisional: true,
  },
  {
    id: "plating-at-the-pass",
    src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1000&q=88",
    alt: "A cook finishing a plate at a busy kitchen pass",
    caption: "Finishing a plate at the pass",
    layout: "portrait",
    isProvisional: true,
  },
  {
    id: "shared-table",
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=88",
    alt: "Several colourful dishes arranged across a shared restaurant table",
    caption: "Made for sharing",
    layout: "square",
    isProvisional: true,
  },
  {
    id: "charred-plate",
    src: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=88",
    alt: "A close view of a charred dish with herbs and roasted vegetables",
    caption: "Close to the fire",
    layout: "portrait",
    isProvisional: true,
  },
  {
    id: "late-evening-table",
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=88",
    alt: "A dark restaurant interior with warm lights over dining tables",
    caption: "Long evenings in Sylhet",
    layout: "landscape",
    isProvisional: true,
  },
  {
    id: "bright-finish",
    src: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1000&q=88",
    alt: "A vibrant finished dish with fresh herbs and citrus",
    caption: "A bright finish",
    layout: "square",
    isProvisional: true,
  },
] satisfies GalleryItem[];
