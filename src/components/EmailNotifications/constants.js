// SCREENS
export const DELETE_EMAIL_SCREEN = Symbol('DELETE_EMAIL_SCREEN')

export const EMAIL_NOTIFICATIONS_EXISTING_EMAIL_SCREEN = Symbol(
  'EMAIL_NOTIFICATIONS_EXISTING_EMAIL_SCREEN'
)

export const EMAIL_NOTIFICATIONS_ERROR_SCREEN = Symbol(
  'EMAIL_NOTIFICATION_ERROR_SCREEN'
)

export const EMAIL_NOTIFICATIONS_FORM_SCREEN = Symbol(
  'EMAIL_NOTIFICATIONS_FORM_SCREEN'
)

export const EMAIL_NOTIFICATIONS_SUCCESS_SCREEN = Symbol(
  'EMAIL_NOTIFICATIONS_SUCCESS_SCREEN'
)
export const LOADING_SCREEN = Symbol('LOADING_SCREEN')

export const NOTIFICATIONS_PREFERENCES_SCREEN = Symbol(
  'NOTIFICATIONS_PREFERENCES_SCREEN'
)

export const PREFERENCES_UPDATE_EMAIL_SCREEN = Symbol(
  'PREFERENCES_UPDATE_EMAIL_SCREEN'
)

export const SIGNATURE_REQUEST_SCREEN = Symbol('SIGNATURE_REQUEST_SCREEN')

export const SIGNATURE_SUCCESS_SCREEN = Symbol('SIGNATURE_SUCCESS_SCREEN')

export const SUCCESS_INFO_SCREEN = Symbol('SUCCESS_INFO_SCREEN')

export const UNLOCK_NOTIFICATIONS_SCREEN = Symbol('UNLOCK_NOTIFICATIONS_SCREEN')

export const VERIFICATION_ERROR_SCREEN = Symbol('VERIFICATION_ERROR_SCREEN')

export const VERIFICATION_SUCCESS_SCREEN = Symbol(
  'VERIFICATION_SUCCESSFUL_SCREEN'
)

export const VERIFY_EMAIL_ADDRESS_PREFERENCES = Symbol(
  'VERIFY_EMAIL_ADDRESS_PREFERENCES'
)

export const VERIFY_YOUR_EMAIL_SCREEN = Symbol('VERIFY_YOUR_EMAIL_SCREEN')

// ACTIONS
export const DELETE_ACTION = Symbol('DELETE_ACTION')
export const DELETE_ACTION_PREFERENCES = Symbol('DELETE_ACTION_PREFERENCES')
export const OPTOUT_ACTION = Symbol('OPTOUT_ACTION')
export const RESEND_EMAIL_ACTION = Symbol('RESEND_EMAIL_ACTION')
export const SUBSCRIBE_EXISTING_ACTION = Symbol('SUBSCRIBE_EXISTING_ACTION')
export const SUBSCRIBE_MODAL_ACTION = Symbol('SUBSCRIBE_MODAL_ACTION')
export const UNLOCK_SETTINGS_ACTION = Symbol('UNLOCK_SETTINGS')
export const UNLOCK_SETTINGS_ACTION_NOT_EMAIL = Symbol(
  'UNLOCK_SETTINGS_ACTION_NOT_EMAIL'
)
export const UNLOCK_SETTINGS_ACTION_NOT_VERIFIED = Symbol(
  'UNLOCK_SETTINGS_ACTION_NOT_VERIFIED'
)

// SETTINGS
export const SETTINGS = {
  [DELETE_ACTION]: {
    signatureSettings: {
      requestText: 'delete your email address',
      successText:
        'You have successfully proved ownership of your account and deleted your email address. You can always re-subscribe from the notifications preferences later.',
    },
    successInfo: {
      title: 'Email deleted',
    },
  },
  [OPTOUT_ACTION]: {
    signatureSettings: {
      title: 'Authenticate your account',
      requestText: 'this popup will not be displayed again',
      successText: 'You have successfully proved ownership of your account.',
    },
  },
  [RESEND_EMAIL_ACTION]: {
    signatureSettings: {
      title: 'Resend email verification',
      requestText: 'resend the email verification',
      successText:
        'You have successfully proved ownership of your account and the verification email was re sent.',
    },
  },
  [SUBSCRIBE_EXISTING_ACTION]: {
    signatureSettings: {
      title: 'Authenticate your account',
      requestText: 'authenticate the email address you provided',
      successText: 'You have successfully proved ownership of your account.',
    },
  },
  [SUBSCRIBE_MODAL_ACTION]: {
    signatureSettings: {
      title: 'Subscribe to notification settings',
      requestText: 'authenticate the email address you provided',
      successText: 'You have successfully proved ownership of your account.',
    },
  },
  [UNLOCK_SETTINGS_ACTION]: {
    signatureSettings: {
      title: 'Unlocking notification settings',
      requestText:
        'act as a form of authentication for the email address you provided',
      successText: 'You have successfully proved ownership of your account.',
    },
  },
}
