import { SocialTooltip } from "@/components/ui/social-media";
import {
  SALT_AND_EMBER_MAP_URL,
  SALT_AND_EMBER_MOBILE_NUMBER,
  SALT_AND_EMBER_MOBILE_TEL,
  SALT_AND_EMBER_WHATSAPP_URL,
  SOCIAL_MEDIA_LINKS,
} from "@/lib/constants/social-media";
import { contentShellClassName } from "@/lib/tailwind";
import { cn } from "@/lib/utils";

const footerClassName = "border-t border-orange py-[clamp(56px,7vw,72px)] pb-7";
const footerHeadingClassName =
  "mb-3.5 text-[10px] uppercase tracking-[1.6px] text-orange";
const footerDetailClassName = "text-xs leading-[1.7] text-muted-foreground";
const footerInteractiveDetailClassName =
  "inline-flex min-h-8 items-center text-xs leading-[1.7] text-muted-foreground";
const footerGridClassName =
  "grid grid-cols-1 gap-[clamp(24px,3vw,40px)] min-[481px]:grid-cols-[1.65fr_1fr] min-[1120px]:grid-cols-[2fr_1fr_1.5fr_1fr]";

export function Footer() {
  return (
    <footer id="contact" className={cn(contentShellClassName, footerClassName)}>
      <div className={footerGridClassName}>
        <div>
          <a className="font-heading text-[30px] font-bold" href="#top">
            Salt <i className="text-orange not-italic">&</i> Ember
          </a>
          <p className={footerDetailClassName}>
            Come for the fire.
            <br />
            Stay for the flavour.
          </p>
        </div>
        <div>
          <p className={footerHeadingClassName}>Find us</p>
          <p className={footerDetailClassName}>
            <a
              className="inline-block min-h-8"
              href={SALT_AND_EMBER_MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Baruthkhana Point, East Zindabazar
              <br />
              Sylhet, Bangladesh
            </a>
          </p>
        </div>
        <div>
          <p className={footerHeadingClassName}>Say hello</p>
          <a
            className={footerInteractiveDetailClassName}
            href={SALT_AND_EMBER_MOBILE_TEL}
          >
            {SALT_AND_EMBER_MOBILE_NUMBER}
          </a>
          <br />
          <a
            className={footerInteractiveDetailClassName}
            href={SALT_AND_EMBER_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp us
          </a>
        </div>
        <div>
          <p className={footerHeadingClassName}>Follow along</p>
          <SocialTooltip
            className="footer-social-links"
            items={SOCIAL_MEDIA_LINKS}
            aria-label="Social and contact links"
          />
        </div>
      </div>
    </footer>
  );
}
