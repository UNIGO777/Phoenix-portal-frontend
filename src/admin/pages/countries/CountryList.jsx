import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { countryService } from '../../services/adminApi';
import DataTable from '../../components/DataTable';
import AdminLayout from '../AdminLayout';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function CountryList() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formName, setFormName] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCountries = () => {
    setLoading(true);
    countryService.getAll()
      .then(({ data }) => {
        setCountries(Array.isArray(data) ? data : data.data || []);
      })
      .catch((err) => {
        console.error('Failed to fetch countries:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormName('');
    setShowForm(true);
  };

  const openEdit = (country) => {
    setEditingId(country._id);
    setFormName(country.name);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormName('');
  };

  const handleSave = async () => {
    if (!formName.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await countryService.update(editingId, { name: formName.trim() });
      } else {
        await countryService.create({ name: formName.trim() });
      }
      cancelForm();
      fetchCountries();
    } catch (err) {
      alert('Failed to save country: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete country "${name}"?`)) return;
    try {
      await countryService.delete(id);
      fetchCountries();
    } catch (err) {
      alert('Failed to delete country: ' + (err.response?.data?.message || err.message));
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
              Countries
            </h1>
            <p style={{ fontSize: 15, color: '#86868b', margin: 0 }}>
              Manage country options for users and businesses.
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
            Add Country
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
              {editingId ? 'Edit Country' : 'New Country'}
            </h3>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
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
                  placeholder="Enter country name"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: 15,
                    border: '1px solid rgba(0,0,0,0.12)',
                    borderRadius: 12,
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#0066cc'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.12)'; }}
                />
              </div>
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
              { key: 'name', label: 'Name' },
              {
                key: 'createdAt',
                label: 'Created',
                render: (value) => value ? new Date(value).toLocaleDateString() : '-',
              },
            ]}
            data={countries}
            loading={loading}
            actions={(country) => [
              {
                label: 'Edit',
                onClick: () => openEdit(country),
              },
              {
                label: 'Delete',
                color: '#ff3b30',
                onClick: () => handleDelete(country._id, country.name),
              },
            ]}
          />
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
