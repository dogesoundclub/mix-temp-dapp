import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { klaytn } from '@/app/blockchain/chains/klaytn';

import { mateContractAbi } from '@/app/blockchain/contracts/mateContractAbi';
import { mixContractAbi } from '@/app/blockchain/contracts/mixContractAbi';
import { mixStakingContractAbi } from '@/app/blockchain/contracts/mixStakingContractAbi';

import { publicClient } from '@/app/blockchain/client'

type address = `0x${string}`

type mixContract = {
  address: address;
  abi: typeof mixContractAbi;
  functionName?: string;
  args?: (string | bigint)[];
}

type mateContract = {
  address: address;
  abi: typeof mateContractAbi;
  functionName?: string;
  args?: (string | bigint)[];
};

type mixStakingContract = {
  address: address;
  abi: typeof mixStakingContractAbi;
  functionName?: string;
  args?: (string | bigint)[];
};

const mixContract: mixContract = { 
  address: klaytn["contracts"]["mixContract"]["address"],
  abi: mixContractAbi
};

const mixStakingContract: mixStakingContract = {
  address: klaytn["contracts"]["mixStakingContract"]["address"],
  abi: mixStakingContractAbi
};

const mateContract: mateContract = {
  address: klaytn["contracts"]["mateContract"]["address"],
  abi: mateContractAbi
};

const eMateContract: mateContract = {
  address: klaytn["contracts"]["eMateContract"]["address"],
  abi: mateContractAbi
};

const biasContract: mateContract = {
  address: klaytn["contracts"]["biasContract"]["address"],
  abi: mateContractAbi
};

function processWalletAddress(walletAddress: string | null): address | null {
  if (walletAddress === null || !/^0x[a-fA-F0-9]+$/i.test(walletAddress)) {
    console.error("Invalid wallet address. Address must start with '0x' and must not be null.");
    return null; // Early return if the address is null or does not meet the format
  }

  const validAddress: address = walletAddress as address;
  
  return validAddress;
}

export async function GET(req: NextRequest, res: NextResponse) {
// export async function GET(req: any) {
  const url = new URL(req.url);

  // Use offset and count instead of page
  const offset = parseInt(url.searchParams.get('offset') || '0');
  const count = parseInt(url.searchParams.get('count') || '10'); // Default count to 10 if not specified

  const walletAddress = processWalletAddress(url.searchParams.get('walletAddress'));

  if (walletAddress === null) {
    return NextResponse.json({
      statusCode: 400,
      message: 'Missing or invalid wallet address'
    });
  }

  const balanceOfMix = await balanceOf(mixContract["address"], walletAddress);
  const balanceOfMate = await balanceOf(mateContract["address"], walletAddress);
  const balanceOfeMate = await balanceOf(eMateContract["address"], walletAddress);
  const balanceOfBias = await balanceOf(biasContract["address"], walletAddress);

  console.log("Balance of Mate: ", balanceOfMate);
  const mateTokenIdIndexes: number[] = Array.from({ length: Number(balanceOfMate) }, (_, i) => i);
  const eMateTokenIdIndexes: number[] = Array.from({ length: Number(balanceOfeMate) }, (_, i) => i);
  const biasTokenIdIndexes: number[] = Array.from({ length: Number(balanceOfBias) }, (_, i) => i);

  console.log("Token ID Indexes: ", mateTokenIdIndexes);
  const mateContractCalls: any[] = mateTokenIdIndexes.map(tokenIdIndex => (
    {
      ...mateContract,
      functionName: 'tokenOfOwnerByIndex',
      args: [walletAddress, tokenIdIndex]
    }
  ));

  const eMateContractCalls: any[] = eMateTokenIdIndexes.map(tokenIdIndex => (
    {
      ...eMateContract,
      functionName: 'tokenOfOwnerByIndex',
      args: [walletAddress, tokenIdIndex]
    }
  ));

  const biasContractCalls: any[] = biasTokenIdIndexes.map(tokenIdIndex => (
    {
      ...biasContract,
      functionName: 'tokenOfOwnerByIndex',
      args: [walletAddress, tokenIdIndex]
    }
  ));

  const contractCalls = mateContractCalls.concat(eMateContractCalls).concat(biasContractCalls);

  function replacer(key, value) {
    if (typeof value === 'bigint') {
      return value.toString(); // BigInt를 문자열로 변환
    }
    return value; // 기타 모든 값은 변환하지 않음
  }

  let results: any[] = []; // Define the type for results if possible

  try {
    const batchCalls = contractCalls;
    console.log("Batch Calls: ", batchCalls);
    const batchResults = await publicClient.multicall({
      contracts: batchCalls,
      allowFailure: true  // Continue even if some calls fail
    });

    results = results.concat(batchResults);
    console.log("Results: ", results);
    const holdingMateTokenIds = results.slice(0, mateTokenIdIndexes.length).map(result => result.status === 'success' ? result.result : null);
    const holdingeMateTokenIds = results.slice(mateTokenIdIndexes.length, mateTokenIdIndexes.length + eMateTokenIdIndexes.length).map(result => result.status === 'success' ? result.result : null);
    const holdingBiasTokenIds = results.slice(mateTokenIdIndexes.length + eMateTokenIdIndexes.length).map(result => result.status === 'success' ? result.result : null);

    const jsonResponse = JSON.stringify({
      statusCode: 200,
      data: { walletAddress, balanceOfMix, balanceOfMate, holdingMateTokenIds, balanceOfeMate, holdingeMateTokenIds, balanceOfBias, holdingBiasTokenIds },
      message: "200 OK"
    }, replacer);

    return NextResponse.json(JSON.parse(jsonResponse)); // 문자열을 다시 객체로 변환하여 응답 생성
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      statusCode: 500,
      message: error.message
    });
  }
}

async function balanceOf(nftContractAddress: `0x${string}`, walletAddress: `0x${string}`): Promise<number> {
  const data: number = Number(await publicClient.readContract({
    address: nftContractAddress,
    abi: mateContractAbi,
    functionName: 'balanceOf',
    args: [walletAddress]
  }))
  return data
}

// // 모의 URL 생성
// const requestUrl = 'https://example.com/api?walletAddress=0x92D8510650173e4F341D872Edcbdc15bc50BA81E&offset=0&count=10';

// const req = {
//   url: requestUrl
// }

// // GET 함수 호출 예제 (실제 환경에서는 NextRequest 객체를 사용)
// const result = await GET(req);
// const responseData = await result.json();
// console.log(responseData);
