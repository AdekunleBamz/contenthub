import { NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { base, celo } from 'viem/chains';
import { CONTRACTS } from '@/lib/contracts';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chain = searchParams.get('chain') as 'base' | 'celo' | null;
  const id = searchParams.get('id');

  if (!chain || !id) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const client = createPublicClient({
      chain: chain === 'base' ? base : celo,
      transport: http(),
    });

    const contract = CONTRACTS[chain].communityContentHub;
    
    const content = await client.readContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'getContent',
      args: [BigInt(id)],
    } as any);

    return NextResponse.json({
      id: Number(content[0]),
      uploader: content[1],
      contentHash: content[2],
      contentType: content[3],
      metadata: content[4],
      timestamp: Number(content[5]),
      votes: Number(content[6]),
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}
