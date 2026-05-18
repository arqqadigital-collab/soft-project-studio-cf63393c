import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

type CompanyItem = { label: string; to?: string; href?: string };

const companyItems: CompanyItem[] = [
  { label: "About Us", to: "/about" },
  { label: "Our Team", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Partner Program", href: "#" },
];

const otherLinks = ["Products", "Solutions", "Clients", "Case Studies", "Contact"];

export function MainNav() {
  return (
    <nav className="hidden items-center gap-8 lg:flex">
      <a href="#" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
        Products
      </a>
      <a href="#" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
        Solutions
      </a>

      {/* Company dropdown */}
      <div className="group relative">
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-white"
        >
          Company
          <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
        </button>
        <div className="invisible absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--brand-dark)]/95 p-2 shadow-2xl backdrop-blur-md">
            {companyItems.map((item) =>
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

      {otherLinks.slice(2).map((link) => (
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
