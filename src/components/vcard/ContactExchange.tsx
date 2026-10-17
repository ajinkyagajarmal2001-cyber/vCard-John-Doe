"use client";

import { Send, UserRoundPlus } from "lucide-react";
import { useId, useState, type ChangeEvent, type FormEvent, type InputHTMLAttributes } from "react";
import type { ResolvedCard } from "@/lib/card";
import { deliverContactExchange, type ContactExchangeForm } from "@/lib/contact-exchange";
import { isValidEmail, isValidPhone } from "@/lib/validation";
import { Dialog } from "@/components/ui/Dialog";

interface ContactExchangeProps {
  exchange: NonNullable<ResolvedCard["contactExchange"]>;
  ownerFirstName: string;
}

const EMPTY: ContactExchangeForm = { name: "", phone: "", email: "", company: "", message: "" };

function Field({ label, optional, error, ...input }: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  optional?: boolean;
  error?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-ink">
        {label}
        {optional && <span className="text-xs font-normal text-muted">Optional</span>}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className="h-12 w-full rounded-xl border border-line-strong bg-surface px-4 text-[16px] text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none focus-visible:outline-none focus:ring-3 focus:ring-brand/15 aria-invalid:border-red-600 dark:aria-invalid:border-red-400"
        {...input}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

/** "Share your contact" card + form. Delivery is handled by lib/contact-exchange.ts. */
export function ContactExchange({ exchange, ownerFirstName }: ContactExchangeProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ContactExchangeForm>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactExchangeForm, string>>>({});
  const via = exchange.channel === "whatsapp" ? "WhatsApp" : "email";

  const update = (key: keyof ContactExchangeForm) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (form.phone?.trim() && !isValidPhone(form.phone)) next.phone = "Please enter a valid phone number.";
    if (form.email?.trim() && !isValidEmail(form.email)) next.email = "Please enter a valid email address.";
    if (!form.phone?.trim() && !form.email?.trim()) next.phone = "Add a phone number or email so you can be reached.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const url = deliverContactExchange(form, exchange, ownerFirstName);
    if (exchange.channel === "whatsapp") window.open(url, "_blank", "noopener,noreferrer");
    else window.location.href = url;
    setOpen(false);
    setForm(EMPTY);
  }

  return (
    <>
      <div className="rounded-2xl border border-brand-line bg-brand-soft px-6 py-8 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-surface text-brand-ink shadow-sm">
          <UserRoundPlus className="size-5" aria-hidden />
        </span>
        <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink">{exchange.title}</h3>
        {exchange.description && (
          <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted">{exchange.description}</p>
        )}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-[15px] font-semibold text-on-brand transition-[filter,transform] hover:brightness-110 active:scale-[0.985]"
        >
          Share your contact
        </button>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title="Share your contact">
        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          <Field label="Full name" name="name" autoComplete="name" required value={form.name} onChange={update("name")} error={errors.name} />
          <Field label="Phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" optional value={form.phone} onChange={update("phone")} error={errors.phone} />
          <Field label="Email" name="email" type="email" inputMode="email" autoComplete="email" optional value={form.email} onChange={update("email")} error={errors.email} />
          <Field label="Company" name="company" autoComplete="organization" optional value={form.company} onChange={update("company")} />
          <div>
            <label htmlFor="exchange-message" className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-ink">
              Message <span className="text-xs font-normal text-muted">Optional</span>
            </label>
            <textarea
              id="exchange-message"
              name="message"
              rows={3}
              value={form.message}
              onChange={update("message")}
              className="w-full resize-none rounded-xl border border-line-strong bg-surface px-4 py-3 text-[16px] text-ink focus:border-brand focus:ring-3 focus:ring-brand/15 focus:outline-none focus-visible:outline-none"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-[15px] font-semibold text-on-brand transition-[filter] hover:brightness-110"
          >
            <Send className="size-4" aria-hidden />
            Send via {via}
          </button>
          <p className="text-center text-xs leading-5 text-muted">
            Opens {via} with your details filled in. Nothing is stored on this website.
          </p>
        </form>
      </Dialog>
    </>
  );
}
