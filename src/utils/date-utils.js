import dayjs from '../lib/dayjs'

export function dateFormat(date, format) {
  return dayjs(date).format(format)
}
