import React, { useEffect, useState } from 'react'
import { useNotificationActions } from '../../../hooks/useEmailNotifications'
import { verifyJurorEmail } from '../../../services/servicesRequests'

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
  const { getJurorEmail } = useNotificationActions(account)

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
    const getEmail = async () => {
      if (!account || !getJurorEmail) {
        setFetching(false)
        return
      }

      const { needsSignature, email } = await getJurorEmail()
      setJurorNeedsSignature(needsSignature)
      setJurorEmail(email)
      setFetching(false)
    }
    getEmail()
  }, [account, getJurorEmail]) //

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
