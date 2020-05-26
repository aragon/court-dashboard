import { getNetworkType } from '../lib/web3-utils'

const ACTIVITY_KEY_REGEX = new RegExp(`^activity:${getNetworkType()}:`)

export function clearActivities() {
  Object.keys(localStorage)
    .filter(key => ACTIVITY_KEY_REGEX.test(key))
    .map(activityKey => localStorage.setItem(activityKey, '[]'))
}
