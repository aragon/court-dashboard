export const DELETE_ACTION = Symbol('DELETE_ACTION')
export const DELETE_ACTION_MODAL = Symbol('DELETE_ACTION_MODAL')
export const DELETE_ACTION_PREFERENCES = Symbol('DELETE_ACTION_PREFERENCES')
export const LOCK_SETTINGS_ACTION = Symbol('LOCK_SETTINGS_ACTION')
export const UNLOCK_SETTINGS_ACTION = Symbol('UNLOCK_SETTINGS')
export const SUBSCRIBE_ACTION = Symbol('SUBSCRIBE_ACTION')

// ************************************** REMOVE AND ADD TO SETTINGS *************************************************************
export const LOCK_SETTINGS_SIGNATURE_SETTINGS = {
  successAction: LOCK_SETTINGS_ACTION,
  title: 'Locking notification settings',
  actionText:
    'act as a form of authentication for the email address you provided',
  successText: 'You have successfully proved ownership of your account.',
}

export const UNLOCK_SIGNATURE_SETTINGS = {
  successAction: UNLOCK_SETTINGS_ACTION,
  title: 'Unlocking notification settings',
  actionText:
    'act as a form of authentication for the email address you provided',
  successText: 'You have successfully proved ownership of your account.',
}

export const DELETE_SIGNATURE_SETTINGS = {
  successAction: DELETE_ACTION,
  actionText: 'delete your email address',
  successText:
    'You have successfully proved ownership of your account and deleted your email address. You can always re-subscribe from Notifications preferences later.',
}

export const DELETE_SIGNATURE_PREFERENCES_SETTINGS = {
  successAction: DELETE_ACTION_PREFERENCES,
  actionText: 'delete your email address',
  successText:
    'You have successfully proved ownership of your account and deleted your email address. You can always re-subscribe from Notifications preferences later.',
}

// ***************************************************************************************************

// SCREENS
export const EMAIL_NOTIFICATIONS_FORM_SCREEN = Symbol(
  'EMAIL_NOTIFICATIONS_FORM_SCREEN'
)

export const UNLOCK_NOTIFICATIONS_SCREEN = Symbol('UNLOCK_NOTIFICATIONS_SCREEN')

export const EMAIL_NOTIFICATIONS_EXISTING_EMAIL_SCREEN = Symbol(
  'EMAIL_NOTIFICATIONS_EXISTING_EMAIL_SCREEN'
)

export const EMAIL_NOTIFICATIONS_ERROR_SCREEN = Symbol(
  'EMAIL_NOTIFICATION_ERROR_SCREEN'
)

export const EMAIL_NOTIFICATIONS_SUCCESS_SCREEN = Symbol(
  'EMAIL_NOTIFICATIONS_SUCCESS_SCREEN'
)

export const NOTIFICATIONS_PREFERENCES_SCREEN = Symbol(
  'NOTIFICATIONS_PREFERENCES_SCREEN'
)
export const SIGNATURE_REQUEST_SCREEN = Symbol('SIGNATURE_REQUEST_SCREEN')

export const VERIFY_YOUR_EMAIL_SCREEN = Symbol('VERIFY_YOUR_EMAIL_SCREEN')

export const DELETE_EMAIL_SCREEN = Symbol('DELETE_EMAIL_SCREEN')

export const PREFERENCES_UPDATE_EMAIL_SCREEN = Symbol(
  'PREFERENCES_UPDATE_EMAIL_SCREEN'
)

export const SIGNATURE_SUCCESS_SCREEN = Symbol('SIGNATURE_SUCCESS_SCREEN')

export const SUCCESS_INFO_SCREEN = Symbol('SUCCESS_INFO_SCREEN')

//* *********************************** ACTIONS *************************************************************************

export const OPTOUT_ACTION = Symbol('OPTOUT_ACTION')
export const RESEND_EMAIL_ACTION = Symbol('RESEND_EMAIL_ACTION')
export const SUBSCRIBE_EXISTING_ACTION = Symbol('SUBSCRIBE_EXISTING_ACTION')
export const SUBSCRIBE_MODAL_ACTION = Symbol('SUBSCRIBE_MODAL_ACTION')

//* *********************************** STATUS INFO *************************************************************************

export const SETTINGS = {
  [SUBSCRIBE_MODAL_ACTION]: {
    signatureSettings: {
      title: 'Subscribe to notification settings',
      requestText: 'authenticate the email address you provided',
      successText: 'You have successfully proved ownership of your account.',
    },
  },
  [SUBSCRIBE_EXISTING_ACTION]: {
    signatureSettings: {
      title: 'Authenticate your account',
      requestText: 'authenticate the email address you provided',
      successText: 'You have successfully proved ownership of your account.',
    },
  },
  [OPTOUT_ACTION]: {
    signatureSettings: {
      title: 'Opt-out email notifications',
      requestText: 'opt you out from email notifications',
      successText:
        'You have successfully proved ownership of your account and opted out of the email notifications service. You can always opt in again if you go to the Notifications settings, in Global preferences.',
    },
    successInfo: {
      title: 'Opt out',
      text:
        'You have successfully opted out of the email notifications service. You can always opt in again if you go to the Notifications settings, in Global preferences.',
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
}
