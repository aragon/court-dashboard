import dayjs from '../lib/dayjs'

const KNOWN_FORMATS = {
  iso: 'YYYY-MM-DDTHH:mm:ssZ',
  standard: 'D MMM YY, h:mm A',
}

export function dateFormat(date, format) {
  return dayjs(date).format(KNOWN_FORMATS[format] || format)
}

export function datesDiff(startDate, endDate) {
  const endDateOfMonth = endDate.get('date')
  const endMonth = endDate.get('month')
  const endYear = endDate.get('year')
  const currentDateOfMonth = startDate.get('date')
  const currentMonth = startDate.get('month')
  const currentEndYear = startDate.get('year')

  if (
    endDateOfMonth === currentDateOfMonth &&
    endMonth === currentMonth &&
    endYear === currentEndYear
  ) {
    return 0
  }
  if (endDate.diff(startDate, 'hour', true) < 24) {
    return 1
  }
  return endDate.diff(startDate, 'day')
}
