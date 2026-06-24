import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { userService } from '../../services/adminApi';
import DataTable from '../../components/DataTable';
import AdminLayout from '../AdminLayout';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');

  // Debounce search input
  const [initialMount, setInitialMount] = useState(true);
  useEffect(() => {
    if (initialMount) {
      setInitialMount(false);
      return;
    }
    const timer = setTimeout(() => {
      setSearchDebounced(search);
      setPage(1);
      setUsers([]);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = useCallback(() => {
    const isFirstPage = page === 1;
    if (isFirstPage) setLoading(true);
    else setLoadingMore(true);

    const filters = searchDebounced ? { search: searchDebounced } : {};
    userService.getAll(page, 20, filters)
      .then(({ data }) => {
        setUsers((prev) => (isFirstPage ? data.data : [...prev, ...data.data]));
        setPagination(data.pagination);
      })
      .catch((err) => {
        console.error('Failed to fetch users:', err);
      })
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });
  }, [page, searchDebounced]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const hasMore = page < (pagination.totalPages || 1);

  const handleDelete = async (id, fullName) => {
    if (!confirm(`Delete user "${fullName}"?`)) return;
    try {
      await userService.delete(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert('Failed to delete user: ' + err.response?.data?.message);
    }
  };

  const handleToggleStatus = async (id, currentStatus, fullName) => {
    try {
      if (currentStatus) {
        await userService.deactivate(id);
      } else {
        await userService.activate(id);
      }
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isActive: !currentStatus } : u))
      );
    } catch (err) {
      alert('Failed to update user status: ' + err.response?.data?.message);
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
              Users
            </h1>
            <p style={{ fontSize: 15, color: '#86868b', margin: 0 }}>
              Manage platform users and their access.
            </p>
          </div>
          <button
            className="admin-header-btn"
            onClick={() => navigate('/admin/users/create')}
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
            Create User
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
              placeholder="Search users by name or email..."
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
              { key: 'fullName', label: 'Full Name' },
              { key: 'email', label: 'Email' },
              { key: 'country', label: 'Country', render: (value) => value?.name || '-' },
              {
                key: 'inquiryCount',
                label: 'Inquiries',
                render: (value) => (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 28,
                      padding: '3px 10px',
                      borderRadius: 980,
                      fontSize: 12,
                      fontWeight: 600,
                      background: value > 0 ? 'rgba(0,102,204,0.08)' : 'rgba(0,0,0,0.04)',
                      color: value > 0 ? '#0066cc' : '#86868b',
                    }}
                  >
                    {value || 0}
                  </span>
                ),
              },
              {
                key: 'isActive',
                label: 'Status',
                render: (value) => (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 10px',
                      borderRadius: 980,
                      fontSize: 12,
                      fontWeight: 500,
                      background: value ? 'rgba(52,199,89,0.1)' : 'rgba(255,59,48,0.1)',
                      color: value ? '#34c759' : '#ff3b30',
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: value ? '#34c759' : '#ff3b30',
                      }}
                    />
                    {value ? 'Active' : 'Inactive'}
                  </span>
                ),
              },
              {
                key: 'createdAt',
                label: 'Created',
                render: (value) => new Date(value).toLocaleDateString(),
              },
            ]}
            data={users}
            loading={loading}
            loadingMore={loadingMore}
            hasMore={hasMore}
            pagination={pagination}
            onPageChange={setPage}
            actions={(user) => [
              {
                label: 'Edit',
                onClick: () => navigate(`/admin/users/${user._id}`),
              },
              {
                label: user.isActive ? 'Deactivate' : 'Activate',
                color: user.isActive ? '#ff9500' : '#34c759',
                onClick: () => handleToggleStatus(user._id, user.isActive, user.fullName),
              },
              {
                label: 'Delete',
                color: '#ff3b30',
                onClick: () => handleDelete(user._id, user.fullName),
              },
            ]}
          />
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
