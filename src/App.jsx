import { useState, useEffect } from 'react';
import {
  Home,
  HelpCircle,
  Settings,
  Moon,
  Sun,
  Radio,
  Check,
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
import { DialerModal } from './components/DialerModal';
import {
  getUserPreferences,
  saveUserPreferences,
} from './lib/storage/transactions';
import { getCarrierEligibility } from './lib/eligibility/registry';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [activeTab, setActiveTab] = useState('home');

  const [scannedQrData, setScannedQrData] = useState(null);
  const [paymentData, setPaymentData] = useState({ amount: 250, note: null });
  const [selectedCarrier, setSelectedCarrier] = useState(getCarrierEligibility('airtel'));
  const [initialScanManualMode, setInitialScanManualMode] = useState(false);
  const [initialScanUploadMode, setInitialScanUploadMode] = useState(false);

  const [isDialerOpen, setIsDialerOpen] = useState(false);
  const [dialerCode, setDialerCode] = useState('*99#');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [preferences, setPreferences] = useState(getUserPreferences);

  useEffect(() => {
    if (preferences.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [preferences.darkMode]);

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
    if (qrResult.amount) {
      setPaymentData({ amount: qrResult.amount, note: qrResult.note || null });
    }
    setCurrentScreen('qr_details');
    showToast('QR Scanned');
  };

  const handleContinueFromDetails = () => {
    if (scannedQrData?.hasFixedAmount) {
      setCurrentScreen('choose_method');
    } else {
      setCurrentScreen('enter_amount');
    }
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

  const handleOpenDialer = (code) => {
    setDialerCode(code);
    setIsDialerOpen(true);
  };

  const handleCompleteDialerHandoff = () => {
    setIsDialerOpen(false);
    setCurrentScreen('payment_status');
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

      {/* Main Content */}
      <main className="app-main-content">
        {currentScreen === 'home' && (
          <HomeScreen
            carrier={selectedCarrier}
            onSwitchCarrier={() => setCurrentScreen('choose_method')}
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
            onBack={() => setCurrentScreen('scan')}
            onContinue={handleContinueFromDetails}
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

      {/* Interactive Phone Dialer Modal */}
      <DialerModal
        isOpen={isDialerOpen}
        onClose={() => setIsDialerOpen(false)}
        initialCode={dialerCode}
        merchantName={scannedQrData?.merchantName || 'Merchant Payee'}
        upiId={scannedQrData?.upiId || 'merchant@upi'}
        amount={paymentData?.amount || 250}
        carrier={selectedCarrier.name}
        onCompleteHandoff={handleCompleteDialerHandoff}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        darkMode={preferences.darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        defaultCarrier={preferences.defaultCarrier}
        onChangeDefaultCarrier={handleChangeDefaultCarrier}
      />

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
