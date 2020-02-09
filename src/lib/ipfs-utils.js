import { IPFS_ENDPOINT } from '../endpoints'

export const ipfsGet = async hash => {
  const endpoint = `${IPFS_ENDPOINT}/${hash}`
  try {
    const result = await fetch(endpoint)
    const data = await result.text()

    return { data, error: !result.ok }
  } catch (err) {
    console.error('Error getting data from IPFS', err)
    return { error: true }
  }
}
