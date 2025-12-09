import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, image, attributes, nftType } = body;

    if (!name || !image) {
      return NextResponse.json({ error: 'Name and image are required' }, { status: 400 });
    }

    // Create NFT metadata following OpenSea standard
    const metadata = {
      name,
      description: description || '',
      image, // IPFS hash or URL
      attributes: attributes || [
        {
          trait_type: 'Type',
          value: nftType || 'achievement',
        },
        {
          trait_type: 'Created',
          value: new Date().toISOString(),
        },
      ],
    };

    // Upload metadata to Pinata
    const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    const metadataFile = new File([metadataBlob], 'metadata.json', { type: 'application/json' });

    const pinataFormData = new FormData();
    pinataFormData.append('file', metadataFile);

    const pinataMetadata = JSON.stringify({
      name: `${name}-metadata.json`,
      keyvalues: {
        type: 'nft-metadata',
        uploadedAt: new Date().toISOString(),
      }
    });
    pinataFormData.append('pinataMetadata', pinataMetadata);

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
      return NextResponse.json({ error: 'Failed to upload metadata to IPFS' }, { status: 500 });
    }

    const data = await res.json();
    const metadataHash = data.IpfsHash;

    return NextResponse.json({ 
      metadataURI: `ipfs://${metadataHash}`,
      metadataUrl: `https://gateway.pinata.cloud/ipfs/${metadataHash}`,
      metadata,
    });
  } catch (error) {
    console.error('Metadata creation error:', error);
    return NextResponse.json({ error: 'Failed to create metadata' }, { status: 500 });
  }
}
