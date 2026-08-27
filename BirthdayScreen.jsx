import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Crown, PartyPopper, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { fireConfetti } from './ConfettiCanvas';
import { normalizeImagePath } from '../utils/imageHelper';

export const BirthdayScreen = ({ config, onNext }) => {
  useEffect(() => {
    // Trigger celebratory confetti fireworks on screen entrance
    fireConfetti('fireworks');
    sounds.playSuccess();
  }, []);

  const recipientName = config?.recipientName || 'NAME_HERE';
  const title = config?.celebrationScreen?.birthdayTitle || 'HAPPY BIRTHDAY';
  const subheading =
    config?.celebrationScreen?.subheading ||
    'Wishing you the most magical and joyful day filled with endless smiles! 🎂✨';
  const mainPhoto = normalizeImagePath(
    config?.celebrationScreen?.mainPhoto,
    '/assets/photos/photo2.svg'
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col items-center text-center space-y-5 py-2"
    >
      {/* Top Birthday Hat / Crown Badge */}
      <motion.div
        animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        <img
          src="/assets/decorations/crown.svg"
          alt="Birthday Crown"
          className="w-14 h-12 drop-shadow-md"
        />
      </motion.div>

      {/* Main Celebratory Heading */}
      <div className="space-y-1">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bubbly font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 tracking-wide"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-2xl sm:text-3xl font-bubbly font-bold text-pink-600 tracking-wider"
        >
          ✨ {recipientName} ✨
        </motion.p>
      </div>

      {/* Celebratory Photo Frame with Floating Decorations */}
      <div className="relative w-full max-w-[250px] sm:max-w-[270px] mx-auto py-2">
        {/* Floating Balloon on Top-Left */}
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-6 -left-6 z-20 w-12 h-16"
        >
          <img src="/assets/decorations/balloon.svg" alt="Balloon" className="w-full h-full drop-shadow-md" />
        </motion.div>

        {/* Floating Star on Bottom-Right */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-2 -right-4 z-20 w-10 h-10"
        >
          <img src="/assets/decorations/star.svg" alt="Star" className="w-full h-full drop-shadow-md" />
        </motion.div>

        {/* Polaroid Card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="polaroid-frame bg-white relative z-10"
        >
          <div className="w-full aspect-square rounded-xl overflow-hidden bg-pastel-lavender/40 border border-purple-100 flex items-center justify-center">
            <img
              src={mainPhoto}
              alt={recipientName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/assets/photos/photo2.svg';
              }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between px-1">
            <span className="text-xs font-handwriting text-pink-700 font-bold text-base">
              🎉 Celebrating You!
            </span>
            <span className="text-xs font-bubbly text-purple-600 font-semibold bg-purple-50 px-2 py-0.5 rounded-full">
              🌟 Star of the Day
            </span>
          </div>
        </motion.div>
      </div>

      {/* Subtitle Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm sm:text-base text-pastel-text max-w-sm font-medium leading-relaxed px-4"
      >
        {subheading}
      </motion.p>

      {/* Continue CTA Button */}
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(233, 30, 99, 0.4)' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          sounds.playPop();
          onNext();
        }}
        className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 text-white font-bubbly font-bold text-base shadow-cute flex items-center gap-2 border-2 border-white/80 transition-all cursor-pointer"
      >
        <span>{config?.celebrationScreen?.ctaButtonText || 'Open Memories 📸'}</span>
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
};

export default BirthdayScreen;
