
export function MerchantAvatar({ category = 'Food & Dining', size = 72, className = '' }) {
  return (
    <div
      className={`merchant-avatar-wrapper ${className}`}
      title={category}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: '#DDF0FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        boxShadow: '0 4px 14px rgba(11, 87, 208, 0.1)',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 48 48" fill="none">
        {/* Market / Shop Roof */}
        <path
          d="M8 20L12 10H36L40 20H8Z"
          fill="#FF6B6B"
        />
        {/* Striped canopy accents */}
        <path d="M12 10L14 20H20L18 10H12Z" fill="#FFA8A8" />
        <path d="M26 10L28 20H34L32 10H26Z" fill="#FFA8A8" />
        {/* Scalloped canopy fringe */}
        <path
          d="M8 20C9.5 22 12.5 22 14 20C15.5 22 18.5 22 20 20C21.5 22 24.5 22 26 20C27.5 22 30.5 22 32 20C33.5 22 36.5 22 38 20C39 21.5 40 21.5 40 20"
          stroke="#E03131"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Shop Walls */}
        <rect x="10" y="21" width="28" height="17" rx="2" fill="#FFFFFF" stroke="#CED4DA" strokeWidth="1.5" />
        {/* Shop Door */}
        <rect x="20" y="27" width="8" height="11" rx="1.5" fill="#4DABF7" />
        {/* Windows */}
        <rect x="13" y="25" width="5" height="5" rx="1" fill="#74C0FC" />
        <rect x="30" y="25" width="5" height="5" rx="1" fill="#74C0FC" />
      </svg>
    </div>
  );
}
