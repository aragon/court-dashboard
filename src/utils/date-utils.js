import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import relativeTime from 'dayjs/plugin/relativeTime'

export const SECOND = 1000
export const MINUTE = 60 * SECOND
export const HOUR = 60 * MINUTE
export const DAY = 24 * HOUR

const KNOWN_FORMATS = {
  iso: 'YYYY-MM-DDTHH:mm:ssZ',
  standard: 'D MMM YY, h:mm A',
}

// dayjs plugins
dayjs.extend(isBetween)
dayjs.extend(relativeTime)

function dateFormat(date, format) {
  return dayjs(date).format(KNOWN_FORMATS[format] || format)
}

// Displays the difference between two dates
function getRelativeTime(from, to) {
  return dayjs(to)
    .from(from)
    .replace(/minutes?/, 'min')
    .replace(/seconds?/, 'sec')
    .trim()
}

export { dayjs, dateFormat, getRelativeTime }
