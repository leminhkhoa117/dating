'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminPage() {
  const searchParams = useSearchParams();
  const secret = searchParams.get('secret');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!secret) {
      setLoading(false);
      return;
    }

    fetch(`/api/schedule?secret=${secret}`)
      .then(res => res.json())
      .then(data => {
        if (data.appointments) {
          setAppointments(data.appointments);
          setAuthorized(true);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [secret]);

  if (loading) {
    return (
      <div className="admin-page" style={{ justifyContent: 'center', minHeight: '100vh' }}>
        <div className="loading-wrap">
          <span className="loading-dot" />
          <span>Đang tải...</span>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="admin-page" style={{ justifyContent: 'center', minHeight: '100vh' }}>
        <div className="admin-unauthorized">
          <span style={{ fontSize: '3rem' }}>🔒</span>
          <h2>Trang dành riêng cho chủ nhân 💜</h2>
          <p>Bạn cần truy cập đúng đường dẫn để xem lịch hẹn.</p>
          <p style={{ marginTop: 8, fontSize: '0.85rem', opacity: 0.6 }}>
            Ví dụ: <code>/admin?secret=your-secret</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📋</div>
        <h1 className="admin-title">
          Lịch hẹn của <span>người đặc biệt</span> 💜
        </h1>
        <p style={{ color: '#9b59d0', fontSize: '0.9rem', marginTop: 6 }}>
          {appointments.length > 0
            ? `Có ${appointments.length} lần chọn lịch`
            : 'Chưa có lịch hẹn nào'}
        </p>
      </div>

      <div className="admin-table-wrap">
        {appointments.length === 0 ? (
          <div className="admin-empty">
            <span style={{ fontSize: '2rem' }}>🥺</span>
            <p style={{ marginTop: 8 }}>Người ấy chưa chọn giờ nào cả...</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>📅 Ngày hẹn</th>
                <th>⏰ Giờ hẹn</th>
                <th>🚗 Giờ đón</th>
                <th>🕐 Thời gian chọn</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt, i) => (
                <tr key={apt._id}>
                  <td style={{ fontWeight: 600, color: '#9b59d0' }}>{i + 1}</td>
                  <td>
                    <span className="admin-badge" style={{ background: 'linear-gradient(135deg, #fce4ff, #e4d0fa)', color: '#7b3fad' }}>
                      {apt.selectedDay || '—'}
                    </span>
                  </td>
                  <td>
                    <span className="admin-badge">{apt.selectedTime}</span>
                  </td>
                  <td>
                    <span className="admin-badge" style={{
                      background: 'linear-gradient(135deg, #b06ee0, #7b3fad)',
                      color: 'white',
                    }}>
                      {apt.pickupTime}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                    {formatDate(apt.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p style={{ fontSize: '0.8rem', color: '#9b59d0', opacity: 0.5 }}>
        💜 Chỉ mình anh mới xem được trang này
      </p>
    </div>
  );
}
