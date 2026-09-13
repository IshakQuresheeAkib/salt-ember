# Product

<!-- impeccable:product-schema 1 -->

## Platform

Web, with one public homepage at `/`.

## Current product

Salt & Ember is a visual restaurant concept for prospective diners in and around Sylhet, Bangladesh. The implemented experience helps a visitor explore a sample menu, view illustrative guest notes, and find placeholder contact details. It is not a live restaurant operations system.

## Implemented capabilities

- In-page navigation to Home, Menu, Reviews, and Contact, with a desktop navigation bar and a mobile disclosure menu.
- A hero food selector with four food states. It advances automatically only when the document is visible, the selector is not hovered or focused, and reduced motion is not requested. Visitors can choose a state.
- A category-filtered sample menu with eight hard-coded dishes and BDT-formatted illustrative prices.
- Nine illustrative testimonials. Animated columns are progressively enhanced with Framer Motion; reduced motion renders all nine cards statically.
- A contact footer containing sample address, telephone, email, and social destinations.

## Product boundaries

The current repository has no reservation form, private-event form, gallery, about section, CMS, backend API, database, authentication, admin tools, ordering, delivery, payments, map integration, analytics, or persistence. Do not describe any of those as current functionality.

All restaurant claims are provisional. This includes cuisine positioning, dishes, prices, availability, imagery, testimonials, address, phone numbers, email, and social links. The contact data in the hero and footer is not yet consolidated; production publication requires an approved, single source of restaurant facts.

## Product principles

1. Make the sample nature of the experience clear and avoid claims of live service capability.
2. Keep interaction controls purposeful, keyboard-operable, and usable on small screens.
3. Keep animation supplemental; content remains available with reduced motion.
4. Replace provisional content only after restaurant approval.

## Next product decisions

Future work needs separate approval before adding new public sections or operational features. At minimum, confirm the restaurant identity, real menu and availability data, final contact details, consent/privacy requirements, the reservation workflow, and an operational owner for any submitted enquiry.
