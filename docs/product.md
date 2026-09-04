# Salt & Ember Product Brief

## Purpose

Create a premium restaurant website for a dine-in business in Sylhet, Bangladesh. It must be visually memorable while helping guests discover food, request reservations, and enquire about private events.

## Launch pages

- Home
- Menu
- About
- Reservations
- Gallery
- Contact

Private-event enquiries live within Reservations or Contact as a distinct flow, not as a vague contact-field option.

## Public features

- Browse menu categories and filter dishes by relevant properties such as category, dietary preference, spice level, and availability.
- Submit a table-reservation request without creating an account.
- Submit a private-event enquiry.
- Find the restaurant's address, phone, opening hours, map, and social links.

## Reservation rules for launch

- Reservation status: pending, confirmed, cancelled.
- Use Asia/Dhaka as the business timezone.
- Validate fields server-side and apply basic anti-spam and duplicate-submission protection.
- Respect configured opening hours, blackout dates, and party-size limits.
- A request is not a confirmed table until staff confirms it.
- Notify staff of a new request through a defined transactional email path.

## Staff and admin features

- Staff authenticate with Supabase Auth; public guests do not.
- Roles: admin and editor.
- The admin interface manages menu categories and items, gallery items, operating and contact details, reservation statuses, and private-event enquiries.
- Do not build a general page builder or give restaurant staff Supabase dashboard access at launch.

## Content model

- menu_categories
- menu_items
- gallery_items
- reservations
- event_enquiries
- profiles or an equivalent staff-role record
- A narrowly scoped site_settings model for opening hours, contact and social details, address and map data, reservation limits, and optional announcements

## Security and data rules

- Use Supabase Row Level Security for all exposed tables.
- Restrict staff actions by role and use secure authorization checks.
- Validate public form submissions on the server.
- Keep privileged keys server-only.
- Preview deployments must use non-production data and email configuration.

## Non-goals for launch

- Online ordering, delivery, payments, guest accounts, loyalty programmes, and a generic CMS.
- Automatic table-allocation optimisation beyond the request and confirmation workflow.

## Local discovery

Add Restaurant structured data, an accurate local address, phone number, opening hours, sitemap, metadata, map location, and Google Business Profile alignment.
