import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { userService, countryService } from '../../services/adminApi';
import FormField from '../../components/FormField';
import AdminLayout from '../AdminLayout';
import Loader from '../../../components/Loader';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [countries, setCountries] = useState([]);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    country: '',
    passportNumber: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    Promise.all([
      countryService.getAll(),
      userService.getById(id),
    ])
      .then(([countriesRes, userRes]) => {
        const options = countriesRes.data.data.map((c) => ({
          value: c._id,
          label: c.name,
        }));
        setCountries(options);

        const user = userRes.data.data;
        setForm({
          fullName: user.fullName || '',
          email: user.email || '',
          mobile: user.mobile || '',
          country: user.country || '',
          passportNumber: user.passportNumber || '',
        });
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setErrors({ submit: 'Failed to load user data' });
        }
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email format';
    if (!form.mobile.trim()) newErrors.mobile = 'Mobile is required';
    if (!form.country) newErrors.country = 'Country is required';
    if (!form.passportNumber.trim()) newErrors.passportNumber = 'Passport number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await userService.update(id, form);
      navigate('/admin/users');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setErrors({ submit: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Loader text="Loading user..." />
      </AdminLayout>
    );
  }

  if (notFound) {
    return (
      <AdminLayout>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: 16,
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c7c7cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1d1d1f', margin: 0 }}>User Not Found</h2>
          <p style={{ fontSize: 14, color: '#86868b', margin: 0 }}>The user you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/admin/users')}
            style={{
              marginTop: 8,
              padding: '10px 22px',
              background: '#0066cc',
              color: '#fff',
              border: 'none',
              borderRadius: 980,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Back to Users
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div className="admin-form-wrap" initial="hidden" animate="visible" variants={stagger} style={{ maxWidth: 600 }}>
        {/* Back link */}
        <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
          <button
            onClick={() => navigate('/admin/users')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'none',
              border: 'none',
              color: '#0066cc',
              fontSize: 14,
              cursor: 'pointer',
              padding: 0,
              marginBottom: 20,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Users
          </button>
        </motion.div>

        <motion.div variants={fadeUp} transition={{ duration: 0.5 }} style={{ marginBottom: 32 }}>
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
            Edit User
          </h1>
          <p style={{ fontSize: 15, color: '#86868b', margin: 0 }}>
            Update user details and information.
          </p>
        </motion.div>

        <motion.div
          className="admin-form-card"
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          style={{
            background: '#fff',
            borderRadius: 18,
            border: '1px solid rgba(0,0,0,0.06)',
            padding: '32px 28px',
          }}
        >
          <form onSubmit={handleSubmit}>
            {errors.submit && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 16px',
                  background: 'rgba(255,59,48,0.06)',
                  border: '1px solid rgba(255,59,48,0.2)',
                  borderRadius: 12,
                  color: '#ff3b30',
                  marginBottom: 24,
                  fontSize: 13,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff3b30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.submit}
              </div>
            )}

            <FormField label="Full Name" name="fullName" type="text" value={form.fullName} onChange={handleChange} error={errors.fullName} placeholder="John Doe" required />
            <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="john@example.com" required />
            <FormField label="Mobile" name="mobile" type="text" value={form.mobile} onChange={handleChange} error={errors.mobile} placeholder="+1 (555) 000-0000" required />
            <FormField label="Country" name="country" type="select" value={form.country} onChange={handleChange} error={errors.country} options={countries} required />
            <FormField label="Passport Number" name="passportNumber" type="text" value={form.passportNumber} onChange={handleChange} error={errors.passportNumber} placeholder="A12345678" required />

            <div className="admin-form-actions" style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  flex: 1,
                  padding: '13px 24px',
                  background: '#0066cc',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.6 : 1,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { if (!saving) e.target.style.background = '#0055b3'; }}
                onMouseLeave={(e) => { e.target.style.background = '#0066cc'; }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/users')}
                style={{
                  flex: 1,
                  padding: '13px 24px',
                  background: '#f5f5f7',
                  color: '#1d1d1f',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.target.style.background = '#ebebed'; }}
                onMouseLeave={(e) => { e.target.style.background = '#f5f5f7'; }}
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
