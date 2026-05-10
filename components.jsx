// components.jsx — shared Traveloop UI components
// All loaded as global window.TL.* for use by screen files.

const { useState } = React;

// ─── Icons (lightweight inline SVGs) ────────────────────────────
const I = {
  search: (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>,
  chev:   (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  chevR:  (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  chevL:  (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  layers: (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  filter: (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  sort:   (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M6 12h12M10 18h4"/></svg>,
  plus:   (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  pin:    (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  cal:    (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  user:   (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  edit:   (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:  (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>,
  share:  (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  bell:   (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  globe:  (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  check:  (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  arrLeft:(s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  cam:    (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  mountain:(s=14)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>,
  clock:  (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  dollar: (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  trend:  (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
};

// ─── Navbar ────────────────────────────────────────────────────
function Navbar({ active = 'Dashboard' }) {
  const links = ['Explore', 'My Trips', 'Community', 'Notes'];
  return (
    <header className="tl-nav">
      <div className="tl-nav__brand">Traveloop<span className="dot">.</span></div>
      <nav className="tl-nav__links">
        {links.map(l => (
          <span key={l} className={'tl-nav__link' + (l === active ? ' is-active' : '')}>{l}</span>
        ))}
        <span className="tl-nav__link">{I.bell(16)}</span>
        <span className="tl-nav__avatar">JD</span>
      </nav>
    </header>
  );
}

// ─── Standard Header (search + filter row) ─────────────────────
function StandardHeader({ value = '', placeholder = 'Search bar......', children }) {
  return (
    <div className="tl-header">
      <div className="tl-search">
        {I.search(18)}
        <input defaultValue={value} placeholder={placeholder} />
        <span style={{fontFamily:'var(--tl-mono)', fontSize:11, color:'var(--tl-muted-2)'}}>⌘K</span>
      </div>
      <div className="tl-filterrow">
        <button className="tl-pill">{I.layers(14)} Group by {I.chev(12)}</button>
        <button className="tl-pill">{I.filter(14)} Filter {I.chev(12)}</button>
        <button className="tl-pill">{I.sort(14)} Sort by... {I.chev(12)}</button>
        {children}
      </div>
    </div>
  );
}

// ─── Filter Pill ───────────────────────────────────────────────
function FilterPill({ label, icon, active, children }) {
  return (
    <button className={'tl-pill' + (active ? ' tl-pill--active' : '')}>
      {icon}
      {label}
      {children || I.chev(12)}
    </button>
  );
}

// ─── Image placeholder ─────────────────────────────────────────
function Img({ tone = '', label = 'image', style = {}, children }) {
  const cls = 'tl-img' + (tone ? ' tl-img--' + tone : '');
  return <div className={cls} style={style}>{children || label}</div>;
}

// ─── Trip Cards ────────────────────────────────────────────────
// Wide (Screen 6) — full-width strip
function TripCardWide({ title, overview, dates, cities, status, tone = '' }) {
  return (
    <div className="tl-card" style={{display:'grid', gridTemplateColumns:'180px 1fr auto', gap:24, alignItems:'center', padding:18}}>
      <Img tone={tone} label={title.toUpperCase()} style={{height:96, borderRadius:8}} />
      <div style={{display:'flex', flexDirection:'column', gap:6, minWidth:0}}>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <h3 style={{fontSize:20, fontWeight:600}}>{title}</h3>
          {status && <span className={'tl-badge tl-badge--' + status.toLowerCase()}>{status}</span>}
        </div>
        <p className="tl-muted" style={{fontSize:13.5, lineHeight:1.55, maxWidth:'80ch'}}>{overview}</p>
        <div style={{display:'flex', gap:18, fontSize:12.5, color:'var(--tl-muted)', marginTop:2}}>
          <span style={{display:'flex',alignItems:'center',gap:6}}>{I.cal(13)} {dates}</span>
          <span style={{display:'flex',alignItems:'center',gap:6}}>{I.pin(13)} {cities}</span>
        </div>
      </div>
      <div style={{display:'flex', gap:8}}>
        <button className="tl-btn tl-btn--outline tl-btn--sm">View</button>
        <button className="tl-btn tl-btn--ghost tl-btn--sm">{I.edit(14)}</button>
      </div>
    </div>
  );
}

// Portrait (Screen 7)
function TripCardPortrait({ title, dates, place, tone = '', tag }) {
  return (
    <div className="tl-card" style={{display:'flex', flexDirection:'column'}}>
      <Img tone={tone} label={place.toUpperCase()} style={{height:280}} />
      <div style={{padding:'18px 18px 20px', display:'flex', flexDirection:'column', gap:8}}>
        {tag && <span className="tl-eyebrow">{tag}</span>}
        <h3 style={{fontSize:20, fontWeight:600, lineHeight:1.25}}>{title}</h3>
        <div style={{display:'flex', gap:14, fontSize:12.5, color:'var(--tl-muted)'}}>
          <span style={{display:'flex',alignItems:'center',gap:6}}>{I.cal(13)} {dates}</span>
          <span style={{display:'flex',alignItems:'center',gap:6}}>{I.pin(13)} {place}</span>
        </div>
        <button className="tl-btn tl-btn--primary" style={{marginTop:10}}>View trip {I.chevR(13)}</button>
      </div>
    </div>
  );
}

// Square (Screen 3 Top Regional)
function CityCard({ city, country, tone = '' }) {
  return (
    <div className="tl-card" style={{display:'flex', flexDirection:'column', cursor:'pointer'}}>
      <Img tone={tone} label={city.toUpperCase()} style={{height:170}} />
      <div style={{padding:'14px 16px 16px'}}>
        <div style={{fontSize:16, fontWeight:600, fontFamily:'var(--tl-display)'}}>{city}</div>
        <div style={{fontSize:12.5, color:'var(--tl-muted)', marginTop:2}}>{country}</div>
      </div>
    </div>
  );
}

// Trip card for dashboard "Previous Trips" — wider
function TripCardSquare({ title, dates, count, tone = '' }) {
  return (
    <div className="tl-card" style={{display:'flex', flexDirection:'column', cursor:'pointer'}}>
      <Img tone={tone} label={title.toUpperCase()} style={{height:200}} />
      <div style={{padding:'18px 20px', display:'flex', flexDirection:'column', gap:6}}>
        <h3 style={{fontSize:18, fontWeight:600}}>{title}</h3>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <span style={{fontSize:13, color:'var(--tl-muted)'}}>{dates}</span>
          <span className="tl-badge tl-badge--completed">{count} stops</span>
        </div>
      </div>
    </div>
  );
}

// ─── Section header ────────────────────────────────────────────
function SectionH({ title, action, sub }) {
  return (
    <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:18}}>
      <div>
        <h2 className="tl-section-h">{title}</h2>
        {sub && <div className="tl-muted" style={{fontSize:13.5, marginTop:4}}>{sub}</div>}
      </div>
      {action}
    </div>
  );
}

// ─── Page Frame (consistent body padding) ──────────────────────
function PageBody({ children, style = {} }) {
  return <div style={{padding:'24px 48px 56px', display:'flex', flexDirection:'column', gap:32, ...style}}>{children}</div>;
}

// ─── Auth Frame ────────────────────────────────────────────────
function AuthFrame({ children, width = 480 }) {
  return (
    <div className="tl-screen" style={{
      display:'flex', alignItems:'center', justifyContent:'center',
      background: 'linear-gradient(135deg, #FAFAF8 0%, #F1EBDF 100%)',
      padding: 48, overflow: 'auto'
    }}>
      <div className="tl-card" style={{width, padding:'44px 44px 36px', position:'relative'}}>
        <div style={{position:'absolute', top:24, left:24, fontFamily:'var(--tl-display)', fontStyle:'italic', fontWeight:700, fontSize:18}}>
          Traveloop<span style={{color:'var(--tl-amber)'}}>.</span>
        </div>
        {children}
      </div>
    </div>
  );
}

// Export everything
Object.assign(window, { I, Navbar, StandardHeader, FilterPill, Img, TripCardWide, TripCardPortrait, CityCard, TripCardSquare, SectionH, PageBody, AuthFrame });
