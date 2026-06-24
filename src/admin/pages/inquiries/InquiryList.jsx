import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { inquiryService } from '../../services/adminApi';
import DataTable from '../../components/DataTable';
import AdminLayout from '../AdminLayout';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const statusColors = {
  new: { bg: 'rgba(255,149,0,0.1)', color: '#ff9500', dot: '#ff9500' },
  in_progress: { bg: 'rgba(0,102,204,0.1)', color: '#0066cc', dot: '#0066cc' },
  responded: { bg: 'rgba(52,199,89,0.1)', color: '#34c759', dot: '#34c759' },
  closed: { bg: 'rgba(142,142,147,0.1)', color: '#8e8e93', dot: '#8e8e93' },
};

const statusLabel = (s) => {
  const map = { new: 'New', in_progress: 'In Progress', responded: 'Responded', closed: 'Closed' };
  return map[s] || 'New';
};

// ── Inquiry Detail Modal ──

function InquiryDetailModal({ inquiry, onClose, onChangeStatus, onDelete }) {
  if (!inquiry) return null;
  const s = statusColors[inquiry.status] || statusColors.new;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 22,
          width: '100%',
          maxWidth: 560,
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            border: 'none',
            background: 'rgba(0,0,0,0.06)',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#6e6e73',
            zIndex: 1,
          }}
        >
          <X size={16} />
        </button>

        <div className="admin-modal-body" style={{ padding: '36px 32px 32px' }}>
          {/* Header */}
          <h3 style={{ fontSize: 22, fontWeight: 600, color: '#1d1d1f', margin: '0 0 4px' }}>
            Inquiry Details
          </h3>
          <p style={{ fontSize: 13, color: '#86868b', margin: '0 0 24px' }}>
            Submitted on {new Date(inquiry.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(inquiry.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </p>

          {/* Status badge */}
          <div style={{ marginBottom: 24 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 14px',
                borderRadius: 980,
                fontSize: 13,
                fontWeight: 500,
                background: s.bg,
                color: s.color,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.dot }} />
              {statusLabel(inquiry.status)}
            </span>
          </div>

          {/* Info rows */}
          <div
            className="admin-inquiry-modal-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div style={{ background: '#f5f5f7', borderRadius: 14, padding: '16px 18px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#86868b', marginBottom: 6 }}>User</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1d1d1f' }}>{inquiry.user?.fullName || 'N/A'}</div>
              <div style={{ fontSize: 13, color: '#6e6e73', marginTop: 2 }}>{inquiry.user?.email || ''}</div>
              {inquiry.user?.mobile && (
                <div style={{ fontSize: 13, color: '#6e6e73', marginTop: 2 }}>{inquiry.user.mobile}</div>
              )}
            </div>
            <div style={{ background: '#f5f5f7', borderRadius: 14, padding: '16px 18px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#86868b', marginBottom: 6 }}>Business</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1d1d1f' }}>{inquiry.business?.name || 'N/A'}</div>
              <div style={{ fontSize: 13, color: '#6e6e73', marginTop: 2 }}>
                {[inquiry.business?.city, inquiry.business?.country?.name].filter(Boolean).join(', ') || ''}
              </div>
            </div>
          </div>

          {/* Message */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#86868b', marginBottom: 10 }}>Message</div>
            <div
              style={{
                background: '#f5f5f7',
                borderRadius: 14,
                padding: '20px 22px',
                fontSize: 15,
                color: '#1d1d1f',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
              }}
            >
              {inquiry.message}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {inquiry.status === 'new' && (
              <button
                onClick={() => { onChangeStatus(inquiry._id, 'in_progress'); onClose(); }}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: 980,
                  background: '#0066cc',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Mark In Progress
              </button>
            )}
            {(inquiry.status === 'new' || inquiry.status === 'in_progress') && (
              <button
                onClick={() => { onChangeStatus(inquiry._id, 'responded'); onClose(); }}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: 980,
                  background: 'rgba(52,199,89,0.1)',
                  color: '#34c759',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Mark Responded
              </button>
            )}
            {inquiry.status !== 'closed' && (
              <button
                onClick={() => { onChangeStatus(inquiry._id, 'closed'); onClose(); }}
                style={{
                  padding: '10px 20px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 980,
                  background: '#fff',
                  color: '#8e8e93',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            )}
            <button
              onClick={() => { onDelete(inquiry._id); onClose(); }}
              style={{
                padding: '10px 20px',
                border: '1px solid rgba(255,59,48,0.2)',
                borderRadius: 980,
                background: 'rgba(255,59,48,0.06)',
                color: '#ff3b30',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                marginLeft: 'auto',
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main List ──

export default function InquiryList() {
  const [inquiries, setInquiries] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const fetchInquiries = useCallback(() => {
    const isFirstPage = page === 1;
    if (isFirstPage) setLoading(true);
    else setLoadingMore(true);

    inquiryService
      .getAll(page, 20)
      .then(({ data }) => {
        setInquiries((prev) => (isFirstPage ? data.data : [...prev, ...data.data]));
        setPagination(data.pagination);
      })
      .catch((err) => {
        console.error('Failed to fetch inquiries:', err);
      })
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });
  }, [page]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const hasMore = page < (pagination.totalPages || 1);

  const handleChangeStatus = async (id, status) => {
    try {
      await inquiryService.changeStatus(id, status);
      setInquiries((prev) =>
        prev.map((inq) => (inq._id === id ? { ...inq, status } : inq))
      );
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this inquiry? This action cannot be undone.')) return;
    try {
      await inquiryService.delete(id);
      setInquiries((prev) => prev.filter((inq) => inq._id !== id));
    } catch (err) {
      alert('Failed to delete inquiry: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <AdminLayout>
      {/* Detail Modal */}
      {selectedInquiry && (
        <InquiryDetailModal
          inquiry={selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          onChangeStatus={handleChangeStatus}
          onDelete={handleDelete}
        />
      )}

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
              Inquiries
            </h1>
            <p style={{ fontSize: 15, color: '#86868b', margin: 0 }}>
              Review and manage business inquiries from users.
            </p>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div variants={fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
          <DataTable
            columns={[
              {
                key: '#',
                label: '#',
                render: (_, __, index) => (
                  <span style={{ fontWeight: 600, color: '#86868b', fontSize: 13 }}>
                    {index + 1}
                  </span>
                ),
              },
              {
                key: 'business',
                label: 'Business',
                render: (_, inquiry) => (
                  <span style={{ fontWeight: 500, color: '#1d1d1f' }}>
                    {inquiry.business?.name || 'N/A'}
                  </span>
                ),
              },
              {
                key: 'user',
                label: 'User',
                render: (_, inquiry) => (
                  <div>
                    <span style={{ fontWeight: 500, color: '#1d1d1f', display: 'block' }}>
                      {inquiry.user?.fullName || 'N/A'}
                    </span>
                    <span style={{ fontSize: 12, color: '#86868b' }}>
                      {inquiry.user?.email || ''}
                    </span>
                  </div>
                ),
              },
              {
                key: 'message',
                label: 'Message',
                render: (value) => (
                  <div
                    style={{
                      color: '#3a3a3c',
                      fontSize: 13,
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      maxWidth: 280,
                    }}
                  >
                    {value || ''}
                  </div>
                ),
              },
              {
                key: 'status',
                label: 'Status',
                render: (value) => {
                  const s = statusColors[value] || statusColors.new;
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
                      {statusLabel(value)}
                    </span>
                  );
                },
              },
              {
                key: 'createdAt',
                label: 'Date',
                render: (value) => new Date(value).toLocaleDateString(),
              },
            ]}
            data={inquiries}
            loading={loading}
            loadingMore={loadingMore}
            hasMore={hasMore}
            pagination={pagination}
            onPageChange={setPage}
            actions={(inquiry) => [
              {
                label: 'View',
                color: '#0066cc',
                onClick: () => setSelectedInquiry(inquiry),
              },
              ...(inquiry.status !== 'closed'
                ? [
                    {
                      label: 'Close',
                      color: '#8e8e93',
                      onClick: () => handleChangeStatus(inquiry._id, 'closed'),
                    },
                  ]
                : []),
              {
                label: 'Delete',
                color: '#ff3b30',
                onClick: () => handleDelete(inquiry._id),
              },
            ]}
          />
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
