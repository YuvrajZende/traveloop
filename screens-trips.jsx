// screens-trips.jsx — Trip Listing, Profile, Search

function ScreenTripListing() {
  return (
    <div className="tl-screen" style={{overflowY:'auto'}}>
      <Navbar active="My Trips" />
      <StandardHeader />
      <PageBody style={{paddingTop:8}}>
        <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between'}}>
          <div>
            <span className="tl-eyebrow">My Trips</span>
            <h1 style={{fontFamily:'var(--tl-display)', fontSize:36, fontWeight:600, marginTop:4}}>
              All your journeys, in one place
            </h1>
          </div>
          <button className="tl-btn tl-btn--primary">{I.plus(15)} New Trip</button>
        </div>

        <section>
          <SectionGroupHeader title="Ongoing" count={1} dot="amber" />
          <div style={{display:'flex', flexDirection:'column', gap:14}}>
            <TripCardWide
              title="Coast of Vietnam"
              status="Ongoing"
              overview="Currently in Hội An, on day 6. Next: Da Nang train, then north to Hà Giang for the loop."
              dates="Apr 28 – May 14, 2026"
              cities="3 cities · 5 stops"
              tone="green"
            />
          </div>
        </section>

        <section>
          <SectionGroupHeader title="Up-coming" count={1} dot="forest" />
          <div style={{display:'flex', flexDirection:'column', gap:14}}>
            <TripCardWide
              title="Paris & Rome Adventure"
              status="Upcoming"
              overview="A 12-day spring run through two capitals. Booked: hotels in both cities, the Vatican entry, and a TGV between."
              dates="Jun 12 – Jun 24, 2025"
              cities="2 cities · 4 stops"
              tone="amber"
            />
          </div>
        </section>

        <section>
          <SectionGroupHeader title="Completed" count={2} dot="ink" />
          <div style={{display:'flex', flexDirection:'column', gap:14}}>
            <TripCardWide
              title="Andalusian Loop"
              status="Completed"
              overview="Sevilla → Córdoba → Granada → Málaga. Tapas every night, flamenco at El Arenal, Alhambra at sunrise."
              dates="Mar 2 – Mar 14, 2025"
              cities="4 cities · 7 stops"
              tone="amber"
            />
            <TripCardWide
              title="Northern Lights Run"
              status="Completed"
              overview="Reykjavík base, three nights chasing the aurora out toward Vík. Glacier hike on day five."
              dates="Jan 8 – Jan 18, 2025"
              cities="3 cities · 4 stops"
              tone="blue"
            />
          </div>
        </section>
      </PageBody>
    </div>
  );
}

function SectionGroupHeader({ title, count, dot }) {
  return (
    <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:14}}>
      <span className={'tl-dot tl-dot--' + dot}></span>
      <h2 style={{fontFamily:'var(--tl-display)', fontSize:24, fontWeight:600}}>{title}</h2>
      <span className="tl-badge tl-badge--completed">{count}</span>
      <span style={{flex:1, height:1, background:'var(--tl-border)'}}></span>
    </div>
  );
}

function ScreenProfile() {
  return (
    <div className="tl-screen" style={{overflowY:'auto'}}>
      <Navbar active="" />
      <PageBody style={{paddingTop:32}}>
        <div className="tl-card" style={{padding:28, display:'grid', gridTemplateColumns:'180px 1fr auto', gap:28, alignItems:'center'}}>
          <div className="tl-avatar" style={{width:160, height:160, fontSize:48, borderRadius:16,
            background:'linear-gradient(135deg, #F4D9A4, #E0AC58)'}}>
            JD
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:14}}>
            <div>
              <span className="tl-eyebrow">Profile</span>
              <h1 style={{fontFamily:'var(--tl-display)', fontSize:34, fontWeight:600, marginTop:2}}>James Doe</h1>
              <p className="tl-muted" style={{fontSize:13.5}}>Joined March 2024 · 8 trips · 23 cities</p>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:18, marginTop:6}}>
              <ProfileField label="Email"   value="james@example.com" />
              <ProfileField label="Phone"   value="+1 555 0142" />
              <ProfileField label="City"    value="Brooklyn" />
              <ProfileField label="Country" value="United States" />
            </div>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:8}}>
            <button className="tl-btn tl-btn--primary">{I.edit(14)} Edit profile</button>
            <button className="tl-btn tl-btn--outline tl-btn--sm">Settings</button>
          </div>
        </div>

        <section>
          <SectionH title="Preplanned Trips" sub="Drafts & confirmed itineraries waiting for you" />
          <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:18}}>
            <TripCardPortrait title="Paris & Rome Adventure"  dates="Jun 12 – Jun 24, 2025" place="Europe"      tone="amber" tag="Confirmed" />
            <TripCardPortrait title="Patagonia Trek"           dates="Oct 5 – Oct 22, 2025"  place="Argentina"   tone="green" tag="Draft" />
            <TripCardPortrait title="Morocco High Atlas"       dates="Nov 14 – Nov 24, 2025" place="Marrakesh"   tone="amber" tag="Booking" />
          </div>
        </section>

        <section>
          <SectionH title="Previous Trips" sub="The journeys behind you" />
          <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:18}}>
            <TripCardPortrait title="Andalusian Loop"        dates="Mar 2 – Mar 14, 2025"  place="Spain"     tone="amber" tag="Completed" />
            <TripCardPortrait title="Northern Lights Run"    dates="Jan 8 – Jan 18, 2025"   place="Iceland"   tone="blue"  tag="Completed" />
            <TripCardPortrait title="Coast of Vietnam"       dates="Nov 12 – Nov 26, 2024"  place="Vietnam"   tone="green" tag="Completed" />
          </div>
        </section>
      </PageBody>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div>
      <div className="tl-eyebrow" style={{fontSize:10}}>{label}</div>
      <div style={{fontSize:14, fontWeight:500, marginTop:4}}>{value}</div>
    </div>
  );
}

function ScreenSearch() {
  const results = [
    {name:'Paragliding over Interlaken',     loc:'Interlaken, Switzerland',  cost:'CHF 220', dur:'2.5 hrs', cat:'Adventure', tone:'blue'},
    {name:'Tandem flight at Ölüdeniz',       loc:'Ölüdeniz, Türkiye',        cost:'€110',   dur:'45 min',  cat:'Adventure', tone:'amber'},
    {name:'Paragliding · Pokhara skies',     loc:'Pokhara, Nepal',           cost:'$95',    dur:'30 min',  cat:'Adventure', tone:'green'},
    {name:'Cape Town Lions Head launch',     loc:'Cape Town, South Africa',  cost:'R 1,400', dur:'1 hr',   cat:'Adventure', tone:''},
    {name:'Annecy lakeshore tandem',         loc:'Annecy, France',           cost:'€95',    dur:'40 min',  cat:'Scenic',    tone:'blue'},
    {name:'Tegelberg alpine paragliding',    loc:'Bavaria, Germany',         cost:'€140',   dur:'1.5 hrs', cat:'Scenic',    tone:'green'},
    {name:'Rio Pedra Bonita launch',         loc:'Rio de Janeiro, Brazil',   cost:'R$ 550', dur:'30 min',  cat:'Iconic',    tone:'amber'},
  ];
  return (
    <div className="tl-screen" style={{overflowY:'auto'}}>
      <Navbar active="Explore" />
      <StandardHeader value="Paragliding" />
      <PageBody style={{paddingTop:12}}>
        <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between'}}>
          <div>
            <h2 style={{fontFamily:'var(--tl-display)', fontSize:30, fontWeight:600}}>Results</h2>
            <p className="tl-muted" style={{fontSize:13.5, marginTop:4}}>
              <strong style={{color:'var(--tl-ink)'}}>247</strong> activities matching <em>"Paragliding"</em>
            </p>
          </div>
          <div style={{display:'flex', gap:8}}>
            <FilterPill label="Map view" icon={I.globe(14)} />
            <FilterPill label="Save search" icon={I.plus(13)} />
          </div>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap:14}}>
          {results.map((r, i) => (
            <div key={i} className="tl-card" style={{display:'grid', gridTemplateColumns:'200px 1fr auto', gap:24, padding:18, alignItems:'center'}}>
              <Img tone={r.tone} label={r.cat.toUpperCase()} style={{height:128, borderRadius:8}} />
              <div style={{display:'flex', flexDirection:'column', gap:8, minWidth:0}}>
                <div style={{display:'flex', alignItems:'center', gap:10}}>
                  <h3 style={{fontSize:19, fontWeight:600}}>{r.name}</h3>
                  <span className="tl-badge tl-badge--upcoming">{r.cat}</span>
                </div>
                <p className="tl-muted" style={{fontSize:13.5, display:'flex', gap:14, alignItems:'center'}}>
                  <span style={{display:'flex', alignItems:'center', gap:6}}>{I.pin(13)} {r.loc}</span>
                  <span style={{display:'flex', alignItems:'center', gap:6}}>{I.clock(13)} {r.dur}</span>
                </p>
                <div style={{display:'flex', gap:8, marginTop:4}}>
                  <span className="tl-badge tl-badge--completed">★ 4.9 (1.2k)</span>
                  <span className="tl-badge tl-badge--completed">Free cancel</span>
                  <span className="tl-badge tl-badge--completed">Top rated</span>
                </div>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:8, alignItems:'flex-end'}}>
                <div style={{fontFamily:'var(--tl-display)', fontSize:24, fontWeight:600}}>{r.cost}</div>
                <div style={{fontSize:11.5, color:'var(--tl-muted)'}}>per person</div>
                <button className="tl-btn tl-btn--primary tl-btn--sm" style={{marginTop:6}}>{I.plus(13)} Add to trip</button>
              </div>
            </div>
          ))}
        </div>
      </PageBody>
    </div>
  );
}

Object.assign(window, { ScreenTripListing, ScreenProfile, ScreenSearch, SectionGroupHeader, ProfileField });
