import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, Gift, PartyPopper } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { normalizeImagePath } from '../utils/imageHelper';

export const GiftRevealModal = ({ gift, onClose }) => {
  if (!gift) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          className="relative w-full max-w-sm bg-[#FFFDF7] rounded-3xl p-6 shadow-2xl border-4 border-pastel-pink space-y-4 text-center overflow-hidden"
        >
          {/* Top Decorative Sparkles */}
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-pink-200/50 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-purple-200/50 rounded-full blur-xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-pink-100 text-pink-700 hover:bg-pink-200 active:scale-90 transition-all z-10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Unwrapped Gift Icon Header */}
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ rotate: [-5, 5, -5], scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-pink-100 to-amber-100 border-2 border-pink-300 flex items-center justify-center shadow-inner p-2 mb-2"
            >
              <img
                src={normalizeImagePath(gift.image, '/assets/gifts/gift1.svg')}
                alt={gift.title}
                className="w-full h-full object-contain drop-shadow"
              />
            </motion.div>

            {gift.badge && (
              <span className="px-3 py-0.5 rounded-full bg-pink-100 text-pink-800 text-xs font-bold font-bubbly border border-pink-300 inline-block mb-1">
                {gift.badge}
              </span>
            )}

            <h3 className="text-xl font-bold font-bubbly text-pastel-purpleDark">
              {gift.title || 'Special Gift'}
            </h3>
          </div>

          {/* Optional Gift Photo / Voucher */}
          {gift.revealPhoto && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 0.15 }}
              className="w-full max-h-40 rounded-xl overflow-hidden border-2 border-dashed border-pink-300 bg-pink-50 p-1"
            >
              <img
                src={normalizeImagePath(gift.revealPhoto, '/assets/photos/photo3.svg')}
                alt="Gift Surprise"
                className="w-full h-36 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </motion.div>
          )}

          {/* Gift Message */}
          <div className="p-4 rounded-2xl bg-white shadow-sm border border-purple-100">
            <p className="text-sm font-handwriting text-pastel-text text-base leading-relaxed">
              {gift.message || 'You received a magical surprise!'}
            </p>
          </div>

          {/* Claim / Close Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bubbly font-bold text-sm shadow-md shadow-pink-200 cursor-pointer"
          >
            Claim This Surprise! 💖
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GiftRevealModal;
