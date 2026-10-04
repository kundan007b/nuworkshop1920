import { useId, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import type { CommitteeProfile } from "@/lib/committee-profiles";

export function ExpandableProfile({ name, profile, children, roomy = false, testId }: {
  name: string;
  profile: CommitteeProfile;
  children: (open: boolean) => ReactNode;
  roomy?: boolean;
  testId?: string;
}) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [manual, setManual] = useState<boolean | null>(null);
  const open = manual ?? (hovered || focused);

  return (
    <div className={`border bg-card transition-[border-color,box-shadow] duration-300 ${open ? "border-crimson/60 shadow-md" : "border-border"}`}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse" && window.matchMedia("(hover: hover)").matches) setHovered(true);
      }}
      onPointerLeave={() => {
        setHovered(false);
        setManual((value) => value === false ? null : value);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocused(false);
          setManual((value) => value === false ? null : value);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          trigger.current?.focus();
          setManual(false);
          setFocused(false);
        }
      }}>
      <button ref={trigger} type="button" id={`${id}-trigger`} aria-expanded={open} aria-controls={`${id}-panel`}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) setFocused(true);
        }}
        onClick={() => setManual(!open)}
        className={`flex w-full items-center gap-4 text-left ${roomy ? "p-5" : "p-3"}`}
        data-testid={testId ?? `committee-profile-${name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}>
        {children(open)}
        <ChevronDown aria-hidden="true" className={`h-4 w-4 shrink-0 text-crimson transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-trigger`} aria-hidden={!open} inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="min-h-0 overflow-hidden">
          <div className={`border-t border-sand/70 pb-4 pt-4 ${roomy ? "mx-5" : "mx-3"}`}>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Designation</p>
            <p className="mt-1 text-sm font-semibold text-navy">{profile.designation}</p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Areas of work</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {profile.areas.map((area) => <li key={area} className="border border-sand bg-ivory px-2 py-1 text-xs leading-snug text-navy">{area}</li>)}
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{profile.summary}</p>
            <a href={profile.source} target="_blank" rel="noopener noreferrer"
              aria-label={`${profile.sourceLabel} for ${name} (opens in a new tab)`}
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-crimson underline underline-offset-4 hover:text-navy">
              {profile.sourceLabel}<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}