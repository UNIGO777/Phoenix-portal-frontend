import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { featuredService } from '../../services/adminApi';
import AdminLayout from '../AdminLayout';
import Loader from '../../../components/Loader';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function FeaturedList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const fetchFeatured = () => {
    setLoading(true);
    featuredService
      .getAll()
      .then(({ data }) => {
        setItems(data.data || data);
        setDirty(false);
      })
      .catch((err) => {
        console.error('Failed to fetch featured listings:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  const moveUp = (index) => {
    if (index === 0) return;
    const next = [...items];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setItems(next);
    setDirty(true);
  };

  const moveDown = (index) => {
    if (index === items.length - 1) return;
    const next = [...items];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    setItems(next);
    setDirty(true);
  };

  const removeItem = (index) => {
    const next = items.filter((_, i) => i !== index);
    setItems(next);
    setDirty(true);
  };

  const handleSaveOrder = async () => {
    setSaving(true);
    try {
      const ids = items.map((item) => item._id);
      await featuredService.updateOrder(ids);
      setDirty(false);
    } catch (err) {
      alert('Failed to save order: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <motion.div initial="hidden" animate="visible" variants={stagger}>
        {/* Header */}
        <motion.div
          className="admin-page-header"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 32,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 600,
                letterSpacing: '-0.015em',
                lineHeight: 1.05,
                margin: '0 0 6px',
                color: '#1d1d1f',
              }}
            >
              Featured Listings
            </h1>
            <p style={{ fontSize: 15, color: '#86868b', margin: 0 }}>
              Manage featured businesses on the homepage.
            </p>
          </div>
          <button
            className="admin-header-btn"
            onClick={handleSaveOrder}
            disabled={!dirty || saving}
            style={{
              padding: '10px 22px',
              background: dirty ? '#0066cc' : '#c7c7cc',
              color: '#fff',
              border: 'none',
              borderRadius: 980,
              fontSize: 14,
              fontWeight: 500,
              cursor: dirty ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s',
              opacity: dirty ? 1 : 0.6,
            }}
            onMouseEnter={(e) => {
              if (dirty) {
                e.currentTarget.style.background = '#0055b3';
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              if (dirty) {
                e.currentTarget.style.background = '#0066cc';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            {saving ? 'Saving...' : 'Save Order'}
          </button>
        </motion.div>

        {/* Content */}
        <motion.div variants={fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
          {loading ? (
            <Loader text="Loading featured listings..." />
          ) : items.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 40px',
                gap: 12,
                background: '#fff',
                borderRadius: 18,
                border: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c7c7cc" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <p style={{ fontSize: 15, color: '#86868b', fontWeight: 500, margin: 0 }}>
                No featured listings yet
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {items.map((item, index) => (
                <motion.div
                  key={item._id || index}
                  className="admin-featured-item"
                  variants={fadeUp}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: 20,
                    background: '#fff',
                    borderRadius: 18,
                    border: '1px solid rgba(0,0,0,0.06)',
                    transition: 'box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Drag handle dots */}
                  <div
                    className="admin-featured-drag"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '4px 4px',
                      gap: 3,
                      flexShrink: 0,
                      opacity: 0.3,
                    }}
                  >
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          background: '#1d1d1f',
                        }}
                      />
                    ))}
                  </div>

                  {/* Reorder buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      style={{
                        width: 28,
                        height: 28,
                        border: '1px solid rgba(0,0,0,0.08)',
                        borderRadius: 8,
                        background: '#fff',
                        cursor: index === 0 ? 'default' : 'pointer',
                        opacity: index === 0 ? 0.3 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s',
                        padding: 0,
                      }}
                      onMouseEnter={(e) => {
                        if (index !== 0) e.currentTarget.style.background = '#f5f5f7';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff';
                      }}
                      title="Move up"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === items.length - 1}
                      style={{
                        width: 28,
                        height: 28,
                        border: '1px solid rgba(0,0,0,0.08)',
                        borderRadius: 8,
                        background: '#fff',
                        cursor: index === items.length - 1 ? 'default' : 'pointer',
                        opacity: index === items.length - 1 ? 0.3 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s',
                        padding: 0,
                      }}
                      onMouseEnter={(e) => {
                        if (index !== items.length - 1) e.currentTarget.style.background = '#f5f5f7';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff';
                      }}
                      title="Move down"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                  </div>

                  {/* Image thumbnail */}
                  <div
                    className="admin-featured-thumb"
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 12,
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: '#f5f5f7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c7c7cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    )}
                  </div>

                  {/* Business info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: '#1d1d1f',
                        margin: '0 0 4px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.name}
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        color: '#86868b',
                        margin: 0,
                      }}
                    >
                      {item.industry?.name || item.industry || 'No industry'}
                    </p>
                  </div>

                  {/* Asking price */}
                  <div className="admin-featured-price" style={{ flexShrink: 0, textAlign: 'right', marginRight: 12 }}>
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: '#1d1d1f',
                        margin: 0,
                      }}
                    >
                      {item.askingPrice
                        ? `$${Number(item.askingPrice).toLocaleString()}`
                        : 'N/A'}
                    </p>
                    <p style={{ fontSize: 11, color: '#86868b', margin: '2px 0 0' }}>
                      Asking Price
                    </p>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeItem(index)}
                    style={{
                      width: 32,
                      height: 32,
                      border: 'none',
                      borderRadius: 980,
                      background: 'rgba(255,59,48,0.08)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.15s',
                      padding: 0,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,59,48,0.16)';
                      e.currentTarget.style.transform = 'scale(1.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,59,48,0.08)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    title="Remove from featured"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff3b30" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
