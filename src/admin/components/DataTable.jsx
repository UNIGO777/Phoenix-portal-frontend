import { useState } from 'react';
import Loader from '../../components/Loader';

export default function DataTable({
  columns,
  data,
  loading,
  onRowClick,
  actions,
  pagination,
  onPageChange,
}) {
  const [hoveredRow, setHoveredRow] = useState(null);

  if (loading) {
    return <Loader text="Loading data..." />;
  }

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 40px',
          gap: 12,
        }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c7c7cc" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
        <p style={{ fontSize: 15, color: '#86868b', fontWeight: 500, margin: 0 }}>
          No data found
        </p>
      </div>
    );
  }

  const getPageNumbers = () => {
    if (!pagination) return [];
    const pages = [];
    const total = pagination.totalPages || 1;
    const current = pagination.page || 1;
    const delta = 2;
    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div>
      <div
        style={{
          overflowX: 'auto',
          background: '#fff',
          borderRadius: 18,
          border: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <table
          className="admin-table"
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 13,
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    padding: '14px 20px',
                    textAlign: 'left',
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#86868b',
                    background: 'rgba(0,0,0,0.02)',
                  }}
                >
                  {col.label}
                </th>
              ))}
              {actions && (
                <th
                  style={{
                    padding: '14px 20px',
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#86868b',
                    background: 'rgba(0,0,0,0.02)',
                    textAlign: 'right',
                  }}
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={row._id || idx}
                onClick={() => onRowClick?.(row)}
                onMouseEnter={() => setHoveredRow(idx)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  borderBottom: idx < data.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                  background: hoveredRow === idx ? 'rgba(0,102,204,0.03)' : '#fff',
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'background 0.15s ease',
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: '16px 20px',
                      color: '#1d1d1f',
                    }}
                  >
                    {col.render ? col.render(row[col.key], row, idx) : row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div className="admin-actions-cell" style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      {actions(row).map((action, i) => (
                        <button
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick();
                          }}
                          style={{
                            padding: '6px 14px',
                            fontSize: 12,
                            fontWeight: 500,
                            border: '1px solid rgba(0,0,0,0.08)',
                            background: '#fff',
                            borderRadius: 8,
                            cursor: 'pointer',
                            color: action.color || '#0066cc',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#f5f5f7';
                            e.target.style.borderColor = 'rgba(0,0,0,0.12)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = '#fff';
                            e.target.style.borderColor = 'rgba(0,0,0,0.08)';
                          }}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="admin-pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 24 }}>
          <button
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
            style={{
              padding: '8px 16px',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 980,
              background: '#fff',
              cursor: pagination.page <= 1 ? 'default' : 'pointer',
              opacity: pagination.page <= 1 ? 0.4 : 1,
              fontSize: 13,
              color: '#1d1d1f',
              fontWeight: 500,
              transition: 'all 0.15s',
            }}
          >
            Previous
          </button>
          {getPageNumbers().map((num) => (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              style={{
                width: 36,
                height: 36,
                border: num === pagination.page ? 'none' : '1px solid rgba(0,0,0,0.08)',
                borderRadius: 980,
                background: num === pagination.page ? '#0066cc' : '#fff',
                color: num === pagination.page ? '#fff' : '#1d1d1f',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: num === pagination.page ? 600 : 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
              }}
            >
              {num}
            </button>
          ))}
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}
            style={{
              padding: '8px 16px',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 980,
              background: '#fff',
              cursor: pagination.page >= pagination.totalPages ? 'default' : 'pointer',
              opacity: pagination.page >= pagination.totalPages ? 0.4 : 1,
              fontSize: 13,
              color: '#1d1d1f',
              fontWeight: 500,
              transition: 'all 0.15s',
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
