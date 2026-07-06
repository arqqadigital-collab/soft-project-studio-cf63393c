import { useState } from "react";
import { Send, MapPin, Phone, Mail } from "lucide-react";
import { Footer } from "@/components/Footer";
import contactHero from "@/assets/contact/contact-hero.jpg.asset.json";
import qatarImage from "@/assets/contact/qatar.jpg.asset.json";


const inquiryAreas = [
  "Dynamics 365 Business Central",
  "Odoo",
  "Zoho",
  "Healthcare Solutions",
  "Cybersecurity",
  "Consulting",
  "Implementation & Integration",
  "Staff Augmentation",
  "Other",
];

const offices = [
  {
    city: "Florida, USA",
    address: "6900 Tavistock Lakes Blvd, Suite 400, Orlando, Florida 32827, USA",
    phone: "+1 (407) 3735356",
    email: "sbs@sbs-me.com",
    image:
      "https://images.unsplash.com/photo-1602940659805-770d1b3b9911?auto=format&fit=crop&w=800&q=70",
  },
  {
    city: "Dubai, UAE",
    address: "Office 1205, Jumeirah Bay Tower X3, Cluster X, Jumeirah Lake Towers.",
    phone: "(+971) 044277705",
    email: "sbs@sbs-me.com",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=70",
  },
  {
    city: "Qatar",
    address: "1st Floor, Al-Jaidah Square Building, Airport Road, PO Box 55743, Doha, Qatar",
    phone: "+974 4426 7499",
    email: "sbs@sbs-me.com",
    image:
      "https://images.unsplash.com/photo-1563296291-1cfcaad86e6d?auto=format&fit=crop&w=800&q=70",
  },
  {
    city: "Saudi Arabia",
    address: "6143 – Al Arid Dist. Unit No.1, Riyadh 13342 – 2901, Kingdom of Saudi Arabia",
    phone: "+966 11 503 0522",
    email: "sbs@sbs-me.com",
    image:
      "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=800&q=70",
  },
  {
    city: "Cairo, Egypt",
    address: "6 AL-Horya St. 9th area, Block No. 16, Nasr City, Cairo, Egypt",
    phone: "+2 (02) 24725260",
    email: "sbs@sbs-me.com",
    image:
      "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=70",
  },

];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    area: "",
    message: "",
    consent: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForm({ name: "", email: "", phone: "", area: "", message: "", consent: false });
  };

  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-32 md:px-12 md:pb-24 md:pt-40">
        <img
          src={contactHero.url}
          alt="Person typing on a laptop"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklab, var(--brand-dark) 82%, transparent) 0%, color-mix(in oklab, var(--brand-blue) 55%, var(--brand-dark) 45%) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl text-center text-white">
          <p
            className="text-sm font-semibold uppercase tracking-[0.25em]"
            style={{ color: "var(--brand-green)" }}
          >
            Contact Us
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            Let's Build Something Together
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 md:text-lg">
            Have a project in mind or need expert advice? Reach out and one of our specialists will
            get back to you within 24 hours.
          </p>
        </div>
      </section>


      {/* Form Section */}
      <section className="px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_1fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-border bg-card p-8 shadow-xl md:p-10"
          >
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">Send us a message</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Fields marked <span style={{ color: "var(--brand-green)" }}>*</span> are required.
            </p>

            <div className="mt-8 space-y-5">
              <Field label="Name" required>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  maxLength={100}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-[var(--brand-blue)]"
                />
              </Field>

              <Field label="Email" required>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  maxLength={255}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-[var(--brand-blue)]"
                />
              </Field>

              <Field label="Phone Number" required>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  maxLength={30}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-[var(--brand-blue)]"
                />
              </Field>

              <Field label="Area of Inquiry" required>
                <select
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  required
                  className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-[var(--brand-blue)]"
                >
                  <option value="">Select an area...</option>
                  {inquiryAreas.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Message">
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  maxLength={1000}
                  rows={5}
                  className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-[var(--brand-blue)]"
                />
              </Field>

              <label className="flex items-start gap-3 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                  required
                  className="mt-1 h-4 w-4 rounded border-border"
                />
                <span>
                  I agree to be contacted about my inquiry and consent to the processing of my data.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="mt-8 inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Contact Us
              <Send className="h-4 w-4" />
            </button>
          </form>

          {/* Quick contact info */}
          <div className="flex flex-col justify-start gap-6">
            <InfoCard
              icon={<Mail className="h-5 w-5" />}
              title="Email us"
              value="sbs@sbs-me.com"
              subtitle="We reply within one business day."
            />
            <InfoCard
              icon={<Phone className="h-5 w-5" />}
              title="Talk to sales"
              value="+971 044 277 705"
              subtitle="Sun–Thu, 9:00 AM – 6:00 PM GST"
            />
            <InfoCard
              icon={<MapPin className="h-5 w-5" />}
              title="Head office"
              value="Dubai, UAE"
              subtitle="Jumeirah Lake Towers, Cluster X"
            />
          </div>
        </div>
      </section>

      {/* Offices */}
      <section
        className="px-6 py-20 md:px-12 md:py-28"
        style={{ background: "var(--brand-dark)" }}
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-white md:text-5xl">Our Offices</h2>
          <p className="mt-4 max-w-2xl text-base text-white/70">
            A global presence with local expertise. Visit us at any of our regional offices.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {offices.map((o) => (
              <div
                key={o.city}
                className="overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={o.image}
                    alt={o.city}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-4 p-5">
                  <h3 className="text-lg font-bold text-white">{o.city}</h3>
                  <div className="flex items-start gap-2 text-sm text-white/80">
                    <MapPin
                      className="mt-0.5 h-4 w-4 shrink-0"
                      style={{ color: "var(--brand-green)" }}
                    />
                    <span>{o.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Phone
                      className="h-4 w-4 shrink-0"
                      style={{ color: "var(--brand-green)" }}
                    />
                    <span>{o.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Mail
                      className="h-4 w-4 shrink-0"
                      style={{ color: "var(--brand-green)" }}
                    />
                    <a href={`mailto:${o.email}`} className="hover:text-white">
                      {o.email}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <Footer />
    </main>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-foreground">
        {label}
        {required && <span style={{ color: "var(--brand-green)" }}> *</span>}
      </span>
      {children}
    </label>
  );
}

function InfoCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
          style={{ background: "var(--gradient-brand)" }}
        >
          {icon}
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </div>
          <div className="mt-1 text-lg font-bold text-foreground">{value}</div>
          <div className="mt-1 text-sm text-muted-foreground">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}
