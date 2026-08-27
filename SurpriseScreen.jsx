import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Gift } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { fireConfetti } from './ConfettiCanvas';

export const SurpriseScreen = ({ config, onYes }) => {
  const [noAttempts, setNoAttempts] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [currentNoText, setCurrentNoText] = useState(
    config?.surpriseScreen?.noButtonText || 'No thanks 🙈'
  );

  const responses = config?.surpriseScreen?.noButtonResponses || [
    "Are you sure? 🥺",
    "Wrong button silly! 😜",
    "Try clicking YES instead! ✨",
    "Nice try, you can't say no! 🎁",
    "Come on, just click YES! 💕",
    "Nope, not allowed! 🚀",
  ];

  const handleNoInteraction = () => {
    sounds.playPop();
    const nextAttempts = noAttempts + 1;
    setNoAttempts(nextAttempts);

    // Pick random teasing response
    const nextResponse = responses[nextAttempts % responses.length];
    setCurrentNoText(nextResponse);

    // Random safe offset within container bounds
    const randomX = (Math.random() - 0.5) * 160;
    const randomY = (Math.random() - 0.5) * 120;
    setNoPosition({ x: randomX, y: randomY });
  };

  const handleYes = () => {
    sounds.playSuccess();
    fireConfetti('big');
    setTimeout(() => {
      onYes();
    }, 600);
  };

  // Grow YES button slightly with every NO attempt
  const yesScale = Math.min(1 + noAttempts * 0.08, 1.35);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.45 }}
      className="w-full flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 py-4"
    >
      {/* Cute Floating Gift Illustration */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 3, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-pastel-pink/40 border-4 border-white shadow-cute flex items-center justify-center relative"
      >
        <img
          src="/assets/decorations/cake.svg"
          alt="Birthday Cake"
          className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles className="w-6 h-6 text-amber-400 fill-amber-300" />
        </motion.div>
      </motion.div>

      {/* Surprise Message Card */}
      <div className="w-full max-w-sm space-y-3 px-2">
        <h2 className="text-sm font-bold uppercase tracking-widest text-pastel-purpleDark font-bubbly">
          {config?.surpriseScreen?.heading || 'A Little Secret'}
        </h2>
        <div className="p-6 rounded-3xl bg-white/90 shadow-cute border-2 border-pastel-lavender space-y-3">
          <p className="text-xl sm:text-2xl font-bold font-bubbly text-pastel-text leading-relaxed whitespace-pre-line">
            {config?.surpriseScreen?.question ||
              'I have little surprise for you.\nWanna see it? 💖'}
          </p>
          <p className="text-xs text-pastel-textMuted font-medium">
            (Choose wisely, only one answer leads to magic! ✨)
          </p>
        </div>
      </div>

      {/* Buttons: YES & NO */}
      <div className="w-full max-w-xs flex flex-col sm:flex-row items-center justify-center gap-4 relative min-h-[120px]">
        {/* YES Button */}
        <motion.button
          animate={{ scale: yesScale }}
          whileHover={{ scale: yesScale * 1.05 }}
          whileTap={{ scale: yesScale * 0.95 }}
          onClick={handleYes}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500 text-white font-bubbly font-bold text-lg shadow-lg shadow-pink-300/60 border-2 border-white/80 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer z-20"
        >
          <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
          <span>{config?.surpriseScreen?.yesButtonText || 'YES! 🎉'}</span>
        </motion.button>

        {/* NO Button (Playful Dodger) */}
        <motion.button
          animate={{
            x: noPosition.x,
            y: noPosition.y,
            scale: noAttempts > 0 ? 0.9 : 1,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          onMouseEnter={handleNoInteraction}
          onTouchStart={handleNoInteraction}
          onClick={handleNoInteraction}
          className="px-5 py-2.5 rounded-2xl bg-white/80 border-2 border-pastel-lavenderDark text-pastel-textMuted text-sm font-semibold font-bubbly hover:bg-rose-50 hover:text-rose-600 transition-colors shadow-sm select-none"
        >
          {currentNoText}
        </motion.button>
      </div>

      {noAttempts > 2 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-handwriting text-pink-600 text-base"
        >
          Hehe, you know you want to see it! Click YES! 💕
        </motion.p>
      )}
    </motion.div>
  );
};

export default SurpriseScreen;
