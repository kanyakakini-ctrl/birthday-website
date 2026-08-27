import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Heart, Sparkles, ArrowRight, Maximize2, X } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { normalizeImagePath } from '../utils/imageHelper';

export const MemoryGallery = ({ config, onNext }) => {
  const memories = config?.memories && config.memories.length > 0 ? config.memories : [
    {
      id: 1,
      image: '/assets/photos/photo1.svg',
      caption: 'PHOTO_1',
      date: 'Special Moment ✨',
      note: 'Every memory with you brings a smile.',
    },
    {
      id: 2,
      image: '/assets/photos/photo2.svg',
      caption: 'PHOTO_2',
      date: 'Sweet Moments 😊',
      note: 'Laughter and joy always follow you.',
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomImage, setZoomImage] = useState(null);

  const currentMemory = memories[currentIndex] || memories[0];

  const handleNext = () => {
    sounds.playClick();
    setCurrentIndex((prev) => (prev + 1) % memories.length);
  };

  const handlePrev = () => {
    sounds.playClick();
    setCurrentIndex((prev) => (prev - 1 + memories.length) % memories.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.45 }}
      className="w-full flex flex-col items-center text-center space-y-4 py-2 max-w-sm sm:max-w-md mx-auto"
    >
      {/* Gallery Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pastel-yellow/60 text-amber-900 border border-pastel-yellowDark/40 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Memory Lane</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bubbly font-bold text-pastel-purpleDark">
          Treasured Moments 📸
        </h2>
        <p className="text-xs text-pastel-textMuted font-medium">
          Slide through some unforgettable memories
        </p>
      </div>

      {/* Main Memory Polaroid Card with Animated Transitions */}
      <div className="relative w-full px-4 py-2 flex items-center justify-center min-h-[360px]">
        {/* Navigation Arrow Left */}
        <button
          onClick={handlePrev}
          title="Previous Memory"
          className="absolute left-0 z-30 p-2.5 rounded-full bg-white/90 shadow-cute border border-purple-100 text-pastel-purpleDark hover:bg-white active:scale-90 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Polaroid Card Animated Carousel with Touch Drag / Swipe */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = offset.x;
              if (swipe < -50 || velocity.x < -300) {
                handleNext();
              } else if (swipe > 50 || velocity.x > 300) {
                handlePrev();
              }
            }}
            initial={{ opacity: 0, x: 40, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.94 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="polaroid-frame w-full max-w-[260px] sm:max-w-[280px] bg-white cursor-pointer group relative touch-pan-y"
            onClick={() => setZoomImage(normalizeImagePath(currentMemory.image))}
          >
            {/* Image Box */}
            <div className="w-full aspect-square rounded-xl overflow-hidden bg-pastel-lavender/30 border border-purple-100 relative pointer-events-none">
              <img
                src={normalizeImagePath(currentMemory.image)}
                alt={currentMemory.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.src = '/assets/photos/photo1.svg';
                }}
              />
              <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Polaroid Description */}
            <div className="mt-3 text-left space-y-1.5 px-1 pointer-events-none">
              <div className="flex items-center justify-between">
                <h3 className="font-bubbly font-bold text-pastel-text text-sm sm:text-base line-clamp-1">
                  {currentMemory.caption}
                </h3>
                {currentMemory.date && (
                  <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {currentMemory.date}
                  </span>
                )}
              </div>
              {currentMemory.note && (
                <p className="text-xs font-handwriting text-pastel-textMuted text-sm line-clamp-2">
                  "{currentMemory.note}"
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrow Right */}
        <button
          onClick={handleNext}
          title="Next Memory"
          className="absolute right-0 z-30 p-2.5 rounded-full bg-white/90 shadow-cute border border-purple-100 text-pastel-purpleDark hover:bg-white active:scale-90 transition-all cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Pagination Dots & Counter */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5">
          {memories.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                sounds.playClick();
                setCurrentIndex(idx);
              }}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? 'w-6 bg-pink-500' : 'w-2 bg-pastel-lavenderDark hover:bg-purple-300'
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-semibold text-pastel-textMuted">
          {currentIndex + 1} of {memories.length} memories
        </span>
      </div>

      {/* Next CTA Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          sounds.playPop();
          onNext();
        }}
        className="mt-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bubbly font-bold text-sm sm:text-base shadow-cute flex items-center gap-2 border border-white/70 cursor-pointer"
      >
        <span>Pick a Surprise Gift 🎁</span>
        <ArrowRight className="w-4 h-4" />
      </motion.button>

      {/* Photo Fullscreen Zoom Modal */}
      <AnimatePresence>
        {zoomImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setZoomImage(null)}
          >
            <div className="relative max-w-sm w-full bg-white p-3 rounded-2xl shadow-2xl">
              <button
                onClick={() => setZoomImage(null)}
                className="absolute -top-3 -right-3 p-2 rounded-full bg-pink-600 text-white shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={zoomImage}
                alt="Enlarged Memory"
                className="w-full h-auto rounded-xl object-contain max-h-[70vh]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MemoryGallery;
