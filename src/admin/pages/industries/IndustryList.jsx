import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { industryService } from '../../services/adminApi';
import DataTable from '../../components/DataTable';
import AdminLayout from '../AdminLayout';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function IndustryList() {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formName, setFormName] = useState('');
  const [formImage, setFormImage] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const fetchIndustries = () => {
    setLoading(true);
    industryService.getAll()
      .then(({ data }) => {
        setIndustries(Array.isArray(data) ? data : data.data || []);
      })
      .catch((err) => {
        console.error('Failed to fetch industries:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormName('');
    setFormImage(null);
    setExistingImage('');
    setShowForm(true);
  };

  const openEdit = (industry) => {
    setEditingId(industry._id);
    setFormName(industry.name);
    setFormImage(null);
    setExistingImage(industry.image || '');
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormName('');
    setFormImage(null);
    setExistingImage('');
  };

  const handleSave = async () => {
    if (!formName.trim()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', formName.trim());
      if (formImage) {
        fd.append('image', formImage);
      }

      if (editingId) {
        await industryService.update(editingId, fd);
      } else {
        await industryService.create(fd);
      }
      cancelForm();
      fetchIndustries();
    } catch (err) {
      alert('Failed to save industry: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete industry "${name}"?`)) return;
    try {
      await industryService.delete(id);
      fetchIndustries();
    } catch (err) {
      alert('Failed to delete industry: ' + (err.response?.data?.message || err.message));
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
              Industries
            </h1>
            <p style={{ fontSize: 15, color: '#86868b', margin: 0 }}>
              Manage industry categories for businesses.
            </p>
          </div>
          <button
            onClick={openAdd}
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
            Add Industry
          </button>
        </motion.div>

        {showForm && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.4 }}
            style={{
              background: '#fff',
              borderRadius: 18,
              border: '1px solid rgba(0,0,0,0.06)',
              padding: 28,
              marginBottom: 24,
            }}
          >
            <h3
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: '#1d1d1f',
                margin: '0 0 20px',
                letterSpacing: '-0.015em',
              }}
            >
              {editingId ? 'Edit Industry' : 'New Industry'}
            </h3>

            {/* Name field */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#86868b',
                  marginBottom: 8,
                }}
              >
                Name
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                placeholder="Enter industry name"
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: 15,
                  border: '1px solid rgba(0,0,0,0.12)',
                  borderRadius: 12,
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0066cc';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0,102,204,0.12)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0,0,0,0.12)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Image field */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#86868b',
                  marginBottom: 8,
                }}
              >
                Image
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* Preview */}
                {(formImage || existingImage) && (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={formImage ? URL.createObjectURL(formImage) : existingImage}
                      alt="Preview"
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 14,
                        objectFit: 'cover',
                        border: '1px solid rgba(0,0,0,0.08)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormImage(null);
                        setExistingImage('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      style={{
                        position: 'absolute',
                        top: -6,
                        right: -6,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: '#ff3b30',
                        color: '#fff',
                        border: 'none',
                        fontSize: 12,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: 1,
                      }}
                    >
                      x
                    </button>
                  </div>
                )}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setFormImage(e.target.files[0]);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      padding: '10px 18px',
                      background: '#f5f5f7',
                      color: '#1d1d1f',
                      border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6e6e73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    {formImage ? formImage.name : existingImage ? 'Change Image' : 'Upload Image'}
                  </button>
                  <p style={{ fontSize: 11, color: '#86868b', margin: '6px 0 0' }}>
                    JPG, PNG or WebP. Recommended 200x200px.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={handleSave}
                disabled={saving || !formName.trim()}
                style={{
                  padding: '12px 28px',
                  background: '#0066cc',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 980,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: saving || !formName.trim() ? 'default' : 'pointer',
                  opacity: saving || !formName.trim() ? 0.5 : 1,
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={cancelForm}
                style={{
                  padding: '12px 22px',
                  background: '#fff',
                  color: '#1d1d1f',
                  border: '1px solid rgba(0,0,0,0.12)',
                  borderRadius: 980,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f5f7'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        <motion.div variants={fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
          <DataTable
            columns={[
              {
                key: 'image',
                label: 'Image',
                render: (value) =>
                  value ? (
                    <img
                      src={value}
                      alt=""
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: '#f5f5f7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#c7c7cc',
                        fontSize: 18,
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  ),
              },
              { key: 'name', label: 'Name' },
              {
                key: 'createdAt',
                label: 'Created',
                render: (value) => value ? new Date(value).toLocaleDateString() : '-',
              },
            ]}
            data={industries}
            loading={loading}
            actions={(industry) => [
              {
                label: 'Edit',
                onClick: () => openEdit(industry),
              },
              {
                label: 'Delete',
                color: '#ff3b30',
                onClick: () => handleDelete(industry._id, industry.name),
              },
            ]}
          />
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
