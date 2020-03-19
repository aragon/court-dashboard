import isIPFS from 'is-ipfs'
import { IPFS_ENDPOINT } from '../endpoints'

const REQUEST_TIMEOUT = 60000

export const ipfsGet = async cid => {
  const endpoint = `${IPFS_ENDPOINT}/${cid}`
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
