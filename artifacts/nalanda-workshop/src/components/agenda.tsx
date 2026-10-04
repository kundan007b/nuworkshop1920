import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DAYS, SESSIONS, TRACKS } from "@/lib/content";

export function Agenda() {
  const [day, setDay] = useState<1 | 2>(1);
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div>
      <div role="group" aria-label="Select workshop day" className="mb-6 grid grid-cols-2 border border-ivory/30 lg:hidden">
        {DAYS.map((d) => (
          <button key={d.day} aria-pressed={day === d.day} aria-controls={`agenda-day-${d.day}`} onClick={() => setDay(d.day)} data-testid={`tab-day-${d.day}`}
            className={`px-3 py-3 font-display text-lg font-bold uppercase tracking-wide ${day === d.day ? "bg-ivory text-navy" : "text-ivory"}`}>
            Day {d.day} · {d.short}
          </button>
        ))}
      </div>
      <div className="grid gap-12 lg:grid-cols-2">
        {DAYS.map((d) => (
          <div key={d.day} id={`agenda-day-${d.day}`} className={day === d.day ? "" : "hidden lg:block"}>
            <div className="border-b border-ivory/30 pb-4">
              <p className="font-mono text-xs uppercase tracking-widest text-coral">Day {d.day} · {d.date} 2026</p>
              <h3 className="mt-1 font-display text-3xl font-bold uppercase leading-none text-ivory">{d.theme}</h3>
            </div>
            <ul>
              {SESSIONS.filter((s) => s.day === d.day).map((s) => {
                const isOpen = open === s.id;
                const t = TRACKS[s.track];
                return (
                  <li key={s.id} className="border-b border-ivory/15">
                    <button onClick={() => setOpen(isOpen ? null : s.id)} aria-expanded={isOpen} aria-controls={`panel-${s.id}`} data-testid={`button-session-${s.id}`}
                      className="grid w-full grid-cols-[4.5rem_1fr_auto] items-start gap-3 py-4 text-left sm:grid-cols-[6rem_1fr_auto]">
                      <span className="pt-1 font-mono text-lg text-sand">{s.time}<span className="block text-[10px] uppercase tracking-widest text-ivory/50">IST</span></span>
                      <span>
                        <span className="block font-display text-2xl font-semibold uppercase leading-tight text-ivory">{s.title}</span>
                        {s.sub && <span className="mt-0.5 block text-sm text-ivory/70">{s.sub}</span>}
                        <span className="mt-2 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ivory/70">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: t.color }} aria-hidden="true" />Track: {t.label}
                        </span>
                      </span>
                      <ChevronDown className={`mt-2 h-5 w-5 text-sand transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                    </button>
                    {isOpen && (
                      <div id={`panel-${s.id}`} className="mb-4 ml-[4.5rem] border-l-2 pl-4 text-sm leading-relaxed text-ivory/85 sm:ml-[6rem]" style={{ borderColor: t.color }}>
                        <p>{s.detail}</p>
                        <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-sand">Programme subject to updates. Speakers per session not yet announced.</p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-wider text-ivory/70" aria-label="Track legend">
        {Object.entries(TRACKS).map(([k, t]) => <li key={k} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: t.color }} />{t.label}</li>)}
      </ul>
      <p className="mt-4 text-sm text-ivory/70">All times are Indian Standard Time (IST). This is the programme as currently planned and is subject to updates; it is not a final confirmed programme.</p>
    </div>
  );
}
