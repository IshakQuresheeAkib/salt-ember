import * as React from "react";
import Image from "next/image";
import { PhoneCall } from "lucide-react";

import { type SocialItem } from "@/lib/constants/social-media";
import { cn } from "@/lib/utils";

export interface SocialTooltipProps
  extends React.HTMLAttributes<HTMLUListElement> {
  items: readonly SocialItem[];
}

export { SOCIAL_MEDIA_LINKS } from "@/lib/constants/social-media";

const socialListClassName = "flex items-center gap-3";
const socialLinkClassName =
  "relative flex size-12 items-center justify-center overflow-hidden rounded-full border border-flameburst-orange/70 bg-background transition-shadow duration-300 ease-in-out group-hover:shadow-[0_0_1.25rem_color-mix(in_srgb,var(--flameburst-orange)_55%,transparent)] group-focus-within:shadow-[0_0_1.25rem_color-mix(in_srgb,var(--flameburst-orange)_55%,transparent)]";
const socialLinkFillClassName =
  "absolute inset-x-0 bottom-0 h-0 transition-[height] duration-300 ease-in-out group-hover:h-full group-focus-within:h-full";
const socialIconClassName = "relative z-10 size-6";
const socialTooltipClassName =
  "pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs text-midnight-shadow opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 motion-safe:-translate-y-1";

const SocialTooltip = React.forwardRef<HTMLUListElement, SocialTooltipProps>(
  ({ className, items, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn(socialListClassName, className)}
      {...props}
    >
      {items.map((item) => (
        <li key={item.ariaLabel} className="group relative">
          <a
            href={item.href}
            aria-label={item.ariaLabel}
            className={socialLinkClassName}
            {...(item.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : undefined)}
          >
            <span
              aria-hidden="true"
              className={socialLinkFillClassName}
              style={{ backgroundColor: item.color }}
            />
            {item.kind === "call" ? (
              <PhoneCall
                aria-hidden="true"
                className={socialIconClassName}
              />
            ) : (
              <Image
                src={item.svgUrl}
                alt=""
                aria-hidden="true"
                className={socialIconClassName}
                width={24}
                height={24}
                unoptimized
              />
            )}
          </a>
          <span
            role="tooltip"
            className={socialTooltipClassName}
            style={{ backgroundColor: item.color }}
          >
            {item.tooltip}
          </span>
        </li>
      ))}
    </ul>
  ),
);

SocialTooltip.displayName = "SocialTooltip";

export { SocialTooltip };
export default SocialTooltip;
