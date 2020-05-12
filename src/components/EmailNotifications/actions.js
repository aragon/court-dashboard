import {
  deleteJurorEmail,
  getJurorEmail,
  resendVerificationEmail,
  subscribeExistingEmail,
  subscribeToNotifications,
  switchNotificationsStatus,
} from '../../services/servicesRequests'

import {
  DELETE_ACTION,
  DELETE_ACTION_PREFERENCES,
  EMAIL_NOTIFICATIONS_FORM_SCREEN,
  NOTIFICATIONS_PREFERENCES_SCREEN,
  OPTOUT_ACTION,
  RESEND_EMAIL_ACTION,
  SUBSCRIBE_EXISTING_ACTION,
  SUBSCRIBE_MODAL_ACTION,
  UNLOCK_SETTINGS_ACTION,
  VERIFY_YOUR_EMAIL_SCREEN,
} from './constants'

export const actions = {
  [DELETE_ACTION]: {
    request: deleteJurorEmail,
    requiresEmail: false,
  },
  [DELETE_ACTION_PREFERENCES]: {
    request: deleteJurorEmail,
    successScreen: EMAIL_NOTIFICATIONS_FORM_SCREEN,
    requiresEmail: false,
  },
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
  [UNLOCK_SETTINGS_ACTION]: {
    request: getJurorEmail,
    successScreen: NOTIFICATIONS_PREFERENCES_SCREEN,
  },
}
