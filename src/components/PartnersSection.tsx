import { useSectionContent } from "@/lib/homepageContent";
import { useLocale } from "@/i18n/LanguageProvider";


export function PartnersSection() {
  const c = useSectionContent("partners");
  const { isRTL } = useLocale();
  const loop = [...c.logos, ...c.logos];


  return (
    <section id="section-partners" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>{c.kicker}</p>
        <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
          <span style={{ color: "var(--brand-dark)" }}>{c.heading1}</span>
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>{c.heading2}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-base text-muted-foreground md:text-lg">{c.body}</p>
      </div>

      <div className="marquee-pause group relative mt-16 overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
        <div className="flex w-max animate-marquee gap-16 md:gap-24" style={{ animationDirection: isRTL ? "normal" : "reverse" }}>
          {loop.map((logo, i) => (
            <div key={i} className="flex h-36 w-72 shrink-0 items-center justify-center md:h-44 md:w-80">
              <img src={logo.src} alt={logo.name} className="max-h-full max-w-full object-contain grayscale opacity-60 transition duration-300 hover:grayscale-0 hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
