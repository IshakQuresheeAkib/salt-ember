import { Beef, PartyPopper, Sparkles } from "lucide-react";

import { HeroFoodSelector } from "@/components/hero-food-selector";
import { Header } from "@/components/header";
import { SocialTooltip } from "@/components/ui/social-media";
import TextBlockAnimation from "@/components/ui/text-block-animation";
import { SOCIAL_MEDIA_LINKS } from "@/lib/constants/social-media";

export function HeroSection() {
  return (
    <section id="top" className="hero content-shell--hero">
      <Header />
      <div className="hero-layout content-shell content-shell--hero">
        <div className="hero-copy">
          <TextBlockAnimation
            animateOnScroll={false}
            delay={0.16}
            blockColor="var(--flameburst-orange)"
            duration={0.75}
          >
            <h1 className="font-heading display-title">
              It’s not just food;
              <br />
              <em>it’s an experience</em>
            </h1>
          </TextBlockAnimation>
          <TextBlockAnimation
            animateOnScroll={false}
            delay={0.3}
            blockColor="var(--flameburst-orange)"
          >
            <p className="hero-intro">
              <span className="hero-intro__line">
                <Sparkles className="hero-intro__icon" aria-hidden="true" />
                Modern Family-Friendly Steakhouse
              </span>
              <span className="hero-intro__line">
                <Beef className="hero-intro__icon" aria-hidden="true" />
                Steaks • Continental • Thai &amp; Chinese • Seafood &amp; More
              </span>
              <span className="hero-intro__line">
                <PartyPopper
                  className="hero-intro__icon"
                  aria-hidden="true"
                />
                Family Dining | Parties | Wedding &amp; Corporate Events
              </span>
            </p>
          </TextBlockAnimation>
          <div className="hero-actions">
            <a className="primary-button" href="#menu">
              Explore the menu <span aria-hidden="true">↗</span>
            </a>
            <a className="secondary-button" href="#contact">
              Get in touch
            </a>
          </div>
          <div className="hero-contact">
            <SocialTooltip
              className="hero-social-links"
              items={SOCIAL_MEDIA_LINKS}
              aria-label="Social and contact links"
            />
          </div>
        </div>
      </div>
      <HeroFoodSelector />
    </section>
  );
}
