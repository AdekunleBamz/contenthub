import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  metadataBase: new URL('https://contenthubs.vercel.app'),
  title: "ContentHub - Community Content Platform",
  description: "Upload, share, and earn on Base and Celo",
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
  },
  openGraph: {
    title: 'ContentHub - Community Content Platform',
    description: 'Upload content, vote on favorites, and mint NFTs on Base and Celo',
    url: 'https://contenthubs.vercel.app',
    siteName: 'ContentHub',
    images: [
      {
        url: 'https://contenthubs.vercel.app/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ContentHub - Community Content Platform',
    description: 'Upload content, vote on favorites, and mint NFTs on Base and Celo',
    images: ['https://contenthubs.vercel.app/og-image.png'],
  },
  other: {
    'fc:miniapp': JSON.stringify({
      version: '1',
      imageUrl: 'https://contenthubs.vercel.app/og-image.png',
      button: {
        title: 'Launch App',
        action: {
          type: 'launch_frame',
          name: 'ContentHub',
          url: 'https://contenthubs.vercel.app',
          splashImageUrl: 'https://contenthubs.vercel.app/splash.svg',
          splashBackgroundColor: '#0a0a0a'
        }
      }
    }),
    'fc:frame': JSON.stringify({
      version: '1',
      imageUrl: 'https://contenthubs.vercel.app/og-image.png',
      button: {
        title: 'Launch App',
        action: {
          type: 'launch_frame',
          name: 'ContentHub',
          url: 'https://contenthubs.vercel.app',
          splashImageUrl: 'https://contenthubs.vercel.app/splash.svg',
          splashBackgroundColor: '#0a0a0a'
        }
      }
    })
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json?v=20260429173728" />
        <meta name="talentapp:project_verification" content="74fbe474308e18b4ce9c4849e648665507ce1b4e7f977fb0ddfc0bb1c0fef1bfea100158f2333f6d9966f7854c2ac8ab4d1935ebdb0a3b9737dd1ab8243d7b11" />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen pt-20">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
