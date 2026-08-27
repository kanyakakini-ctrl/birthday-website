import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const MusicControl = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleToggle = () => {
    setHasInteracted(true);
    const newState = sounds.toggleMusic(audioUrl, (playing) => {
      setIsPlaying(playing);
    });
    setIsPlaying(newState);
  };

  // Optional: Auto start on first user tap anywhere
  useEffect(() => {
    const handleFirstTap = () => {
      if (!hasInteracted) {
        // We do not force play, but we prepare audio context
        sounds.initContext();
      }
    };
    window.addEventListener('click', handleFirstTap, { once: true });
    return () => window.removeEventListener('click', handleFirstTap);
  }, [hasInteracted]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={handleToggle}
        title={isPlaying ? "Mute Background Music" : "Play Background Music"}
        className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-cute transition-all transform active:scale-95 ${
          isPlaying
            ? 'bg-pastel-pink text-pink-900 border-2 border-pastel-pinkDark ring-2 ring-pink-200'
            : 'bg-white/85 backdrop-blur-md text-pastel-textMuted border border-pastel-lavenderDark hover:bg-white hover:text-pastel-text'
        }`}
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-4 h-4 animate-bounce" />
            <div className="flex items-center gap-0.5 h-3">
              <span className="w-1 bg-pink-600 rounded-full h-full animate-[pulse_0.6s_ease-in-out_infinite]" />
              <span className="w-1 bg-pink-600 rounded-full h-2/3 animate-[pulse_0.4s_ease-in-out_infinite]" />
              <span className="w-1 bg-pink-600 rounded-full h-full animate-[pulse_0.8s_ease-in-out_infinite]" />
            </div>
            <span className="text-xs font-bold font-bubbly hidden sm:inline">Music ON</span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4" />
            <span className="text-xs font-semibold font-bubbly hidden sm:inline">Play Music</span>
          </>
        )}
      </button>
    </div>
  );
};

export default MusicControl;
