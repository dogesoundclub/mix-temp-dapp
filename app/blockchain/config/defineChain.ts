import type { Chain, ChainFormatters } from 'viem/types/chain.js'
import type { Assign, Prettify } from 'viem/types/utils.js'

export function defineChain<
  formatters extends ChainFormatters,
  const chain extends Chain<formatters>,
>(chain: chain): Prettify<Assign<Chain<undefined>, chain>> {
  return {
    formatters: undefined,
    fees: undefined,
    serializers: undefined,
    ...chain,
  } as Assign<Chain<undefined>, chain>
}
