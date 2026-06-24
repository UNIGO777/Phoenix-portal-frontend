import { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

export default function DataTable({
  columns,
  data,
  loading,
  onRowClick,
  actions,
  pagination,
  onPageChange,
  hasMore,
  loadingMore,
}) {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useInfiniteScroll({
    hasMore: !!hasMore,
    loading: !!loadingMore,
    onLoadMore: () => {
      if (onPageChange && pagination) {
        onPageChange((pagination.page || 1) + 1);
      }
    },
  });

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

  // ── Mobile card layout ──
  if (isMobile) {
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {data.map((row, idx) => (
            <div
              key={row._id || idx}
              onClick={() => onRowClick?.(row)}
              style={{
                background: '#fff',
                borderRadius: 14,
                border: '1px solid rgba(0,0,0,0.06)',
                padding: '16px 18px',
                cursor: onRowClick ? 'pointer' : 'default',
              }}
            >
              {columns.map((col) => {
                const value = col.render ? col.render(row[col.key], row, idx) : row[col.key];
                if (value === undefined || value === null || value === '' || value === '-') return null;
                return (
                  <div
                    key={col.key}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '7px 0',
                      borderBottom: '1px solid rgba(0,0,0,0.03)',
                      gap: 12,
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#86868b', flexShrink: 0 }}>
                      {col.label}
                    </span>
                    <span style={{ fontSize: 13, color: '#1d1d1f', textAlign: 'right', minWidth: 0, overflow: 'hidden' }}>
                      {value}
                    </span>
                  </div>
                );
              })}

              {actions && (
                <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                  {actions(row).map((action, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); action.onClick(); }}
                      style={{
                        flex: 1,
                        minWidth: 70,
                        padding: '8px 12px',
                        fontSize: 12,
                        fontWeight: 500,
                        border: '1px solid rgba(0,0,0,0.08)',
                        background: '#fff',
                        borderRadius: 8,
                        cursor: 'pointer',
                        color: action.color || '#0066cc',
                        textAlign: 'center',
                      }}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {loadingMore && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
            <div style={{
              width: 24, height: 24,
              border: '3px solid rgba(0,0,0,0.08)', borderTopColor: '#0066cc',
              borderRadius: '50%', animation: 'dt-spin 0.7s linear infinite',
            }} />
            <style>{`@keyframes dt-spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {!loadingMore && !hasMore && data.length > 0 && pagination && (
          <div style={{ textAlign: 'center', padding: '16px 0', fontSize: 12, color: '#86868b' }}>
            Showing all {data.length} records
          </div>
        )}
      </div>
    );
  }

  // ── Desktop table layout ──
  return (
    <div>
      <div
        style={{
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
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
            minWidth: 600,
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
                    whiteSpace: 'nowrap',
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
                    whiteSpace: 'nowrap',
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

      {/* Infinite scroll loading indicator */}
      {loadingMore && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
          <div style={{
            width: 24,
            height: 24,
            border: '3px solid rgba(0,0,0,0.08)',
            borderTopColor: '#0066cc',
            borderRadius: '50%',
            animation: 'dt-spin 0.7s linear infinite',
          }} />
          <style>{`@keyframes dt-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {!loadingMore && !hasMore && data.length > 0 && pagination && pagination.total > data.length === false && (
        <div style={{ textAlign: 'center', padding: '16px 0', fontSize: 12, color: '#86868b' }}>
          Showing all {data.length} records
        </div>
      )}
    </div>
  );
}
