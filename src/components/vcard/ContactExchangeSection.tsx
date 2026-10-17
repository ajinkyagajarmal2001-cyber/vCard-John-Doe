import type { ResolvedCard } from "@/lib/card";
import { Section } from "@/components/ui/Section";
import { ContactExchange } from "./ContactExchange";

export function ContactExchangeSection({ card }: { card: ResolvedCard }) {
  if (!card.contactExchange) return null;
  return (
    <Section id="exchange" title="Exchange contact">
      <ContactExchange exchange={card.contactExchange} ownerFirstName={card.profile.firstName} />
    </Section>
  );
}
