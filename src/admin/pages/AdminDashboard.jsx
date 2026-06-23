import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import AdminLayout from './AdminLayout';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const UsersIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0066cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const BuildingsIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0066cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
  </svg>
);

const StarIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0066cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ChatIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0066cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBusinesses: 0,
    featuredCount: 0,
    inquiriesCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/users?limit=1'),
      api.get('/businesses?limit=1'),
      api.get('/featured?limit=1'),
      api.get('/inquiries?limit=1'),
    ])
      .then(([users, businesses, featured, inquiries]) => {
        setStats({
          totalUsers: users.data.pagination?.total || 0,
          totalBusinesses: businesses.data.pagination?.total || 0,
          featuredCount: featured.data.data?.length || 0,
          inquiriesCount: inquiries.data.pagination?.total || 0,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '70vh',
            gap: 20,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              border: '3px solid rgba(0,0,0,0.08)',
              borderTopColor: '#0066cc',
              borderRadius: '50%',
              animation: 'dashSpin 0.8s linear infinite',
            }}
          />
          <p style={{ fontSize: 15, color: '#86868b', fontWeight: 500, margin: 0 }}>Loading dashboard...</p>
          <style>{`@keyframes dashSpin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    { icon: <UsersIcon />, label: 'Total Users', value: stats.totalUsers, path: '/admin/users' },
    { icon: <BuildingsIcon />, label: 'Total Businesses', value: stats.totalBusinesses, path: '/admin/businesses' },
    { icon: <StarIcon />, label: 'Featured', value: stats.featuredCount, path: '/admin/featured' },
    { icon: <ChatIcon />, label: 'Inquiries', value: stats.inquiriesCount, path: '/admin/inquiries' },
  ];

  const quickActions = [
    {
      title: 'Create User',
      desc: 'Add a new user to the platform with full credentials.',
      color: '#0066cc',
      path: '/admin/users/create',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0066cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
      ),
    },
    {
      title: 'Create Business',
      desc: 'List a new business opportunity on the exchange.',
      color: '#0066cc',
      path: '/admin/businesses?action=create',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0066cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="12" y1="10" x2="12" y2="16" />
          <line x1="9" y1="13" x2="15" y2="13" />
        </svg>
      ),
    },
    {
      title: 'Bulk Import',
      desc: 'Upload multiple records at once via spreadsheet.',
      color: '#34c759',
      path: '/admin/bulk',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34c759" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
    },
  ];

  return (
    <AdminLayout>
      <motion.div initial="hidden" animate="visible" variants={stagger}>
        {/* Hero */}
        <motion.div variants={fadeUp} transition={{ duration: 0.6 }} style={{ marginBottom: 48 }}>
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 600,
              letterSpacing: '-0.015em',
              lineHeight: 1.05,
              margin: '0 0 8px',
              color: '#1d1d1f',
            }}
          >
            Dashboard
          </h1>
          <p style={{ fontSize: 17, color: '#86868b', margin: 0, fontWeight: 400 }}>
            Platform overview and management.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
          <h2
            style={{
              fontSize: 'clamp(20px, 2.4vw, 24px)',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              margin: '0 0 20px',
              color: '#1d1d1f',
            }}
          >
            At a glance.{' '}
            <span style={{ color: '#86868b', fontWeight: 600 }}>Key metrics for your platform.</span>
          </h2>
        </motion.div>

        <div
          className="admin-stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 20,
            marginBottom: 48,
          }}
        >
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(0,0,0,0.1)', transition: { duration: 0.25 } }}
              onClick={() => navigate(card.path)}
              style={{
                background: '#fff',
                padding: '28px 24px',
                borderRadius: 18,
                border: '1px solid rgba(0,0,0,0.06)',
                cursor: 'pointer',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              <div style={{ marginBottom: 16 }}>{card.icon}</div>
              <div style={{ fontSize: 32, fontWeight: 600, color: '#1d1d1f', margin: '0 0 6px' }}>
                {card.value}
              </div>
              <div style={{ fontSize: 13, color: '#86868b', fontWeight: 400 }}>{card.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
          <h2
            style={{
              fontSize: 'clamp(20px, 2.4vw, 24px)',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              margin: '0 0 20px',
              color: '#1d1d1f',
            }}
          >
            Quick actions.{' '}
            <span style={{ color: '#86868b', fontWeight: 600 }}>Common tasks at your fingertips.</span>
          </h2>
        </motion.div>

        <div
          className="admin-actions-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}
        >
          {quickActions.map((action, i) => (
            <motion.div
              key={action.title}
              variants={fadeUp}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.08)', transition: { duration: 0.25 } }}
              onClick={() => navigate(action.path)}
              style={{
                background: '#fff',
                padding: '28px 24px',
                borderRadius: 18,
                border: '1px solid rgba(0,0,0,0.06)',
                cursor: 'pointer',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              <div style={{ marginBottom: 14 }}>{action.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: '#1d1d1f', margin: '0 0 6px' }}>
                {action.title}
              </h3>
              <p style={{ fontSize: 13, color: '#6e6e73', lineHeight: 1.45, margin: 0 }}>
                {action.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AdminLayout>
  );
}
