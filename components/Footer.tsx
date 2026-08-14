import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="dark-section border-t border-line-invert bg-ink px-5 py-12 text-paper sm:px-8">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div>
            <Logo invert />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">
              Concordia Sports Agency SIA
              <br />
              Krišjāņa Valdemāra iela 33A&ndash;4A
              <br />
              Rīga, LV-1010, Latvia
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 font-mono text-xs uppercase tracking-[0.15em] text-paper/60 sm:grid-cols-3 md:text-right">
            <div>
              <p className="text-paper/60">Registration No.</p>
              <p className="mt-2 text-paper/70">40203574668</p>
            </div>
            <div>
              <p className="text-paper/60">VAT No.</p>
              <p className="mt-2 text-paper/70">LV40203574668</p>
            </div>
            <div>
              <p className="text-paper/60">Contact</p>
              <a href="mailto:mail@concordia.football" className="mt-2 block text-paper/70 hover:text-paper">
                mail@concordia.football
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-line-invert pt-8 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-paper/60 sm:flex-row sm:items-center">
          <p>&copy; 2026 Concordia Sports Agency SIA. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-paper">
              Privacy Policy
            </a>
            <a href="/cookies" className="hover:text-paper">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
