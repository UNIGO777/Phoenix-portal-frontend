import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { businessService } from '../../services/adminApi';
import DataTable from '../../components/DataTable';
import AdminLayout from '../AdminLayout';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const formatPrice = (value) => {
  if (!value && value !== 0) return '-';
  const num = Number(value);
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
  return `$${num.toLocaleString()}`;
};

const statusColors = {
  active: { bg: 'rgba(52,199,89,0.1)', color: '#34c759', dot: '#34c759' },
  pending: { bg: 'rgba(255,149,0,0.1)', color: '#ff9500', dot: '#ff9500' },
  rejected: { bg: 'rgba(255,59,48,0.1)', color: '#ff3b30', dot: '#ff3b30' },
};

export default function BusinessList() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(search);
      setPage(1);
      setBusinesses([]);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchBusinesses = useCallback(() => {
    const isFirstPage = page === 1;
    if (isFirstPage) setLoading(true);
    else setLoadingMore(true);

    const filters = searchDebounced ? { search: searchDebounced } : {};
    businessService.getAll(page, 20, filters)
      .then(({ data }) => {
        setBusinesses((prev) => (isFirstPage ? data.data : [...prev, ...data.data]));
        setPagination(data.pagination);
      })
      .catch((err) => {
        console.error('Failed to fetch businesses:', err);
      })
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });
  }, [page, searchDebounced]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const hasMore = page < (pagination.totalPages || 1);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete business "${name}"? This action cannot be undone.`)) return;
    try {
      await businessService.delete(id);
      setPage(1);
      setBusinesses([]);
    } catch (err) {
      alert('Failed to delete business: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await businessService.toggleFeatured(id);
      // Update inline to avoid full refetch
      setBusinesses((prev) =>
        prev.map((b) => (b._id === id ? { ...b, isFeatured: !b.isFeatured } : b))
      );
    } catch (err) {
      alert('Failed to update featured status: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleStatus = async (id, currentStatus, name) => {
    const newStatus = currentStatus === 'active' ? 'rejected' : 'active';
    const actionLabel = currentStatus === 'active' ? 'reject' : 'approve';
    if (!confirm(`Are you sure you want to ${actionLabel} "${name}"?`)) return;
    try {
      await businessService.changeStatus(id, newStatus);
      setBusinesses((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      alert('Failed to update business status: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <AdminLayout>
      <motion.div initial="hidden" animate="visible" variants={stagger}>
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
              Businesses
            </h1>
            <p style={{ fontSize: 15, color: '#86868b', margin: 0 }}>
              Manage business listings on the platform.
            </p>
          </div>
          <button
            className="admin-header-btn"
            onClick={() => navigate('/admin/businesses/create')}
            style={{
              padding: '10px 22px',
              background: '#0066cc',
              color: '#fff',
              border: 'none',
              borderRadius: 980,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0055b3';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#0066cc';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create Business
          </button>
        </motion.div>

        {/* Search bar */}
        <motion.div variants={fadeUp} transition={{ duration: 0.5, delay: 0.05 }} style={{ marginBottom: 20 }}>
          <div className="admin-search-wrap" style={{ position: 'relative', maxWidth: 360 }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#86868b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search businesses by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 40px',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: 12,
                fontSize: 14,
                color: '#1d1d1f',
                background: '#fff',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#0066cc'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; }}
            />
          </div>
        </motion.div>

        <motion.div variants={fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
          <DataTable
            columns={[
              { key: 'name', label: 'Name' },
              {
                key: 'industry',
                label: 'Industry',
                render: (value) => value?.name || '-',
              },
              {
                key: 'country',
                label: 'Country',
                render: (value) => value?.name || '-',
              },
              {
                key: 'status',
                label: 'Status',
                render: (value) => {
                  const s = statusColors[value] || statusColors.pending;
                  return (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4px 10px',
                        borderRadius: 980,
                        fontSize: 12,
                        fontWeight: 500,
                        background: s.bg,
                        color: s.color,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: s.dot,
                        }}
                      />
                      {value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Pending'}
                    </span>
                  );
                },
              },
              {
                key: 'isFeatured',
                label: 'Featured',
                render: (value) => (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '3px 10px',
                      borderRadius: 980,
                      fontSize: 12,
                      fontWeight: 500,
                      background: value ? 'rgba(255,149,0,0.1)' : 'rgba(0,0,0,0.04)',
                      color: value ? '#ff9500' : '#c7c7cc',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill={value ? '#ff9500' : 'none'} stroke={value ? '#ff9500' : '#c7c7cc'} strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    {value ? 'Yes' : 'No'}
                  </span>
                ),
              },
              {
                key: 'askingPrice',
                label: 'Asking Price',
                render: (value) => formatPrice(value),
              },
              {
                key: 'createdAt',
                label: 'Created',
                render: (value) => new Date(value).toLocaleDateString(),
              },
            ]}
            data={businesses}
            loading={loading}
            loadingMore={loadingMore}
            hasMore={hasMore}
            pagination={pagination}
            onPageChange={setPage}
            actions={(business) => [
              {
                label: 'Edit',
                onClick: () => navigate(`/admin/businesses/${business._id}`),
              },
              {
                label: business.isFeatured ? 'Unfeature' : 'Feature',
                color: business.isFeatured ? '#8e8e93' : '#ff9500',
                onClick: () => handleToggleFeatured(business._id),
              },
              {
                label: 'Delete',
                color: '#ff3b30',
                onClick: () => handleDelete(business._id, business.name),
              },
            ]}
          />
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
