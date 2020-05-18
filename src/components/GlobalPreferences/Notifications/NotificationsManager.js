import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useWallet } from '../../../providers/Wallet'
import {
  verifyJurorEmail,
  getJurorEmail,
} from '../../../services/notificationServiceApi'
import { useSubscriptionDetails } from '../../../hooks/useEmailNotifications'
import EmailNotificationsManager from '../../EmailNotifications/EmailNotificationsManager'
import {
  EMAIL_NOTIFICATIONS_FORM_SCREEN,
  NOTIFICATIONS_PREFERENCES_SCREEN,
  UNLOCK_NOTIFICATIONS_SCREEN,
  VERIFICATION_ERROR_SCREEN,
  VERIFICATION_SUCCESS_SCREEN,
  VERIFY_EMAIL_ADDRESS_PREFERENCES,
  LOADING_SCREEN,
} from '../../EmailNotifications/constants'

const NotificationsManager = React.memo(function NotificationsManager() {
  const { account } = useWallet()
  const { search } = useLocation()
  const [startingScreenId, setStartingScreenId] = useState()
  const [jurorNeedsSignature, setJurorNeedsSignature] = useState()
  const [jurorEmail, setJurorEmail] = useState('')

  const {
    emailExists,
    emailVerified,
    notificationsDisabled,
    fetching: fetchingSubscriptionData,
  } = useSubscriptionDetails(account)

  const searchParams = new URLSearchParams(search)
  const address = searchParams.get('address')
  const token = searchParams.get('token')

  useEffect(() => {
    let cancelled = false

    if (!token || !address) {
      return
    }
    const verifyEmailAddress = async () => {
      const { error } = await verifyJurorEmail(address, token)

      if (!cancelled) {
        if (error) {
          return setStartingScreenId(VERIFICATION_ERROR_SCREEN)
        }
        return setStartingScreenId(VERIFICATION_SUCCESS_SCREEN)
      }
    }

    verifyEmailAddress()
    return () => {
      cancelled = true
    }
  }, [account, address, token])

  useEffect(() => {
    let cancelled = false
    const getEmail = async () => {
      if (address || token) {
        return
      }

      if (!account) {
        return setStartingScreenId(UNLOCK_NOTIFICATIONS_SCREEN)
      }

      if (!cancelled) {
        const { needsSignature, email } = await getJurorEmail(account)

        setJurorNeedsSignature(needsSignature)
        setJurorEmail(email)
        if (fetchingSubscriptionData) {
          return setStartingScreenId(LOADING_SCREEN)
        }

        if (!emailVerified && emailExists) {
          return setStartingScreenId(VERIFY_EMAIL_ADDRESS_PREFERENCES)
        }
        if (account && emailVerified && needsSignature) {
          return setStartingScreenId(UNLOCK_NOTIFICATIONS_SCREEN)
        }

        if (account && !emailVerified && !notificationsDisabled) {
          return setStartingScreenId(EMAIL_NOTIFICATIONS_FORM_SCREEN)
        }
        if (account && emailVerified && !needsSignature) {
          return setStartingScreenId(NOTIFICATIONS_PREFERENCES_SCREEN)
        }
      }
    }
    getEmail()
    return () => {
      cancelled = true
    }
  }, [address, account, emailExists, emailVerified, notificationsDisabled, fetchingSubscriptionData, token])

  return (
    startingScreenId && (
      <EmailNotificationsManager
        needsUnlockSettings={jurorNeedsSignature}
        emailExists={emailExists}
        notificationsDisabled={notificationsDisabled}
        email={jurorEmail}
        startingScreen={startingScreenId}
      />
    )
  )
})

export default NotificationsManager
