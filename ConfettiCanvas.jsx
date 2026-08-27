import React, { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

export const ConfettiCanvas = () => {
  // Ambient gentle floating particles
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-[8%] animate-float-slow opacity-60">
        <img src="/assets/decorations/star.svg" alt="star" className="w-8 h-8 drop-shadow-sm" />
      </div>
      <div className="absolute top-24 right-[10%] animate-float-medium opacity-50">
        <img src="/assets/decorations/balloon.svg" alt="balloon" className="w-10 h-14 drop-shadow-sm" />
      </div>
      <div className="absolute bottom-20 left-[6%] animate-float-fast opacity-50">
        <img src="/assets/decorations/heart.svg" alt="heart" className="w-7 h-7 drop-shadow-sm" />
      </div>
      <div className="absolute bottom-32 right-[8%] animate-float-slow opacity-60">
        <img src="/assets/decorations/star.svg" alt="star" className="w-7 h-7 drop-shadow-sm" />
      </div>
    </div>
  );
};

// Helper function to trigger confetti explosion
export const fireConfetti = (type = 'standard') => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const count = type === 'big' ? 120 : 60;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
    colors: ['#F48FB1', '#B39DDB', '#FFE082', '#80DEEA', '#FF8A80', '#D1C4E9'],
  };

  if (type === 'fireworks') {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        ...defaults,
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
      });
      confetti({
        ...defaults,
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } else if (type === 'hearts') {
    confetti({
      ...defaults,
      particleCount: 50,
      spread: 70,
      shapes: ['star', 'circle'],
      scalar: 1.2,
      origin: { y: 0.6 },
    });
  } else {
    confetti({
      ...defaults,
      particleCount: count,
      spread: 80,
      startVelocity: 35,
      origin: { y: 0.65 },
    });
  }
};

export default ConfettiCanvas;
