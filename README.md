力曼小姐 · Ms Riman

A bilingual, privacy-conscious RIMAN product guide for Singapore.

Visitors can browse a curated product library, ask common questions, submit a
private enquiry or reservation request, and continue to the official RIMAN mall
for current pricing, availability and payment.

Public identity

Public brand: 力曼小姐 · Ms Riman

Contact email: linzhiatwork@gmail.com

No personal phone number, PayNow proxy or personal QR code is published

No payment or banking information is collected

Main files

app/page.tsx — bilingual landing page and product catalog

app/InquiryForm.tsx — private enquiry and reservation form

app/ChatGuide.tsx — bilingual FAQ guide; no payment handling

app/api/products/route.ts — public read-only product API

app/api/inquiries/route.ts — validated enquiry submission API

db/schema.ts — product and enquiry database schema

db/store.ts — D1 initialization, product seed and enquiry storage

lib/products.ts — verified seed catalog and official links

lib/inquiry-validation.mjs — server-side form validation

app/globals.css — responsive visual design

tests/ — privacy, rendering and validation tests

Local use

Requires Node.js 22.13 or later.

npm install
npm run dev

Validation

npm run lint
npx tsc --noEmit
npm test

Enquiries are retained for no more than 90 days and do not include payment data.
Final purchases remain on the official RIMAN mall.