# Digital vCard Template

A premium, mobile-first digital business card built as a **reusable template**.
One codebase, many client copies — **only `src/data.ts` changes**.

- No database, no login, no backend, no API keys
- Every section hides itself when its data is blank
- Static site: builds to plain HTML and deploys free on Vercel

```
COPY REPOSITORY  →  replace /public/images  →  edit src/data.ts  →  npm run build  →  Vercel
```

---

## 1. What's included

| Section | Shows when… |
| --- | --- |
| Header (cover, photo, name, title, company, tagline) | always (only `profile.name` is required) |
| Call · WhatsApp · Email · Website buttons | each one appears when its value is set |
| **Save Contact** (downloads a `.vcf` with photo) | always |
| Share button (native share sheet or copy link) | always |
| Day/Night button (light ↔ dark mode, remembered per visitor) | always |
| Contact details (with copy buttons) | phone, email or website is set |
| About + highlight stats | `about.description` is set |
| Services (with "Enquire on WhatsApp") | `services` has items |
| Connect (social links) | at least one social URL is set |
| Gallery (tap to enlarge, swipe with arrows) | `gallery` has items |
| Videos (YouTube, loaded only when played) | `videos` has valid YouTube links |
| Location (address, hours, map, maps button) | address, map link or hours is set |
| Exchange contact (visitor sends their details) | `contactExchange.enabled` + WhatsApp or email set |
| Links | `additionalLinks` has items |
| Quick-action bar (sticky on scroll) | always; Call/WhatsApp icons only if set |
| Agency credit (Kreative Den Media + phone) at the very bottom | set once in `src/branding.ts` |

Generated automatically from `data.ts`: page title & description, Open Graph / X
preview image, favicon and home-screen icon (initials + brand colour),
`robots.txt`, `sitemap.xml` and schema.org structured data.

## 2. Tech stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 ·
Framer Motion (scroll reveals, lazy-loaded) · Lucide icons · `next/font` (Inter / Source Serif 4) · `next/image`.

## 3. Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000 (live reloads when you edit data.ts)
npm run build      # production build, also type-checks data.ts
npm start          # serve the production build
npm run lint
```

## 4. Changing client data

Open **`src/data.ts`**. Every field is commented and marked:

- `[REQUIRED]` – must be filled in (only `profile.name`)
- `[OPTIONAL]` – leave blank to hide the related UI
- `[LIST]` – add, remove or reorder items; `[]` hides the section

**To hide anything, leave it blank.** `""`, `null`, `undefined`, `[]` or deleting
the line all work the same way:

```ts
videos: [],                                   // no Videos section
location: { address: "Pune", mapUrl: "" },    // address shows, maps button hidden
social: { linkedin: "https://linkedin.com/in/jane", instagram: "" }, // only LinkedIn
```

The build fails with a clear TypeScript error if a field is misspelt, so
`npm run build` is a good final check. Invalid values (a malformed email, a
non-YouTube link, an image file that doesn't exist) are skipped rather than
shown broken.

You never need to touch `src/types.ts`, `src/lib/*`, `src/components/*` or `src/app/*` for a normal client.

## 5. Images

Put images in `public/images/` and reference them starting with `/`:

```
public/images/
  profile/   profile.jpg      square, ≥ 400×400
  cover/     cover.jpg        wide banner, ≥ 1200×420
  services/  *.jpg            ≈ 16:10, ≥ 960×600
  gallery/   *.jpg            ≈ 4:3,  ≥ 1080×810
```

```ts
profile: { profileImage: "/images/profile/profile.jpg", coverImage: "/images/cover/cover.jpg" }
```

- JPG or PNG; keep files under ~500 KB. Next.js resizes and converts them automatically.
- **No photo?** Remove `profileImage` and the client's initials appear instead.
  **No cover?** A subtle pattern in the brand colour is used.
- If a path points to a file that doesn't exist, the image is skipped automatically (no broken icons).
- Full `https://` image URLs also work (they are served as-is, without resizing).
- The images shipped with this repo are illustrated placeholders. Replace them for each client.

## 6. Services

```ts
services: [
  {
    title: "Tax Planning",                         // required
    description: "Year-round planning for…",       // optional
    image: "/images/services/tax-planning.jpg",    // optional
    whatsappMessage: "Hi Jane, I need help with tax planning.", // optional
  },
],
```

Without `whatsappMessage`, the button sends *"Hi ‹first name›, I am interested in ‹title›."*
With no `contact.whatsapp` number, enquiry buttons are hidden. `services: []` hides the section.

## 7. Videos

```ts
videos: [{ title: "Client success story", url: "https://youtu.be/VIDEO_ID" }],
```

Any YouTube link format works (watch, youtu.be, shorts, embed, live). The page shows
lightweight thumbnails and loads a single player (privacy-enhanced `youtube-nocookie.com`)
only when a visitor taps play. Non-YouTube links are skipped.

## 8. Social links

```ts
social: {
  linkedin:  "https://www.linkedin.com/in/janesmith",
  instagram: "@janesmith",                 // handles work for Instagram, Facebook, YouTube, X
  facebook:  "",                           // blank → icon hidden
  youtube:   "https://youtube.com/@janesmith",
  twitter:   "https://x.com/janesmith",
},
```

## 9. Google Maps (or any map)

```ts
location: {
  address: "Office 402, Baner Road, Pune 411045",
  mapUrl: "https://maps.app.goo.gl/xxxx",        // "Open in Maps" button
  mapEmbedUrl: "https://www.google.com/maps?q=Baner+Road+Pune&output=embed", // optional mini-map
  latitude: 18.559, longitude: 73.7868,         // optional (saved into the contact)
  businessHours: [{ days: "Mon – Fri", hours: "9:30 AM – 6:30 PM" }],
},
```

- **`mapUrl`**: in Google Maps, search the business → **Share → Copy link**. Apple Maps and
  other providers work too; the button label adapts ("Open in Google Maps", "Open in Apple Maps", "Open in Maps").
- **`mapEmbedUrl`**: Google Maps → **Share → Embed a map → copy only the `src="…"` URL**,
  or use `https://www.google.com/maps?q=<address with + for spaces>&output=embed`. No API key needed.
- Address only → address shows, no button. Nothing set → section hidden.

## 10. WhatsApp

```ts
contact: { whatsapp: "+91 98765 43210" },   // include the country code; spaces/+ are fine
```

Powers the WhatsApp button, the sticky bar icon, service enquiries and (by default)
contact exchange. Leave it blank to remove every WhatsApp button. WhatsApp
doesn't fall back to `phone`, so you can list a landline as the phone number.

### Contact exchange

```ts
contactExchange: { enabled: true, title: "Let's stay in touch", deliverVia: "whatsapp" }, // or "email"
```

The visitor fills in a short form and their details open in WhatsApp (or their email app)
ready to send to the card owner. Nothing is stored and no server is involved. To send
details to a CRM or backend later, edit the single function `deliverContactExchange` in
`src/lib/contact-exchange.ts`.

## 11. Theme & fonts

```ts
theme: {
  primary: "#1E3A5F",        // brand colour (any hex)
  fontStyle: "classic",      // "modern" (sans-serif, default) or "classic" (serif headings)
  // background, surface, text, mutedText are also available
},
```

Text on brand-coloured buttons switches between white and dark automatically, and
brand-coloured text is darkened if needed to stay readable. Remove `theme` entirely for the defaults.

### Day / Night mode

Every card has a Day/Night button on the cover. The night palette is generated
automatically from `primary` (the brand colour is lightened so it stays readable on dark
backgrounds), so no extra colours are needed. The visitor's choice is remembered on their
device and applied before the page paints (no white flash).

```ts
theme: { defaultMode: "light" },   // what first-time visitors see: "light" (default) | "dark" | "system"
```

`"system"` follows the visitor's phone setting until they press the button.

## 12. SEO

```ts
seo: { siteUrl: "https://jane-smith.vercel.app", keywords: ["advocate Mumbai"] },
```

Set `siteUrl` to the live address (or set the `NEXT_PUBLIC_SITE_URL` environment
variable in Vercel; that takes priority). It enables canonical URLs, absolute
share-image links and the sitemap. Title defaults to *"Name | Designation"*, and the
description defaults to the tagline. Both can be overridden with `seo.title` / `seo.description`.

## 13. Agency branding (Kreative Den Media)

The credit at the very bottom of every card comes from **`src/branding.ts`**, not from
`data.ts`, because it is the same for every client:

```ts
export const agencyBranding = {
  name: "Kreative Den Media",
  phone: "+91 9359314272",   // tap-to-call link
  label: "Digital card by",
};
```

Edit it once in the master template and every new client copy inherits it. To remove the
credit from a particular card (e.g. a white-label client), set `name: ""` in that copy.

## 14. Deploy to Vercel

1. Push the client's repository to GitHub.
2. In Vercel: **Add New → Project → Import** the repository. The defaults (Next.js, `npm run build`) are correct.
3. Click **Deploy**. Optionally add a custom domain under **Settings → Domains**,
   then update `seo.siteUrl` (or `NEXT_PUBLIC_SITE_URL`) to match.

Every later push to the main branch redeploys automatically.

## 15. Create a new client copy

```bash
# 1. Copy the template (GitHub "Use this template" works too)
git clone <this-repo-url> vcard-jane-smith
cd vcard-jane-smith
rm -rf .git && git init

# 2. Replace images in public/images/  (keep the same folders)
# 3. Edit src/data.ts
# 4. Check it
npm install
npm run dev      # review in the browser, including on your phone
npm run build    # must finish without errors

# 5. Commit, push to a new GitHub repo, import into Vercel
```

Each deployment contains only its own client's data. There are no client IDs,
URL parameters or shared storage, so one client's card can never expose another's.

## Project structure

```
src/
├── data.ts              ← CLIENT CHANGES THIS
├── branding.ts          ← agency credit (same for every client)
├── types.ts             ← data model (never needs changing)
├── app/
│   ├── layout.tsx       fonts, theme colours, metadata
│   ├── page.tsx         section order
│   ├── icon.tsx, apple-icon.tsx, opengraph-image.tsx, robots.ts, sitemap.ts
│   └── globals.css      design tokens
├── components/
│   ├── ui/              Section, Dialog, SafeImage, Reveal, BrandIcons…
│   └── vcard/           Hero, ContactActions, About, Services, Gallery, Videos, Location…
└── lib/
    ├── card.ts          validates data.ts → clean render model (all hide/show logic)
    ├── card.server.ts   build-time loader (drops missing image files)
    ├── validation.ts    hasValue, isValidUrl, isValidPhone, isValidEmail…
    ├── vcard.ts         .vcf generation
    ├── theme.ts         day/night palettes + no-flash mode script
    ├── whatsapp.ts, youtube.ts, social.ts, seo.ts, contact-exchange.ts
```

## Notes

- **Save Contact inside in-app browsers:** the `.vcf` is generated in the browser and downloaded.
  Some in-app browsers (inside social or chat apps) may block downloads. If so, visitors can use
  "Open in browser". Test on your target devices before handing over a card.
- **Accessibility:** semantic landmarks, labelled icon buttons, visible focus rings, native
  `<dialog>` modals (focus trap, Escape to close), and full support for *reduce motion*.
