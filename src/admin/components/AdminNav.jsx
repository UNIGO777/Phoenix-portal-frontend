import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoImg from '../../assets/Logo.png';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useSidebar } from '../pages/AdminLayout';

export default function AdminNav() {
  const { logout, admin } = useAdminAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const sidebar = useSidebar();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <nav
      className="admin-nav"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 52,
        background: 'rgba(245,245,247,0.82)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        zIndex: 100,
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Hamburger — hidden on desktop, shown on tablet/mobile via CSS */}
        <button
          className="admin-hamburger"
          onClick={() => sidebar?.setSidebarOpen(!sidebar?.sidebarOpen)}
          style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            border: 'none',
            background: 'rgba(0,0,0,0.04)',
            borderRadius: 8,
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '0.04em',
            color: '#1d1d1f',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
          }}
          onClick={() => navigate('/admin/dashboard')}
        >
          <img src={LogoImg} alt="Phoenix Business Advisory" style={{ height: 24, objectFit: 'contain' }} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
        <span className="admin-name" style={{ fontSize: 12, color: '#6e6e73', fontWeight: 500 }}>
          {admin?.name || 'Admin'}
        </span>

        <div style={{ position: 'relative' }}>
          <span
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#0066cc',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              userSelect: 'none',
            }}
          >
            {admin?.name?.charAt(0).toUpperCase()}
          </span>

          {showUserMenu && (
            <div
              style={{
                position: 'absolute',
                top: 42,
                right: 0,
                background: '#fff',
                borderRadius: 14,
                boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                border: '1px solid rgba(0,0,0,0.06)',
                minWidth: 170,
                zIndex: 101,
                overflow: 'hidden',
              }}
            >
              {admin && (
                <div style={{ padding: '10px 18px 12px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1d1d1f' }}>
                    {admin.name || 'Admin'}
                  </div>
                  <div style={{ fontSize: 11, color: '#86868b', marginTop: 2 }}>{admin.email}</div>
                </div>
              )}
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  border: 'none',
                  background: 'none',
                  color: '#ff3b30',
                  textAlign: 'left',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.target.style.background = '#f5f5f7')}
                onMouseLeave={(e) => (e.target.style.background = 'none')}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
