import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';

type SoundType = 'pop' | 'success' | 'remove' | 'toggle' | 'celebrate';

interface SoundContextType {
  playSound: (type: SoundType) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export const useSounds = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSounds must be used within SoundProvider');
  }
  return context;
};

// Vibration patterns for different actions (in milliseconds)
const vibrationPatterns: Record<SoundType, number | number[]> = {
  pop: 15,           // Short tap
  toggle: 10,        // Very short tap
  remove: [10, 30, 10], // Double tap
  success: [15, 50, 25], // Rising pattern
  celebrate: [20, 40, 20, 40, 50, 40, 80], // Celebration pattern!
};

const vibrate = (type: SoundType) => {
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate(vibrationPatterns[type]);
    }
  } catch (e) {
    // Silently fail if vibration not supported
  }
};

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('calculator-sounds-muted') === 'true';
  });
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newValue = !prev;
      localStorage.setItem('calculator-sounds-muted', String(newValue));
      return newValue;
    });
  }, []);

  const playSound = useCallback((type: SoundType) => {
    // Always vibrate on mobile (even if sound is muted)
    vibrate(type);
    
    if (isMuted) return;
    
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      switch (type) {
        case 'pop': {
          // Satisfying pop sound for adding items
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
          osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
          
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          
          osc.start(now);
          osc.stop(now + 0.15);
          break;
        }
        
        case 'toggle': {
          // Subtle click for toggles
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);
          
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
          
          osc.start(now);
          osc.stop(now + 0.1);
          break;
        }
        
        case 'remove': {
          // Soft whoosh for removing
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);
          
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
          
          osc.start(now);
          osc.stop(now + 0.15);
          break;
        }
        
        case 'success': {
          // Pleasant success chime for adding rooms
          const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
          
          notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.08);
            
            gain.gain.setValueAtTime(0, now + i * 0.08);
            gain.gain.linearRampToValueAtTime(0.1, now + i * 0.08 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.2);
            
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.25);
          });
          break;
        }
        
        case 'celebrate': {
          // Epic celebration sound for PDF export! 🎉
          
          // Layer 1: Rising arpeggio
          const arpeggioNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
          arpeggioNotes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.06);
            
            gain.gain.setValueAtTime(0, now + i * 0.06);
            gain.gain.linearRampToValueAtTime(0.12, now + i * 0.06 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.06 + 0.4);
            
            osc.start(now + i * 0.06);
            osc.stop(now + i * 0.06 + 0.5);
          });
          
          // Layer 2: Sparkle highs
          const sparkles = [2093, 2349, 2637, 2793, 3136];
          sparkles.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + 0.3 + i * 0.05);
            
            gain.gain.setValueAtTime(0, now + 0.3 + i * 0.05);
            gain.gain.linearRampToValueAtTime(0.05, now + 0.3 + i * 0.05 + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3 + i * 0.05 + 0.3);
            
            osc.start(now + 0.3 + i * 0.05);
            osc.stop(now + 0.3 + i * 0.05 + 0.35);
          });
          
          // Layer 3: Triumphant chord
          const chordNotes = [261.63, 329.63, 392.00, 523.25];
          chordNotes.forEach((freq) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + 0.5);
            
            gain.gain.setValueAtTime(0, now + 0.5);
            gain.gain.linearRampToValueAtTime(0.06, now + 0.55);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
            
            osc.start(now + 0.5);
            osc.stop(now + 1.3);
          });
          break;
        }
      }
    } catch (e) {
      console.debug('Audio not available:', e);
    }
  }, [isMuted, getAudioContext]);

  return (
    <SoundContext.Provider value={{ playSound, isMuted, toggleMute }}>
      {children}
    </SoundContext.Provider>
  );
};
