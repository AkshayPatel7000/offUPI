import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Flashlight,
  Image as ImageIcon,
  Keyboard,
  AlertCircle,
  Camera,
  Sparkles,
} from 'lucide-react';
import jsQR from 'jsqr';
import { parseUpiQr } from '../lib/qr/parser';
import { SAMPLE_QR_CODES } from '../lib/qr/samples';

export function ScanScreen({
  onBack,
  onQrScanned,
  initialManualMode = false,
  initialUploadMode = false,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [torchOn, setTorchOn] = useState(false);
  const [manualMode, setManualMode] = useState(initialManualMode);
  const [manualUpiInput, setManualUpiInput] = useState('');
  const [manualError, setManualError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const streamRef = useRef(null);
  const animationFrameId = useRef(null);

  // Auto trigger file picker if user requested upload mode
  useEffect(() => {
    if (initialUploadMode && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [initialUploadMode]);

  // Initialize camera
  useEffect(() => {
    if (manualMode) return;
    let isMounted = true;

    async function startCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (isMounted) {
          setHasCameraPermission(false);
          setErrorMessage('Camera access not supported on this device/browser.');
        }
        return;
      }

      try {
        setErrorMessage('');
        const constraints = {
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.play();
        }

        setHasCameraPermission(true);
      } catch {
        if (isMounted) {
          setHasCameraPermission(false);
          setErrorMessage('Camera access denied or unavailable. Use gallery upload or test presets below.');
        }
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [manualMode]);

  // Frame scanner loop using jsQR
  useEffect(() => {
    if (!hasCameraPermission || manualMode) return;

    const canvas = canvasRef.current || document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    function scanFrame() {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code && code.data) {
          const parsed = parseUpiQr(code.data);
          if (parsed.success) {
            onQrScanned(parsed.data);
            return;
          } else {
            setErrorMessage(parsed.error);
          }
        }
      }
      animationFrameId.current = requestAnimationFrame(scanFrame);
    }

    animationFrameId.current = requestAnimationFrame(scanFrame);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [hasCameraPermission, manualMode, onQrScanned]);

  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track && track.applyConstraints) {
      try {
        const nextState = !torchOn;
        await track.applyConstraints({ advanced: [{ torch: nextState }] });
        setTorchOn(nextState);
      } catch {
        // torch not supported on device
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imgData.data, imgData.width, imgData.height);

        if (code && code.data) {
          const parsed = parseUpiQr(code.data);
          if (parsed.success) {
            onQrScanned(parsed.data);
          } else {
            setErrorMessage(parsed.error);
          }
        } else {
          setErrorMessage('No valid QR code was detected in the selected image.');
        }
      };
      img.src = event.target?.result;
    };
    reader.readAsDataURL(file);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    setManualError('');
    const parsed = parseUpiQr(manualUpiInput.trim());
    if (parsed.success) {
      onQrScanned(parsed.data);
    } else {
      setManualError(parsed.error);
    }
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
        <h2>Scan QR code</h2>
      </div>

      {manualMode ? (
        <div style={{ marginTop: 10 }}>
          <div className="minimal-card" style={{ marginBottom: 18 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
              Enter Merchant UPI ID
            </h3>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 14 }}>
              Enter payee VPA (e.g. coffeehouse@okaxis, store@icici).
            </p>

            <form onSubmit={handleManualSubmit}>
              <input
                type="text"
                value={manualUpiInput}
                onChange={(e) => setManualUpiInput(e.target.value)}
                placeholder="e.g. coffeehouse@okaxis"
                autoFocus
                style={{
                  width: '100%',
                  height: 46,
                  borderRadius: 'var(--radius-md)',
                  border: manualError ? '2px solid var(--accent-red)' : '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  padding: '0 14px',
                  fontSize: 15,
                  fontWeight: 600,
                  outline: 'none',
                  marginBottom: 10,
                }}
              />

              {manualError && (
                <div
                  style={{
                    color: 'var(--accent-red)',
                    fontSize: 12,
                    marginBottom: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <AlertCircle size={14} /> {manualError}
                </div>
              )}

              <button type="submit" className="btn-primary" style={{ height: 44 }}>
                Continue
              </button>
            </form>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => setManualMode(false)}
          >
            <Camera size={16} />
            <span>Switch to Camera Scanner</span>
          </button>
        </div>
      ) : (
        <>
          {/* Viewfinder box */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              backgroundColor: '#000000',
              margin: '8px auto 16px',
            }}
          >
            <video
              ref={videoRef}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              muted
              playsInline
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Corner Bracket Reticle */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  width: 200,
                  height: 200,
                  position: 'relative',
                  border: '2px dashed rgba(255,255,255,0.3)',
                  borderRadius: 16,
                }}
              >
                <div style={{ position: 'absolute', top: -2, left: -2, width: 24, height: 24, borderTop: '3px solid #38BDF8', borderLeft: '3px solid #38BDF8', borderTopLeftRadius: 14 }} />
                <div style={{ position: 'absolute', top: -2, right: -2, width: 24, height: 24, borderTop: '3px solid #38BDF8', borderRight: '3px solid #38BDF8', borderTopRightRadius: 14 }} />
                <div style={{ position: 'absolute', bottom: -2, left: -2, width: 24, height: 24, borderBottom: '3px solid #38BDF8', borderLeft: '3px solid #38BDF8', borderBottomLeftRadius: 14 }} />
                <div style={{ position: 'absolute', bottom: -2, right: -2, width: 24, height: 24, borderBottom: '3px solid #38BDF8', borderRight: '3px solid #38BDF8', borderBottomRightRadius: 14 }} />

                {/* Animated Laser Bar */}
                <div
                  style={{
                    position: 'absolute',
                    left: 4,
                    right: 4,
                    height: 2,
                    background: 'linear-gradient(90deg, transparent, #38BDF8, #60A5FA, transparent)',
                    boxShadow: '0 0 10px #38BDF8',
                    animation: 'scanLaser 2.2s ease-in-out infinite',
                  }}
                />
              </div>
            </div>

            <style>{`
              @keyframes scanLaser {
                0% { top: 6px; opacity: 0.6; }
                50% { top: calc(100% - 8px); opacity: 1; }
                100% { top: 6px; opacity: 0.6; }
              }
            `}</style>

            {hasCameraPermission === false && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: '#0F172A',
                  color: '#FFF',
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                <Camera size={36} color="#94A3B8" style={{ marginBottom: 10 }} />
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                  Camera Preview Inactive
                </div>
                <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 14 }}>
                  Upload a QR image file or tap a test scenario below.
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 99,
                    border: 'none',
                    backgroundColor: '#0B57D0',
                    color: '#FFF',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Upload QR Image
                </button>
              </div>
            )}
          </div>

          {/* Action Row: Torch, Gallery, Manual */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 20,
              marginBottom: 16,
            }}
          >
            <button
              type="button"
              onClick={toggleTorch}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                border: 'none',
                background: 'transparent',
                color: torchOn ? 'var(--primary-blue)' : 'var(--text-secondary)',
                fontSize: 11.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  backgroundColor: torchOn ? 'var(--primary-blue-subtle)' : 'var(--bg-card-soft)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Flashlight size={18} />
              </div>
              <span>Torch</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                border: 'none',
                background: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: 11.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-card-soft)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ImageIcon size={18} />
              </div>
              <span>From gallery</span>
            </button>

            <button
              type="button"
              onClick={() => setManualMode(true)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                border: 'none',
                background: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: 11.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-card-soft)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Keyboard size={18} />
              </div>
              <span>Manual</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />

          {errorMessage && (
            <div
              style={{
                backgroundColor: 'var(--accent-red-bg)',
                color: 'var(--accent-red-text)',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: 12,
                marginBottom: 14,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>{errorMessage}</div>
            </div>
          )}

          {/* Quick presets row */}
          <div
            style={{
              backgroundColor: 'var(--bg-card-soft)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              border: '1px solid var(--border-light)',
              marginTop: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Sparkles size={14} color="var(--primary-blue)" />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                Test Scenarios
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
              {SAMPLE_QR_CODES.slice(0, 3).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    const parsed = parseUpiQr(item.raw);
                    if (parsed.success) onQrScanned(parsed.data);
                  }}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-light)',
                    fontSize: 11.5,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                  }}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
