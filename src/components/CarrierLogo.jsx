
export function CarrierLogo({ carrierId, size = 36, className = '' }) {
  const norm = (carrierId || '').toLowerCase();

  if (norm.includes('airtel')) {
    return (
      <div
        className={`carrier-logo-circle ${className}`}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: '#ED1C24',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontWeight: 800,
          fontSize: size * 0.45,
          flexShrink: 0,
          boxShadow: '0 2px 6px rgba(237, 28, 36, 0.25)',
        }}
        title="Airtel"
      >
        <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="none">
          <path
            d="M4 18C7 7 13 4 19 6C17 12 11 16 6 18"
            stroke="white"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <circle cx="15.5" cy="14.5" r="2.2" fill="white" />
        </svg>
      </div>
    );
  }

  if (norm.includes('jio')) {
    return (
      <div
        className={`carrier-logo-circle ${className}`}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: '#0A2885',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontWeight: 800,
          fontSize: size * 0.38,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.5px',
          flexShrink: 0,
          boxShadow: '0 2px 6px rgba(10, 40, 133, 0.3)',
        }}
        title="Jio"
      >
        Jio
      </div>
    );
  }

  if (norm.includes('vi') || norm.includes('vodafone') || norm.includes('idea')) {
    return (
      <div
        className={`carrier-logo-circle ${className}`}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: '#E60000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFD100',
          fontWeight: 900,
          fontSize: size * 0.42,
          fontFamily: 'sans-serif',
          flexShrink: 0,
        }}
        title="Vi (Vodafone Idea)"
      >
        Vi
      </div>
    );
  }

  if (norm.includes('bsnl')) {
    return (
      <div
        className={`carrier-logo-circle ${className}`}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: '#005BBB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontWeight: 800,
          fontSize: size * 0.34,
          flexShrink: 0,
        }}
        title="BSNL"
      >
        BSNL
      </div>
    );
  }

  // Generic SIM carrier logo fallback
  return (
    <div
      className={`carrier-logo-circle ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: '#475569',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        flexShrink: 0,
      }}
      title="SIM Network"
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 7h6M9 11h6M9 15h3" />
      </svg>
    </div>
  );
}
