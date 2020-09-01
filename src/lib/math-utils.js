import { utils as EthersUtils, BigNumber } from 'ethers'

export function bigNum(value) {
  return BigNumber.from(value)
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
 * @param {Boolean} options.precision The precision of the resulting number
 * @returns {String} value formatted
 */
export function formatUnits(
  value,
  { digits = 18, commas = true, replaceZeroBy = '0', precision = 2 } = {}
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

  const roundedValue = round(valueBeforeCommas, precision)

  return commas ? EthersUtils.commify(roundedValue) : roundedValue
}

/**
 * Format an amount of units to be displayed.
 *
 * @param {String} value Value to round
 * @param {Number} precision Rounding precision
 * @returns {String} Value rounded to `precision` decimals
 */
export function round(value, precision = 2) {
  let [whole, decimal] = value.split('.')

  if (!decimal || decimal.length <= precision) return value

  // Round and keep the last `precision` digits
  decimal = Math.round(parseInt((decimal || '0').slice(0, precision + 2)) / 100)

  return `${whole}${decimal ? `.${decimal}` : ''}`
}

const wordNumbers = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
]

export function numberToWord(number) {
  return wordNumbers[number]
}

const ordinalNumbers = [
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
  'sixth',
  'seventh',
  'eighth',
  'ninth',
]

export function numberToOrdinal(number) {
  return ordinalNumbers[number - 1]
}

export function getPercentage(value, totalValue) {
  if (!totalValue > 0) return 0

  return Math.round((value * 100) / totalValue, 2)
}

export function getPercentageBN(value, totalValue) {
  const valueAsNumber = Number(EthersUtils.formatUnits(value, 18))
  const totalValueAsNumber = Number(EthersUtils.formatUnits(totalValue, 18))

  const PERCENT_BN = 100

  if (totalValue.lte(0)) return 0

  return (valueAsNumber * PERCENT_BN) / totalValueAsNumber
}

export function generateRandomNumber() {
  const code = BigNumber.from(EthersUtils.randomBytes(32))
  return code.toHexString().slice(2)
}

/**
 * Normalizes a number from another range into a value between 0 and 1.
 *
 * Identical to map(value, low, high, 0, 1)
 * Numbers outside the range are not clamped to 0 and 1, because out-of-range
 * values are often intentional and useful.
 *
 * From Processing.js
 *
 * @param {Number} aNumber The incoming value to be converted
 * @param {Number} low Lower bound of the value's current range
 * @param {Number} high Upper bound of the value's current range
 * @returns {Number} Normalized number
 */
export function norm(aNumber, low, high) {
  return (aNumber - low) / (high - low)
}

/**
 * Calculates a number between two numbers at a specific increment. The
 * progress parameter is the amount to interpolate between the two values where
 * 0.0 equal to the first point, 0.1 is very near the first point, 0.5 is
 * half-way in between, etc. The lerp function is convenient for creating
 * motion along a straight path and for drawing dotted lines.
 *
 * From Processing.js
 *
 * @param {Number} progress Between 0.0 and 1.0
 * @param {Number} value1 First value
 * @param {Number} value2 Second value
 * @returns {Number} Increment value
 */
export function lerp(progress, value1, value2) {
  return (value2 - value1) * progress + value1
}
