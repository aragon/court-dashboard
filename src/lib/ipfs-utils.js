import axios from 'axios'
// import { toUtf8String } from 'ethers/utils'

// const ipfsEndpoint = 'https://ipfs.io/ipfs'

export const ipfsGet = async hash => {
  console.log(
    'Equals ',
    hash + '' === 'QmTyLBQ36N3u7FfFVNpxMBs8QXtG6K7vEKeTCWuwekLrv4'
  )
  console.log('QmTyLBQ36N3u7FfFVNpxMBs8QXtG6K7vEKeTCWuwekLrv4', hash.toString())

  const endpoint = `http://127.0.0.1:8080/ipfs/${hash}`
  console.log('endpoint ', endpoint)
  try {
    const { data } = await axios.get(endpoint, {
      responseType: 'text',

      // This is needed to disable the default behavior of axios, which
      // always tries to use JSON.parse() even if `responseType` is "text".
      //
      // See:
      //   https://github.com/axios/axios/issues/907#issuecomment-322054564
      //
      // Although the comment states that 'undefined' should work, setting 'undefined' on
      // axios@0.19.0 does not override the default, so we have to use null
      transformResponse: null,
    })
    return data
  } catch (err) {
    console.error('Error getting data from IPFS', err)
  }
}
