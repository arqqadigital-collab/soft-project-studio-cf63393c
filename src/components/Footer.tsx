import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

type FooterLink = { label: string; to?: string; href?: string };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Solutions",
    links: [
      { label: "Digital Strategy", href: "#" },
      { label: "Cloud Infrastructure", href: "#" },
      { label: "Data Analytics", href: "#" },
      { label: "Cybersecurity", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Our Team", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Partner Program", href: "#" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Support Portal", href: "#" },
      { label: "Sales Inquiry", href: "#" },
      { label: "Media Resources", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      className="px-6 py-16 md:px-12 md:py-20"
      style={{ background: "var(--brand-blue)" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <img
              src={logo}
              alt="SBS — Superior Business Solutions"
              className="h-14 w-auto brightness-0 invert"
            />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/80">
              Empowering businesses with next-generation technology solutions. We turn complex
              challenges into clear, actionable digital strategies.
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                {col.title}
              </h3>
              <ul className="mt-6 space-y-4">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="text-base text-white/85 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-base text-white/85 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-white/20 pt-8 text-center">
          <p className="text-sm text-white/80">
            © {new Date().getFullYear()} Superior Business Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
