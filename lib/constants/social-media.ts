export interface SocialMediaLinkBase {
  href: string;
  ariaLabel: string;
  tooltip: string;
  color: string;
  external?: boolean;
}

export interface SocialPlatformLink extends SocialMediaLinkBase {
  kind: "social";
  svgUrl: string;
}

export interface CallLink extends SocialMediaLinkBase {
  kind: "call";
  mobileNumber: string;
}

export type SocialItem = SocialPlatformLink | CallLink;

export const SALT_AND_EMBER_MOBILE_NUMBER = "+880 1704 083 376";
export const SALT_AND_EMBER_MOBILE_TEL = "tel:+8801704083376";
export const SALT_AND_EMBER_MAP_URL = "https://maps.app.goo.gl/qBEyyTSasUwqyaRs5";
export const SALT_AND_EMBER_WHATSAPP_URL = "https://wa.me/8801704083376";

export const SOCIAL_MEDIA_LINKS = [
  {
    kind: "social",
    href: "https://www.facebook.com/saltandember7",
    ariaLabel: "Facebook",
    tooltip: "Facebook",
    color: "var(--orange)",
    svgUrl: "https://cdn.simpleicons.org/facebook/E4E4E4",
    external: true,
  },
  {
    kind: "social",
    href: "https://www.instagram.com/salt.and.ember_",
    ariaLabel: "Instagram",
    tooltip: "Instagram",
    color: "var(--orange)",
    svgUrl: "https://cdn.simpleicons.org/instagram/E4E4E4",
    external: true,
  },
  {
    kind: "social",
    href: SALT_AND_EMBER_WHATSAPP_URL,
    ariaLabel: "WhatsApp",
    tooltip: "WhatsApp",
    color: "var(--orange)",
    svgUrl: "https://cdn.simpleicons.org/whatsapp/E4E4E4",
    external: true,
  },
  {
    kind: "call",
    href: SALT_AND_EMBER_MOBILE_TEL,
    ariaLabel: "Call Salt & Ember",
    tooltip: `Call ${SALT_AND_EMBER_MOBILE_NUMBER}`,
    mobileNumber: SALT_AND_EMBER_MOBILE_NUMBER,
    color: "var(--orange)",
  },
] as const satisfies readonly SocialItem[];
