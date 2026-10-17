import { card } from "@/lib/card.server";
import { buildJsonLd } from "@/lib/seo";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { About } from "@/components/vcard/About";
import { AdditionalLinks } from "@/components/vcard/AdditionalLinks";
import { ContactDetails } from "@/components/vcard/ContactDetails";
import { ContactExchangeSection } from "@/components/vcard/ContactExchangeSection";
import { FloatingControls } from "@/components/vcard/FloatingControls";
import { Footer } from "@/components/vcard/Footer";
import { GallerySection } from "@/components/vcard/GallerySection";
import { Hero } from "@/components/vcard/Hero";
import { Location } from "@/components/vcard/Location";
import { Services } from "@/components/vcard/Services";
import { SocialLinks } from "@/components/vcard/SocialLinks";
import { StickyActionBar } from "@/components/vcard/StickyActionBar";
import { VideosSection } from "@/components/vcard/VideosSection";

/**
 * The whole card. Every section renders itself only when its data exists,
 * so this file never needs to change between clients — edit src/data.ts instead.
 */
export default function Home() {
  const vcardSource = { profile: card.profile, contact: card.contact, social: card.social, location: card.location };

  return (
    <MotionProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(card)).replace(/</g, "\\u003c") }}
      />
      <FloatingControls card={card} />
      <main className="mx-auto w-full max-w-xl sm:px-4 sm:pt-8 sm:pb-28 md:max-w-2xl md:pt-12">
        <div className="overflow-hidden bg-surface sm:rounded-[1.75rem] sm:border sm:border-line sm:shadow-card">
          <Hero card={card} />
          <div className="space-y-12 px-5 pt-2 pb-12 empty:hidden sm:px-8">
            <ContactDetails contact={card.contact} />
            <About about={card.about} />
            <Services services={card.services} />
            <SocialLinks social={card.social} />
            <GallerySection items={card.gallery} />
            <VideosSection videos={card.videos} />
            <Location location={card.location} />
            <ContactExchangeSection card={card} />
            <AdditionalLinks links={card.links} />
          </div>
          <Footer footer={card.footer} />
        </div>
      </main>
      <StickyActionBar source={vcardSource} contact={card.contact} />
    </MotionProvider>
  );
}
