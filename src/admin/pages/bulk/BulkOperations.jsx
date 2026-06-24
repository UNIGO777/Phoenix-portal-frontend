import { useState } from 'react';
import { motion } from 'framer-motion';
import { bulkService } from '../../services/adminApi';
import AdminLayout from '../AdminLayout';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardStyle = {
  background: '#fff',
  borderRadius: 18,
  border: '1px solid rgba(0,0,0,0.06)',
  padding: '28px 24px',
};

const pillButton = (bg = '#0066cc', hoverBg = '#0055b3') => ({
  padding: '10px 22px',
  background: bg,
  color: '#fff',
  border: 'none',
  borderRadius: 980,
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  transition: 'all 0.2s',
  _hoverBg: hoverBg,
});

function PillBtn({ label, bg = '#0066cc', hoverBg = '#0055b3', onClick, disabled, icon }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...pillButton(bg, hoverBg),
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = hoverBg;
        e.currentTarget.style.transform = 'scale(1.02)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = bg;
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function SuccessMessage({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        background: 'rgba(52,199,89,0.06)',
        border: '1px solid rgba(52,199,89,0.2)',
        borderRadius: 12,
        padding: '14px 18px',
        marginTop: 16,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        fontSize: 14,
        color: '#1d1d1f',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34c759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      <span>{message}</span>
    </div>
  );
}

function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        background: 'rgba(255,59,48,0.06)',
        border: '1px solid rgba(255,59,48,0.2)',
        borderRadius: 12,
        padding: '14px 18px',
        marginTop: 16,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        fontSize: 14,
        color: '#1d1d1f',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff3b30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <span>{message}</span>
    </div>
  );
}

export default function BulkOperations() {
  // Import state
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  // Bulk status state
  const [bulkIds, setBulkIds] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);

  const handleDownloadTemplate = async () => {
    try {
      const { data } = await bulkService.getTemplate();
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'business-import-template.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setImportResult({ type: 'error', message: 'Failed to download template: ' + (err.response?.data?.message || err.message) });
    }
  };

  const handleImport = async () => {
    if (!importFile) return;
    setImporting(true);
    setImportResult(null);
    try {
      const formData = new FormData();
      formData.append('file', importFile);
      const { data } = await bulkService.import(formData);
      const successCount = data.successCount ?? data.imported ?? 0;
      const errorCount = data.errorCount ?? data.errors?.length ?? 0;
      let message = `Successfully imported ${successCount} business${successCount !== 1 ? 'es' : ''}.`;
      if (errorCount > 0) {
        const errorDetails = data.errors?.map((e) => e.message || e).join('; ') || '';
        setImportResult({
          type: 'error',
          message: `Imported ${successCount}, but ${errorCount} error${errorCount !== 1 ? 's' : ''} occurred.${errorDetails ? ' ' + errorDetails : ''}`,
        });
      } else {
        setImportResult({ type: 'success', message });
      }
      setImportFile(null);
    } catch (err) {
      setImportResult({
        type: 'error',
        message: 'Import failed: ' + (err.response?.data?.message || err.message),
      });
    } finally {
      setImporting(false);
    }
  };

  const parseIds = () => {
    return bulkIds
      .split(/[,\n]+/)
      .map((id) => id.trim())
      .filter((id) => id.length > 0);
  };

  const handleBulkAction = async (action) => {
    const ids = parseIds();
    if (ids.length === 0) {
      setBulkResult({ type: 'error', message: 'Please enter at least one business ID.' });
      return;
    }

    if (action === 'delete') {
      if (!confirm(`Are you sure you want to delete ${ids.length} business${ids.length !== 1 ? 'es' : ''}? This action cannot be undone.`)) {
        return;
      }
    }

    setBulkLoading(true);
    setBulkResult(null);
    try {
      const serviceFn = bulkService[action];
      await serviceFn(ids);
      const labels = { activate: 'activated', deactivate: 'deactivated', delete: 'deleted' };
      setBulkResult({
        type: 'success',
        message: `Successfully ${labels[action]} ${ids.length} business${ids.length !== 1 ? 'es' : ''}.`,
      });
      setBulkIds('');
    } catch (err) {
      setBulkResult({
        type: 'error',
        message: `Bulk ${action} failed: ` + (err.response?.data?.message || err.message),
      });
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <AdminLayout>
      <motion.div initial="hidden" animate="visible" variants={stagger}>
        {/* Header */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 32 }}
        >
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
            Bulk Operations
          </h1>
          <p style={{ fontSize: 15, color: '#86868b', margin: 0 }}>
            Import, update, and manage businesses in bulk.
          </p>
        </motion.div>

        {/* Section 1: Import Businesses */}
        <motion.div
          className="admin-form-card"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ ...cardStyle, marginBottom: 24 }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: '-0.015em',
              color: '#1d1d1f',
              margin: '0 0 20px',
            }}
          >
            Import from Excel
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <PillBtn
              label="Download Template"
              onClick={handleDownloadTemplate}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              }
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
            <label
              style={{
                padding: '10px 22px',
                background: '#f5f5f7',
                color: '#1d1d1f',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 980,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Choose File
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => {
                  setImportFile(e.target.files[0] || null);
                  setImportResult(null);
                }}
                style={{ display: 'none' }}
              />
            </label>

            {importFile && (
              <span style={{ fontSize: 14, color: '#1d1d1f' }}>
                {importFile.name}
              </span>
            )}

            <PillBtn
              label={importing ? 'Importing...' : 'Import'}
              onClick={handleImport}
              disabled={!importFile || importing}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                </svg>
              }
            />
          </div>

          {importResult?.type === 'success' && <SuccessMessage message={importResult.message} />}
          {importResult?.type === 'error' && <ErrorMessage message={importResult.message} />}
        </motion.div>

        {/* Section 2: Bulk Status Update */}
        <motion.div
          className="admin-form-card"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={cardStyle}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: '-0.015em',
              color: '#1d1d1f',
              margin: '0 0 20px',
            }}
          >
            Bulk Status Update
          </h2>

          <textarea
            value={bulkIds}
            onChange={(e) => {
              setBulkIds(e.target.value);
              setBulkResult(null);
            }}
            placeholder="Enter business IDs (comma-separated or one per line)"
            rows={5}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 12,
              border: '1px solid rgba(0,0,0,0.1)',
              fontSize: 14,
              fontFamily: 'inherit',
              resize: 'vertical',
              outline: 'none',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#0066cc'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; }}
          />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16 }}>
            <PillBtn
              label={bulkLoading ? 'Processing...' : 'Activate All'}
              bg="#34c759"
              hoverBg="#2db24d"
              onClick={() => handleBulkAction('activate')}
              disabled={bulkLoading}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              }
            />
            <PillBtn
              label={bulkLoading ? 'Processing...' : 'Deactivate All'}
              bg="#ff9500"
              hoverBg="#e08600"
              onClick={() => handleBulkAction('deactivate')}
              disabled={bulkLoading}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              }
            />
            <PillBtn
              label={bulkLoading ? 'Processing...' : 'Delete All'}
              bg="#ff3b30"
              hoverBg="#e0332a"
              onClick={() => handleBulkAction('delete')}
              disabled={bulkLoading}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              }
            />
          </div>

          {bulkResult?.type === 'success' && <SuccessMessage message={bulkResult.message} />}
          {bulkResult?.type === 'error' && <ErrorMessage message={bulkResult.message} />}
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
