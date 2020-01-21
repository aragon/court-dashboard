import { utils as EthersUtils } from 'ethers'

export function bigNum(value) {
  return new EthersUtils.BigNumber(value)
}

export function formatTokenAmount(
  amount,
  isIncoming,
  decimals = 0,
  displaySign = false
) {
  return (
    (displaySign ? (isIncoming ? '+' : '-') : '') +
    formatUnits(amount, { digits: decimals })
  )
}

/**
 * Format a decimal-based number back to a normal number
 *
 * @param {string} value the number
 * @param {number} digits number of decimal places
 * @returns {BN} value converted to it's normal representation
 */
export function parseUnits(value, digits) {
  return EthersUtils.parseUnits(value, digits)
}

/**
 * Format an amount of units to be displayed.
 *
 * @param {BigNumber} value Amount of units to format.
 * @param {Number} options.digits Amount of digits on the token.
 * @param {Boolean} options.commas Use comma-separated groups.
 * @param {Boolean} options.replaceZeroBy The string to be returned when value is zero.
 * @returns {String} value formatted
 */
export function formatUnits(
  value,
  { digits = 18, commas = true, replaceZeroBy = '0' } = {}
) {
  if (value.lt(0) || digits < 0) {
    return ''
  }

  let valueBeforeCommas = EthersUtils.formatUnits(value.toString(), digits)

  // Replace 0 by an empty value
  if (valueBeforeCommas === '0.0') {
    return replaceZeroBy
  }

  // EthersUtils.formatUnits() adds a decimal even when 0, this removes it.
  valueBeforeCommas = valueBeforeCommas.replace(/\.0$/, '')

  return commas ? EthersUtils.commify(valueBeforeCommas) : valueBeforeCommas
}

const wordNumbers = [
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
]

export function numberToWord(number) {
  return wordNumbers[number]
}
