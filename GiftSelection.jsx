import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { fireConfetti } from './ConfettiCanvas';
import GiftRevealModal from './GiftRevealModal';

export const GiftSelection = ({ config, onNext }) => {
  const gifts = config?.gifts && config.gifts.length > 0 ? config.gifts : [
    {
      id: 1,
      title: 'Surprise Gift #1',
      boxLabel: 'Gift 1',
      image: '/assets/gifts/gift1.svg',
      revealPhoto: '/assets/photos/photo3.svg',
      message: 'GIFT_MESSAGE_1: Unlimited hugs and smiles!',
    },
    {
      id: 2,
      title: 'Surprise Gift #2',
      boxLabel: 'Gift 2',
      image: '/assets/gifts/gift2.svg',
      revealPhoto: '/assets/photos/photo4.svg',
      message: 'GIFT_MESSAGE_2: A special dinner treat!',
    }
  ];

  const [openedGifts, setOpenedGifts] = useState({});
  const [activeGift, setActiveGift] = useState(null);
  const [animatingId, setAnimatingId] = useState(null);

  const handleOpenGift = (gift) => {
    setAnimatingId(gift.id);
    sounds.playPop();

    setTimeout(() => {
      sounds.playGiftUnwrap();
      fireConfetti('hearts');
      setOpenedGifts((prev) => ({ ...prev, [gift.id]: true }));
      setActiveGift(gift);
      setAnimatingId(null);
    }, 450);
  };

  const openedCount = Object.keys(openedGifts).length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.45 }}
      className="w-full flex flex-col items-center text-center space-y-4 py-2"
    >
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pastel-pink/60 text-pink-900 border border-pastel-pinkDark/40 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-pink-600" />
          <span>Surprise Time</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bubbly font-bold text-pastel-purpleDark lowercase">
          {config?.giftsHeading || 'select any gift'}
        </h2>
        <p className="text-xs sm:text-sm text-pastel-textMuted font-medium">
          {config?.giftsSubheading || 'Tap a gift box to unwrap your special surprises! 🎁'}
        </p>
      </div>

      {/* Gifts Grid */}
      <div className="w-full max-w-sm grid grid-cols-2 sm:grid-cols-3 gap-3.5 py-3 px-2">
        {gifts.map((gift, idx) => {
          const isOpened = openedGifts[gift.id];
          const isAnimating = animatingId === gift.id;

          return (
            <motion.div
              key={gift.id || idx}
              whileHover={{ scale: 1.06, y: -4 }}
              whileTap={{ scale: 0.94 }}
              animate={
                isAnimating
                  ? { rotate: [-10, 10, -10, 10, 0], scale: [1, 1.15, 1] }
                  : { y: [0, -3, 0] }
              }
              transition={
                isAnimating
                  ? { duration: 0.45 }
                  : { duration: 3 + idx * 0.5, repeat: Infinity, ease: 'easeInOut' }
              }
              onClick={() => handleOpenGift(gift)}
              className={`relative flex flex-col items-center p-3 rounded-2xl cursor-pointer border-2 transition-all shadow-cute ${
                isOpened
                  ? 'bg-gradient-to-b from-white to-pink-50/80 border-pink-300'
                  : 'bg-white/90 border-pastel-lavenderDark hover:border-pink-400'
              }`}
            >
              {/* Opened Badge */}
              {isOpened && (
                <div className="absolute top-2 right-2 z-10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100" />
                </div>
              )}

              {/* Gift Image / Box */}
              <div className="w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center p-1 relative">
                <img
                  src={gift.image || '/assets/gifts/gift1.svg'}
                  alt={gift.title}
                  className="w-full h-full object-contain drop-shadow-md"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/gifts/gift1.svg';
                  }}
                />
                {!isOpened && (
                  <motion.div
                    animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.9, 1.1, 0.9] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400 fill-amber-300" />
                  </motion.div>
                )}
              </div>

              {/* Gift Label */}
              <span className="mt-2 text-xs font-bold font-bubbly text-pastel-purpleDark line-clamp-1">
                {gift.boxLabel || gift.title || `Gift ${idx + 1}`}
              </span>
              <span className="text-[10px] text-pink-600 font-semibold font-handwriting text-xs">
                {isOpened ? '✨ Unwrapped!' : 'Tap to open 🎁'}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Status */}
      <p className="text-xs text-pastel-textMuted font-medium">
        {openedCount === 0
          ? 'Pick any gift to begin unwrapping!'
          : `You opened ${openedCount} of ${gifts.length} surprises ✨`}
      </p>

      {/* Next to Final Message CTA */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          sounds.playPop();
          onNext();
        }}
        className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 text-white font-bubbly font-bold text-base shadow-cute flex items-center gap-2 border-2 border-white/80 transition-all cursor-pointer"
      >
        <span>See Final Birthday Message 💌</span>
        <ArrowRight className="w-5 h-5" />
      </motion.button>

      {/* Gift Reveal Modal */}
      {activeGift && (
        <GiftRevealModal gift={activeGift} onClose={() => setActiveGift(null)} />
      )}
    </motion.div>
  );
};

export default GiftSelection;
