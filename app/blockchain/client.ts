import { createPublicClient, createWalletClient, http, custom } from 'viem'
import { klaytn } from './chains/klaytn';

export const publicClient = createPublicClient({
  chain: klaytn,
  transport: http(klaytn["rpcUrls"]["default"]["http"][0], {
    batch: {
      batchSize: 2_000
    } 
  })
})
 
// // eg: Metamask
// export const walletClient = createWalletClient({
//   chain: klaytn,
//   transport: custom(window.ethereum!),
// })
 
// // eg: WalletConnect
// const provider = await EthereumProvider.init({
//   projectId: "abcd1234",
//   showQrModal: true,
//   chains: [1],
// })
 
// export const walletClientWC = createWalletClient({
//   chain: klaytn,
//   transport: custom(provider),
// })