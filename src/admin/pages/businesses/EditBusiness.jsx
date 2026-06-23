import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { businessService, industryService, countryService } from '../../services/adminApi';
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

export default function EditBusiness() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [industries, setIndustries] = useState([]);
  const [countries, setCountries] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    industry: '',
    country: '',
    city: '',
    askingPrice: '',
    annualRevenue: '',
    annualProfit: '',
    numEmployees: '',
    yearEstablished: '',
    website: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  useEffect(() => {
    Promise.all([
      industryService.getAll(),
      countryService.getAll(),
      businessService.getById(id),
    ])
      .then(([indRes, countRes, bizRes]) => {
        setIndustries(
          indRes.data.data.map((i) => ({ value: i._id, label: i.name }))
        );
        setCountries(
          countRes.data.data.map((c) => ({ value: c._id, label: c.name }))
        );

        const biz = bizRes.data.data;
        setForm({
          name: biz.name || '',
          description: biz.description || '',
          industry: biz.industry?._id || biz.industry || '',
          country: biz.country?._id || biz.country || '',
          city: biz.city || '',
          askingPrice: biz.askingPrice || '',
          annualRevenue: biz.annualRevenue || '',
          annualProfit: biz.annualProfit || '',
          numEmployees: biz.numEmployees || '',
          yearEstablished: biz.yearEstablished || '',
          website: biz.website || '',
          contactEmail: biz.contactEmail || '',
          contactPhone: biz.contactPhone || '',
        });
        setExistingImages(biz.images || []);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setErrors({ submit: 'Failed to load business data' });
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setNewImages((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeNewImage = (index) => {
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageIndex) => {
    if (!confirm('Remove this image?')) return;
    try {
      await businessService.removeImage(id, imageIndex);
      setExistingImages((prev) => prev.filter((_, i) => i !== imageIndex));
    } catch (err) {
      alert('Failed to remove image: ' + (err.response?.data?.message || err.message));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Business name is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.industry) newErrors.industry = 'Industry is required';
    if (!form.country) newErrors.country = 'Country is required';
    if (!form.askingPrice) newErrors.askingPrice = 'Asking price is required';
    else if (Number(form.askingPrice) <= 0) newErrors.askingPrice = 'Asking price must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = { ...form };
      Object.keys(payload).forEach((key) => {
        if (payload[key] === '') delete payload[key];
      });

      await businessService.update(id, payload);

      // Upload new images if any
      if (newImages.length > 0) {
        const formData = new FormData();
        newImages.forEach((file) => formData.append('images', file));
        await businessService.uploadImages(id, formData);
      }

      navigate('/admin/businesses');
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
        <Loader text="Loading business..." />
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
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1d1d1f', margin: 0 }}>Business Not Found</h2>
          <p style={{ fontSize: 14, color: '#86868b', margin: 0 }}>The business you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/admin/businesses')}
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
            Back to Businesses
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
            onClick={() => navigate('/admin/businesses')}
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
            Back to Businesses
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
            Edit Business
          </h1>
          <p style={{ fontSize: 15, color: '#86868b', margin: 0 }}>
            Update business details and information.
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

            <FormField label="Business Name" name="name" type="text" value={form.name} onChange={handleChange} error={errors.name} placeholder="Enter business name" required />
            <FormField label="Description" name="description" type="textarea" value={form.description} onChange={handleChange} error={errors.description} placeholder="Describe the business..." required />
            <FormField label="Industry" name="industry" type="select" value={form.industry} onChange={handleChange} error={errors.industry} options={industries} required />
            <FormField label="Country" name="country" type="select" value={form.country} onChange={handleChange} error={errors.country} options={countries} required />
            <FormField label="City" name="city" type="text" value={form.city} onChange={handleChange} error={errors.city} placeholder="City" />
            <FormField label="Asking Price ($)" name="askingPrice" type="number" value={form.askingPrice} onChange={handleChange} error={errors.askingPrice} placeholder="e.g. 500000" required />
            <FormField label="Annual Revenue ($)" name="annualRevenue" type="number" value={form.annualRevenue} onChange={handleChange} error={errors.annualRevenue} placeholder="e.g. 250000" />
            <FormField label="Annual Profit ($)" name="annualProfit" type="number" value={form.annualProfit} onChange={handleChange} error={errors.annualProfit} placeholder="e.g. 100000" />
            <FormField label="Number of Employees" name="numEmployees" type="number" value={form.numEmployees} onChange={handleChange} error={errors.numEmployees} placeholder="e.g. 25" />
            <FormField label="Year Established" name="yearEstablished" type="number" value={form.yearEstablished} onChange={handleChange} error={errors.yearEstablished} placeholder="e.g. 2015" />
            <FormField label="Website" name="website" type="text" value={form.website} onChange={handleChange} error={errors.website} placeholder="https://example.com" />
            <FormField label="Contact Email" name="contactEmail" type="email" value={form.contactEmail} onChange={handleChange} error={errors.contactEmail} placeholder="contact@business.com" />
            <FormField label="Contact Phone" name="contactPhone" type="text" value={form.contactPhone} onChange={handleChange} error={errors.contactPhone} placeholder="+1 (555) 000-0000" />

            {/* Existing images */}
            <div style={{ marginTop: 24, marginBottom: 8 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#1d1d1f',
                  marginBottom: 8,
                }}
              >
                Business Images
              </label>

              {existingImages.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 12, color: '#86868b', margin: '0 0 10px' }}>Current images</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    {existingImages.map((img, index) => (
                      <div
                        key={index}
                        style={{
                          position: 'relative',
                          width: 80,
                          height: 80,
                          borderRadius: 10,
                          overflow: 'hidden',
                          border: '1px solid rgba(0,0,0,0.08)',
                        }}
                      >
                        <img
                          src={typeof img === 'string' ? img : img.url}
                          alt={`Business ${index + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          style={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: 'rgba(255,59,48,0.85)',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            lineHeight: 1,
                            padding: 0,
                          }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  background: '#f5f5f7',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#1d1d1f',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#ebebed'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#f5f5f7'; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                Add Images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>

              {newImagePreviews.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <p style={{ fontSize: 12, color: '#86868b', margin: '0 0 10px' }}>New images to upload</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    {newImagePreviews.map((src, index) => (
                      <div
                        key={index}
                        style={{
                          position: 'relative',
                          width: 80,
                          height: 80,
                          borderRadius: 10,
                          overflow: 'hidden',
                          border: '1px solid rgba(0,0,0,0.08)',
                        }}
                      >
                        <img
                          src={src}
                          alt={`New ${index + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          style={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: 'rgba(0,0,0,0.6)',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            lineHeight: 1,
                            padding: 0,
                          }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
                onClick={() => navigate('/admin/businesses')}
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
