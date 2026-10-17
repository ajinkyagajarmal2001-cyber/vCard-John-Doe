import type { VCardData } from "./types";

/**
 * ============================================================================
 *  CLIENT DATA — THIS IS THE ONLY FILE YOU NEED TO EDIT
 * ============================================================================
 *
 *  How it works
 *  ------------
 *  • Every section of the card is built from the values below.
 *  • To HIDE something, leave it blank:  ""  •  null  •  []  •  or delete it.
 *    e.g.  videos: []        → no Videos section
 *          instagram: ""     → no Instagram icon
 *          mapUrl: ""        → address still shows, maps button disappears
 *  • Images live in /public/images/... and are referenced starting with "/".
 *
 *  Legend
 *  ------
 *  [REQUIRED]  must be filled in
 *  [OPTIONAL]  can be left blank – the related UI hides itself
 *  [LIST]      add, remove or reorder items freely; [] hides the section
 * ============================================================================
 */
export const vCardData: VCardData = {
  /* ------------------------------------------------------------------------
   * PROFILE — header of the card
   * --------------------------------------------------------------------- */
  profile: {
    // [REQUIRED]
    name: "John Doe",

    // [OPTIONAL]
    designation: "Business Consultant",

    // [OPTIONAL]
    company: "Doe Business Solutions",

    // [OPTIONAL] one short sentence
    tagline: "Helping businesses grow through smarter strategy",

    // [OPTIONAL] square image, at least 400 × 400 px
    profileImage: "/images/profile/profile.jpg",

    // [OPTIONAL] wide banner, at least 1200 × 420 px
    coverImage: "/images/cover/cover.jpg",
  },

  /* ------------------------------------------------------------------------
   * CONTACT — powers the Call / WhatsApp / Email / Website buttons
   * --------------------------------------------------------------------- */
  contact: {
    // [OPTIONAL] shown as written; used for the Call button
    phone: "+91 98765 43210",

    // [OPTIONAL] include the country code (spaces and + are fine)
    whatsapp: "+91 98765 43210",

    // [OPTIONAL]
    email: "john.doe@example.com",

    // [OPTIONAL]
    website: "https://example.com",
  },

  /* ------------------------------------------------------------------------
   * ABOUT
   * --------------------------------------------------------------------- */
  about: {
    // [OPTIONAL] defaults to "About"
    title: "About Me",

    // [OPTIONAL] leave blank to hide the whole About section.
    // Use a blank line (\n\n) to start a new paragraph.
    description:
      "I help founders and leadership teams turn ambitious plans into measurable results. Over the past twelve years I have worked with manufacturers, retailers and service firms across India to sharpen their strategy, streamline operations and build teams that execute with confidence.\n\nMy approach is practical and numbers-driven: understand the business deeply, focus on the few decisions that matter most, and stay alongside the team until the results show up.",

    // [LIST] up to 3 short stats; [] to hide
    highlights: [
      { value: "12+", label: "Years experience" },
      { value: "180+", label: "Businesses advised" },
      { value: "9", label: "Industries served" },
    ],
  },

  /* ------------------------------------------------------------------------
   * SOCIAL LINKS — paste full profile URLs ("" hides the icon)
   * --------------------------------------------------------------------- */
  social: {
    linkedin: "https://www.linkedin.com/in/johndoe",
    instagram: "https://www.instagram.com/johndoe",
    youtube: "https://www.youtube.com/@johndoe",
    twitter: "https://x.com/johndoe",
    facebook: "",
  },

  /* ------------------------------------------------------------------------
   * SERVICES  [LIST]
   * Each service gets an "Enquire on WhatsApp" button when a WhatsApp
   * number is set above. `whatsappMessage` is optional.
   * --------------------------------------------------------------------- */
  services: [
    {
      title: "Business Consulting",
      description:
        "A clear-eyed review of your business model, market position and finances, followed by a focused roadmap your team can act on.",
      image: "/images/services/business-consulting.jpg",
      whatsappMessage: "Hi John, I am interested in Business Consulting for my company.",
    },
    {
      title: "Digital Strategy",
      description:
        "Choose the right channels, tools and metrics to win customers online — without wasting budget on noise.",
      image: "/images/services/digital-strategy.jpg",
    },
    {
      title: "Growth Planning",
      description:
        "Annual and quarterly growth plans with realistic targets, owners and review rhythms that keep everyone accountable.",
      image: "/images/services/growth-planning.jpg",
    },
    {
      title: "Financial Advisory",
      description:
        "Cash-flow planning, pricing reviews and funding readiness so you can make big decisions with confidence.",
      image: "/images/services/financial-advisory.jpg",
    },
    {
      title: "Leadership Coaching",
      description:
        "One-to-one and team coaching for founders and senior managers stepping into larger roles.",
      image: "/images/services/leadership-coaching.jpg",
    },
  ],

  /* ------------------------------------------------------------------------
   * VIDEOS  [LIST] — any YouTube link works
   * --------------------------------------------------------------------- */
  videos: [
    {
      title: "How Great Leaders Inspire Action",
      url: "https://www.youtube.com/watch?v=qp0HIF3SfI4",
    },
    {
      title: "Grit: The Power of Passion and Perseverance",
      url: "https://www.youtube.com/watch?v=H14bBuluwB8",
    },
    {
      title: "Inside the Mind of a Master Procrastinator",
      url: "https://youtu.be/arj7oStGLkU",
    },
  ],

  /* ------------------------------------------------------------------------
   * GALLERY  [LIST] — caption is optional, url is optional
   * --------------------------------------------------------------------- */
  gallery: [
    { image: "/images/gallery/strategy-workshop.jpg", caption: "Strategy workshop with a retail leadership team" },
    { image: "/images/gallery/leadership-summit.jpg", caption: "Speaking at the Pune Leadership Summit" },
    { image: "/images/gallery/client-office.jpg", caption: "Quarterly review at a client office" },
    { image: "/images/gallery/growth-review.jpg", caption: "Growth review session" },
    { image: "/images/gallery/team-session.jpg", caption: "Cross-functional planning session" },
    { image: "/images/gallery/keynote.jpg", caption: "Keynote on scaling family businesses", url: "https://example.com/talks" },
  ],

  /* ------------------------------------------------------------------------
   * LOCATION
   * • address only            → address is shown, no maps button
   * • address + mapUrl        → address + "Open in Maps" button
   * • mapEmbedUrl (optional)  → small interactive map
   * --------------------------------------------------------------------- */
  location: {
    address: "Office 402, Business Bay, Baner Road, Pune, Maharashtra 411045, India",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Baner+Road+Pune+Maharashtra",
    mapEmbedUrl: "https://www.google.com/maps?q=Baner+Road+Pune+Maharashtra&output=embed",
    latitude: 18.559,
    longitude: 73.7868,

    // [LIST] [] to hide
    businessHours: [
      { days: "Mon – Fri", hours: "9:30 AM – 6:30 PM" },
      { days: "Saturday", hours: "10:00 AM – 2:00 PM" },
      { days: "Sunday", hours: "Closed" },
    ],
  },

  /* ------------------------------------------------------------------------
   * CONTACT EXCHANGE — visitors share their details with you
   * (sent through WhatsApp or email; no server needed)
   * --------------------------------------------------------------------- */
  contactExchange: {
    enabled: true,
    title: "Let's stay in touch",
    description: "Share your details and I'll get back to you within one business day.",
    deliverVia: "whatsapp",
  },

  /* ------------------------------------------------------------------------
   * ADDITIONAL LINKS  [LIST]
   * --------------------------------------------------------------------- */
  additionalLinks: [
    { title: "Book a Discovery Call", description: "30-minute free consultation", url: "https://example.com/book" },
    { title: "Download Company Profile", description: "PDF · 2 MB", url: "https://example.com/profile.pdf" },
    { title: "Client Case Studies", url: "https://example.com/case-studies" },
  ],

  /* ------------------------------------------------------------------------
   * THEME [OPTIONAL] — remove any line to use the default
   * --------------------------------------------------------------------- */
  theme: {
    primary: "#1E3A5F",
    fontStyle: "modern", // "modern" | "classic"
    defaultMode: "light", // first visit: "light" | "dark" | "system" (visitors can switch Day/Night)
  },

  /* ------------------------------------------------------------------------
   * SEO [OPTIONAL] — set siteUrl once the card is live
   * --------------------------------------------------------------------- */
  seo: {
    siteUrl: "https://john-doe-vcard.vercel.app",
    keywords: ["business consultant Pune", "strategy consulting", "growth planning"],
  },

  /* ------------------------------------------------------------------------
   * FOOTER [OPTIONAL]
   * --------------------------------------------------------------------- */
  footer: {
    credit: null,
  },
};
