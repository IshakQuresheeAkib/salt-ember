import { SocialTooltip } from "@/components/ui/social-media";
import {
  SALT_AND_EMBER_MOBILE_NUMBER,
  SALT_AND_EMBER_MOBILE_TEL,
  SOCIAL_MEDIA_LINKS,
} from "@/lib/constants/social-media";

export function Footer() {
  return (
    <footer id="contact" className="footer content-shell content-shell--wide">
      <div className="footer-top">
        <div>
          <a className="footer-brand" href="#top">
            Salt <i>&</i> Ember
          </a>
          <p>
            Come for the fire.
            <br />
            Stay for the flavour.
          </p>
        </div>
        <div>
          <p className="footer-label">Find us</p>
          <p>
            <a
              href="https://maps.app.goo.gl/qBEyyTSasUwqyaRs5"
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
          <p className="footer-label">Say hello</p>
          <a href={SALT_AND_EMBER_MOBILE_TEL}>{SALT_AND_EMBER_MOBILE_NUMBER}</a>
          <br />
          <a
            href="https://wa.me/8801704083376"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp us
          </a>
        </div>
        <div>
          <p className="footer-label">Follow along</p>
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
