import { useEffect, useState } from 'react'
import {
  TRADE_EXACT,
  getMarketDetails,
  getTokenReserves,
  getTradeDetails,
} from '@uniswap/sdk'
import { useCourtConfig } from '../providers/CourtConfig'

import env from '../environment'
import { getDaiAddress } from '../utils/known-tokens'
import { bigNum, formatUnits } from '../lib/math-utils'
import { addressesEqual, ETH_FAKE_ADDRESS } from '../lib/web3-utils'

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

async function getANJTradeDetails(tokenAddress, anjTokenAddress, tradeAmount) {
  const anjMarketDetails = await getANJMarketDetails(
    tokenAddress,
    anjTokenAddress
  )

  return getTradeDetails(TRADE_EXACT.OUTPUT, tradeAmount, anjMarketDetails)
}

export default function useANJBalanceToUsd(amount) {
  const { anjToken } = useCourtConfig()

  // We'll use the ANJ <> DAI trade details to get the exact ANJ value
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
        const { inputAmount } = await getANJTradeDetails(
          daiAddress,
          anjToken.id,
          amount
        )

        const convertedAmount = formatUnits(
          // BigNumber used by uniswap has different properties as the one we use so we need to convert it
          bigNum(inputAmount.amount.toString(10)),
          {
            digits: inputAmount.token.decimals,
          }
        )

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
  }, [amount, anjToken.id, daiAddress])

  return convertedAmount
}
