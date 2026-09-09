import { SectionHeading } from "@/components/shared/section-heading";

export function ReservationsSection() {
  return (
    <section
      id="reservations"
      className="section-shell reservations-section"
      aria-labelledby="reservations-title"
    >
      <div className="content-shell">
        <SectionHeading
          id="reservations-title"
          eyebrow="Reservations"
          title="Your table is waiting."
          intro="Try the complete reservation experience in the next interface pass. Nothing entered here will be sent or stored."
          tone="light"
        />

        <div className="reservation-preview-grid">
          <article className="reservation-preview reservation-preview--primary">
            <p className="reservation-number">For dinner</p>
            <h3>Reserve a table</h3>
            <p>
              Choose a date, time, and party size in the interactive prototype. The
              experience will include validation, loading, success, failure, and reset.
            </p>
            <p className="prototype-disclosure">
              Prototype only — no booking is sent or stored.
            </p>
          </article>

          <article className="reservation-preview">
            <p className="reservation-number">For gatherings</p>
            <h3>Planning something larger?</h3>
            <p>
              Private-event enquiries use a distinct flow, with space for guest count,
              preferred date, event type, and what you have in mind.
            </p>
            <p className="prototype-disclosure">
              Prototype only — no enquiry is sent or stored.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
