import { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Bell,
  Clock,
  Check,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MerchantAvatar } from '../components/MerchantAvatar';

export function PaymentStatusScreen({
  qrData,
  paymentData,
  onDone,
  onUpdateStatus,
  onNeedHelp,
}) {
  const [currentStatus, setCurrentStatus] = useState('initiated');

  const amount = paymentData?.amount || qrData?.amount || 250;
  const merchantName = qrData?.merchantName || 'The Coffee House';
  const upiId = qrData?.upiId || 'coffeehouse@okaxis';

  useEffect(() => {
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.3 },
      });
    } catch {
      // safe fallback
    }
  }, []);

  const handleStatusChange = (status) => {
    setCurrentStatus(status);
    if (onUpdateStatus) {
      onUpdateStatus(status);
    }
  };

  const formattedDateTime = new Date().toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="screen-container" style={{ textAlign: 'center' }}>
      {/* Checkmark */}
      <div style={{ margin: '14px 0 12px' }}>
        <div
          style={{
            width: 68,
            height: 68,
            borderRadius: '50%',
            backgroundColor: currentStatus === 'failed' ? '#FEE2E2' : '#DCFCE7',
            color: currentStatus === 'failed' ? '#DC2626' : '#16A34A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
          }}
        >
          {currentStatus === 'failed' ? <XCircle size={40} /> : <CheckCircle2 size={40} />}
        </div>
      </div>

      <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
        {currentStatus === 'successful'
          ? 'Payment Confirmed'
          : currentStatus === 'failed'
          ? 'Payment Failed'
          : 'Payment initiated!'}
      </h1>

      <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: 18 }}>
        You have completed the steps on your phone. Please check the confirmation message from your bank.
      </p>

      {/* Details Card */}
      <div className="minimal-card" style={{ textAlign: 'left', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <MerchantAvatar category={qrData?.category} size={40} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
              {merchantName}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
              {upiId}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Amount</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary-blue)' }}>
            ₹{amount}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
          <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Time</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {formattedDateTime}
          </span>
        </div>
      </div>

      {/* Note Warning */}
      <div
        style={{
          backgroundColor: 'var(--accent-amber-bg)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 12px',
          textAlign: 'left',
          display: 'flex',
          gap: 8,
          alignItems: 'flex-start',
          marginBottom: 16,
        }}
      >
        <Bell size={16} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 11.5, color: 'var(--accent-amber-text)', lineHeight: 1.4 }}>
          <strong>Note:</strong> Transaction status may take a few minutes to reflect. Check your bank SMS.
        </div>
      </div>

      {/* Status Options */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 18 }}>
        <button
          type="button"
          onClick={() => handleStatusChange('successful')}
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            border: currentStatus === 'successful' ? '1.5px solid #16A34A' : '1px solid var(--border-light)',
            backgroundColor: currentStatus === 'successful' ? '#DCFCE7' : 'var(--bg-card)',
            color: '#15803D',
            fontSize: 11.5,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Check size={13} /> Confirmed
        </button>

        <button
          type="button"
          onClick={() => handleStatusChange('pending')}
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            border: currentStatus === 'pending' ? '1.5px solid #D97706' : '1px solid var(--border-light)',
            backgroundColor: currentStatus === 'pending' ? '#FEF3C7' : 'var(--bg-card)',
            color: '#B45309',
            fontSize: 11.5,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Clock size={13} /> Pending
        </button>

        <button
          type="button"
          onClick={() => handleStatusChange('failed')}
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            border: currentStatus === 'failed' ? '1.5px solid #DC2626' : '1px solid var(--border-light)',
            backgroundColor: currentStatus === 'failed' ? '#FEE2E2' : 'var(--bg-card)',
            color: '#B91C1C',
            fontSize: 11.5,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <XCircle size={13} /> Failed
        </button>

        <button
          type="button"
          onClick={onNeedHelp}
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-secondary)',
            fontSize: 11.5,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <HelpCircle size={13} /> Help
        </button>
      </div>

      {/* Done CTA */}
      <button
        type="button"
        className="btn-primary"
        onClick={onDone}
        style={{ marginTop: 'auto' }}
      >
        <span>Done</span>
      </button>
    </div>
  );
}
