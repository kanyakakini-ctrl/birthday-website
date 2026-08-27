// Web Audio API Synthesizer & Sound Effects

class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmOscillators = [];
    this.isPlayingBgm = false;
    this.bgmTimer = null;
    this.audioElement = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Keypad click sound
  playClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {
      console.debug('Sound error:', e);
    }
  }

  // Error buzz sound for wrong PIN
  playError() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(120, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {
      console.debug('Sound error:', e);
    }
  }

  // Magical success chime (ascending arpeggio)
  playSuccess() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + index * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch (e) {
      console.debug('Sound error:', e);
    }
  }

  // Pop / Confetti sound
  playPop() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {
      console.debug('Sound error:', e);
    }
  }

  // Gift open celebration fanfare
  playGiftUnwrap() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + idx * 0.07;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.005, start + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.4);
      });
    } catch (e) {
      console.debug('Sound error:', e);
    }
  }

  // Toggle Background Music
  toggleMusic(audioUrl, onStateChange) {
    this.initContext();
    if (this.isPlayingBgm) {
      this.stopMusic();
      if (onStateChange) onStateChange(false);
      return false;
    } else {
      this.startMusic(audioUrl, onStateChange);
      if (onStateChange) onStateChange(true);
      return true;
    }
  }

  startMusic(audioUrl, onStateChange) {
    if (this.isPlayingBgm) return;
    this.initContext();

    // Directly start the synthesized music box instead of relying on MP3 fallback
    this.startSynthesizedBgm();
    this.isPlayingBgm = true;
    if (onStateChange) onStateChange(true);
  }

  // Beautiful Polyphonic Birthday Music Box
  startSynthesizedBgm() {
    // Frequencies for notes
    const G4 = 392.00, A4 = 440.00, B4 = 493.88, C5 = 523.25;
    const D5 = 587.33, E5 = 659.25, F5 = 698.46, Fs5 = 739.99, G5 = 783.99;
    const C4 = 261.63, E4 = 329.63, F4 = 349.23;

    // Melody and chords for "Happy Birthday"
    // Format: { notes: [frequencies], duration: seconds }
    const song = [
      { notes: [G4], d: 0.35 }, { notes: [G4], d: 0.25 },
      { notes: [A4, C4, E4], d: 0.6 }, { notes: [G4], d: 0.6 },
      { notes: [C5, E4, G4], d: 0.6 }, { notes: [B4, D5, G4], d: 1.0 },

      { notes: [G4], d: 0.35 }, { notes: [G4], d: 0.25 },
      { notes: [A4, D5, Fs5], d: 0.6 }, { notes: [G4], d: 0.6 },
      { notes: [D5, F4, G4], d: 0.6 }, { notes: [C5, E4, G4], d: 1.0 },

      { notes: [G4], d: 0.35 }, { notes: [G4], d: 0.25 },
      { notes: [G5, C4, E4], d: 0.6 }, { notes: [E5], d: 0.6 },
      { notes: [C5, F4, A4], d: 0.6 }, { notes: [B4], d: 0.6 }, { notes: [A4], d: 0.8 },

      { notes: [F5], d: 0.35 }, { notes: [F5], d: 0.25 },
      { notes: [E5, C4, E4], d: 0.6 }, { notes: [C5], d: 0.6 },
      { notes: [D5, G4, B4], d: 0.6 }, { notes: [C5, C4, E4, G4], d: 1.2 },
    ];

    let noteIdx = 0;
    const playNextNote = () => {
      if (!this.isPlayingBgm || !this.ctx) return;
      const beat = song[noteIdx];
      
      beat.notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Melody note gets slightly different timbre and louder volume
        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const vol = i === 0 ? 0.5 : 0.2; // Boosted volume
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + beat.d * 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + beat.d * 1.5);
      });

      noteIdx = (noteIdx + 1) % song.length;
      // Add a slight pause at the end of the song before looping
      const delay = noteIdx === 0 ? 2000 : beat.d * 1000 + 50;
      this.bgmTimer = setTimeout(playNextNote, delay);
    };

    playNextNote();
  }

  stopMusic() {
    this.isPlayingBgm = false;
    if (this.audioElement) {
      this.audioElement.pause();
    }
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const sounds = new SoundManager();
export default sounds;
