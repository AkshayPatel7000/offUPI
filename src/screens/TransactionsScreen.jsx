import { useState } from 'react';
import {
  Copy,
  Check,
  X,
  Calendar,
} from 'lucide-react';
import { MerchantAvatar } from '../components/MerchantAvatar';

export function TransactionsScreen({
  transactions = [],
  onClearTransactions,
  onShowToast,
}) {
  const [filter, setFilter] = useState('all');
  const [selectedTx, setSelectedTx] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const filtered = transactions.filter((tx) => {
    if (filter === 'all') return true;
    if (filter === 'successful') return tx.status === 'successful';
    if (filter === 'pending') return tx.status === 'pending' || tx.status === 'initiated';
    if (filter === 'failed') return tx.status === 'failed';
    return true;
  });

  const todayList = filtered.filter((t) => t.group === 'Today' || !t.group);
  const yesterdayList = filtered.filter((t) => t.group === 'Yesterday');

  const handleCopy = (field, text) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    if (onShowToast) onShowToast(`Copied ${field}`);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'successful':
        return (
          <span style={{ fontSize: 11, fontWeight: 700, color: '#15803D' }}>
            Successfull
          </span>
        );
      case 'pending':
        return (
          <span style={{ fontSize: 11, fontWeight: 700, color: '#B45309' }}>
            Pending
          </span>
        );
      case 'failed':
        return (
          <span style={{ fontSize: 11, fontWeight: 700, color: '#DC2626' }}>
            Failed
          </span>
        );
      default:
        return (
          <span style={{ fontSize: 11, fontWeight: 700, color: '#0B57D0' }}>
            Initiated
          </span>
        );
    }
  };

  return (
    <div className="screen-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
          Transactions
        </h2>
        {transactions.length > 0 && (
          <button
            type="button"
            onClick={onClearTransactions}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--text-muted)',
              fontSize: 11.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 2 }}>
        {[
          { id: 'all', label: 'All' },
          { id: 'successful', label: 'Successful' },
          { id: 'pending', label: 'Pending' },
          { id: 'failed', label: 'Failed' },
        ].map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              style={{
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                backgroundColor: isActive ? 'var(--primary-blue)' : 'var(--bg-card-soft)',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
          <Calendar size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
          <div style={{ fontSize: 13, fontWeight: 600 }}>No transactions yet</div>
        </div>
      )}

      {/* Group: Today */}
      {todayList.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
            Today
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {todayList.map((tx) => (
              <button
                key={tx.id}
                type="button"
                onClick={() => setSelectedTx(tx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-light)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <MerchantAvatar category={tx.category} size={36} />
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {tx.merchantName}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {tx.formattedTime || 'Today'}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--text-primary)' }}>
                    ₹{tx.amount}
                  </div>
                  <div>{getStatusBadge(tx.status)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Group: Yesterday */}
      {yesterdayList.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
            Yesterday
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {yesterdayList.map((tx) => (
              <button
                key={tx.id}
                type="button"
                onClick={() => setSelectedTx(tx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-light)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <MerchantAvatar category={tx.category} size={36} />
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {tx.merchantName}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {tx.formattedTime || 'Yesterday'}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--text-primary)' }}>
                    ₹{tx.amount}
                  </div>
                  <div>{getStatusBadge(tx.status)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Minimal Bottom Sheet Receipt */}
      {selectedTx && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 480,
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '20px 20px 0 0',
              padding: '18px 20px 24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary-blue)' }}>
                Transaction Receipt
              </span>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                style={{
                  border: 'none',
                  background: 'var(--bg-card-soft)',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={15} />
              </button>
            </div>

            <div style={{ textAlign: 'center', margin: '6px 0 14px' }}>
              <MerchantAvatar category={selectedTx.category} size={48} />
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginTop: 6 }}>
                {selectedTx.merchantName}
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary-blue)', margin: '2px 0' }}>
                ₹{selectedTx.amount}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {selectedTx.upiId}
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-card-soft)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                fontSize: 12.5,
                marginBottom: 14,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Channel</span>
                <span style={{ fontWeight: 600 }}>{selectedTx.carrier} ({selectedTx.dialCode})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status</span>
                <span>{getStatusBadge(selectedTx.status)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => handleCopy('UPI ID', selectedTx.upiId)}
                style={{ height: 38, fontSize: 12 }}
              >
                {copiedField === 'UPI ID' ? <Check size={14} color="#16A34A" /> : <Copy size={14} />}
                <span>Copy UPI</span>
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => handleCopy('Amount', String(selectedTx.amount))}
                style={{ height: 38, fontSize: 12 }}
              >
                {copiedField === 'Amount' ? <Check size={14} color="#16A34A" /> : <Copy size={14} />}
                <span>Copy Amount</span>
              </button>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => setSelectedTx(null)}
              style={{ height: 42, fontSize: 13.5 }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
