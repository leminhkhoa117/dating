import { Nunito } from 'next/font/google';
import './globals.css';

const nunito = Nunito({
  subsets: ['vietnamese', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-nunito',
});

export const metadata = {
  title: 'Một buổi cà phê 💜',
  description: 'Anh muốn mời em một buổi cà phê nhỏ...',
  icons: {
    icon: '/Capoo1.gif',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={nunito.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
