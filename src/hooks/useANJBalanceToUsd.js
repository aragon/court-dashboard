import { useEffect, useState } from 'react'
import {
  TRADE_EXACT,
  getMarketDetails,
  getTokenReserves,
  getTradeDetails,
} from '@uniswap/sdk'
import env from '../environment'
import { getANTAddress } from '../utils/known-tokens'
import { bigNum, formatUnits } from '../lib/math-utils'
import { useCourtConfig } from '../providers/CourtConfig'
import { addressesEqual, ETHER_FAKE_ADDRESS } from '../lib/web3-utils'

const UNISWAP_PRECISION = 18
const UNISWAP_MARKET_RETRY_EVERY = 1000
const API_BASE = 'https://min-api.cryptocompare.com/data'

async function getANJMarketDetails(tokenAddress, anjTokenAddress) {
  const [tokenData, anjData] = await Promise.all(
    [tokenAddress, anjTokenAddress].map(address => {
      // In the case of ETH, undefined should be passed as the reserves data.
      if (addressesEqual(address, ETHER_FAKE_ADDRESS)) {
        return undefined
      }

      const tokenReserves = getTokenReserves(address, env('CHAIN_ID'))

      if (!tokenReserves) {
        throw new Error('Could not fetch reserves')
      }
      return tokenReserves
    })
  )

  console.log(
    'ANT reserves',
    'ETH: ',
    tokenData.ethReserve.amount.div(10 ** UNISWAP_PRECISION).toNumber(),
    'Token: ',
    tokenData.tokenReserve.amount.div(10 ** UNISWAP_PRECISION).toNumber()
  )
  console.log(
    'ANJ reserves',
    'ETH: ',
    anjData.ethReserve.amount.div(10 ** UNISWAP_PRECISION).toNumber(),
    'Token: ',
    anjData.tokenReserve.amount.div(10 ** UNISWAP_PRECISION).toNumber()
  )

  return getMarketDetails(tokenData, anjData)
}

// Wraps uniswap’s getTradeDetails() to only require
// the other token in the pair, qualified using its symbol.
async function getANJTradeDetails(tokenAddress, anjTokenAddress, tradeAmount) {
  const anjMarketDetails = await getANJMarketDetails(
    tokenAddress,
    anjTokenAddress
  )

  console.log(
    'anjmarket details',
    'Rate ',
    anjMarketDetails.marketRate.rate.toNumber(),
    'Inverted rate ',
    anjMarketDetails.marketRate.rateInverted.toNumber()
  )
  return getTradeDetails(TRADE_EXACT.OUTPUT, tradeAmount, anjMarketDetails)
}

export default function useANJBalanceToUsd(amount) {
  const { anjToken } = useCourtConfig()
  const antAddress = getANTAddress()
  const [convertedAmount, setConvertedAmount] = useState(bigNum(0))

  useEffect(() => {
    let cancelled = false
    let retryTimer

    if (!amount || amount.eq(0) || !antAddress) {
      return
    }
    console.log('amount', formatUnits(amount))
    console.log('antAddress', antAddress)

    const updateConvertedAmount = async () => {
      try {
        const tradeDetails = await getANJTradeDetails(
          antAddress,
          anjToken.id,
          amount
        )

        console.log('trade details', tradeDetails)
        console.log(tradeDetails.inputAmount.amount.valueOf())

        const convertedAmount = tradeDetails.inputAmount.amount.valueOf()

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
  }, [amount, anjToken.id, antAddress])

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
export function useTokenBalanceToUsd(symbol, decimals, balance) {
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
