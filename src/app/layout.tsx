import type { Metadata } from 'next';
import { Inter, Playfair_Display, Geist_Mono } from 'next/font/google';
import './globals.css';
import ClientShell from '@/components/layout/ClientShell';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ),
  title: {
    default: 'Dáng Ý',
    template: '%s • Dáng Ý',
  },
  description:
    'Dáng Ý — thời trang & phụ kiện cao cấp, tinh tuyển trong từng chi tiết.',
  openGraph: {
    type: 'website',
    siteName: 'Dáng Ý',
    title: 'Dáng Ý',
    description:
      'Thời trang & phụ kiện cao cấp, tinh tuyển trong từng chi tiết.',
    images: ['/images/products/nhan-kim-cuong.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dáng Ý',
    description:
      'Thời trang & phụ kiện cao cấp, tinh tuyển trong từng chi tiết.',
    images: ['/images/products/nhan-kim-cuong.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${playfair.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
