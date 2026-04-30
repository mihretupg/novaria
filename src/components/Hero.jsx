import { useEffect, useState } from 'react';
import { ArrowRight, MapPin, MessageSquare, Star } from 'lucide-react';
import { PHONE_NUMBER, WHATSAPP_NUMBER } from '../data';

export default function Hero() {
  const [visible, setVisible] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      // Negative: image travels UP slower than the section, creating depth
      setParallaxY(window.scrollY * -0.35);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToBooking = () =>
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* ── Parallax photo layer ────────────────────────────────
          The container extends 120px beyond the section on both top
          and bottom so there's always room to shift without gaps.
      ── */}
      <div
        className={`pointer-events-none transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          position: 'absolute',
          top: -120,
          left: 0,
          right: 0,
          bottom: -120,
          transform: `translateY(${parallaxY}px)`,
          willChange: 'transform',
        }}
      >
        <img
          src="https://unsplash.com/photos/sf9IcZ5wamw/download?force=true&w=1800"
          alt="Black Cadillac Escalade parked in front of a building"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 54%',
            filter: 'brightness(1.16) contrast(1.08) saturate(1.05)',
          }}
        />
      </div>

      {/* ── Overlay layers ── */}
      <div className="absolute inset-0 hero-overlay-l" />
      <div className="absolute top-0 left-0 right-0 h-40 hero-overlay-t" />
      <div className="absolute bottom-0 left-0 right-0 h-48 hero-overlay-b" />

      {/* Gold glow */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gold-500/5 blur-[130px] pointer-events-none" />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(245,166,35,1) 1px,transparent 1px),linear-gradient(90deg,rgba(245,166,35,1) 1px,transparent 1px)',
          backgroundSize: '80px 80px',
        }} />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 grid md:grid-cols-2 gap-16 items-center">

        {/* Left */}
        <div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/30 bg-gold-500/8 mb-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <MapPin size={13} className="text-gold-400" />
            <span className="hidden sm:inline text-xs font-semibold tracking-widest uppercase text-gold-400 whitespace-nowrap">Premium Dallas Transportation</span>
            <span className="sm:hidden text-[0.68rem] font-semibold tracking-wide uppercase text-gold-400 whitespace-nowrap">Premium Dallas Service</span>
          </div>

          <h1 className={`playfair text-5xl lg:text-7xl font-bold leading-[1.05] mb-6 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <span className="text-theme">Ride in</span>{' '}
            <span className="italic text-theme">Luxury,</span><br />
            <span className="text-gradient-gold">Arrive in</span>{' '}
            <span className="italic text-gradient-gold">Style</span>
          </h1>

          <p className={`text-theme-muted text-lg leading-relaxed max-w-md mb-10 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            Professional limo car service for airport transfers, corporate travel, weddings, and special events across Dallas and the DFW metroplex.
          </p>

          <div className={`flex flex-wrap gap-4 mb-14 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <button onClick={scrollToBooking}
              className="btn-primary flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold">
              Reserve Your Ride <ArrowRight size={18} />
            </button>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
              className="btn-outline flex items-center gap-2 px-8 py-4 rounded-full text-base">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.858L0 24l6.335-1.51A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.791 9.791 0 01-4.994-1.368l-.358-.213-3.76.897.947-3.666-.234-.376A9.79 9.79 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
              </svg>
              WhatsApp Us
            </a>
            <a href={`sms:${PHONE_NUMBER}?&body=Hi%20Novaria%2C%20I%27d%20like%20to%20book%20a%20ride.`}
              className="btn-outline flex items-center gap-2 px-8 py-4 rounded-full text-base">
              <MessageSquare size={18} />
              Text Us
            </a>
          </div>

          <div className={`flex flex-wrap gap-8 transition-all duration-700 delay-[400ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {[{val:'24/7',label:'Availability'},{val:'VIP',label:'Customer Care'},{val:'DFW',label:'Airport Service'}].map((s) => (
              <div key={s.val} className="flex flex-col">
                <span className="text-2xl font-black text-gold-400">{s.val}</span>
                <span className="text-xs text-theme-subtle tracking-widest uppercase mt-0.5">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: card */}
        <div className={`transition-all duration-1000 delay-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
          <div className="relative">
            <div className="absolute inset-0 bg-gold-500/10 blur-3xl rounded-3xl" />
            <div className="relative glass rounded-3xl p-8 gold-border">
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold-400/80">Luxury Experience</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_,i) => <Star key={i} size={10} className="fill-gold-400 text-gold-400" />)}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-black/[0.04] dark:bg-white/[0.03] border border-theme">
                  <span className="text-sm text-theme font-medium">Executive Class</span>
                  <span className="text-xs bg-gold-500 text-black font-bold px-3 py-1 rounded-full">Premium Fleet</span>
                </div>
                {[
                  {title:'Airport Pickup', sub:'On-time service for DFW and Love Field'},
                  {title:'Special Events', sub:'Weddings, prom, birthdays, and nights out'},
                  {title:'Corporate Travel', sub:'Professional transportation for meetings'},
                ].map((item) => (
                  <div key={item.title}
                    className="p-4 rounded-2xl border border-theme hover:border-gold-500/25 hover:bg-gold-500/5 transition-all duration-300 cursor-pointer">
                    <p className="text-sm font-semibold text-theme mb-1">{item.title}</p>
                    <p className="text-xs text-theme-subtle">{item.sub}</p>
                  </div>
                ))}
              </div>

              <button onClick={scrollToBooking}
                className="btn-primary w-full py-4 rounded-2xl font-bold text-sm tracking-wide">
                Get an Instant Quote
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 pointer-events-none">
        <span className="text-[10px] tracking-widest uppercase text-theme-subtle">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-current to-transparent text-theme-subtle" />
      </div>
    </section>
  );
}
