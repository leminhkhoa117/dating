'use client';
import { useRef } from 'react';
import Confetti from './Confetti';

function formatDisplay(time) {
  if (!time) return '';
  const [h, m] = time.split(':');
  const hNum   = parseInt(h);
  const suffix = hNum >= 12 ? 'PM' : 'AM';
  const h12    = hNum === 0 ? 12 : hNum > 12 ? hNum - 12 : hNum;
  return `${h12} giờ ${m} phút ${suffix}`;
}

const CELEBRATE_EMOJIS = ['💜', '🌸', '☕', '🌟'];

export default function Step3({ selectedDay, selectedTime, pickupTime }) {
  const triggerRef = useRef(1);

  return (
    <>
      <Confetti trigger={triggerRef.current} />
      <div className="screen">
        <img
          src="/Capoo3.gif"
          alt="Capoo ăn mừng"
          className="capoo-gif"
          style={{ width: 155, height: 155 }}
        />

        <div className="confirm-card">
          <p className="confirm-text">
            Rõ rồi! <strong>{selectedDay}</strong> anh sẽ qua đón<br />
            <strong>người đẹp</strong> vào lúc
          </p>
          <div className="confirm-time">
            ⏰ {formatDisplay(pickupTime)}
          </div>
          <p className="confirm-sub">
            (trước {formatDisplay(selectedTime)} nhé 💜)
          </p>
        </div>

        <p className="closing-text">
          ✨ Hẹn gặp em {selectedDay} nho!<br />
          Chắc chắn anh sẽ qua đúng giờ, không như mấy lần trước nữa!
        </p>

        <div className="emoji-row">
          {CELEBRATE_EMOJIS.map((c, i) => (
            <span
              key={i}
              style={{
                animation: `gentleFloat ${1.8 + i * 0.3}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
                display: 'inline-block',
                fontSize: '1.6rem',
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
