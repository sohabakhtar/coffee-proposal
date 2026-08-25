import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import BackgroundElements from './components/BackgroundElements';

export default function App() {
  const [yesHovered, setYesHovered] = useState(false);
  const [noHovered, setNoHovered] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  
  // Track No button position: null = initial layout position, object = custom coordinates
  const [noPos, setNoPos] = useState(null);
  const [noRotation, setNoRotation] = useState(0);
  const [escapeCount, setEscapeCount] = useState(0);
  const [lastSector, setLastSector] = useState(-1);

  const audioRef = useRef(null);
  const yesButtonRef = useRef(null);
  const noButtonRef = useRef(null);
  const cardRef = useRef(null);

  // Play romantic music when Yes is clicked
  const playRomanticMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.85;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log('Audio autoplay prevented, initializing fallback audio context:', err);
          startWebAudioFallback();
        });
      }
    } else {
      startWebAudioFallback();
    }
  }, []);

  // Web Audio Fallback for romantic Bollywood piano melody
  const startWebAudioFallback = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Romantic piano synthesizer sequence (Tum Se Hi melody)
      const bpm = 82;
      const beat = 60 / bpm;
      const now = ctx.currentTime + 0.1;

      const notes = {
        'C2': 65.41, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00,
        'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
        'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
        'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
      };

      const chords = [
        { bass: 'C2', arp: ['C3', 'G3', 'B3', 'E4', 'G4', 'D5', 'G4', 'E4'] },
        { bass: 'A2', arp: ['A2', 'E3', 'A3', 'C4', 'E4', 'B4', 'C5', 'E4'] },
        { bass: 'F2', arp: ['F2', 'C3', 'A3', 'E4', 'A4', 'G5', 'E4', 'C4'] },
        { bass: 'G2', arp: ['G2', 'D3', 'G3', 'C4', 'D4', 'B4', 'G4', 'D4'] },
        { bass: 'E2', arp: ['E2', 'B2', 'G3', 'D4', 'G4', 'B4', 'G4', 'D4'] },
        { bass: 'A2', arp: ['A2', 'E3', 'C4', 'G4', 'C5', 'E5', 'C5', 'G4'] },
        { bass: 'D3', arp: ['D3', 'A3', 'F4', 'C5', 'E5', 'F5', 'E5', 'C5'] },
        { bass: 'G2', arp: ['G2', 'D3', 'B3', 'F4', 'G4', 'D5', 'B4', 'G4'] },
      ];

      const leadMelody = [
        { t: 0.0, n: 'E5', d: 1.5 }, { t: 1.5, n: 'D5', d: 0.5 }, { t: 2.0, n: 'C5', d: 2.0 },
        { t: 4.0, n: 'B4', d: 1.5 }, { t: 5.5, n: 'A4', d: 0.5 }, { t: 6.0, n: 'G4', d: 2.0 },
        { t: 8.0, n: 'A4', d: 1.0 }, { t: 9.0, n: 'C5', d: 1.0 }, { t: 10.0, n: 'E5', d: 2.0 },
        { t: 12.0, n: 'D5', d: 1.5 }, { t: 13.5, n: 'C5', d: 0.5 }, { t: 14.0, n: 'D5', d: 2.0 },
        { t: 16.0, n: 'G5', d: 2.0 }, { t: 18.0, n: 'E5', d: 1.5 }, { t: 19.5, n: 'D5', d: 0.5 },
        { t: 20.0, n: 'C5', d: 2.0 }, { t: 22.0, n: 'B4', d: 1.0 }, { t: 23.0, n: 'C5', d: 1.0 },
        { t: 24.0, n: 'D5', d: 2.0 }, { t: 26.0, n: 'C5', d: 1.5 }, { t: 27.5, n: 'B4', d: 0.5 },
        { t: 28.0, n: 'C5', d: 4.0 },
      ];

      const playPianoKey = (freq, startTime, duration, vol) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gainNode.gain.setValueAtTime(0.0001, startTime);
        gainNode.gain.exponentialRampToValueAtTime(vol, startTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration + 0.1);
      };

      // Loop progression
      const playLoop = (offsetTime) => {
        chords.forEach((chord, cIdx) => {
          const barStart = offsetTime + cIdx * 4 * beat;
          if (notes[chord.bass]) {
            playPianoKey(notes[chord.bass], barStart, beat * 3.5, 0.25);
          }
          chord.arp.forEach((noteName, sIdx) => {
            const noteStart = barStart + sIdx * 0.5 * beat;
            if (notes[noteName]) {
              playPianoKey(notes[noteName], noteStart, beat * 1.5, 0.18);
            }
          });
        });

        leadMelody.forEach(({ t, n, d }) => {
          if (notes[n]) {
            playPianoKey(notes[n], offsetTime + t * beat, d * beat + 0.4, 0.35);
          }
        });
      };

      playLoop(now);
      // schedule next loop
      const totalLen = chords.length * 4 * beat;
      setInterval(() => {
        playLoop(ctx.currentTime + 0.1);
      }, totalLen * 1000);

    } catch (e) {
      console.warn('Web Audio playback error:', e);
    }
  };

  // Trigger celebration hearts
  const triggerCelebration = () => {
    // Canvas Confetti Heart Shower
    const heartColors = ['#ff4d6d', '#ff758f', '#ff85a1', '#f72585', '#ffb3c1', '#ffffff'];
    
    // Initial burst
    confetti({
      particleCount: 60,
      spread: 100,
      origin: { y: 0.6 },
      colors: heartColors,
      shapes: ['circle'],
      scalar: 1.2,
      ticks: 200,
    });

    // Continuous floating heart rain for 4 seconds
    const end = Date.now() + 3500;
    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: heartColors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: heartColors,
      });
    }, 150);
  };

  const handleYesClick = () => {
    setIsAccepted(true);
    playRomanticMusic();
    triggerCelebration();
  };

  // Safe Escape Algorithm for No button
  const escapeNoButton = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Dimensions & safe boundaries
    const btnWidth = 110;
    const btnHeight = 48;
    const pad = 24; // boundary padding from viewport edges

    const minX = pad;
    const maxX = Math.max(pad, vw - btnWidth - pad);
    const minY = pad;
    const maxY = Math.max(pad, vh - btnHeight - pad);

    // Card / Center bounding box to avoid
    let centerBox = {
      left: vw / 2 - 170,
      right: vw / 2 + 170,
      top: vh / 2 - 130,
      bottom: vh / 2 + 130,
    };

    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      centerBox = {
        left: rect.left - 30,
        right: rect.right + 30,
        top: rect.top - 20,
        bottom: rect.bottom + 20,
      };
    }

    // 6 Spatial sectors away from center to ensure varied, non-repeating escapes
    // 0: Top-Left, 1: Top-Right, 2: Bottom-Left, 3: Bottom-Right, 4: Far-Left, 5: Far-Right
    const availableSectors = [0, 1, 2, 3, 4, 5].filter((s) => s !== lastSector);
    const chosenSector = availableSectors[Math.floor(Math.random() * availableSectors.length)];
    setLastSector(chosenSector);

    let targetX = 0;
    let targetY = 0;
    const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    switch (chosenSector) {
      case 0: // Top-Left
        targetX = randomBetween(minX, Math.max(minX, Math.min(maxX, centerBox.left - btnWidth - 10)));
        targetY = randomBetween(minY, Math.max(minY, Math.min(maxY, vh * 0.35)));
        break;
      case 1: // Top-Right
        targetX = randomBetween(Math.max(minX, centerBox.right + 10), maxX);
        targetY = randomBetween(minY, Math.max(minY, Math.min(maxY, vh * 0.35)));
        break;
      case 2: // Bottom-Left
        targetX = randomBetween(minX, Math.max(minX, Math.min(maxX, centerBox.left - btnWidth - 10)));
        targetY = randomBetween(Math.max(minY, vh * 0.65), maxY);
        break;
      case 3: // Bottom-Right
        targetX = randomBetween(Math.max(minX, centerBox.right + 10), maxX);
        targetY = randomBetween(Math.max(minY, vh * 0.65), maxY);
        break;
      case 4: // Far-Left
        targetX = randomBetween(minX, Math.max(minX, Math.min(maxX, vw * 0.2)));
        targetY = randomBetween(minY, maxY);
        break;
      case 5: // Far-Right
      default:
        targetX = randomBetween(Math.max(minX, vw * 0.8 - btnWidth), maxX);
        targetY = randomBetween(minY, maxY);
        break;
    }

    // Safety fallback: ensure coordinates are strictly within viewport boundaries
    targetX = Math.max(minX, Math.min(maxX, targetX));
    targetY = Math.max(minY, Math.min(maxY, targetY));

    // Calculate a playful rotation (-14deg to +14deg)
    const randomRot = Math.floor(Math.random() * 28) - 14;

    setNoPos({ x: targetX, y: targetY });
    setNoRotation(randomRot);
    setEscapeCount((prev) => prev + 1);
  };

  // Re-calculate or clamp on window resize
  useEffect(() => {
    const handleResize = () => {
      if (noPos) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const btnWidth = 110;
        const btnHeight = 48;
        const pad = 24;

        setNoPos((prev) => {
          if (!prev) return null;
          return {
            x: Math.max(pad, Math.min(vw - btnWidth - pad, prev.x)),
            y: Math.max(pad, Math.min(vh - btnHeight - pad, prev.y)),
          };
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [noPos]);

  return (
    <div className="proposal-container">
      {/* Background Music Audio Element */}
      <audio
        ref={audioRef}
        src="/audio/romantic-instrumental.mp3"
        preload="auto"
        loop
      />

      {/* Floating Animated Background (Teddy Bears, Hearts, Sparkles) */}
      <BackgroundElements />

      {/* Main Content Area */}
      <main className="main-content">
        {!isAccepted ? (
          /* QUESTION CARD */
          <div className="romantic-card" ref={cardRef}>
            {/* EXACT Title */}
            <h1 className="question-title">☕ Coffee with me?</h1>

            {/* Buttons Area */}
            <div className="buttons-container">
              {/* YES BUTTON WRAPPER (Fixed Center) */}
              <div className="yes-button-wrapper">
                {/* Large pulsating heart tooltip on hover */}
                <div
                  className={`big-heart-popover ${yesHovered ? 'visible' : ''}`}
                  aria-hidden="true"
                >
                  <span className="big-heart-icon">❤️</span>
                </div>

                <button
                  ref={yesButtonRef}
                  id="yes-button"
                  className="btn btn-yes"
                  onMouseEnter={() => setYesHovered(true)}
                  onMouseLeave={() => setYesHovered(false)}
                  onTouchStart={() => setYesHovered(true)}
                  onTouchEnd={() => setYesHovered(false)}
                  onClick={handleYesClick}
                  aria-label="Yes, let's have coffee"
                >
                  Yes ❤️
                </button>
              </div>

              {/* INITIAL NO BUTTON PLACEHOLDER (When not yet escaped) */}
              {!noPos && (
                <div className="no-button-wrapper static-position">
                  <div
                    className={`sad-reaction-emoji ${noHovered ? 'visible' : ''}`}
                    aria-hidden="true"
                  >
                    🥺
                  </div>

                  <button
                    ref={noButtonRef}
                    id="no-button"
                    className={`btn btn-no ${noHovered ? 'shaking' : ''}`}
                    onMouseEnter={() => {
                      setNoHovered(true);
                      // Escape on attempt
                      escapeNoButton();
                    }}
                    onMouseLeave={() => setNoHovered(false)}
                    onTouchStart={(e) => {
                      setNoHovered(true);
                      escapeNoButton(e);
                    }}
                    onClick={(e) => escapeNoButton(e)}
                    aria-label="No"
                  >
                    No 🙈
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* SUCCESS STATE / FINAL SCREEN */
          <div className="romantic-card success-card">
            {/* Floating Soft Hearts & Celebratory Glow */}
            <div className="celebration-glow" aria-hidden="true" />
            
            <div className="success-content">
              <div className="cup-animation" aria-hidden="true">
                <span className="coffee-cup-icon">☕</span>
                <span className="love-steam">❤️</span>
              </div>

              {/* EXACT Romantic Note */}
              <blockquote className="romantic-note">
                “I don't know what tomorrow looks like,<br className="desktop-break" /> but I know who I want beside me. ❤️”
              </blockquote>
            </div>
          </div>
        )}
      </main>

      {/* FLOATING ESCAPED NO BUTTON (Fixed overlay so Yes is NEVER affected) */}
      {!isAccepted && noPos && (
        <div
          className="no-button-wrapper escaped-position"
          style={{
            transform: `translate3d(${noPos.x}px, ${noPos.y}px, 0px) rotate(${noRotation}deg)`,
          }}
        >
          {/* Sad reaction emoji 🥺 */}
          <div
            className={`sad-reaction-emoji ${noHovered ? 'visible' : ''}`}
            aria-hidden="true"
          >
            🥺
          </div>

          <button
            id="no-button-escaped"
            className={`btn btn-no ${noHovered ? 'shaking' : ''}`}
            onMouseEnter={() => {
              setNoHovered(true);
              escapeNoButton();
            }}
            onMouseLeave={() => setNoHovered(false)}
            onTouchStart={(e) => {
              setNoHovered(true);
              escapeNoButton(e);
            }}
            onClick={(e) => escapeNoButton(e)}
            aria-label="No"
          >
            No 🙈
          </button>
        </div>
      )}
    </div>
  );
}
