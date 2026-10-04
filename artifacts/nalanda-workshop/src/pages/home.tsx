import { useEffect, useState } from "react";
import { Calendar, MapPin, Menu, X, Check } from "lucide-react";
import { CONTACT, CONVENERS, MEMBERS, SPEAKERS, STUDENTS, img, initials } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { Agenda } from "@/components/agenda";
import { RegistrationForm } from "@/components/registration-form";
import { CommitteeCard } from "@/components/committee-card";
import { ExpandableProfile } from "@/components/expandable-profile";
import { SPEAKER_PROFILES } from "@/lib/speaker-profiles";

const NAV = [["about", "About"], ["speakers", "Speakers"], ["committee", "Committee"], ["schedule", "Agenda"], ["register", "Register"]];

export default function Home() {
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    document.title = "Nalanda Workshop 2026 | Logic, Computation, AI and Quantum Information Technologies";
    const k = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  return (
    <div>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[60] focus:bg-ivory focus:p-2">Skip to content</a>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-sand/20 bg-navy/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-3" data-testid="link-home">
            <img src={img("nalanda-logo.png")} alt="Nalanda University" className="h-11 w-auto bg-ivory p-1.5" />
            <span className="hidden border-l border-sand/30 pl-3 font-display text-lg font-semibold uppercase tracking-wider text-sand sm:block">Workshop 2026</span>
          </a>
          <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
            {NAV.slice(0, 4).map(([id, l]) => <a key={id} href={`#${id}`} className="font-display text-lg uppercase tracking-wider text-ivory/80 hover:text-coral">{l}</a>)}
            <a href="#register" className="bg-crimson px-4 py-1.5 font-display text-lg font-bold uppercase tracking-wider text-ivory hover:bg-coral hover:text-navy" data-testid="link-nav-register">Register</a>
          </nav>
          <button className="p-2 text-ivory md:hidden" aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu} aria-controls="mobile-nav" onClick={() => setMenu(!menu)} data-testid="button-menu">
            {menu ? <X /> : <Menu />}
          </button>
        </div>
        {menu && (
          <nav id="mobile-nav" aria-label="Mobile" className="border-t border-sand/20 bg-navy px-4 pb-5 md:hidden">
            {NAV.map(([id, l]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)} className="block border-b border-sand/10 py-3 font-display text-2xl uppercase tracking-wide text-ivory">{l}</a>)}
          </nav>
        )}
      </header>

      <main id="main">
        <section id="top" className="grain relative overflow-hidden bg-navy pt-16 text-ivory">
          <div className="pattern absolute inset-0" />
          <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pt-24">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-coral">Series of Workshop · Nalanda University x AI Club</p>
            <h1 className="mt-5 max-w-5xl font-display text-[3.4rem] font-extrabold uppercase leading-[0.92] sm:text-8xl lg:text-[9rem]">
              Logic, Computation, AI <span className="text-sand">and</span> Quantum Information Technologies
            </h1>
            <p className="mt-6 max-w-2xl border-l-4 border-crimson pl-4 text-xl text-ivory/85 sm:text-2xl">Changing interface of Science, Society and Policy</p>
             <p className="mt-5 max-w-3xl text-base leading-relaxed text-sand sm:text-lg">Jointly hosted by the School of Information Sciences &amp; Technology and the Department of Maths.</p>
            <div className="mt-8 flex flex-col gap-3 text-lg sm:flex-row sm:gap-8">
              <span className="flex items-center gap-2"><Calendar className="h-5 w-5 text-coral" aria-hidden="true" />19th &amp; 20th December 2026</span>
              <span className="flex items-center gap-2"><MapPin className="h-5 w-5 text-coral" aria-hidden="true" />Nalanda University, Rajgir, Bihar, India</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#register" className="bg-crimson px-8 py-3.5 font-display text-xl font-bold uppercase tracking-wider hover:bg-coral hover:text-navy" data-testid="link-hero-register">Register for workshop</a>
              <a href="#schedule" className="border border-sand/50 px-8 py-3.5 font-display text-xl font-bold uppercase tracking-wider text-sand hover:bg-sand hover:text-navy">View agenda</a>
            </div>
          </div>
          <div className="relative">
            <img src={img("campus.jpg")} alt="Nalanda University campus at dusk" className="h-44 w-full object-cover sm:h-72 lg:h-96" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
            <Reveal>
              <h2 className="font-display text-5xl font-bold uppercase leading-none text-navy sm:text-6xl">About the Workshop</h2>
              <p className="mt-6 text-lg leading-relaxed">We are pleased to propose a series of orientation programs for the students of STPS, Mathematics and Data Sciences. This workshop aims to expose students of mixed backgrounds systematically to the broader perspective of their course contents.</p>
              <p className="mt-4 text-lg leading-relaxed">The workshop is expected to bring together interdisciplinary scholarship, experts, and policymakers to discuss the transformative potential of Logic, Computation and AI, Quantum Technologies, and how India is setting the trajectory in line with PSA's Mega Science Vision 2035.</p>
            </Reveal>
            <Reveal delay={120} className="bg-navy p-8 text-ivory">
              <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-sand">Key Themes</h3>
              <ul className="mt-5 space-y-5">
                {["Foundational questions pertaining to Logic, Computation and AI", "Theoretical basis of quantum information technologies", "Policy issues involved in the Big Money sciences and India's Scientific Future"].map((t, i) => (
                  <li key={t} className="flex gap-4"><span className="font-mono text-coral">0{i + 1}</span><span>{t}</span></li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section id="speakers" className="bg-sand/40 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="font-display text-5xl font-bold uppercase text-navy sm:text-6xl">Distinguished Speakers</h2>
            <ul className="mt-10 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SPEAKERS.map((s, i) => (
                <li key={s.name}>
                  <Reveal delay={i * 60}>
                    <ExpandableProfile name={s.name} profile={SPEAKER_PROFILES[s.name]} roomy testId={`card-speaker-${i}`}>
                      {(open) => <>
                        {s.photo ? <img src={img(s.photo)} alt="" loading="lazy" width={96} height={96} className="h-24 w-24 shrink-0 rounded-full object-cover object-top ring-2 ring-crimson" /> : <span aria-hidden="true" className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-navy font-display text-3xl font-bold text-sand">{initials(s.name)}</span>}
                        <span className="min-w-0 flex-1">
                          <span role="heading" aria-level={3} className="block font-display text-2xl font-bold uppercase leading-tight text-navy">{s.name}</span>
                          <span className="block font-mono text-xs uppercase tracking-wider text-crimson">{s.role}</span>
                          <span className="mt-1 block text-sm leading-snug text-muted-foreground">{s.org}</span>
                          <span className="mt-2 block text-xs text-crimson">{open ? "Hide profile" : "Explore profile"}</span>
                        </span>
                      </>}
                    </ExpandableProfile>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="committee" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <h2 className="font-display text-5xl font-bold uppercase text-navy sm:text-6xl">Organizing Committee</h2>
          <p className="mt-3 text-sm text-muted-foreground">Discover our conveners and organizing members. Hover over a faculty card, or tap to expand their profile.</p>
          <div className="mt-10 grid gap-10 lg:grid-cols-3">
            {([["Conveners", CONVENERS, "Convener"], ["Organizing Members", MEMBERS, "Organizing Member"], ["Student Coordinators", STUDENTS, "Student Coordinator"]] as const).map(([h, list, role]) => (
              <div key={h}>
                <h3 className="border-b-2 border-crimson pb-2 font-display text-2xl font-bold uppercase text-crimson">{h}</h3>
                <ul className="mt-4 space-y-3">
                  {list.map((n) => (
                    <CommitteeCard key={n} name={n} role={role} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="schedule" className="grain relative bg-navy py-20">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="mb-10 font-display text-5xl font-bold uppercase text-ivory sm:text-6xl">Workshop Agenda</h2>
            <Agenda />
          </div>
        </section>

        <section id="register" className="bg-ivory py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="font-display text-5xl font-bold uppercase text-navy sm:text-6xl">Join the Conversation</h2>
            <p className="mt-4 text-lg">Limited to 100 on-campus and 20-30 off-campus participants. Registration is on a first-come, first-served basis.</p>
            <div className="mt-8 border-l-4 border-crimson bg-sand/40 p-6">
              <h3 className="font-display text-xl font-bold uppercase text-navy">Important Guidelines</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  <><strong>Abstract Submission:</strong> Abstracts must be strictly under 300 words. The deadline for submission is <strong>November 30, 2026</strong>.</>,
                  <><strong>Presentations:</strong> Oral presentations are scheduled for 15 minutes (10 min talk + 5 min Q&amp;A). Posters should be standard A0 size (portrait orientation).</>,
                  <><strong>Registration Fee:</strong> A nominal fee applies to external participants. Payment instructions will be emailed upon form submission.</>,
                  <><strong>Accommodation:</strong> Limited shared accommodation is available for external participants and is allotted strictly on a first-come basis.</>,
                ].map((c, i) => <li key={i} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-crimson" aria-hidden="true" /><span>{c}</span></li>)}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">Submitting this form records a request only. Seat allocation, fee and accommodation are followed up separately.</p>
            </div>
            <div className="mt-8 border border-border bg-card p-5 sm:p-8"><RegistrationForm /></div>
          </div>
        </section>
      </main>

      <footer className="bg-navy py-12 text-ivory/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-end md:justify-between">
          <div>
            <img src={img("nalanda-logo.png")} alt="Nalanda University" className="h-12 w-auto bg-ivory p-1.5" />
            <h4 className="mt-6 font-display text-2xl font-bold uppercase text-sand">Venue &amp; Contact</h4>
            <p>Nalanda University, Rajgir, Bihar, India</p>
            <p className="mt-2 text-sm">For inquiries: <a className="underline" href={`mailto:${CONTACT}`}>{CONTACT}</a></p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <img src={img("ai-club-mark.svg")} alt="AI Club" className="h-12 w-12" />
            <div>
              <p className="font-display text-lg font-bold uppercase tracking-wide text-sand">Powered by AI Club</p>
              <p className="mt-1">© 2026 Nalanda University Workshop. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
