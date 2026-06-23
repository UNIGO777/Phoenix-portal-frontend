import { useState } from 'react';

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required,
  options,
  placeholder,
  rows,
}) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const baseStyle = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px 16px',
    border: error
      ? '1px solid #ff3b30'
      : focused
      ? '1px solid #0066cc'
      : hovered
      ? '1px solid rgba(0,0,0,0.2)'
      : '1px solid rgba(0,0,0,0.1)',
    borderRadius: 12,
    fontSize: 14,
    fontFamily: 'inherit',
    color: '#1d1d1f',
    background: '#fff',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focused ? '0 0 0 3px rgba(0,102,204,0.12)' : 'none',
  };

  const interactionProps = {
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <label
        style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 500,
          color: '#1d1d1f',
          marginBottom: 8,
          letterSpacing: '0.01em',
        }}
      >
        {label}
        {required && <span style={{ color: '#ff3b30', marginLeft: 2 }}>*</span>}
      </label>

      {type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          style={baseStyle}
          {...interactionProps}
        >
          <option value="">Select {label}</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows || 4}
          placeholder={placeholder}
          style={{ ...baseStyle, resize: 'vertical' }}
          {...interactionProps}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={baseStyle}
          {...interactionProps}
        />
      )}

      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            color: '#ff3b30',
            marginTop: 6,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff3b30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
