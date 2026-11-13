"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Flame, Sparkles, Utensils } from "lucide-react";
import type { FoodItem } from "@/lib/constants/food-menu-data";
import { buildDishWhatsAppOrderUrl } from "@/lib/pixel-tracker";
import { cn } from "@/lib/utils";

export interface FoodMenuCardProps {
  dish: FoodItem;
  className?: string;
}

export function FoodMenuCard({ dish, className }: FoodMenuCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { whatsappUrl, triggerTracking } = useMemo(
    () => buildDishWhatsAppOrderUrl(dish),
    [dish]
  );

  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between rounded-[16px] p-6 pt-0",
        "bg-[rgba(249,129,29,0.09)] backdrop-blur-[5.8px] [-webkit-backdrop-filter:blur(5.8px)]",
        "border border-[rgba(249,129,29,0.13)] hover:border-orange/40",
        "shadow-[0_4px_30px_rgba(0,0,0,0.1)]",
        "hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(249,129,29,0.2)]",
        "transition-all duration-400 ease-out hover:-translate-y-2",
        "before:pointer-events-none before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
        className,
      )}
    >
      <div>
        {/* Visual Circular Dish Header - Positioned at top of card */}
        <div className="relative mx-auto -mt-12 sm:-mt-14 h-40 w-40 sm:h-44 sm:w-44 md:h-48 md:w-48 shrink-0">
          {/* Atmospheric floating garnish: Red chili pepper to top right */}
          <div className="pointer-events-none absolute -top-3 -right-2 z-20 transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:rotate-12">
            <svg
              width="28"
              height="28"
              viewBox="0 0 32 32"
              fill="none"
              className="drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]"
            >
              <path
                d="M22 6C20 4 16 5 13 8C10 11 8 16 9 21C9.5 23.5 11 25.5 13 25C15 24.5 16.5 21.5 18 18C19.5 14.5 23 10 23.5 8C23.8 6.8 23 6.4 22 6Z"
                fill="#DC2626"
              />
              <path
                d="M19 11C18 9 15 8 13 10C11 12 10 15 10.5 18C11 15 13 12 16 11Z"
                fill="#EF4444"
                opacity="0.8"
              />
              <path
                d="M22 6C23 4.5 24 3 26 2.5C25.5 4 24.5 5 23.5 5.8L22 6Z"
                fill="#15803D"
              />
            </svg>
          </div>

          {/* Atmospheric floating garnish: Fresh green basil leaf to bottom right */}
          <div className="pointer-events-none absolute -bottom-1 -right-1 z-20 transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:translate-y-1 group-hover:-rotate-12">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
            >
              <path
                d="M12 2C8 4 4 8 4 13C4 17.5 7.5 20.5 12 21C16.5 20.5 20 17.5 20 13C20 8 16 4 12 2Z"
                fill="#16A34A"
              />
              <path
                d="M12 4V19"
                stroke="#15803D"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Atmospheric floating garnish: Small herb leaf to bottom left */}
          <div className="pointer-events-none absolute bottom-4 -left-2 z-20 transition-transform duration-500 ease-out group-hover:-translate-x-1 group-hover:translate-y-0.5 group-hover:rotate-6">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
            >
              <path
                d="M6 5C9 4 14 6 16 10C18 14 16 19 12 20C8 19 5 15 5 11C5 8.5 5.5 6.5 6 5Z"
                fill="#22C55E"
                opacity="0.9"
              />
            </svg>
          </div>

          {/* Cast Iron / Dark Ceramic Skillet Rim with Ambient Depth */}
          <div className="relative h-full w-full rounded-full p-2 bg-gradient-to-b from-[#2a2a2e] via-[#18181b] to-[#09090b] shadow-[0_16px_36px_rgba(0,0,0,0.45)] ring-1 ring-white/10 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:rotate-2">
            {/* Inner Circular Food Image Container */}
            <div className="relative h-full w-full rounded-full overflow-hidden bg-neutral-950 ring-1 ring-white/10">
              {dish.image && !imageError ? (
                <>
                  {!imageLoaded && (
                    <div className="absolute inset-0 animate-pulse bg-neutral-800" />
                  )}
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    sizes="(max-width: 640px) 250px, (max-width: 1024px) 350px, 400px"
                    unoptimized={dish.image.includes("googleusercontent.com")}
                    loading="lazy"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                    className={cn(
                      "object-cover transition-all duration-700 ease-out group-hover:scale-110",
                      imageLoaded ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]" />
                </>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900 text-center">
                  <Utensils className="h-8 w-8 text-orange/80" />
                  <span className="mt-1 text-[9px] tracking-widest text-silver/60 uppercase">
                    Salt & Ember
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Diffused Plate Shadow Cast onto Glass Surface */}
          <div className="pointer-events-none absolute -bottom-2 inset-x-4 h-6 rounded-full bg-black/40 blur-md" />
        </div>

        {/* Content Details: Badges, Title, and Description */}
        <div className="mt-5 flex flex-col">
          {/* Badges: Popular / Spicy */}
          {(dish.isPopular || dish.isSpicy) && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {dish.isPopular && (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange/15 px-2.5 py-0.5 text-[10px] font-semibold text-orange border border-orange/30">
                  <Sparkles className="h-2.5 w-2.5" />
                  Popular
                </span>
              )}
              {dish.isSpicy && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-red-400 border border-red-500/30">
                  <Flame className="h-2.5 w-2.5 text-red-400" />
                  Spicy
                </span>
              )}
            </div>
          )}

          {/* Dish Title */}
          <h4 className="font-heading text-xl sm:text-[22px] font-bold leading-tight tracking-tight text-silver transition-colors duration-200 group-hover:text-orange">
            {dish.name}
          </h4>

          {/* Subtitle / Description */}
          <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-muted-foreground line-clamp-2">
            {dish.portion ? `${dish.portion} • ${dish.description}` : dish.description}
          </p>
        </div>
      </div>

      {/* Card Footer: Price & Circular WhatsApp Order Action */}
      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="font-sans text-lg sm:text-xl font-bold tracking-tight text-silver">
          {dish.price}
        </span>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={triggerTracking}
          className={cn(
            "group/btn relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 active:scale-95",
            "bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/35 shadow-[0_0_12px_rgba(37,211,102,0.15)]",
            "hover:bg-[#25D366] hover:text-neutral-950 hover:border-[#25D366] hover:shadow-[0_0_20px_rgba(37,211,102,0.45)] hover:scale-105"
          )}
          aria-label={`Order ${dish.name} on WhatsApp`}
          title={`Order ${dish.name} on WhatsApp`}
        >
          <svg
            className="h-5 w-5 transition-transform duration-300 group-hover/btn:scale-110 fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>
    </article>
  );
}
