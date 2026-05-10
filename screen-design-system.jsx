// screen-design-system.jsx — Design System showcase

function ScreenDesignSystem() {
  return (
    <div className="tl-screen" style={{overflowY:'auto', padding:'48px 56px 64px'}}>
      <div style={{maxWidth:1280, margin:'0 auto', display:'flex', flexDirection:'column', gap:48}}>
        <header>
          <span className="tl-eyebrow">Design system v1.0</span>
          <h1 style={{fontFamily:'var(--tl-display)', fontSize:60, fontWeight:700, lineHeight:1.02, marginTop:8, letterSpacing:'-0.02em'}}>
            The Traveloop <em style={{fontStyle:'italic', color:'var(--tl-amber)'}}>system</em>.
          </h1>
          <p className="tl-muted" style={{fontSize:16, marginTop:14, maxWidth:680, lineHeight:1.55}}>
            Editorial travel meets functional planner. Warm whites, deep ink, and one decisive amber that signals every "do this next" moment. Headlines are Playfair Display, the rest is DM Sans, codes are JetBrains Mono.
          </p>
        </header>

        <DSSection title="Colors" sub="Strict palette — these tokens cover every UI surface.">
          <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:14}}>
            <Swatch name="Primary BG" hex="#FAFAF8" var="--tl-bg" tone="light" />
            <Swatch name="Ink"        hex="#1E1E1E" var="--tl-ink" />
            <Swatch name="Amber CTA"  hex="#F5A623" var="--tl-amber" />
            <Swatch name="Forest"     hex="#2D6A4F" var="--tl-forest" />
            <Swatch name="Card"       hex="#FFFFFF" var="--tl-card" tone="light" />
            <Swatch name="Muted"      hex="#6B7280" var="--tl-muted" />
            <Swatch name="Border"     hex="#E5E7EB" var="--tl-border" tone="light" />
            <Swatch name="Input BG"   hex="#F3F4F6" var="--tl-input" tone="light" />
            <Swatch name="Danger"     hex="#EF4444" var="--tl-danger" />
            <Swatch name="Success"    hex="#10B981" var="--tl-success" />
          </div>
        </DSSection>

        <DSSection title="Typography" sub="Three families, a generous scale, set with -0.01em on display sizes.">
          <div className="tl-card" style={{padding:32, display:'flex', flexDirection:'column', gap:20}}>
            <TypeRow size={56} family="display" weight={700} label="Display 56 / Playfair Display 700">
              Where do you want to wander next?
            </TypeRow>
            <TypeRow size={36} family="display" weight={600} label="H1 36 / Playfair Display 600">
              Plan a new trip
            </TypeRow>
            <TypeRow size={24} family="display" weight={600} label="H2 24 / Playfair Display 600">
              Top Regional Selections
            </TypeRow>
            <TypeRow size={18} family="display" weight={600} label="H3 18 / Playfair Display 600">
              Itinerary builder
            </TypeRow>
            <TypeRow size={14} family="body" weight={400} label="Body 14 / DM Sans 400">
              Plan multi-city trips, share itineraries, and keep notes that stay with you on the road.
            </TypeRow>
            <TypeRow size={11} family="body" weight={600} label="Eyebrow 11 / DM Sans 600 · uppercase 0.14 tracking" upper>
              Trip journal
            </TypeRow>
            <TypeRow size={14} family="mono" weight={500} label="Mono 14 / JetBrains Mono 500">
              INV-XYZ-30290 · 09:00 → 12:00 · €124
            </TypeRow>
          </div>
        </DSSection>

        <DSSection title="Spacing & Radii" sub="4-pt scale; cards 12px, inputs/buttons 8px, pills 999px.">
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:18}}>
            <div className="tl-card" style={{padding:24}}>
              <div className="tl-eyebrow" style={{marginBottom:12}}>Spacing scale</div>
              <div style={{display:'flex', alignItems:'flex-end', gap:12}}>
                {[4,8,12,16,20,24,32,40,56,72].map((n,i)=>(
                  <div key={i} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:6}}>
                    <div style={{width:n, height:n, background:'var(--tl-ink)', borderRadius: i<3?2:4}}></div>
                    <span className="tl-mono" style={{fontSize:10.5, color:'var(--tl-muted)'}}>{n}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="tl-card" style={{padding:24}}>
              <div className="tl-eyebrow" style={{marginBottom:12}}>Radii</div>
              <div style={{display:'flex', gap:18, alignItems:'center'}}>
                {[
                  ['8','Inputs / Buttons'],
                  ['12','Cards'],
                  ['999','Pills / Badges'],
                ].map(([r,l])=>(
                  <div key={r} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:8}}>
                    <div style={{width:72, height:72, background:'var(--tl-amber)', borderRadius: r==='999'?999:parseInt(r)}}></div>
                    <span className="tl-mono" style={{fontSize:11}}>{r==='999'?'999px':r+'px'}</span>
                    <span style={{fontSize:11.5, color:'var(--tl-muted)'}}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DSSection>

        <DSSection title="Buttons" sub="Solid amber for the next step. Outlined ink for everything else.">
          <div className="tl-card" style={{padding:32, display:'flex', flexDirection:'column', gap:18}}>
            <ButtonRow label="Primary"  >
              <button className="tl-btn tl-btn--primary">Plan a trip</button>
              <button className="tl-btn tl-btn--primary tl-btn--lg">Continue {I.chevR(13)}</button>
              <button className="tl-btn tl-btn--primary tl-btn--sm">{I.plus(13)} Add</button>
            </ButtonRow>
            <ButtonRow label="Outline" >
              <button className="tl-btn tl-btn--outline">Save draft</button>
              <button className="tl-btn tl-btn--outline tl-btn--sm">View</button>
            </ButtonRow>
            <ButtonRow label="Ghost & Dashed">
              <button className="tl-btn tl-btn--ghost">Cancel</button>
              <button className="tl-btn tl-btn--dashed">{I.plus(14)} Add another Section</button>
            </ButtonRow>
          </div>
        </DSSection>

        <DSSection title="Inputs & Forms" sub="Light gray fill, no border at rest. Focus draws a 2px ink ring.">
          <div className="tl-card" style={{padding:32, display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
            <div className="tl-field"><label className="tl-field__label">Default</label><input className="tl-input" defaultValue="Paris, France" /></div>
            <div className="tl-field"><label className="tl-field__label">Focused</label><input className="tl-input" defaultValue="Rome, Italy" autoFocus /></div>
            <div className="tl-field"><label className="tl-field__label">Search</label>
              <div className="tl-search" style={{height:46}}>{I.search(16)}<input placeholder="Search bar......" /></div>
            </div>
            <div className="tl-field"><label className="tl-field__label">Date</label>
              <div className="tl-input" style={{display:'flex', alignItems:'center', gap:10}}>{I.cal(15)} Jun 12, 2025</div>
            </div>
            <div className="tl-field" style={{gridColumn:'1 / -1'}}><label className="tl-field__label">Textarea</label>
              <textarea className="tl-textarea" rows={3} defaultValue="All the necessary information about this section. Hotel arrival, light walk, dinner reservation."></textarea>
            </div>
          </div>
        </DSSection>

        <DSSection title="Pills, Badges & Tabs" sub="Status uses tonal fills. Filter pills use neutral ink.">
          <div className="tl-card" style={{padding:32, display:'flex', flexDirection:'column', gap:20}}>
            <ButtonRow label="Filter pills">
              <FilterPill label="Group by" icon={I.layers(13)} />
              <FilterPill label="Filter" icon={I.filter(13)} active />
              <FilterPill label="Sort by..." icon={I.sort(13)} />
            </ButtonRow>
            <ButtonRow label="Status badges">
              <span className="tl-badge tl-badge--ongoing">Ongoing</span>
              <span className="tl-badge tl-badge--upcoming">Upcoming</span>
              <span className="tl-badge tl-badge--completed">Completed</span>
              <span className="tl-badge tl-badge--danger">Over budget</span>
              <span className="tl-badge tl-badge--completed tl-badge--mono">INR</span>
            </ButtonRow>
            <ButtonRow label="Tabs">
              <div className="tl-tabs">
                <button className="tl-tab is-active">All</button>
                <button className="tl-tab">by Day</button>
                <button className="tl-tab">by stop</button>
              </div>
            </ButtonRow>
          </div>
        </DSSection>

        <DSSection title="Cards" sub="White, soft single-layer shadow, 12px radius. The whole product breathes inside these.">
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:18}}>
            <div className="tl-card" style={{padding:22}}>
              <div className="tl-eyebrow">Anatomy</div>
              <h3 style={{fontFamily:'var(--tl-display)', fontSize:20, fontWeight:600, marginTop:6}}>Card title</h3>
              <p className="tl-muted" style={{fontSize:13.5, lineHeight:1.55, marginTop:8}}>
                Cards have 22-28px internal padding, a section title in Playfair, supporting copy in DM Sans, and one primary action.
              </p>
              <div style={{display:'flex', gap:8, marginTop:14}}>
                <button className="tl-btn tl-btn--primary tl-btn--sm">Primary</button>
                <button className="tl-btn tl-btn--ghost tl-btn--sm">Cancel</button>
              </div>
            </div>
            <CityCard city="Lisbon" country="Portugal" tone="amber" />
          </div>
        </DSSection>

        <DSSection title="Header pattern" sub="Dark navbar + search + 3 filter pills. Repeats on 9 of 14 screens.">
          <div className="tl-card" style={{padding:0, overflow:'hidden'}}>
            <Navbar active="My Trips" />
            <StandardHeader />
            <div style={{height:24}}></div>
          </div>
        </DSSection>

        <footer style={{paddingTop:32, borderTop:'1px solid var(--tl-border)', display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:12.5, color:'var(--tl-muted)'}}>
          <span>Traveloop · Design system v1.0</span>
          <span className="tl-mono">tokens.css · components.jsx · 14 screens</span>
        </footer>
      </div>
    </div>
  );
}

function DSSection({ title, sub, children }) {
  return (
    <section>
      <div style={{marginBottom:18}}>
        <h2 style={{fontFamily:'var(--tl-display)', fontSize:30, fontWeight:600, letterSpacing:'-0.02em'}}>{title}</h2>
        {sub && <p className="tl-muted" style={{fontSize:14, marginTop:6, maxWidth:640}}>{sub}</p>}
      </div>
      {children}
    </section>
  );
}

function Swatch({ name, hex, var: cssvar, tone }) {
  const isLight = tone === 'light';
  return (
    <div className="tl-card" style={{overflow:'hidden'}}>
      <div style={{background: hex, height:96, borderBottom: isLight?'1px solid var(--tl-border)':'0'}}></div>
      <div style={{padding:'12px 14px'}}>
        <div style={{fontSize:13.5, fontWeight:600}}>{name}</div>
        <div className="tl-mono" style={{fontSize:11, color:'var(--tl-muted)', marginTop:2}}>{hex}</div>
        <div className="tl-mono" style={{fontSize:10.5, color:'var(--tl-muted-2)', marginTop:1}}>{cssvar}</div>
      </div>
    </div>
  );
}

function TypeRow({ size, family, weight, label, upper, children }) {
  const fam = family === 'display' ? 'var(--tl-display)' : family === 'mono' ? 'var(--tl-mono)' : 'var(--tl-body)';
  return (
    <div style={{display:'grid', gridTemplateColumns:'260px 1fr', gap:24, alignItems:'baseline', paddingBottom:14, borderBottom:'1px dashed var(--tl-border)'}}>
      <div className="tl-mono" style={{fontSize:11, color:'var(--tl-muted)'}}>{label}</div>
      <div style={{fontFamily: fam, fontSize: size, fontWeight: weight, lineHeight:1.15, textTransform: upper?'uppercase':'none', letterSpacing: upper?'0.14em':'-0.005em'}}>
        {children}
      </div>
    </div>
  );
}

function ButtonRow({ label, children }) {
  return (
    <div style={{display:'grid', gridTemplateColumns:'160px 1fr', gap:24, alignItems:'center', paddingBottom:14, borderBottom:'1px dashed var(--tl-border)'}}>
      <div className="tl-eyebrow">{label}</div>
      <div style={{display:'flex', flexWrap:'wrap', gap:10, alignItems:'center'}}>{children}</div>
    </div>
  );
}

Object.assign(window, { ScreenDesignSystem });
