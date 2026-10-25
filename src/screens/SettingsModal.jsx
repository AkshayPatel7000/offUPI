import {
  X,
  Wifi,
  WifiOff,
  Moon,
  Sun,
  Trash2,
  Info,
} from 'lucide-react';
import { CARRIER_REGISTRY } from '../lib/eligibility/registry';

export function SettingsModal({
  isOpen,
  onClose,
  isOfflineSimulated,
  onToggleOffline,
  darkMode,
  onToggleDarkMode,
  defaultCarrier,
  onChangeDefaultCarrier,
  onClearHistory,
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.65)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 430,
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '26px 26px 0 0',
          padding: '12px 20px calc(24px + var(--sab, 0px))',
          maxHeight: '90dvh',
          overflowY: 'auto',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Mobile Drag Handle */}
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 99,
            backgroundColor: 'var(--border-light)',
            margin: '0 auto 12px',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)' }}>
            Settings & Sandbox Controls
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              background: 'var(--bg-card-soft)',
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 1. Connectivity Simulator */}
        <div
          style={{
            backgroundColor: 'var(--bg-card-soft)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            border: '1px solid var(--border-light)',
            marginBottom: 14,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                backgroundColor: isOfflineSimulated ? 'var(--accent-amber-bg)' : 'var(--accent-green-bg)',
                color: isOfflineSimulated ? 'var(--accent-amber)' : 'var(--accent-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isOfflineSimulated ? <WifiOff size={20} /> : <Wifi size={20} />}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                Simulate Offline Mode
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                {isOfflineSimulated ? 'No internet mode simulated' : 'Standard network mode'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleOffline}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: isOfflineSimulated ? 'var(--accent-amber)' : 'var(--primary-blue)',
              color: '#FFFFFF',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {isOfflineSimulated ? 'Offline' : 'Online'}
          </button>
        </div>

        {/* 2. Dark Mode Toggle */}
        <div
          style={{
            backgroundColor: 'var(--bg-card-soft)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            border: '1px solid var(--border-light)',
            marginBottom: 14,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                backgroundColor: 'var(--primary-blue-subtle)',
                color: 'var(--primary-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {darkMode ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                Dark Theme
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                {darkMode ? 'Dark mode enabled' : 'Light mode enabled'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleDarkMode}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: darkMode ? 'var(--primary-blue)' : 'var(--bg-card)',
              color: darkMode ? '#FFFFFF' : 'var(--text-primary)',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {darkMode ? 'Dark' : 'Light'}
          </button>
        </div>

        {/* 3. Preferred Carrier */}
        <div
          style={{
            backgroundColor: 'var(--bg-card-soft)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            border: '1px solid var(--border-light)',
            marginBottom: 14,
          }}
        >
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
            Default Preferred Carrier
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {CARRIER_REGISTRY.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onChangeDefaultCarrier(c.id)}
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: defaultCarrier === c.id ? '2px solid var(--primary-blue)' : '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: 12.5,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>


        {/* 5. Clear Local History */}
        <button
          type="button"
          onClick={onClearHistory}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--accent-red)',
            backgroundColor: 'transparent',
            color: 'var(--accent-red)',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 18,
          }}
        >
          <Trash2 size={16} />
          <span>Clear Local Preparation History</span>
        </button>

        {/* 6. Technical Limitations Note (Section 13) */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            border: '1px solid var(--border-light)',
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
            marginBottom: 20,
          }}
        >
          <Info size={18} color="var(--primary-blue)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            <strong>Browser Sandbox Notice:</strong> Standard web browsers cannot programmatically query hardware SIM slot configurations or intercept telecom USSD popups due to OS security sandboxing. Future native Android wrapper can leverage <code>TelephonyManager</code> and <code>UssdResponseCallback</code> APIs.
          </div>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={onClose}
          style={{ height: 46 }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
