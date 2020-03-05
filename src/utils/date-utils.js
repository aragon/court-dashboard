import dayjs from '../lib/dayjs'

const KNOWN_FORMATS = {
  iso: 'YYYY-MM-DDTHH:mm:ssZ',
  standard: 'D MMM YY, h:mm A',
}

export function dateFormat(date, format) {
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
      elem > 0 ? `${elem} ${units[index]}${elem > 1 ? 's' : ''} ` : ''
    )
    .join('')
}
