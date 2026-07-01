import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

type MenuItem = {
  label: string;
  to?: string;
  href?: string;
  description?: string;
  items?: MenuItem[];
};
type Menu = { label: string; items: MenuItem[] };

const menus: Menu[] = [
  {
    label: "HealthCare",
    items: [
      {
        label: "Hospital & Clinical Systems",
        description: "Core hospital and clinic platforms",
        items: [
          { label: "Hospital Information System (HIS)", to: "/healthcare/his" },
          { label: "Clinic Management System", href: "#" },
          { label: "Dental Management Suite", to: "/healthcare/dental" },
          { label: "Laboratory Information System (LIS)", to: "/healthcare/lis" },
          { label: "Radiology Information System (RIS)", to: "/healthcare/ris" },
          { label: "Revenue Cycle Management (RCM)", to: "/healthcare/rcm" },
          { label: "Emergency Department Management", href: "#" },
          { label: "Physiotherapy & Rehabilitation", href: "#" },
        ],
      },
      {
        label: "Specialized Clinical Modules",
        description: "Targeted modules for specialized care",
        items: [
          { label: "Blood Bank & Donor Management", to: "/healthcare/blood-bank" },
          { label: "Medication & Dosage Management", to: "/healthcare/medication-dosage" },
          { label: "Telemedicine & Virtual Care", href: "#" },
          { label: "Hospital Operations & RTLS", href: "#" },
        ],
      },
      {
        label: "Medical Imaging",
        description: "PACS, archiving and AI imaging",
        items: [
          { label: "PACS & Medical Archiving", to: "/healthcare/pacs" },
          { label: "AI for Medical Imaging", to: "/healthcare/ai-imaging" },
        ],
      },
      {
        label: "Compliance & Interoperability",
        description: "Regional compliance and standards",
        items: [
          { label: "KSA Compliance & Interoperability", href: "#" },
          { label: "UAE Compliance & Interoperability", to: "/healthcare/uae-compliance" },
        ],
      },
      {
        label: "Healthcare AI",
        description: "Clinical AI and readiness",
        items: [
          { label: "Clinical AI & Documentation", href: "#" },
          { label: "EMRAM Roadmap & AI Readiness", to: "/healthcare/emram" },
        ],
      },
      {
        label: "Patient Engagement & Identity",
        description: "Patient portals and identity management",
        items: [
          { label: "Patient Engagement & Identity", href: "#" },
        ],
      },
      {
        label: "Revenue Cycle & Financial Performance",
        description: "Billing and financial operations",
        items: [
          { label: "Revenue Cycle & Financial Performance", href: "#" },
        ],
      },
    ],
  },
  {
    label: "ERP & Business",
    items: [
      {
        label: "ERP Platforms",
        description: "Enterprise resource planning suites",
        items: [
          { label: "Microsoft Dynamics 365 Business Central", to: "/erp/dynamics-365" },
          { label: "Odoo", to: "/erp/odoo" },
          { label: "Zoho", to: "/erp/zoho" },
        ],
      },
      {
        label: "Business Verticals (ERP)",
        description: "Industry-tailored ERP solutions",
        items: [
          { label: "Manufacturing & Trading", to: "/erp/manufacturing" },
          { label: "Logistics & Distribution", to: "/erp/logistics" },
          { label: "Retail & E-commerce", href: "#" },
          { label: "Education & Research", href: "#" },
        ],
      },
    ],
  },
  {
    label: "Services",
    items: [
      { label: "Cybersecurity", to: "/services/cybersecurity", description: "Protect your digital estate" },
      { label: "Consulting", to: "/services/consulting", description: "Strategy and advisory" },
      { label: "Implementation & Integration", to: "/services/implementation", description: "Deploy and integrate" },
      { label: "Staff Aug & Managed Services", to: "/services/staff-aug", description: "Talent and managed ops" },
      { label: "Learning & Knowledge", href: "#", description: "Enablement and training" },
    ],
  },
  {
    label: "Company",
    items: [
      {
        label: "Company",
        description: "Our story and mission",
        items: [
          { label: "About Us", to: "/about" },
          { label: "Careers", href: "#" },
        ],
      },
      {
        label: "Resources",
        description: "Insights and updates",
        items: [
        { label: "Blog", to: "/blog" },
        { label: "Case Studies", to: "/case-studies" },
        { label: "Events & Webinars", href: "#" },
        ],
      },
    ],
  },
];

const simpleLinks = ["Contact"];

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
            key={item.label}
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
                key={item.label}
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
              key={item.label}
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
                key={sub.label}
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
  return (
    <nav className="hidden items-center gap-8 lg:flex">
      {menus.map((menu) => {
        const hasRightPanel = menu.items.some((i) => i.items && i.items.length > 0);
        const width = hasRightPanel ? "w-[640px]" : "w-[360px]";
        return (
          <div key={menu.label} className="group relative">
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
