import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Delete, Check, Sparkles, KeyRound } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { fireConfetti } from './ConfettiCanvas';
import { normalizeImagePath } from '../utils/imageHelper';

export const UnlockScreen = ({ config, onUnlock }) => {
  const [pin, setPin] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const targetPin = (config?.pin || '1234').toString().trim();
  const maxDigits = 4;

  const handleKeyPress = (num) => {
    if (pin.length < maxDigits) {
      const newPin = pin + num;
      setPin(newPin);
      sounds.playClick();
      setErrorMsg('');

      // Auto check when 4 digits are entered
      if (newPin.length === maxDigits) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      sounds.playClick();
      setErrorMsg('');
    }
  };

  const handleClear = () => {
    setPin('');
    sounds.playClick();
    setErrorMsg('');
  };

  const verifyPin = (currentPin) => {
    if (currentPin === targetPin) {
      setIsSuccess(true);
      sounds.playSuccess();
      fireConfetti('hearts');
      setTimeout(() => {
        onUnlock();
      }, 900);
    } else {
      setIsShaking(true);
      sounds.playError();
      setErrorMsg(`Oops! Wrong key 🗝️ (Hint: ${targetPin})`);
      setTimeout(() => {
        setIsShaking(false);
        setPin('');
      }, 600);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full flex flex-col items-center text-center space-y-4"
    >
      {/* Top Cute Badge */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pastel-pink/70 text-pink-900 border border-pastel-pinkDark/50 text-xs font-semibold shadow-sm"
      >
        <Sparkles className="w-3.5 h-3.5 text-pink-600" />
        <span>Top Secret Birthday Surprise</span>
      </motion.div>

      {/* Main Heading */}
      <div className="space-y-1">
        <h1 className="text-4xl sm:text-5xl font-bubbly font-bold text-pastel-purpleDark tracking-wide lowercase">
          {config?.unlockScreen?.title || 'unlock'}
        </h1>
        <p className="text-base sm:text-lg font-handwriting text-pastel-text text-xl">
          {config?.unlockScreen?.subtitle || 'A special surprise is waiting for you ✨'}
        </p>
      </div>

      {/* Polaroid Decorative Photo Frame */}
      <motion.div
        whileHover={{ scale: 1.03, rotate: 0 }}
        className="polaroid-frame max-w-[200px] sm:max-w-[220px] mx-auto bg-white"
      >
        <div className="w-full aspect-square rounded-lg overflow-hidden bg-pastel-lavender/30 flex items-center justify-center border border-purple-100">
          <img
            src={normalizeImagePath(config?.unlockScreen?.photo, '/assets/photos/photo1.svg')}
            alt="Birthday Mystery"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/assets/photos/photo1.svg';
            }}
          />
        </div>
        <p className="mt-2 text-xs font-handwriting text-pastel-textMuted font-bold">
          🎂 {config?.recipientName || 'Birthday Star'}
        </p>
      </motion.div>

      {/* PIN Indicators (Hearts / Circles) */}
      <motion.div
        animate={isShaking ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center gap-3 py-2"
      >
        {[0, 1, 2, 3].map((index) => {
          const filled = index < pin.length;
          return (
            <motion.div
              key={index}
              animate={filled ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 border-2 ${
                filled
                  ? 'bg-pastel-pinkDark border-pink-600 shadow-md shadow-pink-200'
                  : 'bg-white/80 border-pastel-lavenderDark shadow-inner'
              }`}
            >
              {filled && <span className="text-[9px] text-white">💖</span>}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Error / Hint Message */}
      <div className="h-6 flex items-center justify-center">
        <AnimatePresence>
          {errorMsg ? (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200"
            >
              {errorMsg}
            </motion.p>
          ) : (
            <p className="text-[12px] text-pastel-textMuted font-medium">
              {config?.unlockScreen?.hintText || 'Enter the 4-digit PIN to open ✨'}
            </p>
          )}
        </AnimatePresence>
      </div>

      {/* Number Keypad */}
      <div className="w-full max-w-[280px] grid grid-cols-3 gap-2.5 pt-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <motion.button
            key={num}
            whileHover={{ scale: 1.06, backgroundColor: '#FFFFFF' }}
            whileTap={{ scale: 0.94 }}
            onClick={() => handleKeyPress(num.toString())}
            className="h-12 rounded-2xl bg-white/90 shadow-sm border border-pastel-lavender/80 text-xl font-bold font-bubbly text-pastel-text flex items-center justify-center hover:shadow-cute transition-all"
          >
            {num}
          </motion.button>
        ))}

        {/* Clear Button */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleClear}
          title="Clear all"
          className="h-12 rounded-2xl bg-pastel-pink/40 border border-pastel-pinkDark/30 text-xs font-bold font-bubbly text-pink-900 flex items-center justify-center hover:bg-pastel-pink/60 transition-all"
        >
          CLEAR
        </motion.button>

        {/* Number 0 */}
        <motion.button
          whileHover={{ scale: 1.06, backgroundColor: '#FFFFFF' }}
          whileTap={{ scale: 0.94 }}
          onClick={() => handleKeyPress('0')}
          className="h-12 rounded-2xl bg-white/90 shadow-sm border border-pastel-lavender/80 text-xl font-bold font-bubbly text-pastel-text flex items-center justify-center hover:shadow-cute transition-all"
        >
          0
        </motion.button>

        {/* Backspace Button */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleDelete}
          title="Backspace"
          className="h-12 rounded-2xl bg-pastel-lavender/50 border border-pastel-lavenderDark/40 text-pastel-purpleDark flex items-center justify-center hover:bg-pastel-lavender transition-all"
        >
          <Delete className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default UnlockScreen;
