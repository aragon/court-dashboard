import { IPFS_ENDPOINT } from '../endpoints'

const REQUEST_TIMEOUT = 60000

export const ipfsGet = async hash => {
  const endpoint = `${IPFS_ENDPOINT}/${hash}`
  try {
    const result = await fetch(endpoint, { timeout: REQUEST_TIMEOUT })
    const data = await result.text()

    return { data, error: !result.ok }
  } catch (err) {
    console.error('Error getting data from IPFS', err)
    return { error: true }
  }
}
