import { COMMITTEE_PHOTOS, img, initials } from "@/lib/content";
import { COMMITTEE_PROFILES } from "@/lib/committee-profiles";
import { ExpandableProfile } from "@/components/expandable-profile";

export function CommitteeCard({ name, role }: { name: string; role: string }) {
  const profile = COMMITTEE_PROFILES[name];
  const identity = (open: boolean) => (
    <>
      {COMMITTEE_PHOTOS[name] ? (
        <img src={img(COMMITTEE_PHOTOS[name])} alt="" loading="lazy" width={64} height={64}
          className="h-16 w-16 shrink-0 rounded-full object-cover object-top ring-2 ring-crimson" />
      ) : (
        <span aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-navy font-display text-lg font-bold text-sand">{initials(name)}</span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-navy">{name}</span>
        <span className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{role}</span>
        {profile && <span className="mt-1 block text-xs text-crimson">{open ? "Hide profile" : "Explore profile"}</span>}
      </span>
    </>
  );

  // Student coordinator cards stay informational, without empty interactive controls.
  if (!profile) {
    return <li className="flex items-center gap-4 border border-border bg-card p-3">{identity(false)}</li>;
  }

  return <li><ExpandableProfile name={name} profile={profile}>{identity}</ExpandableProfile></li>;
}