import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, X, ChevronLeft, Send } from 'lucide-react';
import api from '../services/api';
import Layout from '../components/layout/Layout';
import Loader from '../components/Loader';

const defaultImg = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80';

function formatPrice(n) {
  if (!n) return 'N/A';
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function InquiryModal({ business, onClose }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please enter a message.');
      return;
    }
    setSending(true);
    setError('');
    try {
      await api.post('/inquiries', {
        business: business._id,
        message: message.trim(),
      });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setSending(false);
    }
  };

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
          maxWidth: 520,
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
        }}
      >
        {/* Close button */}
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

        <div style={{ padding: '36px 32px 32px' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'rgba(52,199,89,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <Send size={24} color="#34c759" />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 600, color: '#1d1d1f', margin: '0 0 8px' }}>
                Inquiry sent
              </h3>
              <p style={{ fontSize: 15, color: '#6e6e73', margin: '0 0 24px', lineHeight: 1.5 }}>
                Your inquiry for <strong>{business.name}</strong> has been submitted. Our team will get back to you shortly.
              </p>
              <button
                onClick={onClose}
                style={{
                  border: 'none',
                  background: '#0066cc',
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 500,
                  padding: '12px 28px',
                  borderRadius: 980,
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <h3 style={{ fontSize: 22, fontWeight: 600, color: '#1d1d1f', margin: '0 0 4px' }}>
                Request information
              </h3>
              <p style={{ fontSize: 14, color: '#86868b', margin: '0 0 24px', lineHeight: 1.4 }}>
                Send an inquiry about this business opportunity.
              </p>

              {/* Business summary */}
              <div
                style={{
                  display: 'flex',
                  gap: 14,
                  padding: 16,
                  background: '#f5f5f7',
                  borderRadius: 14,
                  marginBottom: 24,
                  alignItems: 'center',
                }}
              >
                <img
                  src={business.images?.[0] || defaultImg}
                  alt=""
                  style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1d1d1f' }}>{business.name}</div>
                  <div style={{ fontSize: 13, color: '#6e6e73', marginTop: 2 }}>
                    {business.industry?.name || 'Business'} · {formatPrice(business.askingPrice)}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1d1d1f', marginBottom: 10 }}>
                  Quick select
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                  {[
                    "I'd like to request detailed financials and revenue history.",
                    "I'm interested in understanding the day-to-day operations and transition support.",
                    "Can you share more about the growth potential and current customer base?",
                  ].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setMessage(opt)}
                      style={{
                        border: message === opt ? '1.5px solid #0066cc' : '1px solid rgba(0,0,0,0.12)',
                        background: message === opt ? 'rgba(0,102,204,0.06)' : '#f5f5f7',
                        color: message === opt ? '#0066cc' : '#1d1d1f',
                        fontSize: 13,
                        fontWeight: 500,
                        padding: '8px 14px',
                        borderRadius: 980,
                        cursor: 'pointer',
                        lineHeight: 1.4,
                        textAlign: 'left',
                        transition: 'all 0.15s',
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1d1d1f', marginBottom: 8 }}>
                  Your message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="I'm interested in learning more about this business. Please share additional details about financials, operations, and the transition process."
                  rows={5}
                  style={{
                    width: '100%',
                    border: '1px solid rgba(0,0,0,0.12)',
                    borderRadius: 12,
                    padding: '14px 16px',
                    fontSize: 15,
                    color: '#1d1d1f',
                    resize: 'vertical',
                    outline: 'none',
                    fontFamily: 'inherit',
                    lineHeight: 1.5,
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#0066cc')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(0,0,0,0.12)')}
                />

                {error && (
                  <p style={{ fontSize: 13, color: '#ff3b30', margin: '10px 0 0' }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  style={{
                    width: '100%',
                    marginTop: 20,
                    border: 'none',
                    background: '#0066cc',
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 500,
                    padding: '14px 28px',
                    borderRadius: 980,
                    cursor: sending ? 'default' : 'pointer',
                    opacity: sending ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'opacity 0.2s',
                  }}
                >
                  <Send size={16} />
                  {sending ? 'Sending...' : 'Send inquiry'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similar, setSimilar] = useState([]);
  const [showInquiry, setShowInquiry] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/businesses/${id}`)
      .then((r) => {
        setBusiness(r.data.data);
        if (r.data.data?.industry?._id) {
          api
            .get('/businesses', {
              params: { industry: r.data.data.industry._id, limit: 5 },
            })
            .then((r2) => {
              setSimilar(
                (r2.data.data || []).filter((b) => b._id !== id).slice(0, 4)
              );
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        setBusiness(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <Loader text="Loading listing..." />
      </Layout>
    );
  }

  if (!business) {
    return (
      <Layout>
        <div style={{ padding: '120px 40px', textAlign: 'center' }}>
          <div style={{ marginBottom: 16, opacity: 0.3 }}><Search size={48} /></div>
          <h2 style={{ fontSize: 28, fontWeight: 600, color: '#1d1d1f', marginBottom: 8 }}>
            Listing not found
          </h2>
          <p style={{ fontSize: 15, color: '#86868b', marginBottom: 24 }}>
            This listing may have been removed or you don't have access.
          </p>
          <button
            onClick={() => navigate('/search')}
            style={{
              border: 'none',
              background: '#0066cc',
              color: '#fff',
              fontSize: 14,
              fontWeight: 500,
              padding: '10px 22px',
              borderRadius: 980,
              cursor: 'pointer',
            }}
          >
            Browse listings
          </button>
        </div>
      </Layout>
    );
  }

  const heroImg = business.images?.[0] || defaultImg;
  const stats = [
    { label: 'Asking Price', value: formatPrice(business.askingPrice) },
    { label: 'Established', value: business.yearEstablished || 'N/A' },
    { label: 'Employees', value: business.numEmployees || 'N/A' },
    { label: 'Industry', value: business.industry?.name || 'N/A' },
    { label: 'Location', value: [business.city, business.country?.name].filter(Boolean).join(', ') || 'N/A' },
    { label: 'Status', value: business.status?.charAt(0).toUpperCase() + business.status?.slice(1) || 'N/A' },
  ];

  return (
    <Layout>
      {/* Inquiry Modal */}
      {showInquiry && (
        <InquiryModal business={business} onClose={() => setShowInquiry(false)} />
      )}

      {/* Back Bar */}
      <div
        style={{
          position: 'sticky',
          top: 48,
          zIndex: 40,
          background: 'rgba(245,245,247,0.92)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            padding: '0 40px',
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            onClick={() => navigate(-1)}
            style={{ fontSize: 13, color: '#0066cc', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 2 }}
          >
            <ChevronLeft size={14} /> Back to results
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1d1d1f' }}>{business.name}</span>
            <button
              onClick={() => setShowInquiry(true)}
              style={{
                border: 'none',
                background: '#0066cc',
                color: '#fff',
                fontSize: 13,
                fontWeight: 500,
                padding: '7px 18px',
                borderRadius: 980,
                cursor: 'pointer',
              }}
            >
              Request info
            </button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section style={{ padding: '56px 40px 0', textAlign: 'center' }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#0066cc',
            marginBottom: 12,
          }}
        >
          {business.industry?.name || 'Business'} ·{' '}
          {[business.city, business.country?.name].filter(Boolean).join(', ')}
        </div>
        <h1
          style={{
            fontSize: 'clamp(40px, 6vw, 68px)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.06,
            margin: '0 0 12px',
            color: '#1d1d1f',
          }}
        >
          {business.name}
        </h1>
        <p
          style={{
            fontSize: 'clamp(19px, 2.4vw, 26px)',
            color: '#6e6e73',
            lineHeight: 1.3,
            maxWidth: 600,
            margin: '0 auto 20px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {business.description || 'Premium business opportunity'}
        </p>
        <div
          style={{
            fontSize: 15,
            color: '#1d1d1f',
            marginBottom: 28,
          }}
        >
          Asking {formatPrice(business.askingPrice)} ·{' '}
          {[business.city, business.country?.name].filter(Boolean).join(', ')}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 40 }}>
          <button
            onClick={() => setShowInquiry(true)}
            style={{
              border: 'none',
              background: '#0066cc',
              color: '#fff',
              fontSize: 16,
              fontWeight: 500,
              padding: '13px 28px',
              borderRadius: 980,
              cursor: 'pointer',
            }}
          >
            Request information
          </button>
        </div>

        {/* Hero Image */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 1100,
            margin: '0 auto',
            aspectRatio: '21/9',
            borderRadius: 28,
            overflow: 'hidden',
          }}
        >
          <img
            src={heroImg}
            alt={business.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              left: 20,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(8px)',
              borderRadius: 12,
              padding: '10px 18px',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            {formatPrice(business.askingPrice)}
          </div>
        </div>
      </section>

      {/* Stats Band */}
      <section style={{ padding: '40px 40px 0' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
            gap: 1,
            background: 'rgba(0,0,0,0.06)',
            borderRadius: 20,
            overflow: 'hidden',
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                background: '#fff',
                padding: '24px 20px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 12, color: '#86868b', marginBottom: 6 }}>{s.label}</div>
              <div
                style={{
                  fontSize: 'clamp(18px, 2vw, 24px)',
                  fontWeight: 600,
                  color: '#1d1d1f',
                }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Description */}
      {business.description && (
        <section style={{ padding: '48px 40px 0', maxWidth: 800, margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              margin: '0 0 20px',
              color: '#1d1d1f',
            }}
          >
            About this business
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: '#1d1d1f', margin: 0 }}>
            {business.description}
          </p>
        </section>
      )}

      {/* Gallery */}
      {business.images && business.images.length > 1 && (
        <section style={{ padding: '48px 40px 0' }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              margin: '0 0 20px',
              color: '#1d1d1f',
            }}
          >
            Gallery
          </h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1.6 }}>
              <img
                src={business.images[0]}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 20,
                  objectFit: 'cover',
                  display: 'block',
                  minHeight: 300,
                }}
              />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {business.images.slice(1, 3).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  style={{
                    width: '100%',
                    flex: 1,
                    borderRadius: 20,
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Band */}
      <section style={{ padding: '48px 40px 0' }}>
        <div
          style={{
            borderRadius: 22,
            background: 'linear-gradient(160deg, #1d2330, #10141d)',
            color: '#fff',
            padding: '40px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 24,
          }}
        >
          <div>
            <h3 style={{ fontSize: 28, fontWeight: 600, margin: '0 0 6px' }}>Interested in this opportunity?</h3>
            <p style={{ fontSize: 15, color: '#b6bcc9', margin: 0 }}>
              Send an inquiry to learn more about this business.
            </p>
          </div>
          <button
            onClick={() => setShowInquiry(true)}
            style={{
              border: 'none',
              background: '#0071e3',
              color: '#fff',
              fontSize: 16,
              fontWeight: 500,
              padding: '13px 26px',
              borderRadius: 980,
              cursor: 'pointer',
            }}
          >
            Request info
          </button>
        </div>
      </section>

      {/* Similar Listings */}
      {similar.length > 0 && (
        <section style={{ padding: '48px 0 0' }}>
          <div style={{ padding: '0 40px' }}>
            <h2
              style={{
                fontSize: 'clamp(22px, 2.6vw, 28px)',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                margin: '0 0 24px',
              }}
            >
              Similar listings.{' '}
              <span style={{ color: '#86868b' }}>More in {business.industry?.name}.</span>
            </h2>
          </div>
          <div
            className="mq-row"
            style={{
              display: 'flex',
              gap: 20,
              overflowX: 'auto',
              padding: '4px 0 22px',
              margin: '0 40px',
            }}
          >
            {similar.map((l) => (
              <article
                key={l._id}
                onClick={() => navigate(`/listing/${l._id}`)}
                style={{
                  flex: '0 0 300px',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 18,
                  background: '#10141d',
                  color: '#fff',
                  minHeight: 370,
                  cursor: 'pointer',
                }}
              >
                <img
                  src={l.images?.[0] || defaultImg}
                  alt=""
                  loading="lazy"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg,rgba(16,20,29,0.15) 0%,rgba(16,20,29,0.55) 55%,rgba(16,20,29,0.94) 100%)',
                  }}
                />
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: 26,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 370,
                  }}
                >
                  <div style={{ fontSize: 12, color: '#cdd4e0', marginBottom: 'auto' }}>
                    {l.industry?.name} · {l.country?.name}
                  </div>
                  <h3
                    style={{
                      fontSize: 22,
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      lineHeight: 1.15,
                      margin: '0 0 10px',
                    }}
                  >
                    {l.name}
                  </h3>
                  <div style={{ fontSize: 15 }}>
                    Asking <strong>{formatPrice(l.askingPrice)}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <div style={{ height: 60 }} />
    </Layout>
  );
}
