import { useRef, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { useCreateRegistration } from "@workspace/api-client-react";
import type { RegistrationInput } from "@workspace/api-client-react";
import { ABSTRACT_MAX_WORDS, CATEGORIES } from "@/lib/content";
import { EmailPreview } from "@/components/email-preview";

type Vals = {
  fullName: string; email: string; category: string; affiliation: string;
  submitAbstract: boolean; presentationTitle: string; abstract: string; format: string;
  accommodation: boolean; dietaryRestrictions: string; consent: boolean;
};
type Errs = Partial<Record<keyof Vals, string>>;

const ORDER: (keyof Vals)[] = ["fullName", "email", "category", "affiliation", "submitAbstract", "presentationTitle", "abstract", "format", "accommodation", "dietaryRestrictions", "consent"];
const LATE = () => Date.now() > Date.parse("2026-11-30T23:59:59+05:30");
const words = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;

function validate(v: Vals): Errs {
  const e: Errs = {};
  const n = v.fullName.trim();
  if (n.length < 2) e.fullName = "Enter your full name (at least 2 characters).";
  if (!v.email.trim()) e.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Enter a valid email address, such as name@example.org.";
  if (!v.category) e.category = "Select your participant category.";
  if (v.affiliation.trim().length < 2) e.affiliation = "Enter your department or institution.";
  if (v.submitAbstract && LATE()) e.submitAbstract = "The abstract deadline of 30 November 2026 (IST) has passed. Untick this option to register without an abstract.";
  if (v.submitAbstract) {
    if (!v.presentationTitle.trim()) e.presentationTitle = "Enter a title for your presentation.";
    const w = words(v.abstract);
    if (w === 0) e.abstract = "Enter your abstract.";
    else if (w > ABSTRACT_MAX_WORDS) e.abstract = `Abstract must be under 300 words. It is ${w} words; remove ${w - ABSTRACT_MAX_WORDS}.`;
    if (!v.format) e.format = "Choose oral or poster.";
  }
  if (v.accommodation && !v.category.startsWith("external")) e.accommodation = "Accommodation is available to external participants only.";
  if (!v.consent) e.consent = "Please confirm consent to proceed.";
  return e;
}

const field = "mt-1.5 block w-full border bg-card px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground/70 focus:border-crimson disabled:opacity-50";

function Field({ id, label, hint, error, required, children, count }: { id: string; label: string; hint?: string; error?: string; required?: boolean; children: ReactNode; count?: ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-semibold text-navy">
          {label}{required && <span className="text-crimson" aria-hidden="true"> *</span>}{required && <span className="sr-only"> (required)</span>}
        </label>
        {count}
      </div>
      {children}
      {hint && <p id={`${id}-hint`} className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {error && <p id={`${id}-err`} role="alert" data-testid={`error-${id}`} className="mt-1 text-sm font-medium text-crimson">{error}</p>}
    </div>
  );
}

export function RegistrationForm() {
  const [, setLoc] = useLocation();
  const create = useCreateRegistration();
  const [v, setV] = useState<Vals>({
    fullName: "", email: "", category: "", affiliation: "", submitAbstract: false, presentationTitle: "",
    abstract: "", format: "", accommodation: false, dietaryRestrictions: "", consent: false,
  });
  const [errs, setErrs] = useState<Errs>({});
  const [touched, setTouched] = useState(false);
  const [serverErr, setServerErr] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const external = v.category.startsWith("external");
  const wc = words(v.abstract);

  const set = <K extends keyof Vals>(k: K, val: Vals[K]) => {
    const next = { ...v, [k]: val };
    if (k === "category" && !String(val).startsWith("external")) next.accommodation = false;
    setV(next);
    if (touched) setErrs(validate(next));
  };
  const ids = (k: keyof Vals, hint = false) => ({
    id: k,
    name: k,
    "aria-invalid": errs[k] ? true : undefined,
    "aria-describedby": [hint ? `${k}-hint` : "", errs[k] ? `${k}-err` : ""].filter(Boolean).join(" ") || undefined,
  });

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setServerErr("");
    setTouched(true);
    const e = validate(v);
    setErrs(e);
    const first = ORDER.find((k) => e[k]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#${first}`)?.focus();
      return;
    }
    const data: RegistrationInput = {
      fullName: v.fullName.trim(), email: v.email.trim(), category: v.category as RegistrationInput["category"],
      affiliation: v.affiliation.trim(), submitAbstract: v.submitAbstract, accommodation: v.accommodation, consent: true,
      ...(v.submitAbstract ? { presentationTitle: v.presentationTitle.trim(), abstract: v.abstract.trim(), format: v.format as "oral" | "poster" } : {}),
      ...(v.dietaryRestrictions.trim() ? { dietaryRestrictions: v.dietaryRestrictions.trim() } : {}),
    };
    try {
      const r = await create.mutateAsync({ data });
      setLoc(`/confirmation/${r.token}`);
    } catch (err) {
      const x = err as { status?: number; data?: { error?: string } };
      setServerErr(
        x.status === 409
          ? "This email address already has a registration request on file. Check your records or write to " + "stps-workshop@nalandauniv.edu.in."
          : x.data?.error ?? "We could not save your request. Check your connection and try again.",
      );
    }
  };

  const pending = create.isPending;
  return (
    <form ref={formRef} onSubmit={submit} noValidate data-testid="form-registration" className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Field id="fullName" label="Full name" required error={errs.fullName}>
          <input {...ids("fullName")} type="text" autoComplete="name" maxLength={100} value={v.fullName} onChange={(e) => set("fullName", e.target.value)} className={`${field} ${errs.fullName ? "border-crimson" : "border-input"}`} data-testid="input-fullName" />
        </Field>
        <Field id="email" label="Email address" required error={errs.email}>
          <input {...ids("email")} type="email" autoComplete="email" maxLength={254} value={v.email} onChange={(e) => set("email", e.target.value)} className={`${field} ${errs.email ? "border-crimson" : "border-input"}`} data-testid="input-email" />
        </Field>
        <Field id="category" label="Participant category" required error={errs.category}>
          <select {...ids("category")} value={v.category} onChange={(e) => set("category", e.target.value)} className={`${field} ${errs.category ? "border-crimson" : "border-input"}`} data-testid="select-category">
            <option value="">Select category...</option>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </Field>
        <Field id="affiliation" label="Department / Affiliation" required error={errs.affiliation}>
          <input {...ids("affiliation")} type="text" maxLength={200} placeholder="e.g. STPS / IIT Tirupati" value={v.affiliation} onChange={(e) => set("affiliation", e.target.value)} className={`${field} ${errs.affiliation ? "border-crimson" : "border-input"}`} data-testid="input-affiliation" />
        </Field>
      </div>

      <fieldset className="border-t border-border pt-6">
        <legend className="font-display text-xl font-bold uppercase tracking-wide text-navy">Call for Presentations</legend>
        <p className="mt-1 text-sm text-muted-foreground">Both internal and external participants are highly encouraged to submit an abstract for the Oral &amp; Poster Presentation session. Deadline: 30 November 2026.</p>
        <label className="mt-4 flex cursor-pointer items-start gap-3">
           <input {...ids("submitAbstract")} type="checkbox" disabled={LATE() && !v.submitAbstract} checked={v.submitAbstract} onChange={(e) => set("submitAbstract", e.target.checked)} className="mt-1 h-5 w-5 accent-crimson" data-testid="checkbox-submitAbstract" />
          <span className="text-sm font-medium">I would like to submit an abstract for presentation</span>
        </label>
        {LATE() && <p className="mt-2 text-sm font-medium text-crimson" data-testid="text-deadline-passed">Abstract submission closed on 30 November 2026 (IST). You can still register without an abstract.</p>}
        {errs.submitAbstract && <p id="submitAbstract-err" role="alert" className="mt-1 text-sm font-medium text-crimson">{errs.submitAbstract}</p>}
        {v.submitAbstract && (
          <div className="mt-4 space-y-5 border-l-2 border-crimson pl-4 sm:pl-6" data-testid="abstract-fields">
            <Field id="presentationTitle" label="Presentation title" required error={errs.presentationTitle}>
              <input {...ids("presentationTitle")} type="text" maxLength={200} value={v.presentationTitle} onChange={(e) => set("presentationTitle", e.target.value)} className={`${field} ${errs.presentationTitle ? "border-crimson" : "border-input"}`} data-testid="input-presentationTitle" />
            </Field>
            <Field id="abstract" label="Abstract" required hint="Strictly under 300 words (maximum 299)." error={errs.abstract}
              count={<span aria-live="polite" className={`font-mono text-xs ${wc > ABSTRACT_MAX_WORDS ? "font-semibold text-crimson" : "text-muted-foreground"}`} data-testid="text-wordcount">{wc} / {ABSTRACT_MAX_WORDS} words</span>}>
               <textarea {...ids("abstract", true)} rows={7} maxLength={15000} value={v.abstract} onChange={(e) => set("abstract", e.target.value)} className={`${field} ${errs.abstract ? "border-crimson" : "border-input"}`} data-testid="input-abstract" />
            </Field>
            <Field id="format" label="Format preference" required error={errs.format} hint="Oral: 15 minutes (10 talk + 5 Q&A). Poster: A0, portrait.">
              <select {...ids("format", true)} value={v.format} onChange={(e) => set("format", e.target.value)} className={`${field} ${errs.format ? "border-crimson" : "border-input"}`} data-testid="select-format">
                <option value="">Select format...</option>
                <option value="oral">Oral Presentation</option>
                <option value="poster">Poster Presentation</option>
              </select>
            </Field>
          </div>
        )}
      </fieldset>

      <fieldset className="border-t border-border pt-6">
        <legend className="font-display text-xl font-bold uppercase tracking-wide text-navy">Logistics</legend>
        <div className="mt-3 grid gap-5 md:grid-cols-2">
          <Field id="accommodation" label="Require accommodation? (external only)" error={errs.accommodation}
            hint={external ? "Limited shared accommodation, first-come basis, subject to availability." : "Select an external category to enable this option."}>
            <select {...ids("accommodation", true)} disabled={!external} value={v.accommodation ? "yes" : "no"} onChange={(e) => set("accommodation", e.target.value === "yes")} className={`${field} ${errs.accommodation ? "border-crimson" : "border-input"}`} data-testid="select-accommodation">
              <option value="no">No</option>
              <option value="yes">Yes (subject to availability)</option>
            </select>
          </Field>
          <Field id="dietaryRestrictions" label="Dietary restrictions" hint="Optional.">
            <input {...ids("dietaryRestrictions", true)} type="text" maxLength={300} placeholder="e.g. Vegetarian, Vegan, None" value={v.dietaryRestrictions} onChange={(e) => set("dietaryRestrictions", e.target.value)} className={`${field} border-input`} data-testid="input-dietary" />
          </Field>
        </div>
      </fieldset>

      <div className="border-t border-border pt-6">
        <label className="flex cursor-pointer items-start gap-3">
          <input {...ids("consent", true)} type="checkbox" checked={v.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-1 h-5 w-5 accent-crimson" data-testid="checkbox-consent" />
          <span className="text-sm">I consent to Nalanda University storing the details above to process my registration request and contact me about this workshop. <span className="text-crimson" aria-hidden="true">*</span><span className="sr-only">(required)</span></span>
        </label>
        <p id="consent-hint" className="sr-only">Required to submit.</p>
        {errs.consent && <p id="consent-err" role="alert" data-testid="error-consent" className="mt-1 text-sm font-medium text-crimson">{errs.consent}</p>}
      </div>

      <details className="group border border-border bg-muted/40" data-testid="details-email-preview">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-navy">Preview the confirmation email</summary>
        <div className="p-3">
          <EmailPreview d={{ ...v, presentationTitle: v.presentationTitle, format: v.format }} />
        </div>
      </details>

      {(touched && Object.keys(errs).length > 0) && (
        <p role="alert" className="border-l-4 border-crimson bg-crimson/10 px-4 py-3 text-sm font-medium text-crimson" data-testid="text-form-error-summary">
          Please correct the {Object.keys(errs).length} highlighted {Object.keys(errs).length === 1 ? "field" : "fields"} and submit again.
        </p>
      )}
      {serverErr && <p role="alert" className="border-l-4 border-crimson bg-crimson/10 px-4 py-3 text-sm font-medium text-crimson" data-testid="text-server-error">{serverErr}</p>}

      <div>
        <button type="submit" disabled={pending} data-testid="button-submit" className="w-full bg-crimson px-6 py-4 font-display text-xl font-bold uppercase tracking-wider text-ivory transition hover:bg-[#8a1820] disabled:opacity-60">
          {pending ? "Saving your request..." : "Submit registration request"}
        </button>
        <p className="mt-3 text-center text-xs text-muted-foreground">Submitting stores your request. It does not confirm a seat and no email is sent at this stage. Fee details for external participants are not yet published.</p>
      </div>
    </form>
  );
}
