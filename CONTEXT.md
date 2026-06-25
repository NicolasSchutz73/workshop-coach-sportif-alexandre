# Context

## Domain language

### Reservation

The visitor-facing process for choosing an available coaching appointment and
submitting the attendee details. The product now has two implemented reservation
providers in the codebase, but the public website now promotes Cal.com through
`/reservation`.

### Reservation intake

The public reservation journey uses the one-to-one session copy from
`lib/booking.ts`:

- `/reservation` uses the Cal.com widget and server routes under `/api/cal`.
- The public copy is aligned with the "Séance 1-to-1" offer: a punctual field
  session around Chambéry for technique, return to running, race preparation, or
  getting restarted.
- Legacy `/booking` links coming from old Strapi content are normalized to
  `/reservation` in the frontend.

The old `/booking` App Router page has been removed from the public site.

### V1 scope from the framing note

The May 2026 framing note defines the V1 deliverable as a mobile-first Next.js
site with five public pages, Strapi-managed content, an online reservation
module, an e-book/payment module, legal pages, on-page SEO, analytics/search
console setup, and a documented back-office handoff.

Current implementation choices differ slightly from the initial optional
wording: Lemon Squeezy is the payment provider, Strapi is the CMS/back-office,
and the public reservation flow uses Cal.com.
