import logo from "@/assets/logo.png";
import { MainNav } from "@/components/MainNav";

export function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-white/5 bg-[var(--brand-dark)]/80 px-6 py-4 backdrop-blur-md md:px-12">
      <a href="/">
        <img
          src={logo}
          alt="SBS — Superior Business Solutions"
          className="h-12 w-auto md:h-14"
        />
      </a>

      <MainNav />

      <button
        className="rounded-full px-7 py-3 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
        style={{ background: "var(--gradient-brand)" }}
      >
        Get Started
      </button>
    </header>
  );
}
