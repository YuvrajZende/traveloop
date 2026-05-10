// screens-auth.jsx — Login + Register

function ScreenLogin() {
  return (
    <AuthFrame width={460}>
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:18, marginTop:18}}>
        <div className="tl-avatar" style={{width:88, height:88, fontSize:28, background:'linear-gradient(135deg,#F4D9A4,#E0AC58)'}}>
          {I.user(36)}
        </div>
        <div style={{textAlign:'center'}}>
          <h1 style={{fontSize:34, lineHeight:1.1, fontWeight:700}}>Welcome back</h1>
          <p className="tl-muted" style={{fontSize:14, marginTop:6}}>Sign in to keep planning your next escape.</p>
        </div>
        <div style={{width:'100%', display:'flex', flexDirection:'column', gap:14, marginTop:8}}>
          <div className="tl-field">
            <label className="tl-field__label">Username</label>
            <input className="tl-input" placeholder="james.doe" defaultValue="james.doe" />
          </div>
          <div className="tl-field">
            <label className="tl-field__label">Password</label>
            <input className="tl-input" type="password" defaultValue="••••••••••" />
          </div>
          <div style={{display:'flex', justifyContent:'space-between', fontSize:13}}>
            <label style={{display:'flex', alignItems:'center', gap:8, color:'var(--tl-muted)'}}>
              <span className="tl-check is-checked">{I.check(12)}</span> Remember me
            </label>
            <a style={{color:'var(--tl-ink)', fontWeight:500, textDecoration:'underline', textDecorationColor:'var(--tl-amber)'}}>Forgot?</a>
          </div>
          <button className="tl-btn tl-btn--primary tl-btn--lg tl-btn--block" style={{marginTop:6}}>Login</button>
          <div style={{textAlign:'center', fontSize:13, color:'var(--tl-muted)', marginTop:6}}>
            Don't have an account? <a style={{color:'var(--tl-ink)', fontWeight:600}}>Register</a>
          </div>
        </div>
      </div>
    </AuthFrame>
  );
}

function ScreenRegister() {
  return (
    <AuthFrame width={620}>
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:6, marginTop:14}}>
        <div className="tl-avatar" style={{width:84, height:84, position:'relative'}}>
          {I.user(34)}
          <span style={{position:'absolute', bottom:-2, right:-2, background:'var(--tl-ink)', color:'#fff', borderRadius:999, width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center'}}>{I.cam(14)}</span>
        </div>
        <h1 style={{fontSize:30, fontWeight:700, marginTop:10}}>Register Users</h1>
        <p className="tl-muted" style={{fontSize:13.5}}>A few details and you'll be on the road.</p>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginTop:24}}>
        <Field label="First Name" placeholder="James" />
        <Field label="Last Name" placeholder="Doe" />
        <Field label="Email Address" placeholder="james@example.com" />
        <Field label="Phone Number" placeholder="+1 555 0142" />
        <Field label="City" placeholder="Brooklyn" />
        <Field label="Country" placeholder="United States" />
      </div>
      <div className="tl-field" style={{marginTop:14}}>
        <label className="tl-field__label">Additional Information....</label>
        <textarea className="tl-textarea" rows={4} placeholder="Tell us about your travel style, dietary needs, preferred climates..." />
      </div>
      <button className="tl-btn tl-btn--primary tl-btn--lg tl-btn--block" style={{marginTop:18}}>Register Users</button>
      <div style={{textAlign:'center', fontSize:13, color:'var(--tl-muted)', marginTop:14}}>
        Already have an account? <a style={{color:'var(--tl-ink)', fontWeight:600}}>Login</a>
      </div>
    </AuthFrame>
  );
}

function Field({ label, placeholder, value }) {
  return (
    <div className="tl-field">
      <label className="tl-field__label">{label}</label>
      <input className="tl-input" placeholder={placeholder} defaultValue={value} />
    </div>
  );
}

Object.assign(window, { ScreenLogin, ScreenRegister, Field });
