import isBetween from 'dayjs/plugin/isBetween'
const dayjs = require('dayjs')

dayjs.extend(isBetween)

export default dayjs
