import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

type MenuItem = {
  label: string;
  to?: string;
  href?: string;
  items?: MenuItem[];
};
type Menu = { label: string; items: MenuItem[] };

const menus: Menu[] = [
  {
    label: "Health Care",
    items: [
      {
        label: "Hospital & Clinical Systems",
        items: [
          { label: "Hospital Information System (HIS)", href: "#" },
          { label: "Clinic Management System", href: "#" },
          { label: "Dental Management Suite", href: "#" },
          { label: "Laboratory Information System (LIS)", href: "#" },
          { label: "Radiology Information System (RIS)", href: "#" },
          { label: "Emergency Department Management", href: "#" },
          { label: "Physiotherapy & Rehabilitation", href: "#" },
        ],
      },
      {
        label: "Specialized Clinical Modules",
        items: [
          { label: "Blood Bank & Donor Management", href: "#" },
          { label: "Medication & Dosage Management", href: "#" },
          { label: "Telemedicine & Virtual Care", href: "#" },
          { label: "Hospital Operations & RTLS", href: "#" },
        ],
      },
      { label: "Patient Engagement & Identity", href: "#" },
      {
        label: "Medical Imaging",
        items: [
          { label: "PACS & Medical Archiving", href: "#" },
          { label: "AI for Medical Imaging", href: "#" },
        ],
      },
      { label: "Revenue Cycle & Financial Performance", href: "#" },
      {
        label: "Compliance & Interoperability",
        items: [
          { label: "KSA Compliance & Interoperability", href: "#" },
          { label: "UAE Compliance & Interoperability", href: "#" },
        ],
      },
      {
        label: "Healthcare AI",
        items: [
          { label: "Clinical AI & Documentation", href: "#" },
          { label: "EMRAM Roadmap & AI Readiness", href: "#" },
        ],
      },
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

const itemClass =
  "block rounded-lg px-4 py-2.5 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white";

function renderLeaf(item: MenuItem) {
  if (item.to) {
    return (
      <Link key={item.label} to={item.to} className={itemClass}>
        {item.label}
      </Link>
    );
  }
  return (
    <a key={item.label} href={item.href ?? "#"} className={itemClass}>
      {item.label}
    </a>
  );
}

function SubMenuItem({ item }: { item: MenuItem }) {
  return (
    <div key={item.label} className="group/sub relative">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 rounded-lg px-4 py-2.5 text-left text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
      >
        <span>{item.label}</span>
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
      <div className="invisible absolute left-full top-0 z-50 w-72 pl-2 opacity-0 transition-all duration-200 group-hover/sub:visible group-hover/sub:opacity-100">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--brand-dark)]/95 p-2 shadow-2xl backdrop-blur-md">
          {item.items!.map((sub) => renderLeaf(sub))}
        </div>
      </div>
    </div>
  );
}

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
          <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--brand-dark)]/95 p-2 shadow-2xl backdrop-blur-md">
              {menu.items.map((item) =>
                item.items ? (
                  <SubMenuItem key={item.label} item={item} />
                ) : (
                  renderLeaf(item)
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
