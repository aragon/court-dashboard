import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)

export const DATE_FORMAT = 'D MMM YY, h:mm A'

export default dayjs
