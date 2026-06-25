import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, ChevronRight, Menu, X } from 'lucide-react';
import LogoImg from '../../assets/Logo.png';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const navItems = [
  { name: 'Marketplace', to: '/home' },
  { name: 'Industries', to: '/search' },
  { name: 'Countries', to: '/search' },
  { name: 'How It Works', to: '#' },
];

const staticMenus = {
  Marketplace: [
    { label: 'Shop', fs: 26, fw: 600, gap: 14, links: [
      { text: 'Browse Listings', to: '/search' },
      { text: 'Featured', to: '/home' },
      { text: 'New on the Market', to: '/search' },
    ]},
    { label: 'Quick Links', fs: 14, fw: 600, gap: 12, links: [
      { text: 'Member Login', to: '/' },
    ]},
  ],
  'How It Works': 'steps',
};

const steps = [
  {
    number: '01',
    title: 'Browse & discover',
    desc: 'Explore verified listings across industries. Filter by price, location, and sector to find your match.',
  },
  {
    number: '02',
    title: 'Request information',
    desc: 'Send an inquiry on any listing. Our team reviews your request and shares detailed financials.',
  },
  {
    number: '03',
    title: 'Due diligence',
    desc: 'Access private data rooms with audited financials, legal documents, and operational details.',
  },
  {
    number: '04',
    title: 'Close the deal',
    desc: 'Work with our team through escrow, legal review, and financing to complete your acquisition.',
  },
];

export default function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [showUser, setShowUser] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [industries, setIndustries] = useState([]);
  const [countries, setCountries] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef(null);

  useEffect(() => {
    api.get('/industries').then((r) => setIndustries(r.data.data || [])).catch(() => {});
    api.get('/countries').then((r) => {
      const d = r.data;
      setCountries(Array.isArray(d) ? d : d.data || []);
    }).catch(() => {});
  }, []);

  // Build Industries menu columns dynamically (split into columns of 5)
  const industryColumns = [];
  const perCol = 5;
  for (let i = 0; i < industries.length; i += perCol) {
    const chunk = industries.slice(i, i + perCol);
    industryColumns.push({
      label: i === 0 ? 'Sectors' : '\u00A0',
      fs: 18,
      fw: 600,
      gap: 12,
      links: chunk.map((ind) => ({ text: ind.name, to: `/search?industry=${ind._id}` })),
    });
  }

  // Build Countries columns (split into columns of 5)
  const countryColumns = [];
  for (let i = 0; i < countries.length; i += perCol) {
    const chunk = countries.slice(i, i + perCol);
    countryColumns.push({
      label: i === 0 ? 'Regions' : '\u00A0',
      fs: 18,
      fw: 600,
      gap: 12,
      links: chunk.map((c) => ({ text: c.name, to: `/search?country=${c._id}` })),
    });
  }

  const menus = {
    ...staticMenus,
    ...(industryColumns.length > 0 ? { Industries: industryColumns } : {}),
    ...(countryColumns.length > 0 ? { Countries: countryColumns } : {}),
  };

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
    navigate('/');
  };

  const handleNavHover = (name) => {
    clearTimeout(closeTimer.current);
    setOpenMenu(menus[name] ? name : null);
  };

  const handleClose = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 80);
  };

  const handleMenuEnter = () => {
    clearTimeout(closeTimer.current);
  };

  const isSteps = openMenu === 'How It Works';
  const activeCols = !isSteps && openMenu ? menus[openMenu] || [] : [];

  return (
    <div
      onMouseLeave={handleClose}
      style={{ position: 'sticky', top: 0, zIndex: 50 }}
    >
      <nav
        style={{
          position: 'relative',
          zIndex: 2,
          background: 'rgba(245,245,247,0.82)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <div
          className="user-nav-bar"
          style={{
            margin: 0,
            padding: '0 40px',
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <Link
            to="/home"
            onMouseEnter={() => setOpenMenu(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: '0.02em',
              color: '#1d1d1f',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <img src={LogoImg} alt="Phoenix Business Advisory" style={{ height: 28, objectFit: 'contain' }} />
          </Link>

          {/* Desktop nav items */}
          <div
            className="user-nav-links"
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: 30,
              fontSize: 12,
              color: '#1d1d1f',
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={menus[item.name] ? '#' : item.to}
                onMouseEnter={() => handleNavHover(item.name)}
                onClick={(e) => {
                  if (menus[item.name]) e.preventDefault();
                }}
                style={{
                  opacity: openMenu === item.name ? 1 : 0.82,
                  lineHeight: '48px',
                  color: '#1d1d1f',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 20 }}>
            <Link
              to="/search"
              onMouseEnter={() => setOpenMenu(null)}
              style={{ opacity: 0.82, color: '#1d1d1f', textDecoration: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Search size={18} />
            </Link>

            {/* Desktop user icon */}
            <div className="user-nav-user" style={{ position: 'relative' }}>
              <span
                style={{ opacity: 0.82, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                onMouseEnter={() => setOpenMenu(null)}
                onClick={() => setShowUser(!showUser)}
              >
                <User size={18} />
              </span>
              {showUser && (
                <div
                  style={{
                    position: 'absolute',
                    top: 32,
                    right: 0,
                    background: '#fff',
                    borderRadius: 14,
                    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    padding: '12px 0',
                    minWidth: 180,
                    zIndex: 100,
                  }}
                >
                  {user && (
                    <div style={{ padding: '8px 20px 12px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1d1d1f' }}>
                        {user.fullName || 'User'}
                      </div>
                      <div style={{ fontSize: 11, color: '#86868b', marginTop: 2 }}>{user.email}</div>
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '10px 20px',
                      border: 'none',
                      background: 'none',
                      textAlign: 'left',
                      fontSize: 13,
                      color: '#1d1d1f',
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

            {/* Mobile hamburger */}
            <button
              className="user-hamburger"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                color: '#1d1d1f',
              }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="user-mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 48,
              zIndex: 3,
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(0,0,0,0.08)',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ padding: '16px 20px' }}>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.to === '#' ? '/search' : item.to}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'block',
                    padding: '14px 0',
                    fontSize: 16,
                    fontWeight: 500,
                    color: '#1d1d1f',
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  {item.name}
                </Link>
              ))}

              {/* Industries in mobile */}
              {industries.length > 0 && (
                <div style={{ paddingTop: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                    Industries
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                    {industries.slice(0, 12).map((ind) => (
                      <Link
                        key={ind._id}
                        to={`/search?industry=${ind._id}`}
                        onClick={() => setMobileOpen(false)}
                        style={{
                          fontSize: 13,
                          color: '#0066cc',
                          textDecoration: 'none',
                          padding: '6px 14px',
                          background: 'rgba(0,102,204,0.06)',
                          borderRadius: 980,
                        }}
                      >
                        {ind.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Countries in mobile */}
              {countries.length > 0 && (
                <div style={{ paddingTop: 4 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                    Countries
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                    {countries.slice(0, 12).map((c) => (
                      <Link
                        key={c._id}
                        to={`/search?country=${c._id}`}
                        onClick={() => setMobileOpen(false)}
                        style={{
                          fontSize: 13,
                          color: '#1d1d1f',
                          textDecoration: 'none',
                          padding: '6px 14px',
                          background: 'rgba(0,0,0,0.04)',
                          borderRadius: 980,
                        }}
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* User info + logout */}
              {user && (
                <div style={{ paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1d1d1f', marginBottom: 2 }}>
                    {user.fullName}
                  </div>
                  <div style={{ fontSize: 12, color: '#86868b', marginBottom: 12 }}>{user.email}</div>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid rgba(255,59,48,0.2)',
                      background: 'rgba(255,59,48,0.06)',
                      color: '#ff3b30',
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Mega Menu */}
      <AnimatePresence>
        {openMenu && !mobileOpen && (isSteps || activeCols.length > 0) && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpenMenu(null)}
              style={{
                position: 'fixed',
                left: 0,
                right: 0,
                top: 48,
                bottom: 0,
                zIndex: 0,
                background: 'rgba(0,0,0,0.3)',
                backdropFilter: 'blur(14px) saturate(120%)',
                WebkitBackdropFilter: 'blur(14px) saturate(120%)',
              }}
            />
            {/* Panel */}
            <motion.div
              className="user-mega-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
              onMouseEnter={handleMenuEnter}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 48,
                zIndex: 1,
                background: 'rgba(245,245,247,0.96)',
                backdropFilter: 'saturate(180%) blur(20px)',
                WebkitBackdropFilter: 'saturate(180%) blur(20px)',
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 30px 50px -30px rgba(0,0,0,0.18)',
              }}
            >
              {isSteps ? (
                /* How It Works — Steps */
                <div
                  className="user-steps-grid-wrap"
                  style={{
                    maxWidth: 1100,
                    margin: '0 auto',
                    padding: '34px 40px 48px',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#86868b', marginBottom: 24 }}>
                    How It Works
                  </div>
                  <div className="user-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
                    {steps.map((step, i) => (
                      <motion.div
                        key={step.number}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.06 }}
                      >
                        <div
                          style={{
                            fontSize: 32,
                            fontWeight: 600,
                            color: '#0066cc',
                            letterSpacing: '-0.02em',
                            marginBottom: 10,
                          }}
                        >
                          {step.number}
                        </div>
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: '#1d1d1f',
                            letterSpacing: '-0.01em',
                            lineHeight: 1.2,
                            marginBottom: 8,
                          }}
                        >
                          {step.title}
                        </div>
                        <div style={{ fontSize: 13, color: '#6e6e73', lineHeight: 1.5 }}>
                          {step.desc}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div style={{ marginTop: 28 }}>
                    <Link
                      to="/search"
                      onClick={() => setOpenMenu(null)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 14,
                        fontWeight: 500,
                        color: '#0066cc',
                        textDecoration: 'none',
                      }}
                    >
                      Start browsing <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              ) : (
                /* Regular Mega Menu */
                <div
                  className="user-mega-cols"
                  style={{
                    maxWidth: 1100,
                    margin: '0 auto',
                    padding: '34px 40px 48px',
                    display: 'flex',
                    gap: 90,
                  }}
                >
                  {activeCols.map((col, ci) => (
                    <motion.div
                      key={ci}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: ci * 0.04 }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#86868b',
                          marginBottom: 18,
                        }}
                      >
                        {col.label}
                      </div>
                      {col.links.map((lnk, li) => (
                        <Link
                          key={li}
                          to={lnk.to}
                          onClick={() => setOpenMenu(null)}
                          style={{
                            display: 'block',
                            color: '#1d1d1f',
                            marginBottom: col.gap,
                            fontSize: col.fs,
                            fontWeight: col.fw,
                            letterSpacing: '-0.01em',
                            lineHeight: 1.2,
                            textDecoration: 'none',
                            transition: 'color 0.15s',
                          }}
                          onMouseEnter={(e) => (e.target.style.color = '#0066cc')}
                          onMouseLeave={(e) => (e.target.style.color = '#1d1d1f')}
                        >
                          {lnk.text}
                        </Link>
                      ))}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
