'use client';
import { useState, useRef, useEffect } from 'react';
import Confetti from '@/components/Confetti';
import Step1 from '@/components/Step1';
import Step2 from '@/components/Step2';
import Step3 from '@/components/Step3';

export default function Home() {
  const [step, setStep]                 = useState(1);
  const [selectedDay, setSelectedDay]   = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [pickupTime, setPickupTime]     = useState('');
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const audioRef = useRef(null);

  const handleYes = (day) => {
    setSelectedDay(day);
    setConfettiTrigger(t => t + 1);
    setTimeout(() => setStep(2), 300);
  };

  const handleConfirm = (time, pickup) => {
    setSelectedTime(time);
    setPickupTime(pickup);
    setConfettiTrigger(t => t + 1);
    setTimeout(() => setStep(3), 400);
  };

  // Play music on first interaction
  useEffect(() => {
    const tryPlay = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.35;
        audioRef.current.play().catch(() => {});
      }
      document.removeEventListener('click', tryPlay);
      document.removeEventListener('touchstart', tryPlay);
    };
    document.addEventListener('click', tryPlay);
    document.addEventListener('touchstart', tryPlay);
    return () => {
      document.removeEventListener('click', tryPlay);
      document.removeEventListener('touchstart', tryPlay);
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src="/pulsebox-lofi-melody-522894.mp3"
        loop
        preload="auto"
        style={{ display: 'none' }}
      />

      {/* Decorative background dots */}
      <div className="bg-dots" aria-hidden="true">
        {[
          { size: 320, top: -80,  left: -80,  delay: 0,   duration: 7 },
          { size: 200, top: 60,   right: -60, delay: 1.5, duration: 9 },
          { size: 150, bottom: 40, left: 20,  delay: 0.8, duration: 6 },
          { size: 100, bottom: -30, right: 30, delay: 2,  duration: 8 },
        ].map((dot, i) => (
          <div
            key={i}
            className="bg-dot"
            style={{
              width: dot.size,
              height: dot.size,
              top: dot.top,
              left: dot.left,
              right: dot.right,
              bottom: dot.bottom,
              animationDuration: `${dot.duration}s`,
              animationDelay: `${dot.delay}s`,
            }}
          />
        ))}
      </div>

      {step === 1 && <Confetti trigger={confettiTrigger} />}

      <main className="main-card" style={{ position: 'relative', zIndex: 1 }}>
        {step === 1 && <Step1 onYes={handleYes} audioRef={audioRef} />}
        {step === 2 && <Step2 onConfirm={handleConfirm} selectedDay={selectedDay} />}
        {step === 3 && (
          <Step3
            selectedDay={selectedDay}
            selectedTime={selectedTime}
            pickupTime={pickupTime}
          />
        )}
      </main>
    </>
  );
}
