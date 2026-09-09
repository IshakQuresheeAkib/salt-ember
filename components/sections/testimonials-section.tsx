import { testimonials } from "@/lib/constants/testimonials";
import { SectionHeading } from "@/components/shared/section-heading";

export function TestimonialsSection() {
  return (
    <section className="section-shell testimonials-section" aria-labelledby="testimonials-title">
      <div className="content-shell">
        <SectionHeading
          id="testimonials-title"
          eyebrow="Provisional testimonials"
          title="Guests, in their own words."
          intro="Sample voices establish the intended rhythm until the restaurant supplies verified guest feedback."
        />

        <div className="testimonial-list">
          {testimonials.map((testimonial, index) => (
            <figure className="testimonial-item" key={testimonial.id}>
              <p className="testimonial-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </p>
              <blockquote>“{testimonial.quote}”</blockquote>
              <figcaption>
                <span>{testimonial.name}</span>
                <span>Sample testimonial</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
