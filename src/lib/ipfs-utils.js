import axios from 'axios'
import { IPFS_ENDPOINT } from '../endpoints'

const HTTP_OK_RESPONSE = 200

export const ipfsGet = async hash => {
  // TODO - ADD in the subgraphh a StringData field for the evidence data since we are returning bytes
  // and for some reason can not be converted into String
  const endpoint = `${IPFS_ENDPOINT}/${hash}`
  try {
    const { data, status } = await axios.get(endpoint)
    return { data, error: status !== HTTP_OK_RESPONSE }
  } catch (err) {
    console.error('Error getting data from IPFS', err)
    return { error: err }
  }
}
