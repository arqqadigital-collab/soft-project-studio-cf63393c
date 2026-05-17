import logo1 from "@/assets/partners/01.png";
import logo2 from "@/assets/partners/02.png";
import logo3 from "@/assets/partners/03.png";
import logo4 from "@/assets/partners/04.png";
import logo5 from "@/assets/partners/05.png";
import logo6 from "@/assets/partners/06.png";
import logo7 from "@/assets/partners/07.png";
import logo8 from "@/assets/partners/08.png";

const logos = [
  { src: logo1, name: "Cerner" },
  { src: logo2, name: "Infinitt Healthcare" },
  { src: logo3, name: "EndNote" },
  { src: logo4, name: "Fortinet" },
  { src: logo5, name: "Imprivata" },
  { src: logo6, name: "Odoo" },
  { src: logo7, name: "Microsoft Dynamics 365 Business Central" },
  { src: logo8, name: "Totara" },
];

export function PartnersSection() {
  const loop = [...logos, ...logos];

  return (
    <section className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p
          className="text-sm font-semibold uppercase tracking-[0.25em]"
          style={{ color: "var(--brand-blue)" }}
        >
          Our Partners
        </p>

        <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
          <span style={{ color: "var(--brand-dark)" }}>Powered By </span>
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-brand)" }}
          >
            Strategic Partnerships
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-base text-muted-foreground md:text-lg">
          Collaborating with world-class technology providers to deliver enterprise-grade solutions,
          innovation, and proven platforms to our clients.
        </p>
      </div>

      <div
        className="marquee-pause group relative mt-16 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee gap-16 md:gap-24" style={{ animationDirection: "reverse" }}>
          {loop.map((logo, i) => (
            <div
              key={i}
              className="flex h-36 w-72 shrink-0 items-center justify-center md:h-44 md:w-80"
            >
              <img
                src={logo.src}
                alt={logo.name}
                className="max-h-full max-w-full object-contain grayscale opacity-60 transition duration-300 hover:grayscale-0 hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
