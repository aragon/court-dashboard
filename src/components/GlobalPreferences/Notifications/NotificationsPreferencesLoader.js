import React from 'react'
import { useWallet } from '../../../providers/Wallet'
import { useSubscriptionDetails } from '../../../hooks/useEmailNotifications'
import NotificationsManager from './NotificationsManager'

function NotificationsPreferencesLoader({ address, token }) {
  const { account } = useWallet()

  const {
    emailExists,
    emailVerified,
    notificationsDisabled,
    // error,
    // errorMsg,
  } = useSubscriptionDetails(account)

  return (
    <NotificationsManager
      account={account}
      paramAddress={address}
      token={token}
      emailExists={emailExists}
      emailVerified={emailVerified}
      notificationsDisabled={notificationsDisabled}
    />
  )
}

export default NotificationsPreferencesLoader
