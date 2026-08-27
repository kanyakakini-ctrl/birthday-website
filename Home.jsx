import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import MobileContainer from '../components/MobileContainer';
import UnlockScreen from '../components/UnlockScreen';
import SurpriseScreen from '../components/SurpriseScreen';
import BirthdayScreen from '../components/BirthdayScreen';
import MemoryGallery from '../components/MemoryGallery';
import GiftSelection from '../components/GiftSelection';
import FinalMessage from '../components/FinalMessage';
import birthdayApi from '../services/birthdayApi';

export const Home = ({ onOpenAdmin }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load configuration from backend API or local cache
  useEffect(() => {
    async function loadConfig() {
      try {
        const data = await birthdayApi.getConfig();
        setConfig(data);
      } catch (err) {
        console.error('Failed to load birthday config:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadConfig();
  }, []);

  if (isLoading || !config) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#E8DEF8] text-pastel-purpleDark space-y-4">
        <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
        <p className="font-bubbly font-bold text-lg animate-pulse">
          ✨ Preparing your birthday surprise... ✨
        </p>
      </div>
    );
  }

  return (
    <MobileContainer
      audioUrl={config?.music?.audioUrl || '/music/birthday-song.mp3'}
      onAdminClick={onOpenAdmin}
    >
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <UnlockScreen
            key="step-1"
            config={config}
            onUnlock={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <SurpriseScreen
            key="step-2"
            config={config}
            onYes={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 3 && (
          <BirthdayScreen
            key="step-3"
            config={config}
            onNext={() => setCurrentStep(4)}
          />
        )}

        {currentStep === 4 && (
          <MemoryGallery
            key="step-4"
            config={config}
            onNext={() => setCurrentStep(5)}
          />
        )}

        {currentStep === 5 && (
          <GiftSelection
            key="step-5"
            config={config}
            onNext={() => setCurrentStep(6)}
          />
        )}

        {currentStep === 6 && (
          <FinalMessage
            key="step-6"
            config={config}
            onReplay={() => setCurrentStep(1)}
          />
        )}
      </AnimatePresence>
    </MobileContainer>
  );
};

export default Home;
