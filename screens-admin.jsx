// screens-admin-notes-invoice.jsx — Admin, Notes, Invoice

function ScreenAdmin() {
  return (
    <div className="tl-screen" style={{overflowY:'auto'}}>
      <Navbar active="" />
      <StandardHeader />
      <PageBody style={{paddingTop:8}}>
        <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between'}}>
          <div>
            <span className="tl-eyebrow">Admin panel</span>
            <h1 style={{fontFamily:'var(--tl-display)', fontSize:34, fontWeight:600, marginTop:4}}>Operations overview</h1>
            <p className="tl-muted" style={{fontSize:13.5, marginTop:6}}>Last sync · 3 minutes ago</p>
          </div>
          <div style={{display:'flex', gap:18}}>
            <Stat label="Active users" v="12,481" delta="+4.2%" />
            <Stat label="Trips this week" v="1,940" delta="+11%" />
            <Stat label="MRR" v="$84.2k" delta="+2.8%" />
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:18}}>
          <Panel title="Manage Users" sub="3 actions pending" action={<button className="tl-btn tl-btn--outline tl-btn--sm">Open table</button>}>
            <table style={{width:'100%', fontSize:13, borderCollapse:'collapse'}}>
              <thead>
                <tr style={{textAlign:'left', color:'var(--tl-muted)', fontSize:11, textTransform:'uppercase', letterSpacing:0.08}}>
                  <th style={th}>User</th><th style={th}>Plan</th><th style={th}>Trips</th><th style={th}>Status</th><th style={th}></th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['James Doe',     'Pro',  8,  'active'],
                  ['Mira Kapoor',   'Free', 3,  'active'],
                  ['Tomás Reyes',   'Pro',  14, 'flagged'],
                  ['Noor Ahmed',    'Pro',  21, 'active'],
                  ['Sasha Lin',     'Free', 1,  'pending'],
                ].map((r,i)=>(
                  <tr key={i} style={{borderTop:'1px solid var(--tl-border)'}}>
                    <td style={td}><span style={{display:'flex', alignItems:'center', gap:8}}><span className="tl-avatar" style={{width:26, height:26, fontSize:10}}>{r[0].split(' ').map(s=>s[0]).join('')}</span>{r[0]}</span></td>
                    <td style={td}>{r[1]}</td>
                    <td style={td} className="tl-mono">{r[2]}</td>
                    <td style={td}><span className={'tl-badge tl-badge--'+(r[3]==='flagged'?'danger':r[3]==='pending'?'ongoing':'upcoming')}>{r[3]}</span></td>
                    <td style={{...td, textAlign:'right'}}><button className="tl-btn tl-btn--ghost tl-btn--sm">{I.edit(13)}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <Panel title="Popular Cities" sub="Last 30 days">
            {[
              ['Lisbon',     'Portugal',   1840, 78],
              ['Kyoto',      'Japan',      1680, 71],
              ['Marrakesh',  'Morocco',    1410, 60],
              ['Reykjavík',  'Iceland',    1290, 55],
              ['Cape Town',  'S. Africa',  1140, 48],
            ].map(([c, co, n, w], i)=>(
              <div key={i} style={{display:'grid', gridTemplateColumns:'160px 1fr 70px', gap:14, alignItems:'center', padding:'10px 0', borderTop: i?'1px dashed var(--tl-border)':'0'}}>
                <div><div style={{fontWeight:600, fontSize:14}}>{c}</div><div style={{fontSize:11.5, color:'var(--tl-muted)'}}>{co}</div></div>
                <div style={{height:8, borderRadius:999, background:'var(--tl-border)', position:'relative'}}>
                  <div style={{position:'absolute', inset:'0 auto 0 0', width:w+'%', background:'var(--tl-amber)', borderRadius:999}}></div>
                </div>
                <div className="tl-mono" style={{textAlign:'right', fontSize:13, fontWeight:500}}>{n.toLocaleString()}</div>
              </div>
            ))}
          </Panel>

          <Panel title="Popular Activities" sub="By bookings this month">
            {[
              ['Walking tours',          820],
              ['Food experiences',       740],
              ['Museum entries',         650],
              ['Boat & cruises',         480],
              ['Adventure (paragliding, etc.)', 410],
              ['Cooking classes',        320],
            ].map(([n,c], i)=>(
              <div key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderTop:i?'1px dashed var(--tl-border)':'0'}}>
                <span style={{fontSize:13.5}}>{n}</span>
                <span className="tl-badge tl-badge--completed tl-mono">{c}</span>
              </div>
            ))}
          </Panel>

          <Panel title="User Trends and Analytics" sub="Trips planned · last 7 days" action={<span className="tl-badge tl-badge--upcoming">{I.trend(12)} +18%</span>}>
            <ChartBars />
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14, marginTop:16, paddingTop:16, borderTop:'1px solid var(--tl-border)'}}>
              <Stat label="Plan→complete" v="64%" delta="+3pt" tight />
              <Stat label="Avg cities" v="2.8" delta="+0.2" tight />
              <Stat label="Avg budget" v="$2.1k" delta="-$80" tight neg />
            </div>
          </Panel>
        </div>
      </PageBody>
    </div>
  );
}
const th = {padding:'10px 8px', fontWeight:600};
const td = {padding:'10px 8px'};

function Stat({ label, v, delta, neg, tight }) {
  return (
    <div style={{padding: tight?0:'0', minWidth:120}}>
      <div className="tl-eyebrow" style={{fontSize:10}}>{label}</div>
      <div style={{fontFamily:'var(--tl-display)', fontSize:tight?20:24, fontWeight:600, marginTop:2}}>{v}</div>
      <div style={{fontSize:11.5, color: neg?'var(--tl-danger)':'var(--tl-forest)', marginTop:2, fontWeight:500}}>{delta}</div>
    </div>
  );
}
function Panel({ title, sub, action, children }) {
  return (
    <div className="tl-card" style={{padding:24, display:'flex', flexDirection:'column', gap:16}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
        <div>
          <h3 style={{fontFamily:'var(--tl-display)', fontSize:20, fontWeight:600}}>{title}</h3>
          {sub && <div style={{fontSize:12, color:'var(--tl-muted)', marginTop:2}}>{sub}</div>}
        </div>
        {action}
      </div>
      <div>{children}</div>
    </div>
  );
}
function ChartBars() {
  const data = [40, 62, 38, 78, 54, 88, 72];
  const days = ['M','T','W','T','F','S','S'];
  return (
    <div style={{display:'flex', alignItems:'flex-end', gap:14, height:140, padding:'8px 0'}}>
      {data.map((v,i)=>(
        <div key={i} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:8}}>
          <div style={{width:'100%', height:v+'%', background: i===5?'var(--tl-amber)':'var(--tl-ink)', borderRadius:'6px 6px 0 0', position:'relative'}}>
            <span style={{position:'absolute', top:-20, left:'50%', transform:'translateX(-50%)', fontSize:10.5, fontFamily:'var(--tl-mono)', color:'var(--tl-muted)'}}>{v*4}</span>
          </div>
          <span style={{fontSize:11, color:'var(--tl-muted)'}}>{days[i]}</span>
        </div>
      ))}
    </div>
  );
}

function ScreenNotes() {
  const [tab, setTab] = useState('All');
  const notes = [
    {title:'Hotel check-in details — Rome stop', body:'Check in after 2pm, room 302, breakfast included (7-10am). Concierge holds bags before 2.', meta:'Day 3 · Jun 14, 2025', stamp:'14:32', tag:'Logistics'},
    {title:'Restaurant: Pierluigi (must-book)',  body:'Reservation under James, 8:30pm. Ask for the patio if weather holds. Fritto misto + carbonara, share both.', meta:'Day 4 · Jun 15, 2025', stamp:'09:11', tag:'Food'},
    {title:'Pantheon entry — go early',           body:'Free before 9am, big lines after. Walk down Via dei Coronari from the hotel; coffee at Sant Eustachio on the way.', meta:'Day 5 · Jun 16, 2025', stamp:'07:48', tag:'Sights'},
  ];
  return (
    <div className="tl-screen" style={{overflowY:'auto'}}>
      <Navbar active="Notes" />
      <StandardHeader />
      <PageBody style={{paddingTop:8}}>
        <div>
          <span className="tl-eyebrow">Trip journal</span>
          <h1 style={{fontFamily:'var(--tl-display)', fontSize:36, fontWeight:600, marginTop:4}}>Trip notes</h1>
          <p className="tl-muted" style={{fontSize:13.5, marginTop:6}}>Trip: Paris &amp; Rome Adventure · 8 notes</p>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div className="tl-tabs">
            {['All', 'by Day', 'by stop'].map(t => (
              <button key={t} className={'tl-tab' + (tab===t?' is-active':'')} onClick={()=>setTab(t)}>{t}</button>
            ))}
          </div>
          <button className="tl-btn tl-btn--primary">{I.plus(15)} Add Note</button>
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:14}}>
          {notes.map((n,i)=>(
            <div key={i} className="tl-card" style={{padding:'22px 24px', display:'flex', flexDirection:'column', gap:10}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div style={{display:'flex', alignItems:'center', gap:10}}>
                  <h3 style={{fontFamily:'var(--tl-display)', fontSize:20, fontWeight:600}}>{n.title}</h3>
                  <span className="tl-badge tl-badge--upcoming">{n.tag}</span>
                </div>
                <div style={{display:'flex', gap:6}}>
                  <button className="tl-btn tl-btn--ghost tl-btn--sm">{I.edit(13)}</button>
                  <button className="tl-btn tl-btn--ghost tl-btn--sm">{I.share(13)}</button>
                </div>
              </div>
              <p style={{fontSize:14, lineHeight:1.6, color:'var(--tl-ink)'}}>{n.body}</p>
              <div style={{display:'flex', gap:14, fontSize:12, color:'var(--tl-muted)', alignItems:'center', marginTop:6, paddingTop:12, borderTop:'1px dashed var(--tl-border)'}}>
                <span style={{display:'flex', alignItems:'center', gap:5}}>{I.cal(12)} {n.meta}</span>
                <span style={{display:'flex', alignItems:'center', gap:5}}>{I.clock(12)} {n.stamp}</span>
                <span style={{flex:1}}></span>
                <span className="tl-mono">note-{String(i+1).padStart(3,'0')}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{display:'flex', justifyContent:'flex-end'}}>
          <button className="tl-btn tl-btn--outline">{I.plus(14)} Add Note</button>
        </div>
      </PageBody>
    </div>
  );
}

function ScreenInvoice() {
  const items = [
    [1, 'hotel',     'Hotel booking — Paris (Le Marais)',     '3 nights',  3000,  9000],
    [2, 'travel',    'Flight bookings (DEL → PAR)',           '4 pax',     12000, 12000],
    [3, 'travel',    'TGV Paris → Rome',                      '4 pax',     320,   1280],
    [4, 'food',      'Group dinner — Trastevere',             '1 evening', 280,   280],
    [5, 'activity',  'Vatican early-access tour',             '4 pax',     85,    340],
  ];
  return (
    <div className="tl-screen" style={{display:'flex', flexDirection:'column', overflow:'hidden'}}>
      <Navbar active="My Trips" />
      <div style={{padding:'18px 48px 0', display:'flex', alignItems:'center', gap:8}}>
        <button className="tl-btn tl-btn--ghost tl-btn--sm">{I.arrLeft(13)} back to My Trips</button>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'380px 1fr', gap:24, padding:'18px 48px 48px', flex:1, overflow:'hidden'}}>
        {/* Sidebar */}
        <aside style={{display:'flex', flexDirection:'column', gap:16, overflowY:'auto'}}>
          <div className="tl-card" style={{padding:22}}>
            <span className="tl-eyebrow">Trip</span>
            <h2 style={{fontFamily:'var(--tl-display)', fontSize:22, fontWeight:600, marginTop:4}}>Trip to Europe Adventure</h2>
            <p className="tl-muted" style={{fontSize:12.5, marginTop:6}}>May 25 – Jan 05, 2025 · 4 cities · created by James</p>
            <div className="tl-search" style={{marginTop:16, height:42}}>
              {I.search(15)}
              <input placeholder="Search invoices......" />
            </div>
          </div>

          <div className="tl-card" style={{padding:0}}>
            <div style={{padding:'18px 22px 12px', borderBottom:'1px solid var(--tl-border)'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <h3 style={{fontFamily:'var(--tl-display)', fontSize:16, fontWeight:600}}>Packing checklist</h3>
                <span className="tl-badge tl-badge--upcoming">5/12</span>
              </div>
              <div className="tl-progress" style={{marginTop:10, height:7}}><div className="tl-progress__fill" style={{width:'42%'}}></div></div>
            </div>
            <div style={{padding:'12px 22px 18px'}}>
              {[
                ['Documents', '3/4'],
                ['Clothing',  '1/4'],
                ['Electronics','1/3'],
              ].map(([n,c],i)=>(
                <div key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderTop: i?'1px dashed var(--tl-border)':'0'}}>
                  <div style={{display:'flex', alignItems:'center', gap:8}}>
                    <span className="tl-check is-checked">{I.check(11)}</span>
                    <span style={{fontSize:13}}>{n}</span>
                  </div>
                  <span className="tl-mono" style={{fontSize:12, color:'var(--tl-muted)'}}>{c}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="tl-btn tl-btn--outline tl-btn--block">View Full Budget</button>

          <div className="tl-card" style={{padding:22, background:'var(--tl-ink)', color:'#fff'}}>
            <span className="tl-eyebrow" style={{color:'rgba(255,255,255,0.6)'}}>Budget insights</span>
            <div style={{display:'flex', flexDirection:'column', gap:14, marginTop:14}}>
              <Row k="Total Budget" v="20,000" />
              <Row k="Total Spent"  v="22,000" />
              <Row k="Remaining"    v="−2,000" danger />
            </div>
            <div className="tl-progress" style={{marginTop:18, background:'rgba(255,255,255,0.15)'}}>
              <div className="tl-progress__fill" style={{width:'100%', background:'var(--tl-danger)'}}></div>
            </div>
            <p style={{fontSize:11.5, color:'rgba(255,255,255,0.6)', marginTop:10}}>Over budget by 10% · review hotel & flight line items</p>
          </div>
        </aside>

        {/* Main */}
        <main style={{display:'flex', flexDirection:'column', gap:18, overflowY:'auto'}}>
          <div className="tl-card" style={{padding:28}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:24}}>
              <div>
                <span className="tl-eyebrow">Invoice</span>
                <h1 className="tl-mono" style={{fontSize:24, fontWeight:600, marginTop:4, color:'var(--tl-ink)', fontFamily:'var(--tl-mono)'}}>INV-XYZ-30290</h1>
                <p className="tl-muted" style={{fontSize:13, marginTop:6}}>Generated May 20, 2025 · Currency INR</p>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:8, alignItems:'flex-end'}}>
                <span className="tl-badge tl-badge--ongoing" style={{fontSize:12, padding:'6px 12px'}}>● pending</span>
                <button className="tl-btn tl-btn--primary tl-btn--sm">Mark as paid</button>
              </div>
            </div>
            <div className="tl-divider" style={{margin:'22px 0 18px'}}></div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:24}}>
              <div>
                <div className="tl-eyebrow">Travelers</div>
                <div style={{display:'flex', alignItems:'center', gap:-6, marginTop:8}}>
                  {['JD','AR','JE','CR'].map((a,i)=>(
                    <span key={a} className="tl-avatar" style={{width:34, height:34, fontSize:12, marginLeft:i?-8:0, border:'2px solid #fff'}}>{a}</span>
                  ))}
                  <span style={{marginLeft:10, fontSize:13}}>James, Arjun, Jerry, Cristina</span>
                </div>
              </div>
              <div>
                <div className="tl-eyebrow">Issued to</div>
                <div style={{fontSize:14, fontWeight:500, marginTop:6}}>James Doe · james@example.com</div>
                <div style={{fontSize:12.5, color:'var(--tl-muted)'}}>Brooklyn, United States · +1 555 0142</div>
              </div>
            </div>
          </div>

          <div className="tl-card" style={{padding:0, overflow:'hidden'}}>
            <table style={{width:'100%', borderCollapse:'collapse', fontSize:13.5}}>
              <thead>
                <tr style={{textAlign:'left', background:'var(--tl-input)', color:'var(--tl-muted)', fontSize:11, textTransform:'uppercase', letterSpacing:0.08}}>
                  <th style={{...th, padding:'12px 16px', width:50}}>#</th>
                  <th style={{...th, padding:'12px 16px', width:120}}>Category</th>
                  <th style={{...th, padding:'12px 16px'}}>Description</th>
                  <th style={{...th, padding:'12px 16px', width:140}}>Qty / Details</th>
                  <th style={{...th, padding:'12px 16px', textAlign:'right', width:120}}>Unit Cost</th>
                  <th style={{...th, padding:'12px 16px', textAlign:'right', width:130}}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((r,i)=>(
                  <tr key={i} style={{borderTop:'1px solid var(--tl-border)'}}>
                    <td style={{padding:'14px 16px'}} className="tl-mono">{r[0]}</td>
                    <td style={{padding:'14px 16px'}}><span className="tl-badge tl-badge--completed">{r[1]}</span></td>
                    <td style={{padding:'14px 16px', fontWeight:500}}>{r[2]}</td>
                    <td style={{padding:'14px 16px', color:'var(--tl-muted)'}}>{r[3]}</td>
                    <td style={{padding:'14px 16px', textAlign:'right', fontFamily:'var(--tl-mono)'}}>{r[4].toLocaleString()}</td>
                    <td style={{padding:'14px 16px', textAlign:'right', fontFamily:'var(--tl-mono)', fontWeight:600}}>{r[5].toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{padding:'18px 22px', borderTop:'1px solid var(--tl-border)', display:'flex', flexDirection:'column', gap:8}}>
              <Total k="Subtotal" v="22,900" />
              <Total k="Tax (5%)" v="1,145" />
              <Total k="Discount" v="−245" muted />
              <div style={{height:1, background:'var(--tl-border)', margin:'4px 0'}}></div>
              <Total k="Grand Total" v="₹ 23,800" bold />
            </div>
          </div>

          <div style={{display:'flex', gap:10, justifyContent:'flex-end'}}>
            <button className="tl-btn tl-btn--outline">Download PDF</button>
            <button className="tl-btn tl-btn--outline">Email invoice</button>
            <button className="tl-btn tl-btn--primary">Settle balance</button>
          </div>
        </main>
      </div>
    </div>
  );
}

function Row({ k, v, danger }) {
  return (
    <div style={{display:'flex', justifyContent:'space-between', fontSize:13.5}}>
      <span style={{color:'rgba(255,255,255,0.7)'}}>{k}</span>
      <span className="tl-mono" style={{fontWeight:600, color: danger?'#FCA5A5':'#fff', fontSize:15}}>{v}</span>
    </div>
  );
}
function Total({ k, v, bold, muted }) {
  return (
    <div style={{display:'flex', justifyContent:'space-between', fontSize: bold?17:13.5, fontWeight: bold?700:400}}>
      <span style={{color: muted?'var(--tl-muted)':'var(--tl-ink)'}}>{k}</span>
      <span className="tl-mono" style={{color: muted?'var(--tl-muted)':'var(--tl-ink)', fontWeight: bold?700:500}}>{v}</span>
    </div>
  );
}

Object.assign(window, { ScreenAdmin, ScreenNotes, ScreenInvoice });
