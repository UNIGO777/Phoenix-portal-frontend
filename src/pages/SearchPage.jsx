import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X, ChevronRight, ChevronLeft } from 'lucide-react';
import api from '../services/api';
import Layout from '../components/layout/Layout';
import Loader from '../components/Loader';

const defaultImg = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80';
const defaultIndustryImg = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80';

const sortOptions = [
  { label: 'Relevance', value: '' },
  { label: 'Price: Low → High', value: 'askingPrice' },
  { label: 'Price: High → Low', value: '-askingPrice' },
  { label: 'Newest first', value: '-createdAt' },
];

function formatPrice(n) {
  if (!n) return 'N/A';
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeIndustry, setActiveIndustry] = useState(searchParams.get('industry') || '');
  const [activeSort, setActiveSort] = useState(searchParams.get('sort') || '');
  const [page, setPage] = useState(1);

  const [industries, setIndustries] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [featured, setFeatured] = useState([]);
  const [browseLoading, setBrowseLoading] = useState(true);

  const debounceRef = useRef(null);
  const searchInputRef = useRef(null);

  // Sync state from URL when params change externally (e.g. navbar click)
  useEffect(() => {
    const urlIndustry = searchParams.get('industry') || '';
    const urlQuery = searchParams.get('q') || '';
    const urlSort = searchParams.get('sort') || '';
    if (urlIndustry !== activeIndustry) setActiveIndustry(urlIndustry);
    if (urlQuery !== query) setQuery(urlQuery);
    if (urlSort !== activeSort) setActiveSort(urlSort);
  }, [searchParams]);

  // Load industries on mount
  useEffect(() => {
    Promise.all([
      api.get('/industries').then((r) => setIndustries(r.data.data || [])).catch(() => {}),
      api.get('/featured').then((r) => setFeatured(r.data.data || [])).catch(() => {}),
    ]).finally(() => setBrowseLoading(false));
  }, []);

  // Fetch businesses when filters change
  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (query) params.search = query;
      if (activeIndustry) params.industry = activeIndustry;
      if (activeSort) params.sort = activeSort;
      const { data } = await api.get('/businesses', { params });
      setBusinesses(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotal(data.pagination?.total || 0);
    } catch {
      setBusinesses([]);
    }
    setLoading(false);
  }, [query, activeIndustry, activeSort, page]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  // Update URL params
  useEffect(() => {
    const p = {};
    if (query) p.q = query;
    if (activeIndustry) p.industry = activeIndustry;
    if (activeSort) p.sort = activeSort;
    setSearchParams(p, { replace: true });
  }, [query, activeIndustry, activeSort, setSearchParams]);

  // Suggestions
  const handleInputChange = (val) => {
    setQuery(val);
    setPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.length >= 2) {
      debounceRef.current = setTimeout(async () => {
        try {
          const { data } = await api.get('/businesses/suggestions', { params: { q: val } });
          setSuggestions(data.data || []);
          setShowSuggestions(true);
        } catch {
          setSuggestions([]);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const clearQuery = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setPage(1);
  };

  const selectIndustry = (id) => {
    setActiveIndustry(id === activeIndustry ? '' : id);
    setPage(1);
  };

  const hasSearch = query || activeIndustry;
  const industryName = activeIndustry
    ? industries.find((i) => i._id === activeIndustry)?.name
    : '';

  return (
    <Layout>
      {/* Search Bar */}
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
            height: 56,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            position: 'relative',
          }}
        >
          <Search size={18} color="#86868b" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search businesses, industries, regions..."
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: 18,
              color: '#1d1d1f',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          {query && (
            <button
              onClick={clearQuery}
              style={{
                border: 'none',
                background: 'rgba(0,0,0,0.08)',
                borderRadius: '50%',
                width: 22,
                height: 22,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#6e6e73',
              }}
            >
              <X size={12} />
            </button>
          )}
          {industryName && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                color: '#0066cc',
                background: 'rgba(0,102,204,0.08)',
                padding: '5px 12px',
                borderRadius: 980,
              }}
            >
              {industryName}
              <span
                onClick={() => setActiveIndustry('')}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <X size={14} />
              </span>
            </span>
          )}

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 40,
                right: 40,
                background: '#fff',
                borderRadius: 14,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                border: '1px solid rgba(0,0,0,0.06)',
                maxHeight: 300,
                overflowY: 'auto',
                zIndex: 100,
              }}
            >
              {suggestions.map((s) => (
                <div
                  key={s.id}
                  onMouseDown={() => {
                    navigate(`/listing/${s.id}`);
                    setShowSuggestions(false);
                  }}
                  style={{
                    padding: '12px 20px',
                    cursor: 'pointer',
                    borderBottom: '1px solid rgba(0,0,0,0.04)',
                    fontSize: 14,
                    color: '#1d1d1f',
                  }}
                  onMouseEnter={(e) => (e.target.style.background = '#f5f5f7')}
                  onMouseLeave={(e) => (e.target.style.background = '#fff')}
                >
                  <div style={{ fontWeight: 500 }}>{s.name}</div>
                  {s.city && <div style={{ fontSize: 12, color: '#86868b', marginTop: 2 }}>{s.city}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Browse Loading */}
      {!hasSearch && browseLoading && (
        <Loader text="Loading browse..." />
      )}

      {/* Browse Header (when no search) */}
      {!hasSearch && !browseLoading && (
        <header style={{ padding: '64px 40px 48px' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 20,
            }}
          >
            <h1
              style={{
                fontSize: 'clamp(44px, 7vw, 80px)',
                fontWeight: 600,
                letterSpacing: '-0.015em',
                lineHeight: 1,
                margin: 0,
                color: '#1d1d1f',
              }}
            >
              Browse
            </h1>
            <p
              style={{
                fontSize: 'clamp(17px, 2vw, 21px)',
                fontWeight: 500,
                color: '#6e6e73',
                margin: 0,
                textAlign: 'right',
              }}
            >
              Explore verified business opportunities
              <br />
              across every industry.
            </p>
          </div>
        </header>
      )}

      {/* Category Tiles (when no search) */}
      {!hasSearch && !browseLoading && industries.length > 0 && (
        <section style={{ padding: '0 40px 40px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 18,
            }}
          >
            {industries.map((cat) => (
              <div
                key={cat._id}
                onClick={() => selectIndustry(cat._id)}
                style={{
                  borderRadius: 22,
                  overflow: 'hidden',
                  position: 'relative',
                  minHeight: 210,
                  cursor: 'pointer',
                  background: '#fff',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Background image */}
                <img
                  src={cat.image || defaultIndustryImg}
                  alt=""
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                {/* White gradient overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg,rgba(255,255,255,0.95) 30%,rgba(255,255,255,0.3) 80%,rgba(255,255,255,0.15) 100%)',
                  }}
                />
                {/* Content */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: 30,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 210,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: '#0066cc',
                      marginBottom: 10,
                    }}
                  >
                    Industry
                  </div>
                  <h3
                    style={{
                      fontSize: 24,
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      lineHeight: 1.1,
                      margin: '0 0 6px',
                      color: '#1d1d1f',
                    }}
                  >
                    {cat.name}
                  </h3>
                  <p style={{ fontSize: 15, color: '#6e6e73', margin: 0, lineHeight: 1.4 }}>
                    Explore opportunities
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Carousel (when no search) */}
      {!hasSearch && !browseLoading && featured.length > 0 && (
        <section style={{ padding: '8px 0 40px' }}>
          <div style={{ padding: '0 40px' }}>
            <h2
              style={{
                fontSize: 'clamp(22px, 2.6vw, 28px)',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                margin: '0 0 24px',
              }}
            >
              Featured.{' '}
              <span style={{ color: '#86868b' }}>Handpicked by our advisors.</span>
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
            {featured.map((l) => (
              <article
                key={l._id}
                onClick={() => navigate(`/listing/${l._id}`)}
                style={{
                  flex: '0 0 320px',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 18,
                  background: '#10141d',
                  color: '#fff',
                  minHeight: 400,
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
                    minHeight: 400,
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
                  <div style={{ fontSize: 13, color: '#c2c9d6', marginTop: 2 }}>
                    {l.numEmployees ? `${l.numEmployees} employees` : ''}{' '}
                    {l.yearEstablished ? `· Est. ${l.yearEstablished}` : ''}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Results View */}
      {hasSearch && (
        <div style={{ display: 'flex', padding: '32px 40px 60px', gap: 40 }}>
          {/* Sidebar */}
          <aside style={{ flex: '0 0 220px', position: 'sticky', top: 170, alignSelf: 'flex-start' }}>
            {/* Industries filter */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#86868b', marginBottom: 14 }}>
                INDUSTRIES
              </div>
              {industries.map((ind) => (
                <div
                  key={ind._id}
                  onClick={() => selectIndustry(ind._id)}
                  style={{
                    padding: '8px 0',
                    fontSize: 14,
                    color: activeIndustry === ind._id ? '#0066cc' : '#1d1d1f',
                    fontWeight: activeIndustry === ind._id ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'color 0.15s',
                  }}
                >
                  {ind.name}
                </div>
              ))}
            </div>

            {/* Sort */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#86868b', marginBottom: 14 }}>
                SORT BY
              </div>
              {sortOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => { setActiveSort(opt.value); setPage(1); }}
                  style={{
                    padding: '8px 0',
                    fontSize: 14,
                    color: activeSort === opt.value ? '#0066cc' : '#1d1d1f',
                    fontWeight: activeSort === opt.value ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'color 0.15s',
                  }}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          </aside>

          {/* Results */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: '#86868b', marginBottom: 20 }}>
              {loading ? '' : `${total} result${total !== 1 ? 's' : ''}`}
            </div>

            {loading && (
              <Loader text="Searching..." />
            )}

            {!loading && businesses.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ marginBottom: 16, opacity: 0.3 }}><Search size={48} /></div>
                <div style={{ fontSize: 21, fontWeight: 600, color: '#1d1d1f', marginBottom: 8 }}>
                  No listings found
                </div>
                <div style={{ fontSize: 15, color: '#86868b', marginBottom: 20 }}>
                  Try adjusting your search or filters.
                </div>
                <button
                  onClick={() => { clearQuery(); setActiveIndustry(''); }}
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
                  Clear search
                </button>
              </div>
            )}

            {businesses.map((biz) => (
              <div
                key={biz._id}
                onClick={() => navigate(`/listing/${biz._id}`)}
                style={{
                  display: 'flex',
                  gap: 24,
                  padding: '20px 0',
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.015)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Image */}
                <img
                  src={biz.images?.[0] || defaultImg}
                  alt=""
                  style={{
                    width: 132,
                    height: 96,
                    borderRadius: 14,
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                />

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: '#0066cc',
                      marginBottom: 4,
                    }}
                  >
                    {biz.industry?.name || 'Business'}
                    {biz.country?.name ? ` · ${biz.country.name}` : ''}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: '#1d1d1f',
                      letterSpacing: '-0.01em',
                      marginBottom: 4,
                    }}
                  >
                    {biz.name}
                  </div>
                  <div style={{ fontSize: 14, color: '#6e6e73', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {biz.description || biz.city || 'Premium business opportunity'}
                  </div>
                </div>

                {/* Price/stats */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: '#1d1d1f' }}>
                    {formatPrice(biz.askingPrice)}
                  </div>
                  <div style={{ fontSize: 13, color: '#86868b', marginTop: 4 }}>
                    {biz.numEmployees ? `${biz.numEmployees} employees` : ''}
                    {biz.yearEstablished ? ` · Est. ${biz.yearEstablished}` : ''}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: '#0066cc',
                      marginTop: 8,
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>View listing <ChevronRight size={14} /></span>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 8,
                  marginTop: 32,
                }}
              >
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  style={{
                    border: '1px solid rgba(0,0,0,0.12)',
                    background: '#fff',
                    borderRadius: 8,
                    padding: '8px 16px',
                    fontSize: 14,
                    cursor: page <= 1 ? 'default' : 'pointer',
                    opacity: page <= 1 ? 0.4 : 1,
                    color: '#1d1d1f',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><ChevronLeft size={14} /> Previous</span>
                </button>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 14,
                    color: '#6e6e73',
                    padding: '0 12px',
                  }}
                >
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  style={{
                    border: '1px solid rgba(0,0,0,0.12)',
                    background: '#fff',
                    borderRadius: 8,
                    padding: '8px 16px',
                    fontSize: 14,
                    cursor: page >= totalPages ? 'default' : 'pointer',
                    opacity: page >= totalPages ? 0.4 : 1,
                    color: '#1d1d1f',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>Next <ChevronRight size={14} /></span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
