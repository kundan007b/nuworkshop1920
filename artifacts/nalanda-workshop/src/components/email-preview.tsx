import { CONTACT, DATES, VENUE, categoryLabel } from "@/lib/content";

export interface PreviewData {
  fullName: string;
  email: string;
  category: string;
  affiliation: string;
  submitAbstract: boolean;
  presentationTitle?: string;
  format?: string;
  accommodation: boolean;
  reference?: string;
}

export function EmailPreview({ d, sent = false }: { d: PreviewData; sent?: boolean }) {
  const external = d.category.startsWith("external");
  return (
    <div data-testid="email-preview" className="border border-border bg-card">
      <div className="flex items-center justify-between gap-3 bg-navy px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-sand">
        <span>Email preview</span>
        <span className="text-coral">Not sent</span>
      </div>
      <div className="space-y-3 p-4 text-sm leading-relaxed">
        <dl className="space-y-1 border-b border-border pb-3 font-mono text-xs">
          <div className="flex gap-2"><dt className="w-14 text-muted-foreground">To</dt><dd className="break-all">{d.email || "your email address"}</dd></div>
          <div className="flex gap-2"><dt className="w-14 text-muted-foreground">From</dt><dd className="break-all">{CONTACT}</dd></div>
          <div className="flex gap-2"><dt className="w-14 text-muted-foreground">Subject</dt><dd>Nalanda Workshop 2026: registration request received</dd></div>
        </dl>
        <p>Dear {d.fullName || "participant"},</p>
        <p>
          We have received your registration request for the Nalanda Workshop 2026 on Logic, Computation, AI and Quantum
          Information Technologies, {DATES}, {VENUE}.
        </p>
        <p>Reference: <span className="font-mono">{d.reference ?? "assigned when you submit"}</span><br />
          {categoryLabel(d.category) || "Category not selected"}{d.affiliation ? `, ${d.affiliation}` : ""}</p>
        {d.submitAbstract && (
          <p>Abstract: {d.presentationTitle || "title pending"} ({d.format === "poster" ? "poster" : d.format === "oral" ? "oral" : "format pending"}). Abstract deadline: 30 November 2026.</p>
        )}
        <p>
          This is a request, not a confirmed seat. Seat availability{external ? ", the registration fee and payment instructions" : ""}
          {d.accommodation ? " and accommodation" : ""} will be communicated separately. Programme timings are in IST and subject to updates.
        </p>
        <p>Questions: {CONTACT}</p>
      </div>
      <p data-testid="text-email-notice" className="border-t border-border bg-muted px-4 py-3 text-xs text-muted-foreground">
        {sent
          ? "Sent."
          : "No email has been sent. This is a preview of the message you can expect; nothing is sent when you submit this form."}
      </p>
    </div>
  );
}
