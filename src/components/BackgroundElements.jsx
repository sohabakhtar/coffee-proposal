import React from 'react';

// 8 Distinct Animated Teddy Bears with varied movements, sizes, and starting positions
const TEDDY_BEARS = [
  { id: 1, top: '8%', left: '10%', size: '2.5rem', anim: 'teddy-bob-vertical', duration: '5.5s', delay: '0s', rotate: '-5deg' },
  { id: 2, top: '15%', right: '12%', size: '3.0rem', anim: 'teddy-drift-horizontal', duration: '7.2s', delay: '1.2s', rotate: '8deg' },
  { id: 3, top: '65%', left: '8%', size: '2.8rem', anim: 'teddy-rotate-float', duration: '8.5s', delay: '0.5s', rotate: '12deg' },
  { id: 4, top: '72%', right: '10%', size: '3.2rem', anim: 'teddy-bob-sway', duration: '6.8s', delay: '2.0s', rotate: '-10deg' },
  { id: 5, top: '28%', left: '22%', size: '2.2rem', anim: 'teddy-diagonal-float', duration: '9.0s', delay: '1.5s', rotate: '6deg' },
  { id: 6, top: '35%', right: '20%', size: '2.6rem', anim: 'teddy-slow-glide', duration: '8.0s', delay: '2.8s', rotate: '-7deg' },
  { id: 7, bottom: '8%', left: '32%', size: '2.4rem', anim: 'teddy-bounce-gentle', duration: '6.2s', delay: '0.8s', rotate: '15deg' },
  { id: 8, top: '82%', right: '35%', size: '2.7rem', anim: 'teddy-float-wobble', duration: '7.8s', delay: '3.2s', rotate: '-12deg' },
];

// 18 Floating Hearts with varied speeds, sizes, and paths
const HEARTS = [
  { id: 1, char: '❤️', left: '6%', bottom: '-10%', size: '1.4rem', duration: '9s', delay: '0s', sway: 'sway-left' },
  { id: 2, char: '💖', left: '18%', bottom: '-10%', size: '1.1rem', duration: '12s', delay: '2.5s', sway: 'sway-right' },
  { id: 3, char: '💕', left: '28%', bottom: '-10%', size: '1.6rem', duration: '8.5s', delay: '1s', sway: 'sway-left' },
  { id: 4, char: '❤️', left: '42%', bottom: '-10%', size: '1.2rem', duration: '14s', delay: '4s', sway: 'sway-right' },
  { id: 5, char: '💗', left: '55%', bottom: '-10%', size: '1.5rem', duration: '10s', delay: '0.5s', sway: 'sway-left' },
  { id: 6, char: '❤️', left: '68%', bottom: '-10%', size: '1.3rem', duration: '11.5s', delay: '3s', sway: 'sway-right' },
  { id: 7, char: '💖', left: '80%', bottom: '-10%', size: '1.7rem', duration: '9.5s', delay: '1.8s', sway: 'sway-left' },
  { id: 8, char: '💕', left: '92%', bottom: '-10%', size: '1.2rem', duration: '13s', delay: '5s', sway: 'sway-right' },
  { id: 9, char: '❤️', left: '12%', bottom: '-10%', size: '1.5rem', duration: '10.5s', delay: '6s', sway: 'sway-right' },
  { id: 10, char: '💗', left: '24%', bottom: '-10%', size: '1.3rem', duration: '8s', delay: '4.5s', sway: 'sway-left' },
  { id: 11, char: '❤️', left: '38%', bottom: '-10%', size: '1.6rem', duration: '11s', delay: '7s', sway: 'sway-right' },
  { id: 12, char: '💖', left: '50%', bottom: '-10%', size: '1.2rem', duration: '13.5s', delay: '2s', sway: 'sway-left' },
  { id: 13, char: '💕', left: '62%', bottom: '-10%', size: '1.5rem', duration: '9s', delay: '5.5s', sway: 'sway-right' },
  { id: 14, char: '❤️', left: '74%', bottom: '-10%', size: '1.4rem', duration: '12.5s', delay: '3.8s', sway: 'sway-left' },
  { id: 15, char: '💗', left: '86%', bottom: '-10%', size: '1.7rem', duration: '10s', delay: '6.2s', sway: 'sway-right' },
  { id: 16, char: '❤️', left: '3%', bottom: '-10%', size: '1.1rem', duration: '15s', delay: '8s', sway: 'sway-left' },
  { id: 17, char: '💖', left: '48%', bottom: '-10%', size: '1.4rem', duration: '11s', delay: '9s', sway: 'sway-right' },
  { id: 18, char: '💕', left: '96%', bottom: '-10%', size: '1.3rem', duration: '10.5s', delay: '7.5s', sway: 'sway-left' },
];

// 14 Sparkles with different timing and glowing positions
const SPARKLES = [
  { id: 1, top: '12%', left: '16%', size: '1.3rem', duration: '3.2s', delay: '0s' },
  { id: 2, top: '22%', right: '18%', size: '1.6rem', duration: '4.1s', delay: '1.1s' },
  { id: 3, top: '48%', left: '7%', size: '1.2rem', duration: '3.5s', delay: '2.0s' },
  { id: 4, top: '56%', right: '8%', size: '1.5rem', duration: '4.8s', delay: '0.5s' },
  { id: 5, top: '78%', left: '20%', size: '1.4rem', duration: '3.0s', delay: '1.8s' },
  { id: 6, top: '85%', right: '22%', size: '1.7rem', duration: '4.4s', delay: '2.7s' },
  { id: 7, top: '18%', left: '45%', size: '1.1rem', duration: '3.8s', delay: '0.8s' },
  { id: 8, top: '88%', left: '52%', size: '1.5rem', duration: '4.2s', delay: '1.4s' },
  { id: 9, top: '38%', left: '14%', size: '1.3rem', duration: '3.6s', delay: '2.4s' },
  { id: 10, top: '42%', right: '15%', size: '1.4rem', duration: '4.0s', delay: '3.1s' },
  { id: 11, top: '5%', left: '70%', size: '1.2rem', duration: '3.4s', delay: '1.9s' },
  { id: 12, top: '92%', left: '10%', size: '1.6rem', duration: '4.5s', delay: '0.3s' },
  { id: 13, top: '68%', left: '45%', size: '1.3rem', duration: '3.9s', delay: '2.2s' },
  { id: 14, top: '15%', left: '88%', size: '1.5rem', duration: '4.3s', delay: '1.6s' },
];

export default function BackgroundElements() {
  return (
    <div className="romantic-background-elements" aria-hidden="true">
      {/* Warm atmospheric bokeh light orbs */}
      <div className="bokeh-orb orb-1" />
      <div className="bokeh-orb orb-2" />
      <div className="bokeh-orb orb-3" />
      <div className="bokeh-orb orb-4" />

      {/* Floating Animated Teddy Bears */}
      {TEDDY_BEARS.map((teddy) => (
        <div
          key={`teddy-${teddy.id}`}
          className={`teddy-item ${teddy.anim}`}
          style={{
            top: teddy.top,
            bottom: teddy.bottom,
            left: teddy.left,
            right: teddy.right,
            fontSize: teddy.size,
            animationDuration: teddy.duration,
            animationDelay: teddy.delay,
            transform: `rotate(${teddy.rotate})`,
          }}
        >
          🧸
        </div>
      ))}

      {/* Floating Animated Hearts */}
      {HEARTS.map((heart) => (
        <div
          key={`heart-${heart.id}`}
          className={`heart-item ${heart.sway}`}
          style={{
            left: heart.left,
            bottom: heart.bottom,
            fontSize: heart.size,
            animationDuration: heart.duration,
            animationDelay: heart.delay,
          }}
        >
          {heart.char}
        </div>
      ))}

      {/* Twinkling Glowing Sparkles */}
      {SPARKLES.map((sparkle) => (
        <div
          key={`sparkle-${sparkle.id}`}
          className="sparkle-item"
          style={{
            top: sparkle.top,
            left: sparkle.left,
            right: sparkle.right,
            fontSize: sparkle.size,
            animationDuration: sparkle.duration,
            animationDelay: sparkle.delay,
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
}
