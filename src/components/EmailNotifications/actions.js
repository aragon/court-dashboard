import {
  resendVerificationEmail,
  subscribeExistingEmail,
  subscribeToNotifications,
  switchNotificationsStatus,
} from '../../services/servicesRequests'

import {
  OPTOUT_ACTION,
  RESEND_EMAIL_ACTION,
  SUBSCRIBE_EXISTING_ACTION,
  SUBSCRIBE_MODAL_ACTION,
  VERIFY_YOUR_EMAIL_SCREEN,
} from './constants'

export const actions = {
  [SUBSCRIBE_MODAL_ACTION]: {
    request: subscribeToNotifications,
    successScreen: VERIFY_YOUR_EMAIL_SCREEN,
    requiresEmail: true,
  },

  [SUBSCRIBE_EXISTING_ACTION]: {
    request: subscribeExistingEmail,
    successScreen: VERIFY_YOUR_EMAIL_SCREEN,
    requiresEmail: false,
  },
  [OPTOUT_ACTION]: {
    request: switchNotificationsStatus,
    params: [true], // disabled = true
    requiresEmail: false,
  },
  [RESEND_EMAIL_ACTION]: {
    request: resendVerificationEmail,
    successScreen: VERIFY_YOUR_EMAIL_SCREEN,
    requiresEmail: false,
  },
}
