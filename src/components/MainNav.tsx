import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useMenuTree } from "@/lib/menuTree";
import { useLocale } from "@/i18n/LanguageProvider";
import { localizePath, useRouteMap } from "@/lib/routeMap";

type Leaf = {
  id: string;
  label: string;
  to?: string;
  href?: string;
};
type Column = { id: string; label: string; description?: string | null; items: Leaf[] };
type Menu = { id: string; label: string; columns: Column[] };



function isExternal(url: string | null | undefined) {
  return !!url && /^https?:\/\//i.test(url);
}

function LeafLink({
  item,
  className,
  children,
}: {
  item: Leaf;
  className: string;
  children: React.ReactNode;
}) {
  if (item.to) {
    return (
      <Link to={item.to} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={item.href ?? "#"}
      target={isExternal(item.href) ? "_blank" : undefined}
      rel={isExternal(item.href) ? "noreferrer" : undefined}
      className={className}
    >
      {children}
    </a>
  );
}

function MegaPanel({ menu }: { menu: Menu }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = menu.columns[activeIdx];
  const hasRightPanel = menu.columns.some((c) => c.items.length > 0);

  if (!hasRightPanel) {
    return (
      <div className="grid grid-cols-1 gap-2 p-4">
        {menu.columns.map((c) => (
          <div key={c.id} className="rounded-xl p-3 text-sm font-semibold text-white/80">
            {c.label}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[minmax(280px,1fr)_minmax(320px,1.2fr)] rtl:grid-cols-[minmax(320px,1.2fr)_minmax(280px,1fr)]">
      <div className="space-y-1 border-e border-white/10 bg-white/[0.02] p-3 rtl:order-2">

        {menu.columns.map((c, idx) => {
          const isActive = idx === activeIdx;
          return (
            <button
              key={c.id}
              type="button"
              onMouseEnter={() => setActiveIdx(idx)}
              onFocus={() => setActiveIdx(idx)}
              className={`flex w-full items-start gap-3 rounded-xl p-3 text-start transition-colors ${
                isActive ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-white">{c.label}</div>
                {c.description ? (
                  <div className="mt-0.5 line-clamp-2 text-xs text-white/50">{c.description}</div>
                ) : null}
              </div>
              {c.items.length > 0 && (
                <ChevronRight
                  className={`mt-1 h-4 w-4 shrink-0 transition-colors ${
                    isActive ? "text-white" : "text-white/40"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
      <div className="p-3 rtl:order-1">
        {active && active.items.length > 0 ? (
          <div className="space-y-1">
            <div className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-white/40">
              {active.label}
            </div>
            {active.items.map((sub) => (
              <LeafLink
                key={sub.id}
                item={sub}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
              >
                {sub.label}
              </LeafLink>
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-white/50">
            No pages yet
          </div>
        )}
      </div>
    </div>
  );
}

export function MainNav() {
  const { data: tree = [] } = useMenuTree();
  const { locale } = useLocale();
  const { data: routeMap } = useRouteMap();

  const menus: Menu[] = tree
    .filter((g) => g.is_visible)
    .map((g) => ({
      id: g.id,
      label: g.label,
      columns: g.columns
        .filter((c) => c.is_visible)
        .map((c) => ({
          id: c.id,
          label: c.label,
          description: c.description,
          items: c.items
            .map<Leaf | null>((it) => {
              if (it.kind === "page") {
                const p = it.page;
                if (p.status !== "published" || !p.route_path) return null;
                const leaf: Leaf = { id: p.id, label: p.nav_label || p.title };
                if (isExternal(p.route_path)) leaf.href = p.route_path;
                else leaf.to = localizePath(p.route_path, locale, routeMap);
                return leaf;
              }
              const l = it.link;
              if (!l.is_visible) return null;
              const leaf: Leaf = { id: l.id, label: l.label };
              if (l.target === "_blank" || isExternal(l.url)) leaf.href = l.url;
              else if (l.url.startsWith("/")) leaf.to = localizePath(l.url, locale, routeMap);
              else leaf.href = l.url;
              return leaf;
            })
            .filter((x): x is Leaf => x !== null),
        })),
    }))
    .filter((m) => m.columns.length > 0);

  return (
    <nav className="hidden items-center gap-8 lg:flex">
      {menus.map((menu) => {
        const totalItems = menu.columns.reduce((n, c) => n + c.items.length, 0);
        // Render as a plain link when the group is just a single link.
        if (menu.columns.length === 1 && totalItems === 1) {
          const leaf = menu.columns[0].items[0];
          return (
            <LeafLink
              key={menu.id}
              item={leaf}
              className="text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {menu.label}
            </LeafLink>
          );
        }
        const hasRightPanel = menu.columns.some((c) => c.items.length > 0);
        const width = hasRightPanel ? "w-[640px]" : "w-[360px]";
        return (
          <div key={menu.id} className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {menu.label}
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
            </button>
            <div
              className={`invisible absolute left-1/2 top-full z-50 ${width} -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100`}
            >
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--brand-dark)]/95 shadow-2xl backdrop-blur-md">
                <MegaPanel menu={menu} />
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
