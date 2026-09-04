# Salt & Ember Product Brief

## Purpose

Create a premium, frontend-first restaurant website for a dine-in business in Sylhet, Bangladesh. The current milestone is the public architecture, visual design, responsive composition, and usable interaction prototypes—not production backend or staff tooling.

The site should feel memorable and editorial while helping guests explore the food, understand the restaurant, and complete realistic reservation and private-event enquiry interfaces.

## Current milestone

Deliver the complete public-facing frontend for:

- Home
- Menu
- About
- Reservations
- Gallery
- Contact

All routes, navigation, layouts, responsive states, content states, and primary interactions should be represented. A polished interface is required even where submission or persistence remains mocked.

## Public experiences

- Browse menu categories and filter typed fixture data by verified properties such as category, dietary preference, spice level, and availability.
- Explore signature dishes, restaurant story, gallery imagery, testimonials, location, contact details, opening hours, map, and social links.
- Complete a table-reservation form and receive a clearly labelled simulated success or error state.
- Complete a distinct private-event enquiry flow rather than hiding it in a generic contact-field option.
- Use every experience with keyboard, touch, pointer, reduced-motion, mobile, desktop, and short-height layouts.

## Frontend data boundary

- Use typed local fixtures for menu items, gallery items, testimonials, hours, contact details, and prototype reservation or enquiry results.
- Keep fixtures separate from presentation components so a future data source can replace them without redesigning the UI.
- Treat categories, prices, dietary claims, spice levels, hours, addresses, testimonials, and photography as provisional until confirmed by the restaurant.
- Do not create duplicate production and mock data systems during this milestone.
- No user account is required for any public prototype flow.

## Reservation and event prototypes

- Build complete field, validation, loading, failure, success, and reset states.
- Submission may be handled entirely in local UI state or through a development-only mock handler.
- Clearly communicate that the prototype does not create a confirmed booking or send a real enquiry.
- Preserve a clean interface boundary for later server-backed submission.
- EmailJS is not required for architecture or design work and should not be introduced as a substitute for persistence.

## Deferred work

The following are intentionally outside the current milestone:

- Supabase project setup, schema, migrations, Storage, generated database types, and Row Level Security.
- Staff authentication, roles, admin routes, content management, and reservation management.
- Production reservation persistence, pending/confirmed/cancelled workflow, availability enforcement, blackout dates, duplicate protection, and transactional email.
- Production private-event persistence and staff notification.
- Guest accounts, online ordering, delivery, payments, loyalty programmes, and a general page-builder CMS.

These capabilities may be added later behind the frontend boundaries established in this phase. They must not be presented as complete until they are implemented and verified.

## Local discovery

Design the frontend to accommodate accurate restaurant metadata, structured data, address, phone, opening hours, map location, social links, sitemap, and Google Business Profile alignment. Use placeholders only when visibly marked as unverified content.

## Delivery order

1. Confirm the visual concept, exact copy, content inventory, and canonical brand tokens.
2. Establish fonts, global layout, responsive containers, page shells, navigation, and footer.
3. Build the complete Home-page composition using typed fixtures.
4. Build Menu and its filtering interactions.
5. Build About, Gallery, Reservations, Contact, and the private-event flow.
6. Add the restrained GSAP motion pass after static responsive layouts are accepted.
7. Verify mobile, short-height, reduced-motion, keyboard, performance, and visual fidelity.
8. Add backend capabilities later as a separate, approved milestone.
