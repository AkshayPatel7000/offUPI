import { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Smartphone,
  ArrowRight,
} from 'lucide-react';
import { CARRIER_REGISTRY } from '../lib/eligibility/registry';
import { CarrierLogo } from '../components/CarrierLogo';

export function ChoosePaymentMethodScreen({
  onBack,
  onSelectMethod,
  selectedCarrierId = 'airtel',
}) {
  const [activeCarrierId, setActiveCarrierId] = useState(selectedCarrierId);

  const detectedCarrier = CARRIER_REGISTRY.find((c) => c.id === 'airtel') || CARRIER_REGISTRY[0];
  const otherCarriers = CARRIER_REGISTRY.filter((c) => c.id !== 'airtel');

  const currentSelection = CARRIER_REGISTRY.find((c) => c.id === activeCarrierId) || detectedCarrier;

  const handleProceed = () => {
    onSelectMethod({
      carrier: currentSelection,
      method: currentSelection.primaryMethod,
      simSlot: 'SIM 1',
    });
  };

  return (
    <div className="screen-container">
      {/* Header */}
      <div className="nav-header">
        <button
          type="button"
          className="back-btn"
          onClick={onBack}
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <h2>Choose payment method</h2>
      </div>

      {/* Detected Carrier Section */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
          Detected mobile network
        </div>

        <button
          type="button"
          onClick={() => setActiveCarrierId(detectedCarrier.id)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-card)',
            border: activeCarrierId === detectedCarrier.id ? '2px solid var(--primary-blue)' : '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <CarrierLogo carrierId={detectedCarrier.id} size={38} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {detectedCarrier.name}
                </span>
                <CheckCircle2 size={15} color="#16A34A" />
              </div>
              <div style={{ fontSize: 12, color: 'var(--accent-green)', fontWeight: 600 }}>
                Supports USSD based UPI
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Pay using *99#
              </div>
            </div>
          </div>

          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              border: activeCarrierId === detectedCarrier.id ? '5px solid var(--primary-blue)' : '2px solid var(--border-light)',
              backgroundColor: '#FFFFFF',
            }}
          />
        </button>
      </div>

      {/* Other Networks Section */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
          Other network options
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {otherCarriers.map((carrier) => {
            const isSelected = activeCarrierId === carrier.id;
            return (
              <button
                key={carrier.id}
                type="button"
                onClick={() => setActiveCarrierId(carrier.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-card)',
                  border: isSelected ? '2px solid var(--primary-blue)' : '1px solid var(--border-light)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CarrierLogo carrierId={carrier.id} size={32} />
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {carrier.name}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                      {carrier.primaryMethodSubtitle}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    border: isSelected ? '5px solid var(--primary-blue)' : '2px solid var(--border-light)',
                    backgroundColor: '#FFFFFF',
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Dual SIM Note */}
      <div
        style={{
          backgroundColor: 'var(--bg-card-soft)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 12px',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          marginBottom: 'auto',
        }}
      >
        <Smartphone size={16} color="var(--primary-blue)" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          Ensure your phone dialer uses the SIM registered with your bank.
        </div>
      </div>

      {/* Primary CTA */}
      <div style={{ marginTop: 20, flexShrink: 0 }}>
        <button
          type="button"
          className="btn-primary"
          onClick={handleProceed}
        >
          <span>Show my payment steps</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
