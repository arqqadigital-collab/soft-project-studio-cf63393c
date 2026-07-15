import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useNavTree, type NavTreeGroup } from "@/lib/navTree";

function LeafLink({
  to, className, children,
}: { to: string; className: string; children: React.ReactNode }) {
  const isExternal = to.startsWith("http");
  if (isExternal) {
    return (
      <a href={to} className={className} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

function MegaPanel({ group }: { group: NavTreeGroup }) {
  const sections = group.sections.filter((s) => s.is_visible);
  const [activeIdx, setActiveIdx] = useState(0);
  const active = sections[activeIdx];
  const hasChildrenAnywhere = sections.some((s) => s.pages.length > 0);

  if (!sections.length) {
    return <div className="p-4 text-sm text-white/60">No items.</div>;
  }

  if (!hasChildrenAnywhere) {
    return (
      <div className="grid grid-cols-1 gap-2 p-4">
        {sections.map((s) => (
          <LeafLink
            key={s.id}
            to={s.href || "#"}
            className="group/leaf flex flex-col gap-1 rounded-xl p-3 transition-colors hover:bg-white/10"
          >
            <span className="text-sm font-semibold text-white">{s.label}</span>
            {s.description && <span className="text-xs text-white/60">{s.description}</span>}
          </LeafLink>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[minmax(280px,1fr)_minmax(320px,1.2fr)]">
      <div className="space-y-1 border-r border-white/10 bg-white/[0.02] p-3">
        {sections.map((s, idx) => {
          const isActive = idx === activeIdx;
          const hasChildren = s.pages.length > 0;
          const inner = (
            <>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">{s.label}</div>
                {s.description && (
                  <div className="mt-0.5 text-xs text-white/60">{s.description}</div>
                )}
              </div>
              {hasChildren && (
                <ChevronRight
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive ? "text-white" : "text-white/40"
                  }`}
                />
              )}
            </>
          );
          const cls = `flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${
            isActive ? "bg-white/10" : "hover:bg-white/5"
          }`;
          if (hasChildren) {
            return (
              <button
                key={s.id}
                type="button"
                onMouseEnter={() => setActiveIdx(idx)}
                onFocus={() => setActiveIdx(idx)}
                className={cls}
              >
                {inner}
              </button>
            );
          }
          return (
            <LeafLink key={s.id} to={s.href || "#"} className={cls}>
              {inner}
            </LeafLink>
          );
        })}
      </div>
      <div className="p-3">
        {active && active.pages.length > 0 ? (
          <div className="space-y-1">
            <div className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-white/40">
              {active.label}
            </div>
            {active.pages
              .filter((p) => p.status === "published")
              .map((p) => (
                <Link
                  key={p.id}
                  to={`/p/${p.slug}`}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {p.nav_label || p.title}
                </Link>
              ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-white/50">
            {active?.description}
          </div>
        )}
      </div>
    </div>
  );
}

export function MainNav() {
  const { data } = useNavTree();
  const groups = (data ?? []).filter((g) => g.is_visible);

  return (
    <nav className="hidden items-center gap-8 lg:flex">
      {groups.map((group) => {
        const hasChildren = group.sections.some((s) => s.pages.length > 0);
        const width = hasChildren ? "w-[640px]" : "w-[360px]";
        return (
          <div key={group.id} className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {group.label}
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
            </button>
            <div
              className={`invisible absolute left-1/2 top-full z-50 ${width} -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100`}
            >
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--brand-dark)]/95 shadow-2xl backdrop-blur-md">
                <MegaPanel group={group} />
              </div>
            </div>
          </div>
        );
      })}

      <Link
        to="/contact"
        className="text-sm font-medium text-white/80 transition-colors hover:text-white"
      >
        Contact
      </Link>
    </nav>
  );
}
