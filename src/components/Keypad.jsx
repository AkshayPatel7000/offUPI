import { Delete } from 'lucide-react';

export function Keypad({ onKeyPress, onBackspace, showDecimal = true }) {
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handlePress = (val) => {
    triggerHaptic();
    onKeyPress(val);
  };

  const handleBack = () => {
    triggerHaptic();
    onBackspace();
  };

  return (
    <div className="keypad-grid" role="group" aria-label="Numeric Keypad">
      <button type="button" className="keypad-key" onClick={() => handlePress('1')}>1</button>
      <button type="button" className="keypad-key" onClick={() => handlePress('2')}>2</button>
      <button type="button" className="keypad-key" onClick={() => handlePress('3')}>3</button>

      <button type="button" className="keypad-key" onClick={() => handlePress('4')}>4</button>
      <button type="button" className="keypad-key" onClick={() => handlePress('5')}>5</button>
      <button type="button" className="keypad-key" onClick={() => handlePress('6')}>6</button>

      <button type="button" className="keypad-key" onClick={() => handlePress('7')}>7</button>
      <button type="button" className="keypad-key" onClick={() => handlePress('8')}>8</button>
      <button type="button" className="keypad-key" onClick={() => handlePress('9')}>9</button>

      {showDecimal ? (
        <button type="button" className="keypad-key" onClick={() => handlePress('.')}>.</button>
      ) : (
        <div className="keypad-key" style={{ opacity: 0, pointerEvents: 'none' }} />
      )}
      <button type="button" className="keypad-key" onClick={() => handlePress('0')}>0</button>
      <button
        type="button"
        className="keypad-key"
        onClick={handleBack}
        aria-label="Backspace"
        style={{ color: '#4B5563' }}
      >
        <Delete size={22} />
      </button>
    </div>
  );
}
