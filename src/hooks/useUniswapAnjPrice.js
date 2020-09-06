import { useEffect, useState } from 'react'
import { captureException } from '@sentry/browser'

import gql from 'graphql-tag'
import { Client } from 'urql'

const RETRY_EVERY = 3000

const UNISWAP_URL = 'https://api.thegraph.com/subgraphs/name/lutter/uniswap-v2'
const ETH_ANJ_PAIR = '0x0ffc70be6e2d841e109653ddb3034961591679d6'
const DAI_ETH_PAIR = '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11'

const graphqlClient = new Client({ url: UNISWAP_URL })

const ANJ_PRICE_QUERY = gql`
  query {
    pair(id: "${ETH_ANJ_PAIR}") {
      token0Price
    }
  }
`
const ETH_PRICE_QUERY = gql`
  query {
    pair(id: "${DAI_ETH_PAIR}") {
      token0Price
    }
  }
`

export function useUniswapAnjPrice() {
  const [anjPrice, setAnjPrice] = useState(0)

  useEffect(() => {
    let cancelled = false
    let retryTimer
    async function fetchPrice() {
      try {
        const [anjResults, ethResults] = await Promise.all([
          graphqlClient.query(ANJ_PRICE_QUERY).toPromise(),
          graphqlClient.query(ETH_PRICE_QUERY).toPromise(),
        ])

        const { pair: anjPair } = anjResults.data
        const { pair: ethPair } = ethResults.data
        const anjToEthPrice = anjPair.token0Price
        const ethToDaiPrice = ethPair.token0Price
        const anjPrice = Number(anjToEthPrice) * Number(ethToDaiPrice)

        if (!cancelled) {
          setAnjPrice(anjPrice)
        }
      } catch (err) {
        captureException(err)
        retryTimer = setTimeout(fetchPrice, RETRY_EVERY)
      }
    }

    fetchPrice()

    return () => {
      cancelled = true
      clearTimeout(retryTimer)
    }
  }, [])

  return anjPrice
}
