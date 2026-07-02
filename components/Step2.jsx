'use client';
import { useState } from 'react';

// Time slots from 17:00 to 20:30, every 30 minutes
const TIME_SLOTS = [
   '17:30',
  '18:00', '18:30',
  '19:00', '19:30',
  '20:00'
];

const HOURS   = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

function formatDisplay(time) {
  if (!time) return '';
  const [h, m] = time.split(':');
  const hNum   = parseInt(h);
  const suffix = hNum >= 12 ? 'PM' : 'AM';
  const h12    = hNum === 0 ? 12 : hNum > 12 ? hNum - 12 : hNum;
  return `${h12}:${m} ${suffix}`;
}

export default function Step2({ onConfirm, selectedDay }) {
  const [selected,    setSelected]    = useState('');
  const [manualHour,  setManualHour]  = useState('18');
  const [manualMin,   setManualMin]   = useState('00');
  const [useManual,   setUseManual]   = useState(false);
  const [loading,     setLoading]     = useState(false);

  const manualTime  = `${manualHour}:${manualMin}`;
  const effectiveTime = useManual ? manualTime : selected;

  const handleSlot = (slot) => {
    setSelected(slot);
    setUseManual(false);
    const [h, m] = slot.split(':');
    setManualHour(h);
    setManualMin(m);
  };

  const handleManualChange = (h, m) => {
    setManualHour(h);
    setManualMin(m);
    setSelected('');
    setUseManual(true);
  };

  const handleConfirm = async () => {
    if (!effectiveTime) return;
    setLoading(true);
    try {
      const res  = await fetch('/api/schedule', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ selectedDay, selectedTime: effectiveTime }),
      });
      const data = await res.json();
      if (data.success) {
        onConfirm(effectiveTime, data.appointment.pickupTime);
        return;
      }
    } catch (err) {
      console.error('Failed to save:', err);
    }
    // fallback: calculate locally
    const [h, m] = effectiveTime.split(':').map(Number);
    const total  = h * 60 + m - 15;
    const ph     = Math.floor(total / 60);
    const pm     = total % 60;
    onConfirm(effectiveTime, `${String(ph).padStart(2,'0')}:${String(pm).padStart(2,'0')}`);
    setLoading(false);
  };

  return (
    <div className="screen">
      <img
        src="/Capoo2.gif"
        alt="Capoo vui mừng"
        className="capoo-gif"
        style={{ width: 160, height: 160 }}
      />

      {/* Show selected day as a badge */}
      {selectedDay && (
        <div className="day-badge">📅 {selectedDay}</div>
      )}

      <p className="question-text">
        Hè hè, anh biết em sẽ đồng ý mà :3333
        <span style={{ display: 'block', fontSize: '1rem', fontWeight: 500, marginTop: 4 }}>
          Vậy em muốn mấy giờ đây :333?
        </span>
      </p>

      <div className="time-section">
        <div className="time-label">⏰ Chọn khung giờ</div>
        <div className="time-slots-grid">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              className={`time-slot ${selected === slot && !useManual ? 'selected' : ''}`}
              onClick={() => handleSlot(slot)}
            >
              {slot}
            </button>
          ))}
        </div>

        <div className="divider">hoặc nhập tay</div>

        <div className={`manual-time-wrap ${useManual ? 'manual-time-wrap--active' : ''}`}>
          <label>🕐 Giờ cụ thể:</label>
          <div className="time-selects">
            <select
              className="time-select"
              value={manualHour}
              onChange={(e) => handleManualChange(e.target.value, manualMin)}
            >
              {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
            <span className="time-colon">:</span>
            <select
              className="time-select"
              value={manualMin}
              onChange={(e) => handleManualChange(manualHour, e.target.value)}
            >
              {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <span className="time-ampm">
              {parseInt(manualHour) >= 12 ? 'PM' : 'AM'}
            </span>
            <button
              className="btn-use-manual"
              onClick={() => handleManualChange(manualHour, manualMin)}
            >
              Dùng giờ này
            </button>
          </div>
        </div>

        {effectiveTime && (
          <div className="selected-preview">
            ✨ Đã chọn: <strong>{formatDisplay(effectiveTime)}</strong>
          </div>
        )}
      </div>

      <button
        className="btn-confirm"
        onClick={handleConfirm}
        disabled={!effectiveTime || loading}
      >
        {loading ? 'Đang lưu...' : 'Chọn khung giờ này 💜'}
      </button>
    </div>
  );
}
