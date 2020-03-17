import { getNetworkName } from './lib/web3-utils'
import env from './environment'

export const extendError = (name, { defaultMessage }) =>
  class extends Error {
    name = name
    constructor(message = defaultMessage) {
      super(message)
    }
  }

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

export const InvalidNetworkType = extendError('InvalidNetworkType', {
  defaultMessage: 'The network type is invalid',
})
export const InvalidURI = extendError('InvalidURI', {
  defaultMessage: 'The URI is invalid',
})
export const NoConnection = extendError('NoConnection', {
  defaultMessage: 'There is no connection',
})
