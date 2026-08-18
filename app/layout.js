import './globals.css';
import { AuthProvider } from '@/app/components/providers/AuthProvider';
import { ThemeProvider } from '@/app/components/providers/ThemeProvider';

export const metadata = {
  title: 'Exousia Fellowship Inc',
  description: 'Manage your partnership with Exousia Fellowship Incorporated',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/logopng.png', type: 'image/png' },
    ],
    apple: '/images/logopng.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/images/logopng.png" />
        <meta name="theme-color" content="#E51913" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}