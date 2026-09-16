import { Beef, PartyPopper, Sparkles } from "lucide-react";

import { HeroFoodSelector } from "@/components/hero-food-selector";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { SocialTooltip } from "@/components/ui/social-media";
import TextBlockAnimation from "@/components/ui/text-block-animation";
import { SOCIAL_MEDIA_LINKS } from "@/lib/constants/social-media";
import { contentShellClassName } from "@/lib/tailwind";
import { cn } from "@/lib/utils";

const heroSectionClassName =
  "hero relative block min-h-[clamp(600px,49vw,720px)] text-silver isolate tablet:min-h-0 tablet:pb-11 mobile:pb-[30px] desktop:h-[101svh] desktop:min-h-[600px]";
const heroLayoutClassName =
  "hero-layout relative z-2 mt-10 grid min-h-[calc(clamp(600px,49vw,720px)_-_clamp(64px,5vw,80px))] grid-cols-2 items-center pointer-events-none tablet:min-h-0 tablet:grid-cols-1";
const heroIconClassName =
  "hero-intro__icon mt-0.5 size-4 shrink-0 text-orange [stroke-width:1.75]";
const heroHeadingClassName =
  "font-[family-name:var(--font-title)] text-[clamp(40px,13.818px+7.273vw,72px)] min-desktop:text-[clamp(50px,5.5vw,130px)] font-bold leading-[1] text-silver";
const heroIntroClassName =
  "my-[clamp(20px,2vw,28px)] text-[clamp(14px,13px+0.2vw,16px)] text-muted-foreground [overflow-wrap:anywhere]";
const heroIntroRowClassName = "flex items-start gap-2";
const heroCtaContainerClassName =
  "flex flex-wrap items-center gap-[var(--space-xs)] mobile:w-full mobile:gap-2";
const heroCtaMobileClassName =
  "mobile:min-w-0 mobile:flex-1 mobile:justify-center mobile:whitespace-nowrap";
const heroContactClassName =
  "mt-[clamp(30px,4vw,70px)] flex items-center gap-[var(--space-xs)] text-[clamp(12px,11.2px+0.14vw,14px)] text-silver";

export function HeroSection() {
  return (
    <section id="top" className={heroSectionClassName}>
      <Header />
      <HeroFoodSelector />
      <div className={cn(contentShellClassName, heroLayoutClassName)}>
        <div className="hero-copy relative z-2 pointer-events-auto">
          <TextBlockAnimation
            animateOnScroll={false}
            delay={0.16}
            blockColor="var(--orange)"
            duration={0.75}
          >
            <h1 className={heroHeadingClassName}>
              It’s not just food,
              <br />
              <em className="not-italic text-orange">It’s an experience!</em>
            </h1>
          </TextBlockAnimation>
          <TextBlockAnimation
            animateOnScroll={false}
            delay={0.3}
            blockColor="var(--orange)"
          >
            <p className={heroIntroClassName}>
              <span className={heroIntroRowClassName}>
                <Sparkles className={heroIconClassName} aria-hidden="true" />
                Modern Family-Friendly Steakhouse
              </span>
              <span className={cn(heroIntroRowClassName, "mt-[7px]")}>
                <Beef
                  className={cn(heroIconClassName, "[animation-delay:0.32s]")}
                  aria-hidden="true"
                />
                Steaks • Continental • Thai &amp; Chinese • Seafood &amp; More
              </span>
              <span className={cn(heroIntroRowClassName, "mt-[7px]")}>
                <PartyPopper
                  className={cn(heroIconClassName, "[animation-delay:0.64s]")}
                  aria-hidden="true"
                />
                Family Dining | Parties | Wedding &amp; Corporate Events
              </span>
            </p>
          </TextBlockAnimation>
          <div className={heroCtaContainerClassName}>
            <Button
              variant="primary"
              href="#menu"
              className={heroCtaMobileClassName}
            >
              Explore the menu <span aria-hidden="true">↗</span>
            </Button>
            <Button
              variant="secondary"
              href="#contact"
              className={heroCtaMobileClassName}
            >
              Get in touch
            </Button>
          </div>
          <div className={heroContactClassName}>
            <SocialTooltip
              className="hero-social-links"
              items={SOCIAL_MEDIA_LINKS}
              aria-label="Social and contact links"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
