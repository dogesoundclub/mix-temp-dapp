import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { klaytn } from '@/app/blockchain/chains/klaytn';

import { getContract } from 'viem'
import { mateContractAbi } from '@/app/blockchain/contracts/mateContractAbi'
import { publicClient, walletClient } from '@/app/blockchain/client'

const client = createPublicClient({ 
  chain: klaytn, 
  transport: http(klaytn.rpcUrls.default.http[0])
});

export async function GET(req: NextRequest, res: NextResponse) {
  console.log('Requested GET /api/erc721Balance')
  const url = new URL(req.url);

  // Use offset and count instead of page
  const offset = parseInt(url.searchParams.get('offset') || '0');
  const count = parseInt(url.searchParams.get('count') || '10'); // Default count to 10 if not specified

  const walletAddress = url.searchParams.get('walletAddress');
  if (!walletAddress) {
    return NextResponse.json({
      statusCode: 400,
      message: 'Missing wallet address'
    });
  }

//   const provider = new ethers.JsonRpcProvider('https://public-en-cypress.klaytn.net');
//   const contractAddress = '0xe47e90c58f8336a2f24bcd9bcb530e2e02e1e8ae';
//   const mateContract = new ethers.Contract(contractAddress, MateContractABI, provider);

  const mateContract = getContract({
    address: klaytn['contracts']['mateContract']['address'],
    abi: mateContractAbi,
    // 1a. Insert a single client
    client: publicClient,
  })

  try {
    const balance = await mateContract.balanceOf(walletAddress);
    const balanceNumber = Number(balance);

    const nftIds: string[] = [];

    // Start from the index based on the offset
    const start = offset;
    const end = Math.min(start + count, balanceNumber);

    for (let i = start; i < end; i++) {
      const id: string = await mateContract.tokenOfOwnerByIndex(walletAddress, i);
      nftIds.push(id.toString());
    }

    return NextResponse.json({
      statusCode: 200,
      data: { balanceNumber, nftIds },
      message: "200 OK"
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      statusCode: 500,
      message: error.message
    });
  }
}
