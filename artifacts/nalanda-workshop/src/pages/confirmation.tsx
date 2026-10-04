import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { useGetRegistration, getGetRegistrationQueryKey } from "@workspace/api-client-react";
import { CalendarPlus, Printer } from "lucide-react";
import { CONTACT, DATES, VENUE, categoryLabel, img } from "@/lib/content";
import { EmailPreview } from "@/components/email-preview";

function setMeta(name: string, content: string) {
  let m = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  const prev = m?.content;
  if (!m) { m = document.createElement("meta"); m.name = name; document.head.appendChild(m); }
  m.content = content;
  return () => { if (prev === undefined) m?.remove(); else if (m) m.content = prev; };
}

function downloadIcs() {
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Nalanda Workshop 2026//EN", "BEGIN:VEVENT", "UID:nalanda-workshop-2026@nalandauniv.edu.in",
    "DTSTAMP:20260101T000000Z", "DTSTART;VALUE=DATE:20261219", "DTEND;VALUE=DATE:20261221",
    "SUMMARY:Nalanda Workshop 2026: Logic\\, Computation\\, AI and Quantum Information Technologies",
    "LOCATION:Nalanda University\\, Rajgir\\, Bihar\\, India",
    "DESCRIPTION:Programme subject to updates. Times in IST. Contact: " + CONTACT, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  a.download = "nalanda-workshop-2026.ics";
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function Confirmation() {
  const { token = "" } = useParams<{ token: string }>();
  const q = useGetRegistration(token, { query: { enabled: !!token, queryKey: getGetRegistrationQueryKey(token) } });
  useEffect(() => {
    const a = setMeta("robots", "noindex, nofollow, noarchive");
    const b = setMeta("referrer", "no-referrer");
    const t = document.title;
    document.title = "Registration request | Nalanda Workshop 2026";
    return () => { a(); b(); document.title = t; };
  }, []);
  const r = q.data;

  return (
    <div className="min-h-[100dvh] bg-ivory">
      <header className="no-print bg-navy"><div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3"><img src={img("nalanda-logo.png")} alt="Nalanda University" className="h-11 w-auto bg-ivory p-1.5" /></Link>
        <Link href="/" className="font-display text-lg uppercase tracking-wider text-sand">Workshop home</Link>
      </div></header>
      <main className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        {q.isLoading && <div className="space-y-4" aria-busy="true" data-testid="skeleton-receipt">{[40, 24, 64].map((h, i) => <div key={i} className="animate-pulse bg-sand/50" style={{ height: h * 2 }} />)}</div>}
        {q.isError && (
          <div role="alert" className="border-l-4 border-crimson bg-card p-6" data-testid="text-receipt-error">
            <h1 className="font-display text-4xl font-bold uppercase text-navy">Receipt not found</h1>
            <p className="mt-2">We could not retrieve this receipt. The link may be incomplete, or the connection failed.</p>
            <div className="mt-4 flex gap-3">
              <button onClick={() => q.refetch()} className="bg-crimson px-5 py-2 font-display text-lg font-bold uppercase text-ivory" data-testid="button-retry">Try again</button>
              <Link href="/#register" className="border border-navy px-5 py-2 font-display text-lg font-bold uppercase text-navy">Register</Link>
            </div>
          </div>
        )}
        {r && (
          <article data-testid="receipt">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-crimson">Request received · not yet a confirmed seat</p>
            <h1 className="mt-3 font-display text-5xl font-extrabold uppercase leading-[0.95] text-navy sm:text-7xl">Thank you, {r.fullName}.</h1>
            <p className="mt-4 text-lg">Your registration request has been stored. The organisers will follow up about your seat. No email has been sent.</p>

            <div className="mt-8 bg-navy p-6 text-ivory sm:p-8">
              <p className="font-mono text-xs uppercase tracking-widest text-sand">Receipt reference</p>
              <p className="mt-1 break-all font-mono text-3xl text-coral" data-testid="text-reference">{r.reference}</p>
              <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                {[
                  ["Name", r.fullName], ["Email", r.email], ["Category", categoryLabel(r.category)], ["Affiliation", r.affiliation],
                  ["Dates", DATES], ["Venue", VENUE],
                  ["Programme", "Day 1 from 10:00 IST, Day 2 from 10:00 IST (subject to updates)"],
                  ["Requested", new Date(r.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }) + " IST"],
                  ...(r.submitAbstract ? [["Abstract", `${r.presentationTitle ?? "Title pending"} (${r.format ?? "format pending"}), Day 1, 17:30 IST`]] : []),
                ].map(([k, v]) => <div key={k}><dt className="font-mono text-[11px] uppercase tracking-wider text-sand">{k}</dt><dd className="mt-0.5">{v}</dd></div>)}
              </dl>
            </div>

            <section className="mt-6 border border-border bg-card p-6" aria-labelledby="pending">
              <h2 id="pending" className="font-display text-2xl font-bold uppercase text-navy">Pending follow-up</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                <li>Seat: pending. Places are limited to 100 internal and 20-30 external participants.</li>
                <li>Fee: not yet specified. {r.category.startsWith("external") ? "External participants will be told the fee and how to pay." : "Internal participants will be informed if anything applies."}</li>
                <li>Accommodation: {r.accommodation ? "requested, pending availability." : "not requested."}</li>
              </ul>
              <p className="mt-3 text-sm">Questions: <a className="underline" href={`mailto:${CONTACT}`}>{CONTACT}</a></p>
            </section>

            <div className="no-print mt-6 flex flex-wrap gap-3">
              <button onClick={downloadIcs} className="flex items-center gap-2 bg-crimson px-5 py-3 font-display text-lg font-bold uppercase text-ivory" data-testid="button-calendar"><CalendarPlus className="h-5 w-5" aria-hidden="true" />Save to calendar</button>
              <button onClick={() => window.print()} className="flex items-center gap-2 border border-navy px-5 py-3 font-display text-lg font-bold uppercase text-navy" data-testid="button-print"><Printer className="h-5 w-5" aria-hidden="true" />Print confirmation</button>
            </div>

            <section className="mt-10" aria-labelledby="em">
              <h2 id="em" className="mb-3 font-display text-2xl font-bold uppercase text-navy">Email preview</h2>
              <EmailPreview d={{ ...r, reference: r.reference }} />
            </section>
            <p className="no-print mt-8 text-xs text-muted-foreground">This page is private to you. Keep the link safe; anyone holding it can view this receipt.</p>
          </article>
        )}
      </main>
    </div>
  );
}
