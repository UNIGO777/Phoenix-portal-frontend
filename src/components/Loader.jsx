import { Loader2 } from 'lucide-react';

export default function Loader({ text = 'Loading...', fullPage = false, size = 40 }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        ...(fullPage
          ? {
              minHeight: '100vh',
              background: '#f5f5f7',
              fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
            }
          : {
              padding: '60px 40px',
              minHeight: '40vh',
            }),
      }}
    >
      <Loader2
        size={size}
        strokeWidth={2}
        color="#0066cc"
        style={{ animation: 'loaderSpin 0.8s linear infinite' }}
      />
      {text && (
        <p style={{ fontSize: 14, color: '#86868b', fontWeight: 500, margin: 0 }}>
          {text}
        </p>
      )}
      <style>{`@keyframes loaderSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
