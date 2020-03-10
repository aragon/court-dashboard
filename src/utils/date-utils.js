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
  onlyDate: 'DD/MM/YY',
}

// dayjs plugins
dayjs.extend(isBetween)
dayjs.extend(relativeTime)

function dateFormat(date, format) {
  return dayjs(date).format(KNOWN_FORMATS[format] || format)
}

export function formatDuration(duration) {
  const dayInSeconds = 86400
  const hourInSeconds = 3600
  const minuteInSeconds = 60
  const units = ['day', 'hour', 'minute', 'second']

  const days = Math.floor(duration / dayInSeconds)
  const hours = Math.floor((duration % dayInSeconds) / hourInSeconds)
  const minutes = Math.floor(
    ((duration % dayInSeconds) % hourInSeconds) / minuteInSeconds
  )
  const seconds = ((duration % dayInSeconds) % hourInSeconds) % minuteInSeconds

  return [days, hours, minutes, seconds]
    .map((elem, index) =>
      elem > 0 ? `${elem} ${units[index]}${elem > 1 ? 's' : ''}` : ''
    )
    .join(' ')
    .trim()
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
