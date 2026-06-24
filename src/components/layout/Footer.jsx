import { Link } from 'react-router-dom';
import { Copyright } from 'lucide-react';

const columns = [
  {
    title: 'Marketplace',
    links: [
      { label: 'Browse Listings', to: '/search' },
      { label: 'Industries', to: '/search' },
      { label: 'Featured', to: '/home' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Member Login', to: '/' },
      { label: 'Home', to: '/home' },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ background: '#fff', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
      <div style={{ margin: 0, padding: '38px clamp(16px, 5vw, 40px)' }}>
        <div
          className="user-footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'clamp(14px, 4vw, 28px)',
            paddingBottom: 24,
            borderBottom: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          {columns.map((col) => (
            <div key={col.title}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#1d1d1f',
                  marginBottom: 12,
                }}
              >
                {col.title}
              </div>
              {col.links.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  style={{
                    display: 'block',
                    fontSize: 12,
                    color: '#6e6e73',
                    lineHeight: 2,
                    textDecoration: 'none',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: '#86868b', lineHeight: 1.5, margin: '18px 0 0' }}>
          Phoenix Business Exchange facilitates introductions between approved members and verified
          sellers. Listings are subject to availability and member eligibility. All financial figures
          are seller-reported and independently reviewed prior to listing.
        </p>
        <p style={{ fontSize: 12, color: '#86868b', margin: '14px 0 0' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Copyright size={12} /> 2026 Phoenix Business Exchange. All rights reserved.</span>
        </p>
      </div>
    </footer>
  );
}
