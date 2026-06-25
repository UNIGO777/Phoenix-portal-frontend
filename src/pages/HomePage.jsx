import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, FolderLock, Headset, Landmark, ChevronRight, ArrowRight } from 'lucide-react';
import api from '../services/api';
import Layout from '../components/layout/Layout';
import Loader from '../components/Loader';

const industryImages = {
  SaaS: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80',
  'E-commerce': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200&q=80',
  Retail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&q=80',
  Healthcare: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&q=80',
  Manufacturing: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=200&q=80',
  Logistics: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200&q=80',
  'Real Estate': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=80',
  Hospitality: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80',
};

const defaultImg = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80';

const benefits = [
  { icon: ShieldCheck, title: 'Verified financials', desc: 'Audited before any listing goes live.' },
  { icon: Lock, title: 'Escrow protection', desc: 'Funds secured through every close.' },
  { icon: FolderLock, title: 'Private data rooms', desc: 'Diligence shared on your terms.' },
  { icon: Headset, title: 'Advisor support', desc: 'Guidance from search to signing.' },
  { icon: Landmark, title: 'Financing partners', desc: 'Capital options built into the deal.' },
];

function formatPrice(n) {
  if (!n) return 'N/A';
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

/* reusable fade-up variant */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

/* stagger children */
const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* card scale-in */
const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
};

export default function HomePage() {
  const navigate = useNavigate();
  const [industries, setIndustries] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/industries').then((r) => setIndustries(r.data.data || [])).catch(() => {}),
      api.get('/featured').then((r) => setFeatured(r.data.data || [])).catch(() => {}),
      api.get('/businesses?limit=12').then((r) => setRecommended(r.data.data || [])).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <Loader text="Loading marketplace..." />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Promo Strip */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.05)' }}
      >
        <div
          style={{
            padding: '13px clamp(16px, 5vw, 40px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: 12, color: '#6e6e73' }}>
            Verified financials and escrow protection on every listing.{' '}
            <Link to="/search" style={{ color: '#0066cc', textDecoration: 'none' }}>
              See how it works <ChevronRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
            </Link>
          </span>
        </div>
      </motion.div>

      {/* Hero Header */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={stagger}
        style={{ padding: '64px clamp(16px, 5vw, 40px) 48px' }}
      >
        <div
          className="user-hero-row"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 20,
          }}
        >
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              fontSize: 'clamp(44px, 7vw, 80px)',
              fontWeight: 600,
              letterSpacing: '-0.015em',
              lineHeight: 1,
              margin: 0,
              color: '#1d1d1f',
            }}
          >
            Marketplace
          </motion.h1>
          <motion.div
            className="user-hero-sub"
            variants={fadeUp}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ textAlign: 'right', maxWidth: 300 }}
          >
            <p
              style={{
                fontSize: 'clamp(19px, 2.4vw, 24px)',
                fontWeight: 600,
                lineHeight: 1.25,
                letterSpacing: '-0.01em',
                margin: '0 0 6px',
                color: '#1d1d1f',
              }}
            >
              The best way to acquire
              <br />
              the businesses you want.
            </p>
            <Link
              to="/search"
              style={{ display: 'block', fontSize: 14, color: '#0066cc', textDecoration: 'none', marginTop: 6 }}
            >
              Browse listings <ChevronRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
            </Link>
          </motion.div>
        </div>
      </motion.header>

      {/* Industry Row */}
      {industries.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          style={{ padding: '0 clamp(16px, 5vw, 40px) 8px' }}
        >
          <div
            className="mq-row user-industry-row"
            style={{
              display: 'flex',
              gap: 5,
              overflowX: 'auto',
              padding: '8px 2px 22px',
              scrollSnapType: 'x proximity',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            onWheel={(e) => {
              if (e.deltaY === 0) return;
              e.currentTarget.scrollLeft += e.deltaY < 0 ? -50 : 50;
            }}
          >
            {industries.map((ind, i) => (
              <motion.div
                key={ind._id}
                className="user-industry-item"
                variants={scaleIn}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  to={`/search?industry=${ind._id}`}
                  className="user-industry-link"
                  style={{
                    flex: '0 0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 11,
                    width: 120,
                    scrollSnapAlign: 'start',
                    textDecoration: 'none',
                    color: '#1d1d1f',
                  }}
                >
                  <img
                    src={ind.image || industryImages[ind.name] || defaultImg}
                    alt={ind.name}
                    loading="lazy"
                    className="user-industry-img"
                    style={{
                      width: 'clamp(64px, 12vw, 96px)',
                      height: 'clamp(64px, 12vw, 96px)',
                      borderRadius: 20,
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <span className="user-industry-name" style={{ fontSize: 13, textAlign: 'center', lineHeight: 1.2, fontWeight: 500 }}>{ind.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* New on the Market */}
      {featured.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          style={{ padding: '32px clamp(16px, 5vw, 40px) 8px' }}
        >
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: 'clamp(22px, 2.6vw, 28px)',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              margin: '0 0 24px',
              color: '#1d1d1f',
            }}
          >
            New on the market.{' '}
            <span style={{ color: '#86868b', fontWeight: 600 }}>Verified opportunities, just listed.</span>
          </motion.h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 54 }}>
            {featured.slice(0, 3).map((biz, i) => {
              const imageLeft = i % 2 === 1;
              const textContent = (
                <div style={{ padding: 'clamp(24px, 4vw, 44px)', display: 'flex', flexDirection: 'column' }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#0066cc',
                      marginBottom: 12,
                    }}
                  >
                    {i === 0 ? 'Featured' : ''}{i === 0 && biz.industry?.name ? ' · ' : ''}{biz.industry?.name || 'Business'}
                  </div>
                  <h3
                    style={{
                      fontSize: 'clamp(26px, 3vw, 36px)',
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                      lineHeight: 1.1,
                      margin: '0 0 6px',
                      color: '#1d1d1f',
                    }}
                  >
                    <span style={{ color: '#0066cc' }}>{biz.name.split(' ')[0]}</span>{' '}
                    {biz.name.split(' ').slice(1).join(' ')}
                  </h3>
                  {biz.city && (
                    <p style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#1d1d1f', margin: '4px 0 0' }}>
                      {biz.city}{biz.country?.name ? `, ${biz.country.name}` : ''}
                    </p>
                  )}

                  <div style={{ width: '100%', height: 2, background: '#0066cc', margin: '18px 0 20px', opacity: 0.7 }} />

                  <ul style={{ listStyle: 'disc', paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                    {biz.description && (
                      <li style={{ fontSize: 15, lineHeight: 1.5, color: '#333' }}>
                        {biz.description.length > 120 ? biz.description.slice(0, 120) + '...' : biz.description}
                      </li>
                    )}
                    {biz.yearEstablished && (
                      <li style={{ fontSize: 15, lineHeight: 1.5, color: '#333' }}>
                        <strong>{new Date().getFullYear() - biz.yearEstablished} Years</strong> + in Operation (Est. {biz.yearEstablished})
                      </li>
                    )}
                    {biz.numEmployees && (
                      <li style={{ fontSize: 15, lineHeight: 1.5, color: '#333' }}>
                        <strong>{biz.numEmployees} Employees</strong> + in Company
                      </li>
                    )}
                    <li style={{ fontSize: 15, lineHeight: 1.5, color: '#333' }}>
                      <strong>{formatPrice(biz.askingPrice)}</strong> + Asking Price
                    </li>
                    {biz.grossRevenue && (
                      <li style={{ fontSize: 15, lineHeight: 1.5, color: '#333' }}>
                        <strong>{formatPrice(biz.grossRevenue)}</strong> + Gross Revenue
                      </li>
                    )}
                  </ul>

                  <div style={{ width: '100%', height: 1, background: '#ddd', margin: '20px 0 18px' }} />

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 10,
                      background: '#1d1d1f',
                      color: '#fff',
                      padding: '12px 24px',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      alignSelf: 'flex-start',
                    }}
                  >
                    View Details
                    <ArrowRight size={16} />
                  </div>
                </div>
              );
              const imageContent = (
                <div style={{ position: 'relative', minHeight: 380 }}>
                  <img
                    src={biz.images?.[0] || defaultImg}
                    alt={biz.name}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              );
              return (
                <motion.article
                  key={biz._id}
                  variants={scaleIn}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ scale: 1.005 }}
                  onClick={() => navigate(`/listing/${biz._id}`)}
                  className="new-market-card"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr',
                    background: '#f5f5f7',
                    borderRadius: 18,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    minHeight: 380,
                  }}
                >
                  {imageLeft ? imageContent : textContent}
                  {imageLeft ? textContent : imageContent}
                </motion.article>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* Featured Listings Carousel - Hand-picked by advisors */}
      {featured.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          style={{ padding: '52px 0 8px' }}
        >
          <div style={{ padding: '0 clamp(16px, 5vw, 40px)' }}>
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              style={{
                fontSize: 'clamp(22px, 2.6vw, 28px)',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                margin: '0 0 24px',
                color: '#1d1d1f',
              }}
            >
              Featured listings.{' '}
              <span style={{ color: '#86868b', fontWeight: 600 }}>Hand-picked by our advisors.</span>
            </motion.h2>
          </div>
          <div
            className="mq-row user-featured-row"
            style={{
              display: 'flex',
              gap: 20,
              overflowX: 'auto',
              padding: '10px 0 26px',
              margin: '0 clamp(16px, 5vw, 40px)',
              scrollSnapType: 'x proximity',
            }}
          >
            {featured.map((l, i) => (
              <motion.article
                key={l._id}
                variants={scaleIn}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(0,0,0,0.25)', transition: { duration: 0.25 } }}
                onClick={() => navigate(`/listing/${l._id}`)}
                style={{
                  flex: '0 0 300px',
                  scrollSnapAlign: 'start',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 18,
                  background: '#10141d',
                  color: '#fff',
                  minHeight: 380,
                  cursor: 'pointer',
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                <img
                  src={l.images?.[0] || defaultImg}
                  alt=""
                  loading="lazy"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
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
                    minHeight: 380,
                  }}
                >
                  <div style={{ fontSize: 12, color: '#cdd4e0', marginBottom: 'auto' }}>
                    {l.industry?.name || 'Business'} &middot; {l.country?.name || ''}
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
                  <div style={{ fontSize: 15, color: '#fff' }}>
                    Asking <strong>{formatPrice(l.askingPrice)}</strong>
                  </div>
                  <div style={{ fontSize: 13, color: '#c2c9d6', marginTop: 2 }}>
                    {l.numEmployees ? `${l.numEmployees} employees` : ''}{' '}
                    {l.yearEstablished ? `\u00B7 Est. ${l.yearEstablished}` : ''}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>
      )}

      {/* You May Have Your Interest */}
      {recommended.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          style={{ padding: '52px 0 8px' }}
        >
          <div style={{ padding: '0 clamp(16px, 5vw, 40px)' }}>
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              style={{
                fontSize: 'clamp(22px, 2.6vw, 28px)',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                margin: '0 0 24px',
                color: '#1d1d1f',
              }}
            >
              You may have your interest.{' '}
              <span style={{ color: '#86868b', fontWeight: 600 }}>More opportunities worth exploring.</span>
            </motion.h2>
          </div>
          <div
            className="mq-row user-featured-row"
            style={{
              display: 'flex',
              gap: 20,
              overflowX: 'auto',
              padding: '10px 0 26px',
              margin: '0 clamp(16px, 5vw, 40px)',
              scrollSnapType: 'x proximity',
            }}
          >
            {recommended.map((l, i) => (
              <motion.article
                key={l._id}
                variants={scaleIn}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(0,0,0,0.12)', transition: { duration: 0.25 } }}
                onClick={() => navigate(`/listing/${l._id}`)}
                style={{
                  flex: '0 0 280px',
                  scrollSnapAlign: 'start',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 18,
                  background: '#f5f5f7',
                  color: '#1d1d1f',
                  minHeight: 360,
                  cursor: 'pointer',
                  border: '1px solid rgba(0,0,0,0.08)',
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                <img
                  src={l.images?.[0] || defaultImg}
                  alt=""
                  loading="lazy"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: 180, objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 360,
                    paddingTop: 190,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#86868b', textTransform: 'uppercase', marginBottom: 8 }}>
                    {l.industry?.name || 'Business'} &middot; {l.city || 'N/A'}
                  </div>
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      lineHeight: 1.2,
                      margin: '0 0 8px',
                      color: '#1d1d1f',
                    }}
                  >
                    {l.name}
                  </h3>
                  <p style={{ fontSize: 13, color: '#6e6e73', lineHeight: 1.4, margin: '0 0 12px', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {l.description || 'Business opportunity'}
                  </p>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 'auto', paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#86868b' }}>Asking</div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: '#1d1d1f' }}>{formatPrice(l.askingPrice)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#86868b' }}>Est.</div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: '#1d1d1f' }}>{l.yearEstablished || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>
      )}

      {/* The Difference */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        style={{ padding: '52px clamp(16px, 5vw, 40px) 8px' }}
      >
        <motion.h2
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: 'clamp(22px, 2.6vw, 28px)',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            margin: '0 0 24px',
            color: '#1d1d1f',
          }}
        >
          The Phoenix difference.{' '}
          <span style={{ color: '#86868b', fontWeight: 600 }}>More reasons to acquire with us.</span>
        </motion.h2>
        <div
          className="user-benefits-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 16,
          }}
        >
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              style={{
                borderRadius: 18,
                background: '#fff',
                padding: '26px 22px',
                minHeight: 196,
              }}
            >
              <div style={{ marginBottom: 16, opacity: 0.85 }}><b.icon size={22} strokeWidth={1.8} /></div>
              <h3 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.25, margin: '0 0 6px', color: '#1d1d1f' }}>
                {b.title}
              </h3>
              <p style={{ fontSize: 13, color: '#6e6e73', lineHeight: 1.4, margin: 0 }}>{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Guidance */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        style={{ padding: '52px clamp(16px, 5vw, 40px) 8px' }}
      >
        <motion.h2
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: 'clamp(22px, 2.6vw, 28px)',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            margin: '0 0 24px',
            color: '#1d1d1f',
          }}
        >
          Guidance is here.{' '}
          <span style={{ color: '#86868b', fontWeight: 600 }}>Whenever and however you need it.</span>
        </motion.h2>
        <div className="user-guidance-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            {
              title: 'Browse verified listings.',
              desc: 'Explore opportunities across industries with audited financials.',
              img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
            },
            {
              title: 'Review verified due diligence.',
              desc: 'Financials, legal, and operations \u2014 audited before listing.',
              img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
            },
            {
              title: 'Close with confidence.',
              desc: 'Escrow, legal templates, and financing partners built in.',
              img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
            },
          ].map((card, i) => (
            <motion.article
              key={card.title}
              variants={fadeUp}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              style={{
                borderRadius: 22,
                background: '#fff',
                padding: 'clamp(16px, 4vw, 32px)',
                minHeight: 300,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <h3
                style={{
                  fontSize: 21,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.15,
                  margin: '0 0 8px',
                  color: '#1d1d1f',
                }}
              >
                {card.title}
              </h3>
              <p style={{ fontSize: 15, color: '#6e6e73', lineHeight: 1.45, margin: 0 }}>{card.desc}</p>
              <img
                src={card.img}
                alt=""
                style={{
                  marginTop: 'auto',
                  width: '100%',
                  height: 120,
                  borderRadius: 14,
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </motion.article>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        style={{ padding: '44px clamp(16px, 5vw, 40px) 8px' }}
      >
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            borderRadius: 22,
            background: 'linear-gradient(160deg, #1d2330, #10141d)',
            color: '#fff',
            padding: 'clamp(44px, 6vw, 72px) clamp(16px, 4vw, 32px)',
            textAlign: 'center',
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 600,
              letterSpacing: '-0.015em',
              lineHeight: 1.06,
              margin: '0 0 14px',
            }}
          >
            Start your next acquisition today.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{
              fontSize: 17,
              color: '#b6bcc9',
              lineHeight: 1.5,
              maxWidth: 480,
              margin: '0 auto 28px',
            }}
          >
            Gain access to exclusive opportunities unavailable to the public.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}
          >
            <Link
              to="/search"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0071e3',
                color: '#fff',
                fontSize: 16,
                fontWeight: 500,
                padding: '13px 26px',
                borderRadius: 980,
                textDecoration: 'none',
              }}
            >
              Browse listings
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Quick Links */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
        style={{ padding: '48px clamp(16px, 5vw, 40px) 24px' }}
      >
        <motion.h2
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          style={{ fontSize: 21, fontWeight: 600, color: '#1d1d1f', margin: '0 0 16px' }}
        >
          Quick Links
        </motion.h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {[
            { label: 'Browse Listings', to: '/search' },
            { label: 'Industries', to: '/search' },
            { label: 'Member Login', to: '/' },
          ].map((q, i) => (
            <motion.div
              key={q.label}
              variants={fadeUp}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                to={q.to}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: 14,
                  color: '#1d1d1f',
                  border: '1px solid rgba(0,0,0,0.16)',
                  borderRadius: 980,
                  padding: '8px 18px',
                  background: '#fff',
                  textDecoration: 'none',
                }}
              >
                {q.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <div style={{ height: 40 }} />
    </Layout>
  );
}
