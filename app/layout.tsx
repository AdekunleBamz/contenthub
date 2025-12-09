import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "ContentHub - Community Content Platform",
  description: "Upload, share, and earn on Base and Celo",
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://contenthubs.vercel.app/og-image.svg',
    'fc:frame:button:1': 'Launch App',
    'fc:frame:button:1:action': 'launch_frame',
    'fc:frame:button:1:target': 'https://contenthubs.vercel.app',
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
