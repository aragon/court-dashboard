import sha3 from 'js-sha3'
const { keccak_256: keccak256 } = sha3

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

export function hexToAscii(hexx) {
  const hex = hexx.toString()
  let str = ''
  for (let i = 0; i < hex.length && hex.substr(i, 2) !== '00'; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
  return str
}

export function toDate(evmTimestamp) {
  const milliseconds = evmTimestamp.toString() * 1000
  const date = new Date(milliseconds)
  return (
    date
      .toISOString()
      .slice(0, 19)
      .replace(/-/g, '/')
      .replace('T', ' ') + ' UTC'
  )
}

export const addressPattern = '(0x)?[0-9a-fA-F]{40}'
