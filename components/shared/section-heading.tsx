type SectionHeadingProps = {
  id: string;
  title: string;
  eyebrow?: string;
  intro?: string;
  tone?: "dark" | "light";
};

export function SectionHeading({
  id,
  title,
  eyebrow,
  intro,
  tone = "dark",
}: SectionHeadingProps) {
  const isLight = tone === "light";

  return (
    <div className="section-heading">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p
            className={`mb-4 text-[0.7rem] font-semibold tracking-[0.2em] uppercase ${
              isLight ? "text-deep-red" : "text-amber"
            }`}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2
          id={id}
          className={`font-heading text-[clamp(2.9rem,7vw,6.25rem)] leading-[0.86] font-semibold tracking-[-0.055em] text-balance ${
            isLight ? "text-ink" : "text-bone"
          }`}
        >
          {title}
        </h2>
      </div>
      {intro ? (
        <p
          className={`max-w-md text-sm leading-7 md:text-base ${
            isLight ? "text-ash" : "text-smoke"
          }`}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}
