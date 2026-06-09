import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

type MenuItem = { label: string; to?: string; href?: string };
type Menu = { label: string; items: MenuItem[] };

const menus: Menu[] = [
  {
    label: "Health Care",
    items: [
      { label: "Hospital & Clinical Systems", href: "#" },
      { label: "Specialized Clinical Modules", href: "#" },
      { label: "Patient Engagement & Identity", href: "#" },
      { label: "Medical Imaging", href: "#" },
      { label: "Revenue Cycle & Financial Performance", href: "#" },
      { label: "Compliance & Interoperability", href: "#" },
      { label: "Healthcare AI", href: "#" },
    ],
  },
  {
    label: "ERP & Business",
    items: [
      { label: "ERP Platforms", href: "#" },
      { label: "Business Verticals (ERP)", href: "#" },
    ],
  },
  {
    label: "Services",
    items: [
      { label: "Cybersecurity", href: "#" },
      { label: "Consulting", href: "#" },
      { label: "Implementation & Integration", href: "#" },
      { label: "Staff Aug & Managed Services", href: "#" },
      { label: "Learning & Knowledge", href: "#" },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "About Us", to: "/about" },
      { label: "Our Team", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Partner Program", href: "#" },
    ],
  },
];

const simpleLinks = ["Clients", "Case Studies", "Contact"];

export function MainNav() {
  return (
    <nav className="hidden items-center gap-8 lg:flex">
      {menus.map((menu) => (
        <div key={menu.label} className="group relative">
          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            {menu.label}
            <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
          </button>
          <div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--brand-dark)]/95 p-2 shadow-2xl backdrop-blur-md">
              {menu.items.map((item) =>
                item.to ? (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="block rounded-lg px-4 py-2.5 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block rounded-lg px-4 py-2.5 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {item.label}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      ))}

      {simpleLinks.map((link) => (
        <a
          key={link}
          href="#"
          className="text-sm font-medium text-white/80 transition-colors hover:text-white"
        >
          {link}
        </a>
      ))}
    </nav>
  );
}
