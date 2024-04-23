import { defineChain } from '../config/defineChain'
import { parseGwei } from 'viem'

export const klaytn = defineChain({
  id: 8217,
  name: 'Klaytn Mainnet',
  nativeCurrency: { name: 'Klay', symbol: 'KLAY', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://public-en-cypress.klaytn.net'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Klaytn Scope',
      url: 'https://klaytnscope.com',
      apiUrl: 'https://api-cypress.klaytnscope.com/api',
    },
  },
  contracts: {
    mixContract: {
        address: '0xDd483a970a7A7FeF2B223C3510fAc852799a88BF',
        blockCreated: 71_693_661,
    },
    mixStakingContract: {
        address: '0x226cA982Bf947e327313472CC60592f93CBca01B',
        blockCreated: 92_431_128,
    },
    mateContract: {
        address: '0xe47e90c58f8336a2f24bcd9bcb530e2e02e1e8ae',
        blockCreated: 64_116_899,
    },
    eMateContract: {
        address: '0x2b303fd0082e4b51e5a6c602f45545204bbbb4dc',
        blockCreated: 84_007_508,
    },
    biasContract: {
        address: '0xdedd727ab86bce5d416f9163b2448860bbde86d4',
        blockCreated: 85_639_467, 
    },
    multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 96_002_415,
    },
  },
  fees: { 
    baseFeeMultiplier: 1.2, 
    defaultPriorityFee: parseGwei('0.01'), 
  } 
})
