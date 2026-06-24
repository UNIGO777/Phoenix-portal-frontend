import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Lock, CheckCircle } from 'lucide-react';
import api from '../services/api';
import NetworkGlobe from '../components/NetworkGlobe';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const role = searchParams.get('role') || 'user';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = role === 'admin' ? '/auth/admin/reset-password' : '/auth/user/reset-password';
      await api.post(endpoint, { token, password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'radial-gradient(120% 90% at 50% 0%, #0c1a3a 0%, #060b1c 55%, #03060f 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Inter', sans-serif",
          color: '#8ea2c8',
          fontSize: 14,
        }}
      >
        Invalid reset link. Please request a new one.
      </div>
    );
  }

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
      <NetworkGlobe />

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
            {/* ── SUCCESS VIEW ── */}
            {success ? (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'rgba(70,226,154,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 18px',
                  }}
                >
                  <CheckCircle size={22} color="#46e29a" />
                </div>
                <div
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 17,
                    fontWeight: 600,
                    color: '#eef3ff',
                    marginBottom: 8,
                  }}
                >
                  Password reset successful
                </div>
                <div style={{ fontSize: 13, color: '#8ea2c8', lineHeight: 1.5, marginBottom: 24 }}>
                  Your password has been updated. You can now log in with your new password.
                </div>
                <button
                  onClick={() => navigate('/')}
                  style={{
                    width: '100%',
                    padding: 14,
                    border: 'none',
                    borderRadius: 12,
                    background: 'linear-gradient(135deg,#2f6bff,#5b8cff 60%,#7fa6ff)',
                    color: '#fff',
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: '.04em',
                    cursor: 'pointer',
                    boxShadow: '0 12px 32px rgba(50,110,255,.4), inset 0 1px 0 rgba(255,255,255,.3)',
                  }}
                >
                  BACK TO LOGIN
                </button>
              </div>
            ) : (
              /* ── RESET FORM VIEW ── */
              <>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, cursor: 'pointer', color: '#7fa6ff', fontSize: 13 }}
                  onClick={() => navigate('/')}
                >
                  <ChevronLeft size={14} /> Back to login
                </div>
                <div
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 17,
                    fontWeight: 600,
                    color: '#eef3ff',
                    letterSpacing: '.01em',
                  }}
                >
                  Set new password
                </div>
                <div style={{ fontSize: 12, color: '#8ea2c8', marginBottom: 24, lineHeight: 1.5 }}>
                  Enter your new password below. Must be at least 6 characters.
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
                  {/* New Password */}
                  <div style={{ position: 'relative' }}>
                    <Lock
                      size={16}
                      color="#7f93bd"
                      style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={inputStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>

                  {/* Confirm Password */}
                  <div style={{ position: 'relative' }}>
                    <Lock
                      size={16}
                      color="#7f93bd"
                      style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      style={inputStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>

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
                    {isLoading ? 'RESETTING...' : 'RESET PASSWORD'}
                  </button>
                </form>
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
        PHOENIX BUSINESS EXCHANGE · HIGHLY CONFIDENTIAL · ENCRYPTED CHANNEL
      </div>
    </div>
  );
}
