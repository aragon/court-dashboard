import { getNetworkName } from './lib/web3-utils'
import env from './environment'

export class DisputeNotFound extends Error {
  name = 'DisputeNotFound'
  constructor(disputeId) {
    super(
      `It looks like there’s no dispute associated with the “DisputeID #${disputeId}” on the Ethereum ${getNetworkName(
        env('CHAIN_ID')
      )} network.`
    )
    this.disputeId = disputeId
  }
}
