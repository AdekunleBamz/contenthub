import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ContentHub - Community Content Platform';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 20,
          }}
        >
          ContentHub
        </div>
        <div
          style={{
            fontSize: 32,
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            maxWidth: 800,
          }}
        >
          Upload, Share & Earn on Base and Celo
        </div>
        <div
          style={{
            fontSize: 24,
            color: 'rgba(255,255,255,0.7)',
            marginTop: 30,
          }}
        >
          🎨 Content • 🗳️ Voting • 🏆 NFTs
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
