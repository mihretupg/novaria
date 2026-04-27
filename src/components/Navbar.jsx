import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { NAV_LINKS, WHATSAPP_NUMBER } from '../data';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleNavClick = (href) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass border-b border-theme py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col leading-none focus:outline-none">
            <span className="text-xl font-black tracking-widest text-theme">NOVARIA</span>
            <span className="text-[9px] font-medium tracking-[0.32em] text-gold-500 uppercase mt-0.5">Limo</span>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button key={link.href} onClick={() => handleNavClick(link.href)}
                className="text-sm font-medium text-theme-muted hover:text-gold-400 transition-colors duration-200 tracking-wide">
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-theme-muted hover:text-theme transition-colors">
              <Phone size={14} /><span>WhatsApp</span>
            </a>
            <button onClick={() => handleNavClick('#booking')}
              className="btn-primary px-5 py-2.5 rounded-full text-sm font-bold">
              Book Now
            </button>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <button className="w-10 h-10 rounded-xl border border-theme text-theme-muted hover:text-gold-400 hover:border-gold-400/40 transition-colors flex items-center justify-center"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-[60] transition-all duration-300 ${
        mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="absolute inset-0 dark:bg-black/90 bg-white/90 backdrop-blur-xl"
          onClick={() => setMobileOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-80 glass border-l border-theme p-8 flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex justify-between items-center mb-12">
            <span className="text-gold-400 font-black tracking-widest">NOVARIA</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-11 h-11 rounded-xl border border-gold-500/50 bg-gold-500/10 text-gold-400 hover:bg-gold-500 hover:text-black transition-all flex items-center justify-center"
              aria-label="Close menu">
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col gap-6 flex-1">
            {NAV_LINKS.map((link) => (
              <button key={link.href} onClick={() => handleNavClick(link.href)}
                className="text-left text-lg font-medium text-theme-muted hover:text-gold-400 transition-colors">
                {link.label}
              </button>
            ))}
          </nav>
          <button onClick={() => handleNavClick('#booking')}
            className="btn-primary w-full py-4 rounded-2xl text-base font-bold mt-8">
            Book Now
          </button>
        </div>
      </div>
    </>
  );
}
