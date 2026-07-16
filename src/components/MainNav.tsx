import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useNavTree } from "@/lib/navTree";

type MenuItem = {
  id: string;
  label: string;
  to?: string;
  href?: string;
  description?: string;
  items?: MenuItem[];
};
type Menu = { id: string; label: string; items: MenuItem[] };

function LeafLink({
  item,
  className,
  children,
}: {
  item: MenuItem;
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
    <a href={item.href ?? "#"} className={className}>
      {children}
    </a>
  );
}

function MegaPanel({ menu }: { menu: Menu }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = menu.items[activeIdx];
  const hasRightPanel = menu.items.some((i) => i.items && i.items.length > 0);

  if (!hasRightPanel) {
    return (
      <div className="grid grid-cols-1 gap-2 p-4">
        {menu.items.map((item) => (
          <LeafLink
            key={item.id}
            item={item}
            className="group/leaf flex flex-col gap-1 rounded-xl p-3 transition-colors hover:bg-white/10"
          >
            <span className="text-sm font-semibold text-white">{item.label}</span>
            {item.description && (
              <span className="text-xs text-white/60">{item.description}</span>
            )}
          </LeafLink>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[minmax(280px,1fr)_minmax(320px,1.2fr)]">
      <div className="space-y-1 border-r border-white/10 bg-white/[0.02] p-3">
        {menu.items.map((item, idx) => {
          const isActive = idx === activeIdx;
          const hasChildren = item.items && item.items.length > 0;
          const content = (
            <>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">{item.label}</div>
                {item.description && (
                  <div className="mt-0.5 text-xs text-white/60">{item.description}</div>
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
          const className = `flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${
            isActive ? "bg-white/10" : "hover:bg-white/5"
          }`;

          if (hasChildren) {
            return (
              <button
                key={item.id}
                type="button"
                onMouseEnter={() => setActiveIdx(idx)}
                onFocus={() => setActiveIdx(idx)}
                className={className}
              >
                {content}
              </button>
            );
          }

          return (
            <LeafLink
              key={item.id}
              item={item}
              className={className}
            >
              {content}
            </LeafLink>
          );
        })}
      </div>
      <div className="p-3" onMouseEnter={() => { /* keep active */ }}>
        {active.items && active.items.length > 0 ? (
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
            {active.description}
          </div>
        )}
      </div>
    </div>
  );
}

export function MainNav() {
  const { data: tree = [] } = useNavTree();
  const menus: Menu[] = tree
    .filter((group) => group.is_visible)
    .map((group) => ({
      id: group.id,
      label: group.label,
      items: group.sections
        .filter((section) => section.is_visible)
        .map((section) => {
          const pageItems: MenuItem[] = section.pages
            .filter((page) => page.status === "published")
            .map((page) => ({
              id: `page-${page.id}`,
              label: page.nav_label || page.title,
              to: `/p/${page.slug}`,
              position: page.position,
            } as MenuItem & { position: number }));
          const customItems: MenuItem[] = section.customItems
            .filter((item) => item.is_visible)
            .map((item) => ({
              id: `custom-${item.id}`,
              label: item.label,
              ...(item.item_type === "external" ? { href: item.url } : { to: item.url }),
              position: item.position,
            } as MenuItem & { position: number }));
          const items = [...pageItems, ...customItems]
            .sort((a, b) => ((a as MenuItem & { position: number }).position - (b as MenuItem & { position: number }).position));

          return {
            id: section.id,
            label: section.label,
            description: section.description ?? undefined,
            ...(items.length > 0
              ? { items }
              : section.href
                ? (/^https?:\/\//i.test(section.href) ? { href: section.href } : { to: section.href })
                : {}),
          };
        }),
    }))
    .filter((menu) => menu.items.length > 0);

  return (
    <nav className="hidden items-center gap-8 lg:flex">
      {menus.map((menu) => {
        const hasRightPanel = menu.items.some((i) => i.items && i.items.length > 0);
        const width = hasRightPanel ? "w-[640px]" : "w-[360px]";

        // Simple top-level link: single section that is a leaf link
        if (menu.items.length === 1 && !menu.items[0].items) {
          const only = menu.items[0];
          const className =
            "inline-flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-white";
          if (only.to) {
            return (
              <Link key={menu.id} to={only.to} className={className}>
                {menu.label}
              </Link>
            );
          }
          return (
            <a key={menu.id} href={only.href ?? "#"} className={className}>
              {menu.label}
            </a>
          );
        }

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
