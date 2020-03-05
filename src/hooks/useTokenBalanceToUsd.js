import { useEffect, useState } from 'react'
import { getMarketDetails, getTokenReserves } from '@uniswap/sdk'
import { useCourtConfig } from '../providers/CourtConfig'

import env from '../environment'
import { getTokenAddress } from '../utils/known-tokens'
import { formatUnits, bigNum } from '../lib/math-utils'
import { addressesEqual, ETH_FAKE_ADDRESS } from '../lib/web3-utils'

const UNISWAP_PRECISION = 18
const UNISWAP_MARKET_RETRY_EVERY = 1000
const API_BASE = 'https://min-api.cryptocompare.com/data'

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

/**
 * @dev ANJ can only be bought in Uniswap for now so we'll get the ANJ <> DAI market details
 * Convert ANJ amount into USD price
 * @param {BigNum} amount The amount to convert to USD
 * @returns {String} The amount value in USD
 */
export function useANJBalanceToUsd(amount) {
  const { anjToken } = useCourtConfig()

  // We'll use the ANJ <> DAI market details to get the spot price
  const daiAddress = getTokenAddress('DAI')

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
        console.error('Could not fetch Uniswap price for ANJ', err)
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

/**
 * Convert a token into a USD price
 *
 * @param {String} symbol The symbol of the token to convert from.
 * @param {Number} decimals The amount of decimals for the token.
 * @param {BigNumber} balance The balance to convert into USD.
 * @returns { Number } The balance value in USD
 */
export default function useTokenBalanceToUsd(symbol, decimals, balance) {
  const [usd, setUsd] = useState('-')
  useEffect(() => {
    let cancelled = false

    fetch(`${API_BASE}/price?fsym=${symbol}&tsyms=USD`)
      .then(res => res.json())
      .then(price => {
        if (cancelled || !balance || !(parseFloat(price.USD) > 0)) {
          return
        }

        const usdDigits = 2
        const precision = 6

        const usdBalance = balance
          .mul(bigNum(parseInt(price.USD * 10 ** (precision + usdDigits), 10)))
          .div(10 ** precision)
          .div(bigNum(10).pow(decimals))

        setUsd(formatUnits(usdBalance, { digits: usdDigits }))
      })

    return () => {
      cancelled = true
    }
  }, [balance, decimals, symbol])

  return usd
}
