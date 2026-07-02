'use client';
import { useState, useEffect } from 'react';

const HEART_CONFIG = [
  { emoji: '💜', left: '10%', delay: '0s',   duration: '2.4s', size: '0.9rem'  },
  { emoji: '💜', left: '25%', delay: '0.6s',  duration: '2.8s', size: '0.75rem' },
  { emoji: '✨', left: '42%', delay: '0.3s',  duration: '2.2s', size: '0.8rem'  },
  { emoji: '💜', left: '58%', delay: '1.0s',  duration: '3.0s', size: '1rem'    },
  { emoji: '✨', left: '72%', delay: '0.5s',  duration: '2.5s', size: '0.7rem'  },
  { emoji: '💜', left: '85%', delay: '1.2s',  duration: '2.6s', size: '0.85rem' },
  { emoji: '🌸', left: '18%', delay: '1.8s',  duration: '3.2s', size: '0.75rem' },
  { emoji: '💜', left: '65%', delay: '2.0s',  duration: '2.9s', size: '0.9rem'  },
];

const NO_TEXTS = [
  'Không',
  'Em chắc chứ?',
  'Đồng ý đi mò',
  'Suy nghĩ kỹ lại đi',
  'Đừng từ chối mò 🥺',
];

const YES_SIZES = [
  { fontSize: '1.05rem', padding: '15px 36px' },
  { fontSize: '1.22rem', padding: '17px 42px' },
  { fontSize: '1.42rem', padding: '20px 50px' },
  { fontSize: '1.65rem', padding: '22px 58px' },
  { fontSize: '1.9rem',  padding: '26px 66px' },
  { fontSize: '2.4rem',  padding: '30px 80px' },
];

const DAYS = ['Thứ 6', 'Thứ 7', 'Chủ nhật'];

export default function Step1({ onYes, audioRef }) {
  const [noCount, setNoCount]     = useState(0);
  const [noVisible, setNoVisible] = useState(true);
  const [mounted, setMounted]     = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [dayError, setDayError]   = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleNo = () => {
    const next = noCount + 1;
    if (next >= NO_TEXTS.length) setNoVisible(false);
    setNoCount(next);
  };

  const handleYes = () => {
    if (!selectedDay) {
      setDayError(true);
      setTimeout(() => setDayError(false), 1200);
      return;
    }
    if (audioRef?.current) {
      audioRef.current.volume = 0.35;
      audioRef.current.play().catch(() => {});
    }
    onYes(selectedDay);
  };

  const yesSize = YES_SIZES[Math.min(noCount, YES_SIZES.length - 1)];
  const noText  = NO_TEXTS[Math.min(noCount, NO_TEXTS.length - 1)];
  const isLast  = noCount >= NO_TEXTS.length - 1;

  return (
    <div className="screen">
      {/* GIF + hearts */}
      <div className="gif-area">
        {mounted && (
          <div className="floating-hearts" aria-hidden="true">
            {HEART_CONFIG.map((h, i) => (
              <span
                key={i}
                className="heart"
                style={{
                  left: h.left,
                  animationDuration: h.duration,
                  animationDelay: h.delay,
                  fontSize: h.size,
                }}
              >
                {h.emoji}
              </span>
            ))}
          </div>
        )}
        <img src="/Capoo1.gif" alt="Capoo dễ thương" className="capoo-gif" />
      </div>

      <p className="question-text">
        Hong biết bộ trưởng có thể hẹn người đẹp một buổi{' '}
        <span>☕ cuối tuần này</span> được hong nhỉ?
      </p>

      {/* Day selector */}
      <div className="day-selector">
        <p className={`day-label ${dayError ? 'day-label--error' : ''}`}>
          {dayError ? '⚠️ Em chọn ngày trước nha!' : '📅 Em rảnh ngày nào?'}
        </p>
        <div className="day-btn-row">
          {DAYS.map((day) => (
            <button
              key={day}
              className={`btn-day ${selectedDay === day ? 'btn-day--active' : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Yes / No */}
      <div className={`btn-row ${!noVisible ? 'btn-row--single' : ''}`}>
        <button
          className="btn-yes"
          onClick={handleYes}
          style={{
            fontSize: yesSize.fontSize,
            padding: yesSize.padding,
            transition: 'font-size 0.45s cubic-bezier(0.22,1,0.36,1), padding 0.45s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          Đồng ý 💜
        </button>

        {noVisible && (
          <button
            className={`btn-no ${isLast ? 'btn-no--warn' : ''}`}
            onClick={handleNo}
          >
            {noText}
          </button>
        )}
      </div>

      {noCount >= 2 && noVisible && (
        <p className="hint-text">(anh biết em sẽ đồng ý mà 🥺)</p>
      )}
    </div>
  );
}
