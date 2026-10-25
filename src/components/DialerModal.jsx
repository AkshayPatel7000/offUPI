import { useState } from 'react';
import { Phone, Delete, X, ArrowRight, ShieldCheck } from 'lucide-react';

export function DialerModal(props) {
  if (!props.isOpen) return null;
  return <DialerModalInner key={props.initialCode} {...props} />;
}

function DialerModalInner({
  onClose,
  initialCode = '*99#',
  merchantName = 'The Coffee House',
  upiId = 'coffeehouse@okaxis',
  amount = 250,
  carrier = 'Airtel',
  onCompleteHandoff,
}) {
  const [dialedNumber, setDialedNumber] = useState(initialCode);
  const [sessionState, setSessionState] = useState('idle'); // 'idle' | 'calling' | 'ussd_menu' | 'ivr_active' | 'pin_prompt' | 'done'
  const [ussdStep, setUssdStep] = useState(1);
  const [destinationType, setDestinationType] = useState('UPI'); // 'UPI' | 'MOBILE'
  const [userInput, setUserInput] = useState('');

  const handleKeyPress = (char) => {
    if (sessionState === 'idle') {
      setDialedNumber((prev) => prev + char);
    } else {
      setUserInput((prev) => prev + char);
    }
  };

  const handleBackspace = () => {
    if (sessionState === 'idle') {
      setDialedNumber((prev) => prev.slice(0, -1));
    } else {
      setUserInput((prev) => prev.slice(0, -1));
    }
  };

  const handleCall = () => {
    // Attempt native device dialer handoff via tel: protocol
    try {
      const sanitized = dialedNumber.replace(/#/g, '%23');
      window.location.href = `tel:${sanitized}`;
    } catch {
      // Ignored if browser blocks tel:
    }

    // Launch interactive in-app telecom simulation
    if (dialedNumber.includes('124') || initialCode.toLowerCase().includes('voice')) {
      setSessionState('ivr_active');
    } else {
      setSessionState('calling');
      setTimeout(() => {
        setSessionState('ussd_menu');
      }, 1200);
    }
  };

  const handleSendUssd = () => {
    const trimmed = userInput.trim();

    if (ussdStep === 1) {
      // Main Menu: 1 Send Money, 3 Check Balance, 4 My Profile, 5 Pending, 6 Txns, 7 UPI PIN
      if (trimmed === '3') {
        setUssdStep(30);
      } else if (trimmed === '4') {
        setUssdStep(40);
      } else if (trimmed === '5') {
        setUssdStep(50);
      } else if (trimmed === '6') {
        setUssdStep(60);
      } else if (trimmed === '7') {
        setUssdStep(70);
      } else {
        // Default or '1': Send Money
        setUssdStep(2);
      }
      setUserInput('');
    } else if (ussdStep === 2) {
      // Submenu after selecting 1 to send money:
      // 1 Mobile No, 3 UPI ID, 4 Saved Beneficiary, 5 IFSC, A/C No.
      if (trimmed === '1') {
        setDestinationType('MOBILE');
        setUssdStep(3);
      } else {
        // Default or '3': UPI ID
        setDestinationType('UPI');
        setUssdStep(3);
      }
      setUserInput('');
    } else if (ussdStep === 3) {
      // Step 3: Beneficiary (UPI ID or Mobile No) entered
      setUssdStep(4);
      setUserInput('');
    } else if (ussdStep === 4) {
      // Step 4: Amount entered
      setUssdStep(5);
      setUserInput('');
    } else if (ussdStep === 5) {
      // Step 5: PIN entered on telecom prompt
      setSessionState('done');
      setTimeout(() => {
        onCompleteHandoff();
      }, 1400);
    } else if (ussdStep >= 30) {
      // Return to main menu from any info screen
      setUssdStep(1);
      setUserInput('');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '28px 28px 0 0',
          padding: '12px 20px calc(24px + var(--sab, 0px))',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '94dvh',
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
            margin: '0 auto 10px',
          }}
        />

        {/* Modal Close / Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--primary-blue)', backgroundColor: 'var(--primary-blue-subtle)', padding: '4px 10px', borderRadius: 99 }}>
              {carrier} Telecom Session
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              background: 'var(--bg-card-soft)',
              borderRadius: '50%',
              width: 30,
              height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={16} color="var(--text-secondary)" />
          </button>
        </div>

        {/* DIALER VIEW (idle) */}
        {sessionState === 'idle' && (
          <>
            <div style={{ textAlign: 'center', margin: '14px 0 20px' }}>
              <div
                style={{
                  fontSize: 38,
                  fontWeight: 800,
                  letterSpacing: '1px',
                  color: '#0F172A',
                  minHeight: 52,
                }}
              >
                {dialedNumber || ' '}
              </div>
              <div style={{ fontSize: 13, color: '#0B57D0', fontWeight: 600, marginTop: 4 }}>
                Simulating Phone Dialer
              </div>
            </div>

            {/* Quick Copy Chips */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: 14,
                border: '1px solid #E2E8F0',
                padding: '10px 14px',
                marginBottom: 16,
                fontSize: 12,
                color: '#475569',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                Pay <strong>₹{amount}</strong> to <strong>{upiId}</strong>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(upiId);
                  alert(`Copied ${upiId} to clipboard!`);
                }}
                style={{
                  border: 'none',
                  background: '#E8F0FE',
                  color: '#0B57D0',
                  fontWeight: 700,
                  padding: '4px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 11,
                }}
              >
                Copy UPI
              </button>
            </div>

            {/* Keypad Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 14,
                margin: '10px 0 24px',
              }}
            >
              {[
                { n: '1', sub: '' },
                { n: '2', sub: 'ABC' },
                { n: '3', sub: 'DEF' },
                { n: '4', sub: 'GHI' },
                { n: '5', sub: 'JKL' },
                { n: '6', sub: 'MNO' },
                { n: '7', sub: 'PQRS' },
                { n: '8', sub: 'TUV' },
                { n: '9', sub: 'WXYZ' },
                { n: '*', sub: '' },
                { n: '0', sub: '+' },
                { n: '#', sub: '' },
              ].map(({ n, sub }) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => handleKeyPress(n)}
                  style={{
                    height: 56,
                    borderRadius: 16,
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#1E293B',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                  }}
                >
                  <span>{n}</span>
                  {sub && <span style={{ fontSize: 9, color: '#94A3B8', fontWeight: 600 }}>{sub}</span>}
                </button>
              ))}
            </div>

            {/* Call Button & Backspace */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <button
                type="button"
                onClick={handleCall}
                style={{
                  width: 66,
                  height: 66,
                  borderRadius: '50%',
                  backgroundColor: '#22C55E',
                  border: 'none',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 6px 18px rgba(34, 197, 94, 0.4)',
                  transition: 'transform 0.15s ease',
                }}
              >
                <Phone size={28} />
              </button>

              <button
                type="button"
                onClick={handleBackspace}
                style={{
                  position: 'absolute',
                  right: 20,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: '#64748B',
                  padding: 8,
                }}
              >
                <Delete size={24} />
              </button>
            </div>
          </>
        )}

        {/* CALLING / USSD RUNNING VIEW */}
        {sessionState === 'calling' && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                border: '4px solid #E2E8F0',
                borderTopColor: '#0B57D0',
                margin: '0 auto 20px',
                animation: 'spin 1s linear infinite',
              }}
            />
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1E293B', marginBottom: 6 }}>
              USSD code running...
            </h3>
            <p style={{ fontSize: 14, color: '#64748B' }}>Connecting to {carrier} NPCI NUUP Gateway</p>
          </div>
        )}

        {/* INTERACTIVE USSD MODAL DIALOG */}
        {sessionState === 'ussd_menu' && (
          <div style={{ padding: '10px 0' }}>
            <div
              style={{
                backgroundColor: '#F1F5F9',
                borderRadius: 18,
                padding: '16px 18px',
                marginBottom: 16,
                fontFamily: 'monospace',
                fontSize: 13.5,
                lineHeight: 1.6,
                color: '#0F172A',
                border: '1px solid #CBD5E1',
              }}
            >
              {ussdStep === 1 && (
                <>
                  <div style={{ fontWeight: 'bold', marginBottom: 8, color: '#0B57D0' }}>
                    Welcome to *99# ({carrier}):
                  </div>
                  <div>1. Send Money</div>
                  <div>3. Check Balance</div>
                  <div>4. My Profile</div>
                  <div>5. Pending Transactions</div>
                  <div>6. Transactions</div>
                  <div>7. UPI PIN</div>
                </>
              )}

              {ussdStep === 2 && (
                <>
                  <div style={{ fontWeight: 'bold', marginBottom: 8, color: '#0B57D0' }}>
                    Send Money to:
                  </div>
                  <div>1. Mobile No.</div>
                  <div>3. UPI ID</div>
                  <div>4. Saved Beneficiary</div>
                  <div>5. IFSC, A/C No.</div>
                </>
              )}

              {ussdStep === 3 && (
                <>
                  <div style={{ fontWeight: 'bold', marginBottom: 8, color: '#0B57D0' }}>
                    Enter Beneficiary {destinationType === 'MOBILE' ? 'Mobile Number' : 'UPI ID'}:
                  </div>
                  <div style={{ color: '#64748B', fontSize: 12.5 }}>
                    {destinationType === 'MOBILE' ? 'e.g. 9876543210' : `Prepared: ${upiId}`}
                  </div>
                </>
              )}

              {ussdStep === 4 && (
                <>
                  <div style={{ fontWeight: 'bold', marginBottom: 8, color: '#0B57D0' }}>
                    Enter Amount for {merchantName}:
                  </div>
                  <div>Prepared Amount: ₹{amount}</div>
                </>
              )}

              {ussdStep === 5 && (
                <>
                  <div style={{ fontWeight: 'bold', marginBottom: 8, color: '#DC2626' }}>
                    Enter 4 or 6 digit UPI PIN to authorize ₹{amount} to {merchantName}:
                  </div>
                  <div style={{ color: '#64748B', fontSize: 12 }}>
                    (Entered securely on telecom prompt only)
                  </div>
                </>
              )}

              {ussdStep === 30 && (
                <>
                  <div style={{ fontWeight: 'bold', marginBottom: 8, color: '#0B57D0' }}>
                    Check Balance:
                  </div>
                  <div>State Bank of India (A/C ending in 4102)</div>
                  <div style={{ color: '#16A34A', fontWeight: 700, marginTop: 4 }}>
                    Available Balance: ₹4,850.50
                  </div>
                </>
              )}

              {ussdStep === 40 && (
                <>
                  <div style={{ fontWeight: 'bold', marginBottom: 8, color: '#0B57D0' }}>
                    My Profile:
                  </div>
                  <div>Name: Account Holder</div>
                  <div>UPI ID: user@upi</div>
                  <div>Linked Bank: State Bank of India</div>
                </>
              )}

              {ussdStep === 50 && (
                <>
                  <div style={{ fontWeight: 'bold', marginBottom: 8, color: '#0B57D0' }}>
                    Pending Transactions:
                  </div>
                  <div>No pending collect requests.</div>
                </>
              )}

              {ussdStep === 60 && (
                <>
                  <div style={{ fontWeight: 'bold', marginBottom: 8, color: '#0B57D0' }}>
                    Recent Transactions:
                  </div>
                  <div>1. ₹{amount} to {merchantName} (Recent)</div>
                  <div>2. ₹40 to Chai Point (Completed)</div>
                </>
              )}

              {ussdStep === 70 && (
                <>
                  <div style={{ fontWeight: 'bold', marginBottom: 8, color: '#0B57D0' }}>
                    UPI PIN Management:
                  </div>
                  <div>1. Set UPI PIN</div>
                  <div>2. Change UPI PIN</div>
                </>
              )}
            </div>

            {/* Quick Answer Buttons */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {ussdStep === 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setUserInput('1')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: 8,
                      border: '1px solid #0B57D0',
                      backgroundColor: '#E8F0FE',
                      color: '#0B57D0',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: 12.5,
                    }}
                  >
                    1 (Send Money)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserInput('3')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: 8,
                      border: '1px solid var(--border-light)',
                      backgroundColor: 'var(--bg-card-soft)',
                      color: 'var(--text-secondary)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: 12.5,
                    }}
                  >
                    3 (Check Balance)
                  </button>
                </>
              )}

              {ussdStep === 2 && (
                <>
                  <button
                    type="button"
                    onClick={() => setUserInput('3')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: 8,
                      border: '1px solid #0B57D0',
                      backgroundColor: '#E8F0FE',
                      color: '#0B57D0',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: 12.5,
                    }}
                  >
                    3 (UPI ID)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserInput('1')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: 8,
                      border: '1px solid var(--border-light)',
                      backgroundColor: 'var(--bg-card-soft)',
                      color: 'var(--text-secondary)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: 12.5,
                    }}
                  >
                    1 (Mobile No)
                  </button>
                </>
              )}

              {ussdStep === 3 && (
                <button
                  type="button"
                  onClick={() => setUserInput(destinationType === 'MOBILE' ? '9876543210' : upiId)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 8,
                    border: '1px solid #0B57D0',
                    backgroundColor: '#E8F0FE',
                    color: '#0B57D0',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: 12.5,
                  }}
                >
                  Use {destinationType === 'MOBILE' ? 'Mobile No' : `UPI ID (${upiId})`}
                </button>
              )}

              {ussdStep === 4 && (
                <button
                  type="button"
                  onClick={() => setUserInput(String(amount))}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 8,
                    border: '1px solid #0B57D0',
                    backgroundColor: '#E8F0FE',
                    color: '#0B57D0',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: 12.5,
                  }}
                >
                  Use ₹{amount}
                </button>
              )}

              {ussdStep === 5 && (
                <button
                  type="button"
                  onClick={() => setUserInput('••••')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 8,
                    border: '1px solid #16A34A',
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: 12.5,
                  }}
                >
                  Authorize with PIN
                </button>
              )}

              {ussdStep >= 30 && (
                <button
                  type="button"
                  onClick={() => {
                    setUssdStep(1);
                    setUserInput('');
                  }}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 8,
                    border: '1px solid #0B57D0',
                    backgroundColor: '#E8F0FE',
                    color: '#0B57D0',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: 12.5,
                  }}
                >
                  0. Back to Main Menu
                </button>
              )}
            </div>

            {/* USSD Input Field & Send Button */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input
                type={ussdStep === 5 ? 'password' : 'text'}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Reply..."
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 12,
                  border: '2px solid #0B57D0',
                  padding: '0 14px',
                  fontSize: 16,
                  fontWeight: 600,
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={handleSendUssd}
                style={{
                  height: 48,
                  padding: '0 20px',
                  borderRadius: 12,
                  backgroundColor: '#0B57D0',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* 124PAY IVR VOICE VIEW */}
        {sessionState === 'ivr_active' && (
          <div style={{ textAlign: 'center', padding: '24px 10px' }}>
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                backgroundColor: '#0A2885',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 8px 24px rgba(10,40,133,0.3)',
              }}
            >
              <Phone size={32} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1E293B', marginBottom: 4 }}>
              Call connected: 124PAY
            </h3>
            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>
              Listening to official IVR voice prompts
            </p>

            <div
              style={{
                backgroundColor: '#EFF6FF',
                borderRadius: 16,
                padding: '16px',
                textAlign: 'left',
                border: '1px solid #BFDBFE',
                marginBottom: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#1E40AF', marginBottom: 8, fontSize: 13 }}>
                <ShieldCheck size={18} /> IVR Voice Guidance
              </div>
              <p style={{ fontSize: 13, color: '#1E3A8A', lineHeight: 1.5 }}>
                "You are paying ₹{amount} to {merchantName}. To approve, please key in your UPI PIN on your dialpad now."
              </p>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setSessionState('done');
                setTimeout(onCompleteHandoff, 1200);
              }}
            >
              I have authorized payment <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* SESSION COMPLETED FEEDBACK */}
        {sessionState === 'done' && (
          <div style={{ textAlign: 'center', padding: '36px 16px' }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
              }}
            >
              <ShieldCheck size={32} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#15803D', marginBottom: 6 }}>
              Session Completed!
            </h3>
            <p style={{ fontSize: 13.5, color: '#64748B' }}>
              Redirecting to transaction follow-up...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
