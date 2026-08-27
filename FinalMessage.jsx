import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, RotateCcw, Send, Star } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { fireConfetti } from './ConfettiCanvas';
import { normalizeImagePath } from '../utils/imageHelper';

export const FinalMessage = ({ config, onReplay }) => {
  useEffect(() => {
    fireConfetti('fireworks');
    sounds.playSuccess();
  }, []);

  const message = config?.finalMessage || {};
  const recipientName = config?.recipientName || 'NAME_HERE';
  const photo = normalizeImagePath(
    message.photo || config?.celebrationScreen?.mainPhoto,
    '/assets/photos/photo2.svg'
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.93 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col items-center text-center space-y-4 py-2 max-w-sm sm:max-w-md mx-auto"
    >
      {/* Top Floating Hearts Badge */}
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="w-14 h-14 rounded-full bg-pastel-pink/60 border-2 border-pastel-pinkDark flex items-center justify-center shadow-cute"
      >
        <Heart className="w-8 h-8 text-rose-500 fill-rose-400" />
      </motion.div>

      {/* Heading */}
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bubbly font-bold text-pastel-purpleDark">
          {message.heading || 'A Letter For You 💌'}
        </h2>
        <p className="text-xs font-handwriting text-pastel-text text-base">
          {message.subheading || 'From the bottom of my heart...'}
        </p>
      </div>

      {/* Romantic / Cute Parchment Card */}
      <div className="w-full relative bg-[#FFFDF7] rounded-3xl p-5 sm:p-6 shadow-cute border-2 border-[#E9D8A6]/60 text-left space-y-4">
        {/* Cute Washi Tape on top */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-pink-200/80 -rotate-2 rounded-sm shadow-sm border border-pink-300/40 pointer-events-none" />

        {/* Small photo stamp */}
        <div className="flex items-center gap-3 pb-2 border-b border-dashed border-purple-200">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-purple-100 border border-purple-300 flex-shrink-0">
            <img
              src={photo}
              alt={recipientName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/assets/photos/photo2.svg';
              }}
            />
          </div>
          <div>
            <h4 className="font-bubbly font-bold text-pastel-text text-sm">
              To: {recipientName} 🎂
            </h4>
            <p className="text-[11px] font-handwriting text-pink-600 font-semibold">
              Today is all about you! ✨
            </p>
          </div>
        </div>

        {/* Message Content */}
        <div className="max-h-60 overflow-y-auto pr-1">
          <p className="text-xs sm:text-sm font-body text-pastel-text leading-relaxed whitespace-pre-line">
            {message.content ||
              `BIRTHDAY_MESSAGE_HERE\n\nDearest ${recipientName},\n\nWishing you an extraordinary birthday filled with endless laughter, love, and sweet dreams coming true!\n\nThank you for bringing so much happiness to everyone around you.`}
          </p>
        </div>

        {/* Signature */}
        <div className="pt-2 border-t border-dashed border-purple-200 text-right">
          <p className="text-sm font-handwriting text-pink-700 font-bold text-lg">
            {message.signature || 'With lots of love 💕'}
          </p>
        </div>
      </div>

      {/* Action: Replay Surprise Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          sounds.playPop();
          onReplay();
        }}
        className="mt-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 text-white font-bubbly font-bold text-base shadow-cute flex items-center gap-2 border-2 border-white/80 transition-all cursor-pointer"
      >
        <RotateCcw className="w-5 h-5" />
        <span>{message.replayButtonText || 'Replay Surprise 🔄'}</span>
      </motion.button>
    </motion.div>
  );
};

export default FinalMessage;
