import logo1 from "@/assets/clients/01.png";
import logo2 from "@/assets/clients/02.png";
import logo3 from "@/assets/clients/03.png";
import logo4 from "@/assets/clients/04.png";
import logo5 from "@/assets/clients/05.png";
import logo6 from "@/assets/clients/06.png";
import logo7 from "@/assets/clients/07.png";
import logo8 from "@/assets/clients/08.png";
import logo9 from "@/assets/clients/09.png";

const logos = [
  { src: logo1, name: "Al Tanfith Aldwaliah" },
  { src: logo2, name: "APIC Agri Export" },
  { src: logo3, name: "Ameco" },
  { src: logo4, name: "Beehive Giveaways" },
  { src: logo5, name: "Boss Office Furniture" },
  { src: logo6, name: "Dazzle Advertising" },
  { src: logo7, name: "De Backer's" },
  { src: logo8, name: "Siddiq Farsi Holding" },
  { src: logo9, name: "Etal" },
];

export function ClientsSection() {
  // Duplicate the list to create a seamless infinite loop
  const loop = [...logos, ...logos];

  return (
    <section className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p
          className="text-sm font-semibold uppercase tracking-[0.25em]"
          style={{ color: "var(--brand-blue)" }}
        >
          Our Clients
        </p>

        <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
          <span style={{ color: "var(--brand-dark)" }}>Trusted by </span>
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-brand)" }}
          >
            leading organizations
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-base text-muted-foreground md:text-lg">
          Partnering with enterprises and healthcare institutions to deliver impactful digital
          transformation solutions across the MENA region and the United States.
        </p>
      </div>

      {/* Marquee */}
      <div
        className="marquee-pause group relative mt-16 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee gap-16 md:gap-24">
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
