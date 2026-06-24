import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dot } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, verifyOtp } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP states
  const [view, setView] = useState('login'); // 'login' | 'otp'
  const [otpEmail, setOtpEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data.data?.otpRequired) {
        setOtpEmail(data.data.email);
        setView('otp');
        setOtp('');
        setOtpError('');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp.trim()) { setOtpError('Please enter the OTP'); return; }
    setOtpLoading(true);
    setOtpError('');

    try {
      await verifyOtp(otpEmail, otp.trim());
      navigate('/admin/dashboard');
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpError('');
    setOtpLoading(true);
    try {
      await login(email, password);
      setOtpError('');
      setOtp('');
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        background: 'radial-gradient(120% 90% at 50% 0%, #0c1a3a 0%, #060b1c 55%, #03060f 100%)',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Ambient glow orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '30%',
          width: '40%',
          height: '50%',
          background: 'radial-gradient(circle, rgba(50,100,200,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-10%',
          width: '40%',
          height: '40%',
          background: 'radial-gradient(circle, rgba(255,100,60,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Grid pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />

      {/* Branding */}
      <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', marginTop: 44 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 9,
              background: 'linear-gradient(150deg,#ff7a45,#ff4d4d)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 22px rgba(255,90,60,.5)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2c1.5 3 .5 4.8-.8 6.2C9.4 10.3 8 12 8 14.5a4 4 0 0 0 8 .2c0-.9-.2-1.7-.6-2.5 1.8 1 2.6 2.8 2.6 4.8a6 6 0 1 1-9.7-4.7C10.4 9.2 12 6.5 12 2Z"
                fill="#fff"
              />
            </svg>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 700,
                fontSize: 20,
                letterSpacing: '.04em',
                color: '#fff',
                lineHeight: 1,
              }}
            >
              PHOENIX
            </div>
            <div
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 500,
                fontSize: 12,
                letterSpacing: '.42em',
                color: '#ff8a5c',
                lineHeight: 1,
                marginTop: 4,
              }}
            >
              BUSINESS EXCHANGE
            </div>
          </div>
        </div>
      </div>

      {/* Glass Login Panel */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '54%',
          transform: 'translate(-50%,-50%)',
          zIndex: 3,
          width: 'min(90vw,380px)',
        }}
      >
        <div
          className="login-glass-panel"
          style={{
            width: '100%',
            padding: '36px 34px 30px',
            borderRadius: 24,
            background: 'linear-gradient(160deg, rgba(120,160,230,.06), rgba(20,40,90,.04))',
            backdropFilter: 'blur(6px) saturate(150%)',
            WebkitBackdropFilter: 'blur(6px) saturate(150%)',
            border: '1px solid rgba(170,200,255,.22)',
            boxShadow:
              '0 24px 70px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.22), inset 0 0 70px rgba(90,150,255,.06)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Diagonal glass sheen */}
          <div
            style={{
              position: 'absolute',
              top: '-40%',
              left: '-30%',
              width: '80%',
              height: '180%',
              transform: 'rotate(20deg)',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.10), transparent)',
              pointerEvents: 'none',
            }}
          />
          {/* Glowing rim arc */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 22,
              pointerEvents: 'none',
              boxShadow: 'inset 0 0 0 1px rgba(120,180,255,.12)',
              background: 'radial-gradient(120% 60% at 50% -10%, rgba(90,150,255,.25), transparent 60%)',
            }}
          />

          <div style={{ position: 'relative' }}>
            {/* ── LOGIN VIEW ── */}
            {view === 'login' && (
              <>
                {/* Title with shield icon */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2 4 5v6c0 5 3.4 8.6 8 11 4.6-2.4 8-6 8-11V5l-8-3Z"
                      stroke="#7fa6ff"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <path d="M9 12l2 2 4-4" stroke="#7fa6ff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: 17,
                      fontWeight: 600,
                      color: '#eef3ff',
                      letterSpacing: '.01em',
                    }}
                  >
                    Command Center
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#8ea2c8', marginBottom: 24 }}>
                  Restricted administrative access
                </div>

                {error && (
                  <div
                    style={{
                      background: 'rgba(255,60,60,.12)',
                      border: '1px solid rgba(255,80,80,.3)',
                      borderRadius: 10,
                      padding: '10px 14px',
                      marginBottom: 16,
                      fontSize: 13,
                      color: '#ff8a8a',
                    }}
                  >
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {/* Email */}
                  <div style={{ position: 'relative' }}>
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }}
                    >
                      <circle cx="12" cy="8" r="4" stroke="#7f93bd" strokeWidth="1.7" />
                      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="#7f93bd" strokeWidth="1.7" />
                    </svg>
                    <input
                      type="email"
                      placeholder="Admin email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{
                        width: '100%', padding: '13px 14px 13px 40px', borderRadius: 11,
                        border: '1px solid rgba(150,190,255,.2)', background: 'rgba(6,12,28,.45)',
                        color: '#eef3ff', fontSize: 14, outline: 'none', boxSizing: 'border-box',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = 'rgba(110,170,255,.7)'; e.target.style.boxShadow = '0 0 0 3px rgba(80,140,255,.18)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(150,190,255,.2)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

                  {/* Password */}
                  <div style={{ position: 'relative' }}>
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }}
                    >
                      <rect x="5" y="10" width="14" height="10" rx="2" stroke="#7f93bd" strokeWidth="1.7" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="#7f93bd" strokeWidth="1.7" />
                    </svg>
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        width: '100%', padding: '13px 14px 13px 40px', borderRadius: 11,
                        border: '1px solid rgba(150,190,255,.2)', background: 'rgba(6,12,28,.45)',
                        color: '#eef3ff', fontSize: 14, outline: 'none', boxSizing: 'border-box',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = 'rgba(110,170,255,.7)'; e.target.style.boxShadow = '0 0 0 3px rgba(80,140,255,.18)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(150,190,255,.2)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%', padding: 14, border: 'none', borderRadius: 12,
                      background: loading ? 'linear-gradient(135deg,#1d4abf,#3a6adf)' : 'linear-gradient(135deg,#2f6bff,#5b8cff 60%,#7fa6ff)',
                      color: '#fff', fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 600,
                      letterSpacing: '.04em', cursor: loading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 12px 32px rgba(50,110,255,.4), inset 0 1px 0 rgba(255,255,255,.3)',
                      opacity: loading ? 0.7 : 1, marginTop: 4,
                    }}
                    onMouseEnter={(e) => { if (!loading) { e.target.style.filter = 'brightness(1.08)'; e.target.style.boxShadow = '0 14px 40px rgba(60,130,255,.55), inset 0 1px 0 rgba(255,255,255,.4)'; } }}
                    onMouseLeave={(e) => { e.target.style.filter = 'none'; e.target.style.boxShadow = '0 12px 32px rgba(50,110,255,.4), inset 0 1px 0 rgba(255,255,255,.3)'; }}
                  >
                    {loading ? 'AUTHENTICATING...' : 'ACCESS COMMAND CENTER'}
                  </button>
                </form>

                {/* Admin badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 22 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff5a3c', animation: 'adminPulse 1.8s ease-in-out infinite', display: 'inline-block' }} />
                  <span style={{ fontSize: 10, letterSpacing: '.2em', color: '#ffb39c', fontWeight: 600 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>ADMIN ACCESS <Dot size={16} /> RESTRICTED</span>
                  </span>
                </div>

                {/* Demo credentials */}
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(170,200,255,.14)', textAlign: 'center' }}>
                  <span style={{ fontSize: 11, color: '#6b7fa0' }}>
                    Demo: naman13399@gmail.com / Naman@13399
                  </span>
                </div>
              </>
            )}

            {/* ── OTP VIEW ── */}
            {view === 'otp' && (
              <>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, cursor: 'pointer', color: '#7fa6ff', fontSize: 13 }}
                  onClick={() => { setView('login'); setOtpError(''); setOtp(''); }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                  Back to login
                </div>

                <div style={{ textAlign: 'center', marginBottom: 8 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(91,140,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7fa6ff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2 4 5v6c0 5 3.4 8.6 8 11 4.6-2.4 8-6 8-11V5l-8-3Z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 17, fontWeight: 600, color: '#eef3ff', letterSpacing: '.01em' }}>
                    Verify Identity
                  </div>
                  <div style={{ fontSize: 12, color: '#8ea2c8', marginTop: 6, lineHeight: 1.5 }}>
                    A 6-digit code has been sent to<br />
                    <strong style={{ color: '#bcd0f2' }}>{otpEmail}</strong>
                  </div>
                </div>

                {otpError && (
                  <div style={{ background: 'rgba(255,60,60,.12)', border: '1px solid rgba(255,80,80,.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#ff8a8a' }}>
                    {otpError}
                  </div>
                )}

                <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 20 }}>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    autoFocus
                    style={{
                      width: '100%', padding: '16px 14px', borderRadius: 11,
                      border: '1px solid rgba(150,190,255,.2)', background: 'rgba(6,12,28,.45)',
                      color: '#7fa6ff', fontSize: 28, fontWeight: 700, letterSpacing: '0.3em',
                      textAlign: 'center', outline: 'none', boxSizing: 'border-box',
                      fontFamily: "'Courier New', monospace",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = 'rgba(110,170,255,.7)'; e.target.style.boxShadow = '0 0 0 3px rgba(80,140,255,.18)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(150,190,255,.2)'; e.target.style.boxShadow = 'none'; }}
                  />

                  <button
                    type="submit"
                    disabled={otpLoading || otp.length !== 6}
                    style={{
                      width: '100%', padding: 14, border: 'none', borderRadius: 12,
                      background: (otpLoading || otp.length !== 6) ? 'linear-gradient(135deg,#1d4abf,#3a6adf)' : 'linear-gradient(135deg,#2f6bff,#5b8cff 60%,#7fa6ff)',
                      color: '#fff', fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 600,
                      letterSpacing: '.04em', cursor: (otpLoading || otp.length !== 6) ? 'not-allowed' : 'pointer',
                      boxShadow: '0 12px 32px rgba(50,110,255,.4), inset 0 1px 0 rgba(255,255,255,.3)',
                      opacity: (otpLoading || otp.length !== 6) ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => { if (!otpLoading && otp.length === 6) { e.target.style.filter = 'brightness(1.08)'; } }}
                    onMouseLeave={(e) => { e.target.style.filter = 'none'; }}
                  >
                    {otpLoading ? 'VERIFYING...' : 'VERIFY & LOGIN'}
                  </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: 18 }}>
                  <span
                    onClick={handleResendOtp}
                    style={{ fontSize: 12, color: '#7fa6ff', cursor: 'pointer', textDecoration: 'none' }}
                  >
                    Didn't receive the code? Resend
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="login-footer"
        style={{
          position: 'relative',
          zIndex: 3,
          marginTop: 'auto',
          padding: '26px 0 20px',
          fontSize: 11,
          letterSpacing: '.18em',
          color: '#46577a',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2 4 5v6c0 5 3.4 8.6 8 11 4.6-2.4 8-6 8-11V5l-8-3Z"
            stroke="#46577a"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
        <span style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>PHOENIX BUSINESS EXCHANGE <Dot size={16} /> ADMIN PORTAL <Dot size={16} /> ENCRYPTED CHANNEL</span>
      </div>

      <style>{`
        @keyframes adminPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}
