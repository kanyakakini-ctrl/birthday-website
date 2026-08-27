import React from 'react';
import { Settings } from 'lucide-react';
import ConfettiCanvas from './ConfettiCanvas';
import MusicControl from './MusicControl';

export const MobileContainer = ({ children, audioUrl, onAdminClick }) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 overflow-x-hidden">
      {/* Background Ambient Particles & Confetti */}
      <ConfettiCanvas />

      {/* Floating Music Control */}
      <MusicControl audioUrl={audioUrl} />

      {/* Subtle Admin Link (Bottom-Right or Top-Left) */}
      <button
        onClick={onAdminClick}
        title="Admin Settings (Customize Text & Photos)"
        className="fixed bottom-3 right-3 z-40 p-2 rounded-full bg-white/70 backdrop-blur-md text-pastel-purple hover:text-pastel-purpleDark hover:bg-white transition-all shadow-sm opacity-50 hover:opacity-100"
      >
        <Settings className="w-4 h-4" />
      </button>

      {/* Main Experience Container */}
      <main className="w-full max-w-md sm:max-w-lg min-h-screen sm:min-h-[720px] sm:my-auto flex flex-col justify-between relative z-10 sm:rounded-[36px] bg-[#FAF5FF] sm:shadow-cute-lg border-0 sm:border-[5px] sm:border-[#EDE7F6] overflow-hidden">
        {/* Top Decorative Header Wave on Desktop */}
        <div className="w-full h-3 bg-gradient-to-r from-[#F48FB1] via-[#B39DDB] to-[#FFE082] opacity-80" />

        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
          {children}
        </div>

        {/* Bottom Decorative Footer on Desktop */}
        <div className="w-full py-2 bg-[#F3E8FF]/60 text-center border-t border-purple-100/50">
          <p className="text-[11px] text-pastel-textMuted font-medium flex items-center justify-center gap-1">
            Made with <span className="text-pink-500 animate-pulse">💖</span> for a magical birthday
          </p>
        </div>
      </main>
    </div>
  );
};

export default MobileContainer;
