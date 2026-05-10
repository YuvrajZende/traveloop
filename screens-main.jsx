// screens-main.jsx — Dashboard, New Trip, Itinerary Builder

function ScreenDashboard() {
  return (
    <div className="tl-screen" style={{overflowY:'auto'}}>
      <Navbar active="Explore" />
      {/* Banner */}
      <div style={{position:'relative', height:280, margin:'0', overflow:'hidden'}}>
        <Img tone="" label="" style={{height:'100%', borderRadius:0,
          background: 'linear-gradient(135deg, #2D6A4F 0%, #1E1E1E 100%)'}}>
          <div style={{position:'absolute', inset:0, padding:'48px 48px',
            display:'flex', flexDirection:'column', justifyContent:'flex-end', color:'#fff'}}>
            <span className="tl-eyebrow" style={{color:'rgba(255,255,255,0.7)'}}>Spring 2026 · Featured</span>
            <h1 style={{fontFamily:'var(--tl-display)', fontSize:48, fontWeight:600, lineHeight:1.05, marginTop:8, maxWidth:780}}>
              Where do you want to <em style={{color:'var(--tl-amber)', fontStyle:'italic'}}>wander</em> next?
            </h1>
            <p style={{fontSize:15, opacity:0.85, marginTop:10, maxWidth:540}}>
              Plan multi-city trips, share itineraries, and keep notes that stay with you on the road.
            </p>
          </div>
        </Img>
      </div>

      <StandardHeader value="" placeholder="Search bar......" />

      <div style={{padding:'20px 48px 0'}}>
        <button className="tl-btn tl-btn--primary tl-btn--lg" style={{padding:'0 32px'}}>
          {I.plus(16)} Plan a trip
        </button>
      </div>

      <PageBody>
        <section>
          <SectionH title="Top Regional Selections" sub="Curated by editors this week" action={
            <a style={{fontSize:13, fontWeight:600}}>See all {I.chevR(12)}</a>
          } />
          <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:18}}>
            <CityCard city="Lisbon"     country="Portugal"  tone="amber" />
            <CityCard city="Kyoto"      country="Japan"     tone="green" />
            <CityCard city="Marrakesh"  country="Morocco"   tone="" />
            <CityCard city="Reykjavík"  country="Iceland"   tone="blue" />
            <CityCard city="Cape Town"  country="S. Africa" tone="amber" />
          </div>
        </section>

        <section>
          <SectionH title="Previous Trips" sub="Pick up where you left off" />
          <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:18}}>
            <TripCardSquare title="Andalusian Loop"     dates="Mar 2 – Mar 14, 2025" count={4} tone="amber" />
            <TripCardSquare title="Northern Lights Run" dates="Jan 8 – Jan 18, 2025"  count={3} tone="blue" />
            <TripCardSquare title="Coast of Vietnam"    dates="Nov 12 – Nov 26, 2024" count={5} tone="green" />
          </div>
        </section>
      </PageBody>
    </div>
  );
}

function ScreenNewTrip() {
  return (
    <div className="tl-screen" style={{overflowY:'auto'}}>
      <Navbar active="My Trips" />
      <PageBody style={{paddingTop:36}}>
        <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:24}}>
          <div>
            <span className="tl-eyebrow">New trip · step 1 of 3</span>
            <h1 style={{fontFamily:'var(--tl-display)', fontSize:44, fontWeight:600, marginTop:6, lineHeight:1.05}}>
              Plan a new trip
            </h1>
            <p className="tl-muted" style={{fontSize:14, marginTop:8, maxWidth:560}}>
              Start with a destination and dates. We'll help you fill in stops, activities, and budget on the next steps.
            </p>
          </div>
          <button className="tl-btn tl-btn--outline">Save draft</button>
        </div>

        <div className="tl-card" style={{padding:32, display:'grid', gridTemplateColumns:'1fr 1fr', gap:18}}>
          <div className="tl-field" style={{gridColumn:'1 / -1'}}>
            <label className="tl-field__label">Select a Place:</label>
            <div className="tl-input" style={{display:'flex', alignItems:'center', gap:10}}>
              {I.pin(16)}
              <input style={{border:0, background:'transparent', outline:'none', flex:1, font:'inherit'}}
                placeholder="e.g. Paris, Rome, Barcelona..." defaultValue="Paris, Rome" />
              <span className="tl-badge">2 cities</span>
            </div>
          </div>
          <div className="tl-field">
            <label className="tl-field__label">Start Date:</label>
            <input className="tl-input" placeholder="Jun 12, 2025" defaultValue="Jun 12, 2025" />
          </div>
          <div className="tl-field">
            <label className="tl-field__label">End Date:</label>
            <input className="tl-input" placeholder="Jun 24, 2025" defaultValue="Jun 24, 2025" />
          </div>
          <div className="tl-field">
            <label className="tl-field__label">First stop start date:</label>
            <input className="tl-input" placeholder="Jun 12, 2025" defaultValue="Jun 12, 2025" />
          </div>
          <div className="tl-field">
            <label className="tl-field__label">Travelers</label>
            <input className="tl-input" defaultValue="4 adults · 0 kids" />
          </div>
        </div>

        <section>
          <SectionH title="Suggestions for places to visit / activities to perform"
            sub="Based on your destination and travel window" />
          <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:18}}>
            {[
              ['Eiffel quarter walk',    'Paris, FR',     'amber',  'A 3-hour stroll through the 7th arrondissement, ending at sunset.'],
              ['Trastevere food crawl',  'Rome, IT',      'green',  'Six tastings, one neighborhood — pasta, gelato, supplì, wine.'],
              ['Vatican early access',   'Vatican City',  'blue',   'Skip-the-line tickets for the Sistine Chapel before 9am.'],
              ['Seine sunset cruise',    'Paris, FR',     'blue',   'A 70-minute glide past Notre-Dame, bridges lit at golden hour.'],
              ['Colosseum + Forum tour', 'Rome, IT',      'amber',  'Guided by an archaeologist; small groups of eight or fewer.'],
              ['Montmartre at dawn',     'Paris, FR',     '',       'Quiet streets, fresh croissants, and the city before it wakes.'],
            ].map(([t, p, tone, d]) => (
              <div key={t} className="tl-card" style={{display:'flex', flexDirection:'column'}}>
                <Img tone={tone} label={p.toUpperCase()} style={{height:170}} />
                <div style={{padding:'16px 18px 18px', display:'flex', flexDirection:'column', gap:8}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <h3 style={{fontSize:17, fontWeight:600}}>{t}</h3>
                    <span className="tl-badge tl-badge--completed">{p}</span>
                  </div>
                  <p className="tl-muted" style={{fontSize:13, lineHeight:1.55}}>{d}</p>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:6}}>
                    <span style={{fontSize:12.5, color:'var(--tl-muted)', display:'flex', alignItems:'center', gap:6}}>
                      {I.clock(13)} 3 hrs · €45
                    </span>
                    <button className="tl-btn tl-btn--sm tl-btn--outline">{I.plus(13)} Add</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid var(--tl-border)', paddingTop:24}}>
          <button className="tl-btn tl-btn--ghost">{I.arrLeft(14)} Back</button>
          <button className="tl-btn tl-btn--primary tl-btn--lg">Continue to itinerary {I.chevR(13)}</button>
        </div>
      </PageBody>
    </div>
  );
}

function ScreenItineraryBuilder() {
  const sections = [
    {n:1, title:'Arrival in Paris · check in & rest', desc:'All the necessary information about this section. Hotel arrival, light walk near the river, dinner at the corner brasserie.', range:'Jun 12 → Jun 13, 2025', budget:'420'},
    {n:2, title:'Paris museum + food day',           desc:'Louvre morning, Tuileries lunch, Marais shopping, dinner reservation 8pm.', range:'Jun 13 → Jun 15, 2025', budget:'680'},
    {n:3, title:'Train to Rome · settle in',          desc:'TGV to Rome, taxi to hotel, an evening passeggiata through Trastevere.', range:'Jun 15 → Jun 17, 2025', budget:'540'},
  ];
  return (
    <div className="tl-screen" style={{overflowY:'auto'}}>
      <Navbar active="My Trips" />
      <PageBody style={{paddingTop:32}}>
        <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between'}}>
          <div>
            <span className="tl-eyebrow">Itinerary builder · step 2 of 3</span>
            <h1 style={{fontFamily:'var(--tl-display)', fontSize:36, fontWeight:600, marginTop:6}}>
              Paris &amp; Rome Adventure
            </h1>
            <p className="tl-muted" style={{fontSize:13.5, marginTop:6}}>
              Jun 12 – Jun 24, 2025 · 12 days · 2 cities
            </p>
          </div>
          <div style={{display:'flex', gap:8}}>
            <button className="tl-btn tl-btn--outline">Preview</button>
            <button className="tl-btn tl-btn--primary">Save itinerary</button>
          </div>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap:18}}>
          {sections.map(s => <SectionCard key={s.n} {...s} />)}
          <button className="tl-btn tl-btn--dashed tl-btn--block" style={{height:64, fontSize:14}}>
            {I.plus(16)} Add another Section
          </button>
        </div>
      </PageBody>
    </div>
  );
}

function SectionCard({ n, title, desc, range, budget }) {
  return (
    <div className="tl-card" style={{padding:24, display:'flex', flexDirection:'column', gap:16, position:'relative'}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <span style={{
            fontFamily:'var(--tl-display)', fontSize:13, fontWeight:700,
            background:'var(--tl-ink)', color:'#fff',
            padding:'4px 10px', borderRadius:6, letterSpacing:0.04
          }}>SECTION {n}</span>
          <h3 style={{fontSize:18, fontWeight:600}}>{title}</h3>
        </div>
        <div style={{display:'flex', gap:6}}>
          <button className="tl-btn tl-btn--ghost tl-btn--sm">{I.edit(13)}</button>
          <button className="tl-btn tl-btn--ghost tl-btn--sm">{I.trash(13)}</button>
        </div>
      </div>
      <textarea className="tl-textarea" rows={3} defaultValue={desc} />
      <div style={{display:'grid', gridTemplateColumns:'1fr 240px', gap:14}}>
        <div className="tl-field">
          <label className="tl-field__label">Date Range:</label>
          <div className="tl-input" style={{display:'flex', alignItems:'center', gap:10}}>
            {I.cal(15)} <span style={{color:'var(--tl-ink)'}}>{range}</span>
          </div>
        </div>
        <div className="tl-field">
          <label className="tl-field__label">Budget of this section</label>
          <div className="tl-input" style={{display:'flex', alignItems:'center'}}>
            <span className="tl-mono" style={{color:'var(--tl-muted)'}}>EUR&nbsp;</span>
            <input style={{border:0, background:'transparent', outline:'none', flex:1, font:'inherit', textAlign:'right', fontFamily:'var(--tl-mono)'}} defaultValue={budget} />
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenDashboard, ScreenNewTrip, ScreenItineraryBuilder, SectionCard });
