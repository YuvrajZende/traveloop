// screens-trip-detail.jsx — Itinerary View, Community, Packing Checklist

function ScreenItineraryView() {
  const day1 = [
    {time:'09:00', name:'Breakfast at Café de Flore',          dur:'1h',   cost:'€32',  cat:'Food'},
    {time:'10:30', name:'Louvre — Denon wing, ticketed entry', dur:'3h',   cost:'€22',  cat:'Culture'},
    {time:'15:00', name:'Tuileries walk + Angelina hot choco',  dur:'1.5h', cost:'€18',  cat:'Leisure'},
  ];
  const day2 = [
    {time:'08:30', name:'Montmartre at dawn',                  dur:'2h',   cost:'free', cat:'Walk'},
    {time:'12:00', name:"Marais lunch — L'As du Fallafel",     dur:'1h',   cost:'€14',  cat:'Food'},
    {time:'19:30', name:'Seine sunset cruise',                 dur:'1.5h', cost:'€38',  cat:'Scenic'},
  ];
  return (
    <div className="tl-screen" style={{overflowY:'auto'}}>
      <Navbar active="My Trips" />
      <StandardHeader value="paris itinerary" />
      <PageBody style={{paddingTop:10}}>
        <div>
          <span className="tl-eyebrow">Itinerary view</span>
          <h1 style={{fontFamily:'var(--tl-display)', fontSize:36, fontWeight:600, marginTop:6}}>
            Itinerary for a selected place
          </h1>
          <p className="tl-muted" style={{fontSize:13.5, marginTop:6}}>
            Paris, France · Jun 12 – Jun 16, 2025
          </p>
        </div>

        <DayBlock day={1} date="Thu, Jun 12" items={day1} />
        <DayBlock day={2} date="Fri, Jun 13" items={day2} />

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:18}}>
          <div className="tl-card" style={{padding:24}}>
            <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:14}}>
              {I.mountain(18)}
              <h3 style={{fontSize:18, fontWeight:600, fontFamily:'var(--tl-display)'}}>Physical Activity</h3>
            </div>
            <ul style={{listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:10}}>
              {[
                ['Montmartre dawn walk', '2h · 4.8km', 'Light'],
                ['Louvre exploration',  '3h · 2.1km', 'Light'],
                ['Tuileries stroll',    '1.5h · 1.9km','Easy'],
                ['Seine cruise',        '1.5h · sit',  'Rest'],
              ].map(([n,m,t],i) => (
                <li key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:i<3?'1px dashed var(--tl-border)':'0'}}>
                  <div>
                    <div style={{fontWeight:500, fontSize:13.5}}>{n}</div>
                    <div style={{fontSize:12, color:'var(--tl-muted)', marginTop:2}}>{m}</div>
                  </div>
                  <span className="tl-badge tl-badge--upcoming">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="tl-card" style={{padding:24}}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14}}>
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                {I.dollar(18)}
                <h3 style={{fontSize:18, fontWeight:600, fontFamily:'var(--tl-display)'}}>Expense</h3>
              </div>
              <span className="tl-badge tl-badge--completed tl-badge--mono">EUR</span>
            </div>
            <ul style={{listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:10}}>
              {[
                ['Breakfast — Café de Flore',  32],
                ['Louvre tickets',             22],
                ['Tuileries + Angelina',       18],
                ['Lunch — Fallafel',           14],
                ['Seine sunset cruise',        38],
              ].map(([n,c],i) => (
                <li key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:i<4?'1px dashed var(--tl-border)':'0'}}>
                  <span style={{fontSize:13.5}}>{n}</span>
                  <span className="tl-mono" style={{fontWeight:500}}>€{c}</span>
                </li>
              ))}
              <li style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0 0', borderTop:'2px solid var(--tl-ink)', marginTop:6}}>
                <span style={{fontWeight:600}}>Day total</span>
                <span className="tl-mono" style={{fontWeight:700, fontSize:18}}>€124</span>
              </li>
            </ul>
          </div>
        </div>
      </PageBody>
    </div>
  );
}

function DayBlock({ day, date, items }) {
  return (
    <section>
      <div style={{display:'flex', alignItems:'center', gap:18, marginBottom:14}}>
        <div style={{
          background:'var(--tl-ink)', color:'#fff',
          padding:'14px 20px', borderRadius:'12px',
          display:'flex', flexDirection:'column', minWidth:140
        }}>
          <span style={{fontFamily:'var(--tl-mono)', fontSize:11, opacity:0.7, letterSpacing:0.1}}>DAY</span>
          <span style={{fontFamily:'var(--tl-display)', fontSize:38, fontWeight:600, lineHeight:1}}>0{day}</span>
          <span style={{fontSize:12, opacity:0.7, marginTop:2}}>{date}</span>
        </div>
        <div style={{flex:1, height:1, background:'var(--tl-border)'}}></div>
        <span className="tl-badge tl-badge--completed">{items.length} activities</span>
      </div>
      <div style={{display:'flex', flexDirection:'column', gap:10}}>
        {items.map((it, i) => (
          <div key={i} className="tl-card" style={{display:'grid', gridTemplateColumns:'90px 1fr auto auto', gap:20, padding:18, alignItems:'center'}}>
            <div style={{fontFamily:'var(--tl-mono)', fontSize:18, fontWeight:500}}>{it.time}</div>
            <div style={{minWidth:0}}>
              <div style={{fontSize:15.5, fontWeight:600}}>{it.name}</div>
              <div style={{fontSize:12.5, color:'var(--tl-muted)', marginTop:3, display:'flex', gap:12}}>
                <span style={{display:'flex', alignItems:'center', gap:5}}>{I.clock(12)} {it.dur}</span>
                <span className="tl-badge tl-badge--upcoming" style={{padding:'2px 8px', fontSize:10.5}}>{it.cat}</span>
              </div>
            </div>
            <span className="tl-mono" style={{fontWeight:600, fontSize:15}}>{it.cost}</span>
            <button className="tl-btn tl-btn--ghost tl-btn--sm">{I.edit(13)}</button>
          </div>
        ))}
      </div>
    </section>
  );
}

function ScreenCommunity() {
  const posts = [
    {title:'Two weeks slow-traveling Andalusia (Mar 2025)', user:'Mira K.', avatar:'MK',
     desc:"Sevilla → Granada → Córdoba → Málaga. Detailed hotel notes, budget breakdown, the one tapas spot you absolutely should not skip.",
     tags:['Spain', 'Slow travel', '14 days', '€1,820 / pp'], tone:'amber'},
    {title:'Iceland in January, without a rental car',      user:'Tomás R.', avatar:'TR',
     desc:'Bus passes, day tours, and a Reykjavík apartment as base. Aurora luck on night four — full timing notes inside.',
     tags:['Iceland', 'Winter', '10 days', '$2,400 / pp'], tone:'blue'},
    {title:"Coastal Vietnam by motorbike — what I'd redo", user:'Noor A.',  avatar:'NA',
     desc:"From Hội An up the Hải Vân pass to Huế. Honest take on routes, weather windows, and where it got truly hard.",
     tags:['Vietnam', 'Adventure', '21 days', '$1,100 / pp'], tone:'green'},
  ];
  return (
    <div className="tl-screen" style={{overflowY:'auto'}}>
      <Navbar active="Community" />
      <StandardHeader />
      <PageBody style={{paddingTop:8}}>
        <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between'}}>
          <div>
            <span className="tl-eyebrow">Community tab</span>
            <h1 style={{fontFamily:'var(--tl-display)', fontSize:36, fontWeight:600, marginTop:4}}>
              Stories from the road
            </h1>
            <p className="tl-muted" style={{fontSize:13.5, marginTop:6, maxWidth:560}}>
              Itineraries shared by other travelers. Save them, fork them, follow the planners whose taste you trust.
            </p>
          </div>
          <button className="tl-btn tl-btn--primary">{I.share(14)} Share a trip</button>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap:18}}>
          {posts.map((p, i) => (
            <div key={i} className="tl-card" style={{display:'grid', gridTemplateColumns:'320px 1fr auto', gap:24, padding:20}}>
              <Img tone={p.tone} label={p.title.split(' ')[0].toUpperCase()} style={{height:200, borderRadius:8}} />
              <div style={{display:'flex', flexDirection:'column', gap:10, minWidth:0}}>
                <div style={{display:'flex', alignItems:'center', gap:10}}>
                  <span className="tl-avatar" style={{width:32, height:32, fontSize:12}}>{p.avatar}</span>
                  <span style={{fontWeight:500, fontSize:13.5}}>{p.user}</span>
                  <span style={{fontSize:12, color:'var(--tl-muted)'}}>· shared 3 days ago</span>
                </div>
                <h3 style={{fontFamily:'var(--tl-display)', fontSize:22, fontWeight:600, lineHeight:1.2}}>{p.title}</h3>
                <p className="tl-muted" style={{fontSize:13.5, lineHeight:1.55}}>{p.desc}</p>
                <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:4}}>
                  {p.tags.map(t => <span key={t} className="tl-badge tl-badge--completed">{t}</span>)}
                </div>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:8, alignItems:'flex-end', justifyContent:'space-between'}}>
                <div style={{display:'flex', gap:14, fontSize:12.5, color:'var(--tl-muted)'}}>
                  <span>♡ 248</span><span>↳ 32</span>
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:8}}>
                  <button className="tl-btn tl-btn--primary tl-btn--sm">Fork trip</button>
                  <button className="tl-btn tl-btn--outline tl-btn--sm">Save</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PageBody>
    </div>
  );
}

function ScreenChecklist() {
  const cats = [
    {name:'Documents', count:'3/4', items:[
      ['Passport', true],
      ['Flight Tickets (printed)', true],
      ['Travel insurance', true],
      ['Hotel booking confirmation', false],
    ]},
    {name:'Clothing', count:'1/4', items:[
      ['Casual Shirts', true],
      ['Trousers / Jeans', false],
      ['Comfortable walking shoes', false],
      ['Light jacket / windbreaker', false],
    ]},
    {name:'Electronics', count:'1/3', items:[
      ['Phone charger', true],
      ['Universal power adapter', false],
      ['Earphones / Headphones', false],
    ]},
  ];
  return (
    <div className="tl-screen" style={{overflowY:'auto'}}>
      <Navbar active="My Trips" />
      <StandardHeader />
      <PageBody style={{paddingTop:8}}>
        <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between'}}>
          <div>
            <span className="tl-eyebrow">Packing checklist</span>
            <h1 style={{fontFamily:'var(--tl-display)', fontSize:32, fontWeight:600, marginTop:4}}>
              Trip: Paris &amp; Rome Adventure
            </h1>
            <p className="tl-muted" style={{fontSize:13.5, marginTop:6}}>Jun 12 – Jun 24, 2025 · 12 days</p>
          </div>
          <span className="tl-badge tl-badge--upcoming" style={{fontSize:13, padding:'6px 14px'}}>5 / 12 packed</span>
        </div>

        <div className="tl-card" style={{padding:20}}>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:10, fontSize:13}}>
            <span style={{fontWeight:600}}>Progress: 5/12 items packed</span>
            <span className="tl-mono" style={{color:'var(--tl-muted)'}}>42%</span>
          </div>
          <div className="tl-progress"><div className="tl-progress__fill" style={{width:'42%'}}></div></div>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap:14}}>
          {cats.map(c => (
            <div key={c.name} className="tl-card" style={{padding:0}}>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px', borderBottom:'1px solid var(--tl-border)'}}>
                <div style={{display:'flex', alignItems:'center', gap:12}}>
                  {I.chev(14)}
                  <h3 style={{fontFamily:'var(--tl-display)', fontSize:19, fontWeight:600}}>{c.name}</h3>
                  <span className="tl-badge tl-badge--upcoming">{c.count}</span>
                </div>
                <button className="tl-btn tl-btn--ghost tl-btn--sm">{I.plus(13)} Add</button>
              </div>
              <ul style={{listStyle:'none', padding:'8px 22px 12px', margin:0}}>
                {c.items.map(([n,checked],i) => (
                  <li key={i} style={{display:'flex', alignItems:'center', gap:12, padding:'10px 0'}}>
                    <span className={'tl-check' + (checked?' is-checked':'')}>{checked && I.check(12)}</span>
                    <span style={{fontSize:14, color: checked?'var(--tl-muted)':'var(--tl-ink)', textDecoration:checked?'line-through':'none'}}>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{display:'flex', gap:10, alignItems:'center'}}>
          <button className="tl-btn tl-btn--dashed" style={{flex:1}}>{I.plus(15)} Add item to checklist</button>
          <button className="tl-btn tl-btn--outline">Reset all</button>
          <button className="tl-btn tl-btn--outline">{I.share(14)} Share Checklist</button>
        </div>
      </PageBody>
    </div>
  );
}

Object.assign(window, { ScreenItineraryView, ScreenCommunity, ScreenChecklist, DayBlock });
