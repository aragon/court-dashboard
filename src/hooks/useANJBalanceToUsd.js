import { useEffect, useState } from 'react'
import { getMarketDetails, getTokenReserves } from '@uniswap/sdk'
import { useCourtConfig } from '../providers/CourtConfig'

import env from '../environment'
import { getDaiAddress } from '../utils/known-tokens'
import { formatUnits, bigNum } from '../lib/math-utils'
import { addressesEqual, ETH_FAKE_ADDRESS } from '../lib/web3-utils'

const UNISWAP_PRECISION = 18
const UNISWAP_MARKET_RETRY_EVERY = 1000

async function getANJMarketDetails(tokenAddress, anjTokenAddress) {
  const [tokenData, anjData] = await Promise.all(
    [tokenAddress, anjTokenAddress].map(address => {
      // In the case of ETH, undefined should be passed as the reserves data.
      if (addressesEqual(address, ETH_FAKE_ADDRESS)) {
        return undefined
      }

      const tokenReserves = getTokenReserves(address, env('CHAIN_ID'))

      if (!tokenReserves) {
        throw new Error('Could not fetch reserves')
      }
      return tokenReserves
    })
  )

  return getMarketDetails(tokenData, anjData)
}

export default function useANJBalanceToUsd(amount) {
  const { anjToken } = useCourtConfig()

  // We'll use the ANJ <> DAI market details to get the spot price
  const daiAddress = getDaiAddress()

  const [convertedAmount, setConvertedAmount] = useState('0')

  useEffect(() => {
    let cancelled = false
    let retryTimer

    if (!amount || amount.eq(0) || !daiAddress) {
      return
    }

    const updateConvertedAmount = async () => {
      try {
        const { marketRate } = await getANJMarketDetails(
          daiAddress,
          anjToken.id,
          amount
        )

        const precision = bigNum(10).pow(UNISWAP_PRECISION)

        const rate = bigNum(marketRate.rateInverted.times(precision).toFixed(0))

        const convertedAmount = formatUnits(amount.mul(rate).div(precision), {
          digits: anjToken.decimals,
        })

        if (!cancelled) {
          setConvertedAmount(convertedAmount)
        }
      } catch (err) {
        console.log('err', err)
        if (!cancelled) {
          retryTimer = setTimeout(
            updateConvertedAmount,
            UNISWAP_MARKET_RETRY_EVERY
          )
        }
      }
    }

    updateConvertedAmount()

    return () => {
      cancelled = true
      clearTimeout(retryTimer)
    }
  }, [amount, anjToken, daiAddress])

  return convertedAmount
}
