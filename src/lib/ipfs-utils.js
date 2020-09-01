import isIPFS from 'is-ipfs'
import { defaultIpfsGateway } from '../endpoints'

const SPLIT_IPFS_REGEX = /(Qm[a-zA-Z0-9]{44})/
const TEST_IPFS_REGEX = /(Qm[a-zA-Z0-9]{44})/

const REQUEST_TIMEOUT = 60000

export const ipfsGet = async cid => {
  const endpoint = `${defaultIpfsGateway}/${cid}`
  try {
    const result = await fetch(endpoint, { timeout: REQUEST_TIMEOUT })
    const data = await result.text()

    return { data, error: !result.ok }
  } catch (err) {
    console.error(`Error requesting data from IPFS for ${endpoint}`, err)
    return { error: true }
  }
}

export const getIpfsCidFromUri = string => {
  const ipfsCid = string.replace(/^ipfs:/, '')

  if (isIPFS.cid(ipfsCid) || isIPFS.cidPath(ipfsCid)) {
    return ipfsCid
  }
  return ''
}

export function transformIPFSHash(str, callback) {
  return str
    .split(SPLIT_IPFS_REGEX)
    .map((part, index) => callback(part, TEST_IPFS_REGEX.test(part), index))
}
