import { useState, useEffect } from 'react';
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

  useEffect(() => {
    setLoading(true);
    userService.getAll(page, 20)
      .then(({ data }) => {
        setUsers(data.data);
        setPagination(data.pagination);
      })
      .catch((err) => {
        console.error('Failed to fetch users:', err);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const handleDelete = async (id, fullName) => {
    if (!confirm(`Delete user "${fullName}"?`)) return;
    try {
      await userService.delete(id);
      userService.getAll(page, 20).then(({ data }) => {
        setUsers(data.data);
        setPagination(data.pagination);
      });
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
      userService.getAll(page, 20).then(({ data }) => {
        setUsers(data.data);
        setPagination(data.pagination);
      });
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
