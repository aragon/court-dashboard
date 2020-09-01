import env from '../environment'
import { providers as Providers, utils } from 'ethers'
import { InvalidURI, InvalidNetworkType, NoConnection } from '../errors'
import { validHttpFormat } from './uri-utils'

const { id: keccak256, solidityKeccak256: soliditySha3, toUtf8String } = utils

export const DEFAULT_LOCAL_CHAIN = 'private'
export const ETH_FAKE_ADDRESS = `0x${''.padEnd(40, '0')}`

const ETH_ADDRESS_SPLIT_REGEX = /(0x[a-fA-F0-9]{40}(?:\b|\.|,|\?|!|;))/g
const ETH_ADDRESS_TEST_REGEX = /(0x[a-fA-F0-9]{40}(?:\b|\.|,|\?|!|;))/g

export function getFunctionSignature(func) {
  return keccak256(func).slice(0, 10)
}

export function getUseWalletProviders() {
  const providers = [{ id: 'injected' }, { id: 'frame' }]

  if (env('FORTMATIC_API_KEY')) {
    providers.push({
      id: 'fortmatic',
      useWalletConf: { apiKey: env('FORTMATIC_API_KEY') },
    })
  }

  if (env('PORTIS_DAPP_ID')) {
    providers.push({
      id: 'portis',
      useWalletConf: { dAppId: env('PORTIS_DAPP_ID') },
    })
  }

  return providers
}

export function getUseWalletConnectors() {
  return getUseWalletProviders().reduce((connectors, provider) => {
    if (provider.useWalletConf) {
      connectors[provider.id] = provider.useWalletConf
    }
    return connectors
  }, {})
}

function toChecksumAddress(address) {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    throw new Error(
      'Given address "' + address + '" is not a valid Ethereum address.'
    )
  }

  address = address.toLowerCase().replace(/^0x/i, '')

  const addressHash = keccak256(address).replace(/^0x/i, '')
  let checksumAddress = '0x'

  for (let i = 0; i < address.length; i++) {
    // If ith character is 9 to f then make it uppercase
    if (parseInt(addressHash[i], 16) > 7) {
      checksumAddress += address[i].toUpperCase()
    } else {
      checksumAddress += address[i]
    }
  }

  return checksumAddress
}

// Check address equality with checksums
export function addressesEqual(first, second) {
  first = first && toChecksumAddress(first)
  second = second && toChecksumAddress(second)
  return first === second
}

export const addressPattern = '(0x)?[0-9a-fA-F]{40}'

/**
 * Shorten an Ethereum address. `charsLength` allows to change the number of
 * characters on both sides of the ellipsis.
 *
 * Examples:
 *   shortenAddress('0x19731977931271')    // 0x1973…1271
 *   shortenAddress('0x19731977931271', 2) // 0x19…71
 *   shortenAddress('0x197319')            // 0x197319 (already short enough)
 *
 * @param {string} address The address to shorten
 * @param {number} [charsLength=4] The number of characters to change on both sides of the ellipsis
 * @returns {string} The shortened address
 */
export function shortenAddress(address, charsLength = 4) {
  const prefixLength = 2 // "0x"
  if (!address) {
    return ''
  }
  if (address.length < charsLength * 2 + prefixLength) {
    return address
  }
  return (
    address.slice(0, charsLength + prefixLength) +
    '…' +
    address.slice(-charsLength)
  )
}

export function getNetworkType(chainId = env('CHAIN_ID')) {
  chainId = String(chainId)

  if (chainId === '1') return 'main'
  if (chainId === '3') return 'ropsten'
  if (chainId === '4') return 'rinkeby'

  return DEFAULT_LOCAL_CHAIN
}

export function getNetworkName(chainId = env('CHAIN_ID')) {
  chainId = String(chainId)

  if (chainId === '1') return 'Mainnet'
  if (chainId === '3') return 'Ropsten'
  if (chainId === '4') return 'Rinkeby'

  return 'unknown'
}

export function sanitizeNetworkType(networkType) {
  if (networkType === 'private') {
    return 'localhost'
  } else if (networkType === 'main') {
    return 'mainnet'
  }
  return networkType
}

export function isLocalOrUnknownNetwork(chainId = env('CHAIN_ID')) {
  return getNetworkType(chainId) === DEFAULT_LOCAL_CHAIN
}

// Detect Ethereum addresses in a string and transform each part.
//
// `callback` is called on every part with two params:
//   - The string of the current part.
//   - A boolean indicating if it is an address.
//
export function transformAddresses(str, callback) {
  return str
    .split(ETH_ADDRESS_SPLIT_REGEX)
    .map((part, index) =>
      callback(part, ETH_ADDRESS_TEST_REGEX.test(part), index)
    )
}

/**
 * Check if the ETH node at the given URI is compatible for the current environment
 * @param {string} uri URI of the ETH node.
 * @param {string} expectedNetworkType The expected network type of the ETH node.
 * @returns {Promise} Resolves if the ETH node is compatible, otherwise throws:
 *    - InvalidURI: URI given is not compatible (e.g. must be WebSockets)
 *    - InvalidNetworkType: ETH node connected to wrong network
 *    - NoConnection: Couldn't connect to URI
 */
export async function checkValidEthNode(uri) {
  const isLocalOrUnknown = isLocalOrUnknownNetwork(env('CHAIN_ID'))

  if (!validHttpFormat(uri)) {
    throw new InvalidURI('The URI must use the HTTP protocol')
  }

  try {
    const expectedNetworkType = getNetworkType()
    const provider = await new Providers.JsonRpcProvider(uri)
    const networkType = await provider.getNetwork()
    const networkTypeName =
      networkType.name === 'homestead' ? 'main' : networkType.name

    if (!isLocalOrUnknown) {
      if (networkTypeName !== expectedNetworkType) {
        throw new InvalidNetworkType()
      }
    }
  } catch (err) {
    if (err instanceof InvalidNetworkType) {
      throw err
    }
    throw new NoConnection()
  }

  return true
}

export async function signMessage(wallet, message) {
  let signHash
  let error = false

  try {
    signHash = await wallet.ethers.getSigner().signMessage(message)
  } catch (err) {
    error = err
  }

  return { signHash, error }
}

// ethers utils exports
export { keccak256, soliditySha3, toUtf8String }
