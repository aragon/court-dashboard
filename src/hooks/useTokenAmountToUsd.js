import { useEffect, useState } from 'react'
import { captureException } from '@sentry/browser'

import { useCourtConfig } from '../providers/CourtConfig'
import { useUniswapAnjPrice } from './useUniswapAnjPrice'
import { bigNum, formatUnits } from '../lib/math-utils'
import { getNetworkType } from '../lib/web3-utils'

const API_BASE = 'https://api.0x.org'
const UNISWAP_PRECISION = bigNum(10).pow(18)

const SELL_TOKEN = 'USDC'
const SELL_TOKEN_PRECISION = bigNum(10).pow(6)

/**
 * Convert ANJ amount into USD price
 * @param {BigNum} amount The amount to convert to USD
 * @returns {String} The amount value in USD
 */
export function useANJAmountToUsd(amount) {
  const { anjToken } = useCourtConfig()
  const anjPrice = useUniswapAnjPrice()

  if (!amount || anjPrice === 0) {
    return '-'
  }

  return convertAmount(amount, anjPrice, anjToken.decimals, UNISWAP_PRECISION)
}

/**
 * Convert a token into a USD price
 *
 * @param {String} symbol The symbol of the token to convert from.
 * @param {Number} decimals The amount of decimals for the token.
 * @param {BigNumber} amount The amount to convert into USD.
 * @returns { Number } The balance value in USD
 */
export function useTokenAmountToUsd(symbol, decimals, amount) {
  const [amountInUsd, setAmountInUsd] = useState('-')
  useEffect(() => {
    let cancelled = false

    if (getNetworkType() !== 'main') {
      return
    }

    const fetchPrice = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/swap/v0/prices?sellToken=${SELL_TOKEN}`
        )
        const prices = await res.json()

        if (cancelled || !amount || !prices?.records?.length) {
          return
        }

        const priceRecord = prices.records.find(
          price => price.symbol === symbol
        )
        if (!priceRecord) {
          return
        }

        const convertedAmount = convertAmount(
          amount,
          priceRecord.price,
          decimals,
          SELL_TOKEN_PRECISION
        )
        setAmountInUsd(convertedAmount)
      } catch (err) {
        console.error(`Could not fetch ${symbol} USD price`, err)
        captureException(err)
      }
    }

    fetchPrice()

    return () => {
      cancelled = true
    }
  }, [amount, decimals, symbol])

  return amountInUsd
}

function convertAmount(amount, price, decimals, precision) {
  const rate = (price * precision).toFixed()

  return formatUnits(amount.mul(rate.toString()).div(precision), {
    digits: decimals,
  })
}
