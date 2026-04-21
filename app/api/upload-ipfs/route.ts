import { NextRequest, NextResponse } from 'next/server';
import { ALLOWED_MIME_TYPES } from '@/lib/constants';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.PINATA_JWT) {
      return NextResponse.json({ error: 'Upload service not configured' }, { status: 503 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const MAX_SIZE = 50 * 1024 * 1024; // 50 MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File exceeds 50 MB limit' }, { status: 413 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
      return NextResponse.json({ error: 'File type is not supported' }, { status: 415 });
    }

    // Upload to Pinata
    const pinataFormData = new FormData();
    pinataFormData.append('file', file);

    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        uploadedAt: new Date().toISOString(),
      }
    });
    pinataFormData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 1,
    });
    pinataFormData.append('pinataOptions', options);

    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PINATA_JWT}`,
      },
      body: pinataFormData,
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('Pinata error:', error);
      return NextResponse.json({ error: 'Failed to upload to IPFS' }, { status: 500 });
    }

    const data = await res.json();
    const ipfsHash = data.IpfsHash;

    return NextResponse.json({ 
      ipfsHash,
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
