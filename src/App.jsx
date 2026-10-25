import { useState, useEffect } from 'react';
import {
  Home,
  Receipt,
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
import { TransactionsScreen } from './screens/TransactionsScreen';
import { HelpScreen } from './screens/HelpScreen';
import { SettingsModal } from './screens/SettingsModal';
import { DialerModal } from './components/DialerModal';
import {
  getStoredTransactions,
  saveTransaction,
  updateTransactionStatus,
  clearStoredTransactions,
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

  const [transactions, setTransactions] = useState(() => getStoredTransactions());
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

  const handleSelectSampleQr = (sample) => {
    const data = {
      raw: sample.raw,
      upiId: sample.upiId,
      merchantName: sample.merchantName,
      amount: sample.amount,
      note: 'Cold Brew and Bagel',
      currency: 'INR',
      category: sample.category,
      hasFixedAmount: Boolean(sample.amount),
    };
    setScannedQrData(data);
    setPaymentData({ amount: sample.amount || 250, note: null });
    setCurrentScreen('qr_details');
    showToast(`Loaded ${sample.title}`);
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

    saveTransaction({
      merchantName: scannedQrData?.merchantName || 'The Coffee House',
      upiId: scannedQrData?.upiId || 'coffeehouse@okaxis',
      amount: paymentData?.amount || scannedQrData?.amount || 250,
      note: paymentData?.note || null,
      category: scannedQrData?.category || 'Food & Dining',
      method: selectedCarrier.primaryMethod,
      carrier: selectedCarrier.name,
      status: 'initiated',
      dialCode: dialerCode,
    });

    setTransactions(getStoredTransactions());
    setCurrentScreen('payment_status');
  };

  const handleUpdateStatus = (newStatus) => {
    if (transactions[0]?.id) {
      const updated = updateTransactionStatus(transactions[0].id, newStatus);
      setTransactions(updated);
      showToast(`Marked as ${newStatus}`);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear locally recorded preparation history?')) {
      clearStoredTransactions();
      setTransactions([]);
      showToast('History cleared');
    }
  };

  const handleToggleOffline = () => {
    const nextVal = !preferences.offlineSimulated;
    const updated = { ...preferences, offlineSimulated: nextVal };
    setPreferences(updated);
    saveUserPreferences(updated);
    showToast(nextVal ? 'Offline mode simulated' : 'Cellular mode restored');
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

  const showBottomNav =
    currentScreen === 'home' ||
    currentScreen === 'transactions' ||
    currentScreen === 'help';

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
            className="status-dot-btn"
            onClick={handleToggleOffline}
            title="Toggle offline simulated mode"
          >
            <span className={`dot-indicator ${preferences.offlineSimulated ? 'dot-offline' : 'dot-online'}`} />
            <span>{preferences.offlineSimulated ? 'Offline' : 'Cellular'}</span>
          </button>

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
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {currentScreen === 'home' && (
          <HomeScreen
            carrier={selectedCarrier}
            onSwitchCarrier={() => setCurrentScreen('choose_method')}
            onNavigate={(target, opts) => {
              setInitialScanManualMode(Boolean(opts?.manualMode));
              setInitialScanUploadMode(Boolean(opts?.uploadMode));
              setCurrentScreen(target);
            }}
            onSelectSampleQr={handleSelectSampleQr}
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
              setActiveTab('transactions');
              setCurrentScreen('transactions');
            }}
            onUpdateStatus={handleUpdateStatus}
            onNeedHelp={() => {
              setActiveTab('help');
              setCurrentScreen('help');
            }}
          />
        )}

        {currentScreen === 'transactions' && (
          <TransactionsScreen
            transactions={transactions}
            onClearTransactions={handleClearHistory}
            onShowToast={showToast}
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
            className={`nav-tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => handleTabChange('transactions')}
          >
            <div className="tab-icon-pill">
              <Receipt size={19} />
            </div>
            <span>Transactions</span>
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
        merchantName={scannedQrData?.merchantName || 'The Coffee House'}
        upiId={scannedQrData?.upiId || 'coffeehouse@okaxis'}
        amount={paymentData?.amount || 250}
        carrier={selectedCarrier.name}
        onCompleteHandoff={handleCompleteDialerHandoff}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isOfflineSimulated={preferences.offlineSimulated}
        onToggleOffline={handleToggleOffline}
        darkMode={preferences.darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        defaultCarrier={preferences.defaultCarrier}
        onChangeDefaultCarrier={handleChangeDefaultCarrier}
        onClearHistory={handleClearHistory}
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
