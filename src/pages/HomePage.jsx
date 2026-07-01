import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, FolderLock, Headset, Landmark, ChevronRight, ArrowRight, CircleCheck } from 'lucide-react';
import api from '../services/api';
import Layout from '../components/layout/Layout';
import Loader from '../components/Loader';

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
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/featured').then((r) => setFeatured(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
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
            
          </motion.div>
        </div>
      </motion.header>


      {/* Featured Products */}
      {featured.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
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
            Featured products.{' '}
            <span style={{ color: '#86868b', fontWeight: 600 }}>Top opportunities, hand-picked for you.</span>
          </motion.h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 54 }}>
            {featured.map((biz, i) => {
              const imageLeft = i % 2 === 1;
              const textContent = (
                <div className="new-market-text" style={{ padding: 'clamp(18px, 3vw, 32px)', display: 'flex', flexDirection: 'column' }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#0066cc',
                      marginBottom: 6,
                    }}
                  >
                    {i === 0 ? 'Featured' : ''}{i === 0 && biz.industry?.name ? ' · ' : ''}{biz.industry?.name || 'Business'}
                  </div>
                  <h3
                    style={{
                      fontSize: 'clamp(22px, 2.6vw, 32px)',
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                      lineHeight: 1.1,
                      margin: '0 0 4px',
                      color: '#1d1d1f',
                    }}
                  >
                    <span style={{ color: '#0066cc' }}>{biz.name.split(' ')[0]}</span>{' '}
                    {biz.name.split(' ').slice(1).join(' ')}
                  </h3>
                  {biz.city && (
                    <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#1d1d1f', margin: '2px 0 0' }}>
                      {biz.city}{biz.country?.name ? `, ${biz.country.name}` : ''}
                    </p>
                  )}

                  <div style={{ width: '100%', height: 2, background: '#0066cc', margin: '12px 0 12px', opacity: 0.7 }} />

                  <ul style={{ listStyle: 'disc', paddingLeft: 18, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {biz.description && (
                      <li style={{ fontSize: 14, lineHeight: 1.4, color: '#333' }}>
                        {biz.description.length > 120 ? biz.description.slice(0, 120) + '...' : biz.description}
                      </li>
                    )}
                    {biz.yearEstablished && (
                      <li style={{ fontSize: 14, lineHeight: 1.4, color: '#333' }}>
                        <strong>{new Date().getFullYear() - biz.yearEstablished} Years</strong> + in Operation (Est. {biz.yearEstablished})
                      </li>
                    )}
                    {biz.numEmployees && (
                      <li style={{ fontSize: 14, lineHeight: 1.4, color: '#333' }}>
                        <strong>{biz.numEmployees} Employees</strong> + in Company
                      </li>
                    )}
                    <li style={{ fontSize: 14, lineHeight: 1.4, color: '#333' }}>
                      <strong>{formatPrice(biz.askingPrice)}</strong> + Asking Price
                    </li>
                    {biz.grossRevenue && (
                      <li style={{ fontSize: 14, lineHeight: 1.4, color: '#333' }}>
                        <strong>{formatPrice(biz.grossRevenue)}</strong> + Gross Revenue
                      </li>
                    )}
                  </ul>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CircleCheck size={18} color="#22c55e" />
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#1d1d1f' }}>Permanent Visa</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <CircleCheck size={18} color="#22c55e" />
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#1d1d1f' }}>Green Card</span>
                    </div>
                  </div>

                  <div style={{ width: '100%', height: 1, background: '#ddd', margin: '12px 0 10px' }} />

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      background: '#1d1d1f',
                      color: '#fff',
                      padding: '10px 20px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      alignSelf: 'flex-start',
                    }}
                  >
                    View Details
                    <ArrowRight size={14} />
                  </div>
                </div>
              );
              const imageContent = (
                <div className="new-market-img" style={{ position: 'relative', minHeight: 380 }}>
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
