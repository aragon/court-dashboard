import React, { useEffect, useState } from 'react'
import {
  verifyJurorEmail,
  getJurorEmail,
} from '../../../services/servicesRequests'

import EmailNotificationsManager from '../../EmailNotifications/EmailNotificationsManager'
import {
  EMAIL_NOTIFICATIONS_FORM_SCREEN,
  NOTIFICATIONS_PREFERENCES_SCREEN,
  UNLOCK_NOTIFICATIONS_SCREEN,
  VERIFICATION_ERROR_SCREEN,
  VERIFICATION_SUCCESS_SCREEN,
} from '../../EmailNotifications/constants'

const NotificationsManager = React.memo(function NotificationsManager({
  account,
  emailExists,
  emailVerified,
  notificationsDisabled,
  paramAddress,
  token,
}) {
  const [jurorNeedsSignature, setJurorNeedsSignature] = useState()
  const [jurorEmail, setJurorEmail] = useState('')
  const [fetching, setFetching] = useState(true)
  const [verificationError, setVerificationError] = useState(false)

  useEffect(() => {
    let cancelled = false

    if (!token && !paramAddress) {
      return
    }
    const verifyEmailAddress = async () => {
      const { verified } = await verifyJurorEmail(paramAddress, token)

      if (!cancelled) {
        if (!verified) {
          setVerificationError(true)
        }
      }
    }

    verifyEmailAddress()
    return () => {
      cancelled = true
    }
  }, [account, paramAddress, token])

  useEffect(() => {
    let cancelled = false
    const getEmail = async () => {
      if (!account) {
        setFetching(false)
        return
      }

      if (!cancelled) {
        const { needsSignature, email } = await getJurorEmail(account)
        setJurorNeedsSignature(needsSignature)
        setJurorEmail(email)
        setFetching(false)
      }
    }
    getEmail()
    return () => {
      cancelled = true
    }
  }, [account])

  const startingScreenId = getStartingScreen(
    account,
    emailExists,
    emailVerified,
    notificationsDisabled,
    jurorNeedsSignature,
    token,
    verificationError
  )

  return (
    !fetching && (
      <EmailNotificationsManager
        needsUnlockSettings={jurorNeedsSignature}
        isModal={false}
        account={account}
        emailExists={emailExists}
        notificationsDisabled={notificationsDisabled}
        email={jurorEmail}
        startingScreen={startingScreenId}
      />
    )
  )
})

function getStartingScreen(
  account,
  emailExists,
  emailVerifiedd,
  notificationsDisabled,
  jurorNeedsSignature,
  token,
  verificationError
) {
  if (token) {
    if (verificationError) {
      return VERIFICATION_ERROR_SCREEN
    }
    return VERIFICATION_SUCCESS_SCREEN
  }
  const emailVerified = true
  if (!account || (account && emailVerified && jurorNeedsSignature)) {
    return UNLOCK_NOTIFICATIONS_SCREEN
  }
  if (account && !emailVerified && !notificationsDisabled) {
    return EMAIL_NOTIFICATIONS_FORM_SCREEN
  }
  if (account && emailVerified && !jurorNeedsSignature) {
    return NOTIFICATIONS_PREFERENCES_SCREEN
  }
}

export default NotificationsManager
