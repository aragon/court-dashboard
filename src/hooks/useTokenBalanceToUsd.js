import { useEffect, useState } from 'react'
import { bigNum, formatUnits } from '../lib/math-utils'

const API_BASE = 'https://min-api.cryptocompare.com/data'

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
