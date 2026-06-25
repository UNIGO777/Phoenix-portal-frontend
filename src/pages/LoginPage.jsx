import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft } from 'lucide-react';
import NetworkGlobe from '../components/NetworkGlobe';
import LogoImg from '../assets/Logo.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const [view, setView] = useState('login'); // 'login' | 'otp'

  // OTP states
  const [otpEmail, setOtpEmail] = useState('');
  const [otpRememberMe, setOtpRememberMe] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await login(email, password, remember);
      if (data.data?.otpRequired) {
        setOtpEmail(data.data.email);
        setOtpRememberMe(data.data.rememberMe || false);
        setView('otp');
        setOtp('');
        setOtpError('');
      } else {
        navigate('/home');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp.trim()) { setOtpError('Please enter the OTP'); return; }
    setOtpLoading(true);
    setOtpError('');
    try {
      await verifyOtp(otpEmail, otp.trim(), otpRememberMe);
      navigate('/home');
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
      await login(email, password, remember);
      setOtp('');
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '13px 14px 13px 40px',
    borderRadius: 11,
    border: '1px solid rgba(150,190,255,.2)',
    background: 'rgba(6,12,28,.45)',
    color: '#eef3ff',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = 'rgba(110,170,255,.7)';
    e.target.style.boxShadow = '0 0 0 3px rgba(80,140,255,.18)';
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = 'rgba(150,190,255,.2)';
    e.target.style.boxShadow = 'none';
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
      {/* Globe */}
      <NetworkGlobe />

      {/* Branding */}
      <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', marginTop: 44 }}>
        <img src={LogoImg} alt="Phoenix Business Advisory" style={{ height: 44, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
      </div>

      {/* Glass Panel */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '54%',
          transform: 'translate(-50%,-50%)',
          zIndex: 3,
          width: 'min(90vw,360px)',
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
            animation: 'pbxFloat 7s ease-in-out infinite',
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
                <div
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 17,
                    fontWeight: 600,
                    color: '#eef3ff',
                    letterSpacing: '.01em',
                  }}
                >
                  Access the Exchange
                </div>
                <div style={{ fontSize: 12, color: '#8ea2c8', marginBottom: 24 }}>
                  Encrypted credentials required
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
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={inputStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
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
                      style={inputStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>

                  {/* Remember / Reset */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      margin: '0 0 4px',
                      fontSize: 12,
                    }}
                  >
                    <label
                      style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#9fb0d4', cursor: 'pointer' }}
                    >
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        style={{ accentColor: '#5b8cff' }}
                      />
                      Remember me
                    </label>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: 14,
                      border: 'none',
                      borderRadius: 12,
                      background: isLoading
                        ? 'linear-gradient(135deg,#1d4abf,#3a6adf)'
                        : 'linear-gradient(135deg,#2f6bff,#5b8cff 60%,#7fa6ff)',
                      color: '#fff',
                      fontFamily: "'Sora', sans-serif",
                      fontSize: 14,
                      fontWeight: 600,
                      letterSpacing: '.04em',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 12px 32px rgba(50,110,255,.4), inset 0 1px 0 rgba(255,255,255,.3)',
                      opacity: isLoading ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.target.style.filter = 'brightness(1.08)';
                        e.target.style.boxShadow = '0 14px 40px rgba(60,130,255,.55), inset 0 1px 0 rgba(255,255,255,.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.filter = 'none';
                      e.target.style.boxShadow = '0 12px 32px rgba(50,110,255,.4), inset 0 1px 0 rgba(255,255,255,.3)';
                    }}
                  >
                    {isLoading ? 'AUTHENTICATING...' : 'ENTER PORTAL'}
                  </button>

                  {/* OTP notice */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 14 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7f93bd" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2 4 5v6c0 5 3.4 8.6 8 11 4.6-2.4 8-6 8-11V5l-8-3Z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                    <span style={{ fontSize: 11, color: '#7f93bd' }}>
                      OTP verification will be sent to your email
                    </span>
                  </div>
                </form>
              </>
            )}

            {/* ── OTP VIEW ── */}
            {view === 'otp' && (
              <>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, cursor: 'pointer', color: '#7fa6ff', fontSize: 13 }}
                  onClick={() => { setView('login'); setOtpError(''); setOtp(''); }}
                >
                  <ChevronLeft size={14} /> Back to login
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
                    {otpLoading ? 'VERIFYING...' : 'VERIFY & ENTER PORTAL'}
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

            {/* Confidential badge — only on login view */}
            {view === 'login' && (
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    marginTop: 20,
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: '#ff5a3c',
                      animation: 'pbxPulse 1.8s ease-in-out infinite',
                      display: 'inline-block',
                    }}
                  />
                  <span
                    style={{
                      fontSize: 10,
                      letterSpacing: '.2em',
                      color: '#ffb39c',
                      fontWeight: 600,
                    }}
                  >
                    HIGHLY CONFIDENTIAL · RESTRICTED ACCESS
                  </span>
                </div>

                {/* Visa badges */}
                <div
                  className="login-badges"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: 14,
                    marginTop: 14,
                    paddingTop: 14,
                    borderTop: '1px solid rgba(170,200,255,.14)',
                  }}
                >
                  {['Visa', 'Green Card', 'Permanent Residency'].map((label) => (
                    <span
                      key={label}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#bcd0f2' }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="rgba(60,200,130,.18)" />
                        <path
                          d="M7 12.5l3.2 3.2L17 9"
                          stroke="#46e29a"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {label}
                    </span>
                  ))}
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
        <img src={LogoImg} alt="Phoenix Business Advisory" style={{ height: 14, objectFit: 'contain', filter: 'brightness(0) invert(0.4)' }} />
        · HIGHLY CONFIDENTIAL · ENCRYPTED CHANNEL
      </div>
    </div>
  );
}
