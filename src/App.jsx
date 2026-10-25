import { useState, useEffect } from 'react';
import {
  Home,
  HelpCircle,
  Settings,
  Moon,
  Sun,
  Radio,
  Check,
  Download,
  WifiOff,
  Share2,
  PlusSquare,
  X,
  RefreshCw,
} from 'lucide-react';
import { HomeScreen } from './screens/HomeScreen';
import { ScanScreen } from './screens/ScanScreen';
import { QrDetailsScreen } from './screens/QrDetailsScreen';
import { EnterAmountScreen } from './screens/EnterAmountScreen';
import { ChoosePaymentMethodScreen } from './screens/ChoosePaymentMethodScreen';
import { UssdGuideScreen } from './screens/UssdGuideScreen';
import { VoiceGuideScreen } from './screens/VoiceGuideScreen';
import { PaymentStatusScreen } from './screens/PaymentStatusScreen';
import { HelpScreen } from './screens/HelpScreen';
import { SettingsModal } from './screens/SettingsModal';
import {
  getUserPreferences,
  saveUserPreferences,
} from './lib/storage/transactions';
import { getCarrierEligibility } from './lib/eligibility/registry';

const checkIsStandalone = () => {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    (typeof document !== 'undefined' && document.referrer.includes('android-app://'))
  );
};

const checkIsIos = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const userAgent = window.navigator.userAgent || '';
  return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
};

const getInitialScreen = () => {
  if (typeof window !== 'undefined') {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('action') === 'scan') {
        return 'scan';
      }
    } catch (e) {
      console.warn('URL param parse error:', e);
    }
  }
  return 'home';
};

function App() {
  const [currentScreen, setCurrentScreen] = useState(getInitialScreen);
  const [activeTab, setActiveTab] = useState('home');

  const [scannedQrData, setScannedQrData] = useState(null);
  const [paymentData, setPaymentData] = useState({ amount: 250, note: null });
  const [selectedCarrier, setSelectedCarrier] = useState(getCarrierEligibility('airtel'));
  const [initialScanManualMode, setInitialScanManualMode] = useState(false);
  const [initialScanUploadMode, setInitialScanUploadMode] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [preferences, setPreferences] = useState(getUserPreferences);

  // PWA & Network States
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(checkIsStandalone);
  const [isIos] = useState(checkIsIos);
  const [showIosInstallModal, setShowIosInstallModal] = useState(false);
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine !== false : true));
  const [swUpdateAvailable, setSwUpdateAvailable] = useState(false);

  useEffect(() => {
    if (preferences.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [preferences.darkMode]);

  // PWA Lifecycle & Event Listeners
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      setToastMessage('Offline UPI installed successfully!');
      setTimeout(() => setToastMessage(''), 2500);
    };

    const handleOnline = () => {
      setIsOnline(true);
      setToastMessage('Back Online');
      setTimeout(() => setToastMessage(''), 2200);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    const handleSwUpdate = () => {
      setSwUpdateAvailable(true);
    };

    let mediaQueryList;
    const handleDisplayModeChange = (e) => {
      setIsStandalone(e.matches || window.navigator.standalone === true);
    };
    if (window.matchMedia) {
      mediaQueryList = window.matchMedia('(display-mode: standalone)');
      if (mediaQueryList.addEventListener) {
        mediaQueryList.addEventListener('change', handleDisplayModeChange);
      } else if (mediaQueryList.addListener) {
        mediaQueryList.addListener(handleDisplayModeChange);
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('sw-update-available', handleSwUpdate);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('sw-update-available', handleSwUpdate);
      if (mediaQueryList) {
        if (mediaQueryList.removeEventListener) {
          mediaQueryList.removeEventListener('change', handleDisplayModeChange);
        } else if (mediaQueryList.removeListener) {
          mediaQueryList.removeListener(handleDisplayModeChange);
        }
      }
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setDeferredPrompt(null);
          showToast('Installing Offline UPI...');
        }
      } catch (err) {
        console.warn('Install prompt error:', err);
      }
    } else if (isIos) {
      setShowIosInstallModal(true);
    } else {
      showToast('To install: tap browser menu (⋮) -> Add to Home screen');
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2200);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentScreen(tab);
  };

  const handleQrScanned = (qrResult) => {
    setScannedQrData(qrResult);
    setPaymentData({
      amount: qrResult.amount || 250,
      note: qrResult.note || null,
    });
    setCurrentScreen('qr_details');
    showToast('QR Scanned');
  };


  const handleContinueFromAmount = (enteredData) => {
    setPaymentData(enteredData);
    setCurrentScreen('choose_method');
  };

  const handleSelectMethod = ({ carrier, method }) => {
    setSelectedCarrier(carrier);
    if (method === 'VOICE_124PAY' || carrier.id === 'jio') {
      setCurrentScreen('guide_voice');
    } else {
      setCurrentScreen('guide_ussd');
    }
  };

  const handleOpenDialer = (code, carrier = selectedCarrier) => {
    const isVoice = code === '124PAY' || carrier?.id === 'jio';
    const telNumber = isVoice ? '08045163666' : (code || '*99#');
    const telUri = isVoice
      ? 'tel:08045163666'
      : `tel:${telNumber.replace(/#/g, '%23')}`;

    try {
      window.location.href = telUri;
    } catch (err) {
      console.warn('Native dialer redirect:', err);
    }

    setCurrentScreen('payment_status');
    showToast(`Redirecting to phone dialer (${isVoice ? '124PAY' : '*99#'})...`);
  };

  const handleToggleDarkMode = () => {
    const nextVal = !preferences.darkMode;
    const updated = { ...preferences, darkMode: nextVal };
    setPreferences(updated);
    saveUserPreferences(updated);
  };

  const handleChangeDefaultCarrier = (carrierId) => {
    const updated = { ...preferences, defaultCarrier: carrierId };
    setPreferences(updated);
    saveUserPreferences(updated);
    setSelectedCarrier(getCarrierEligibility(carrierId));
    showToast(`Default: ${carrierId.toUpperCase()}`);
  };

  const showBottomNav = currentScreen === 'home' || currentScreen === 'help';

  return (
    <div className="mobile-app-shell">
      {/* Minimal Top Header */}
      <header className="app-top-header">
        <button
          type="button"
          className="brand-row"
          onClick={() => handleTabChange('home')}
        >
          <div className="brand-icon">
            <Radio size={18} />
          </div>
          <span className="brand-name">Offline UPI</span>
        </button>

        <div className="header-actions">
          {!isStandalone && (deferredPrompt || isIos) && (
            <button
              type="button"
              className="header-install-pill"
              onClick={handleInstallClick}
              title="Install App"
            >
              <Download size={13} strokeWidth={2.4} />
              <span>Install</span>
            </button>
          )}

          <button
            type="button"
            className="header-icon-btn"
            onClick={handleToggleDarkMode}
            title="Theme"
          >
            {preferences.darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            type="button"
            className="header-icon-btn"
            onClick={() => setIsSettingsOpen(true)}
            title="Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </header>

      {/* Realtime Network & Offline Status Banner */}
      {!isOnline && (
        <div className="offline-network-badge" role="status" aria-live="polite">
          <WifiOff size={13} />
          <span>Offline Mode • Zero Data Needed (*99# & Voice Ready)</span>
        </div>
      )}

      {/* Service Worker Update Prompt */}
      {swUpdateAvailable && (
        <div className="sw-update-banner" role="status">
          <span>New version available</span>
          <button
            type="button"
            className="sw-update-btn"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={12} /> Reload
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="app-main-content">
        {currentScreen === 'home' && (
          <HomeScreen
            carrier={selectedCarrier}
            onSwitchCarrier={() => setIsSettingsOpen(true)}
            isStandalone={isStandalone}
            canInstall={Boolean(deferredPrompt || isIos)}
            onInstall={handleInstallClick}
            onNavigate={(target, opts) => {
              setInitialScanManualMode(Boolean(opts?.manualMode));
              setInitialScanUploadMode(Boolean(opts?.uploadMode));
              setCurrentScreen(target);
            }}
          />
        )}

        {currentScreen === 'scan' && (
          <ScanScreen
            initialManualMode={initialScanManualMode}
            initialUploadMode={initialScanUploadMode}
            onBack={() => setCurrentScreen('home')}
            onQrScanned={handleQrScanned}
          />
        )}

        {currentScreen === 'qr_details' && (
          <QrDetailsScreen
            qrData={scannedQrData}
            carrier={selectedCarrier}
            onSwitchCarrier={(carrier) => setSelectedCarrier(carrier)}
            onBack={() => setCurrentScreen('scan')}
            onOpenDialer={handleOpenDialer}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'enter_amount' && (
          <EnterAmountScreen
            qrData={scannedQrData}
            onBack={() => setCurrentScreen('qr_details')}
            onContinue={handleContinueFromAmount}
          />
        )}

        {currentScreen === 'choose_method' && (
          <ChoosePaymentMethodScreen
            selectedCarrierId={selectedCarrier.id}
            onBack={() => {
              if (scannedQrData?.hasFixedAmount) {
                setCurrentScreen('qr_details');
              } else {
                setCurrentScreen('enter_amount');
              }
            }}
            onSelectMethod={handleSelectMethod}
          />
        )}

        {currentScreen === 'guide_ussd' && (
          <UssdGuideScreen
            qrData={scannedQrData}
            paymentData={paymentData}
            carrier={selectedCarrier}
            onBack={() => setCurrentScreen('choose_method')}
            onOpenDialer={handleOpenDialer}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'guide_voice' && (
          <VoiceGuideScreen
            qrData={scannedQrData}
            paymentData={paymentData}
            carrier={selectedCarrier}
            onBack={() => setCurrentScreen('choose_method')}
            onOpenDialer={handleOpenDialer}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'payment_status' && (
          <PaymentStatusScreen
            qrData={scannedQrData}
            paymentData={paymentData}
            onDone={() => {
              setActiveTab('home');
              setCurrentScreen('home');
            }}
            onNeedHelp={() => {
              setActiveTab('help');
              setCurrentScreen('help');
            }}
          />
        )}

        {currentScreen === 'help' && (
          <HelpScreen />
        )}
      </main>

      {/* Minimal Persistent Bottom Navigation */}
      {showBottomNav && (
        <nav className="app-bottom-nav">
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => handleTabChange('home')}
          >
            <div className="tab-icon-pill">
              <Home size={19} />
            </div>
            <span>Home</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'help' ? 'active' : ''}`}
            onClick={() => handleTabChange('help')}
          >
            <div className="tab-icon-pill">
              <HelpCircle size={19} />
            </div>
            <span>Help</span>
          </button>
        </nav>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        darkMode={preferences.darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        defaultCarrier={preferences.defaultCarrier}
        onChangeDefaultCarrier={handleChangeDefaultCarrier}
      />

      {/* iOS Safari Install Guide Modal */}
      {showIosInstallModal && (
        <div
          className="ios-install-backdrop"
          onClick={() => setShowIosInstallModal(false)}
        >
          <div
            className="ios-install-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
          >
            <div className="ios-install-header">
              <div className="ios-install-title-row">
                <div className="brand-icon">
                  <Radio size={16} />
                </div>
                <h4 id="ios-install-title">Install Offline UPI</h4>
              </div>
              <button
                type="button"
                className="close-btn"
                onClick={() => setShowIosInstallModal(false)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <p className="ios-install-subtitle">
              Add Offline UPI to your Home Screen for instant offline access:
            </p>
            <ol className="ios-install-steps">
              <li>
                <div className="step-num">1</div>
                <div className="step-text">
                  Tap the <strong>Share</strong> button <Share2 size={13} className="inline-icon" /> at the bottom of Safari.
                </div>
              </li>
              <li>
                <div className="step-num">2</div>
                <div className="step-text">
                  Scroll down and tap <strong>Add to Home Screen</strong> <PlusSquare size={13} className="inline-icon" />.
                </div>
              </li>
              <li>
                <div className="step-num">3</div>
                <div className="step-text">
                  Tap <strong>Add</strong> in the top-right corner. It will work completely offline!
                </div>
              </li>
            </ol>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '16px' }}
              onClick={() => setShowIosInstallModal(false)}
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Minimal Toast */}
      {toastMessage && (
        <div className="minimal-toast">
          <Check size={14} color="#38BDF8" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
