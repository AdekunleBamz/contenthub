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
        <link rel="manifest" href="/manifest.json" />
        <meta name="talentapp:project_verification" content="218e3a82a786ac8b5e1777f9afaccbf35db8262ee96d6d07a88f3a0cf25292d1fa4c1972d77678c9a7aecc45f5d9b69d100b5161f00889784f90fc9041085d0f" />
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
