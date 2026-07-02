import { Suspense } from 'react';

export const metadata = {
  title: 'Admin - Lịch hẹn 💜',
};

export default function AdminLayout({ children }) {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#9b59d0' }}>
        Đang tải...
      </div>
    }>
      {children}
    </Suspense>
  );
}
