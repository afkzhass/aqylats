const Navbar = () => {
  return (
    <nav className="bg-primary h-[60px] px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-accent-foreground font-semibold text-sm font-serif">
          A
        </div>
        <div>
          <div className="text-primary-foreground text-lg font-serif font-medium tracking-wide">
            Aqyl AI
          </div>
          <span className="text-warm text-[11px] font-sans font-light tracking-widest uppercase">
            Білім платформасы
          </span>
        </div>
      </div>

      <div className="hidden md:flex gap-1">
        <button className="px-3.5 py-1.5 rounded-md bg-white/15 text-primary-foreground text-sm font-sans">
          Учебные курсы
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xs font-medium">
          АБ
        </div>
        <span className="hidden md:inline text-primary-foreground/50 text-xs">Ученик</span>
      </div>
    </nav>
  );
};

export default Navbar;
