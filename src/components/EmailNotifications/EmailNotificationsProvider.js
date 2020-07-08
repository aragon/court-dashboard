import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { useWallet } from '../../providers/Wallet'
import {
  getJurorEmail,
  getSubscriptionDetails,
  subscribeExistingEmail,
  subscribeToNotifications,
} from '../../services/servicesRequests'

const EmailNotificationsContext = React.createContext()

function EmailNotificationsProvider({ children }) {
  const { account } = useWallet()

  const asyncCancelled = useRef(false)
  const [email, setEmail] = useState(null)
  const [needsSignature, setNeedsSignature] = useState(false)
  const [subscriptionDetails, setSubscriptionDetails] = useState({
    error: null,
    fetching: false,
  })

  const handleOnSubscribe = useCallback(
    async email => {
      const response = await subscribeToNotifications(account, email)

      if (response.error && !response.needsSignature) {
        return response.error
      }

      if (!asyncCancelled.current) {
        setEmail(email)
        if (needsSignature !== Boolean(response.needsSignature)) {
          setNeedsSignature(!needsSignature)
        }
      }
    },
    [account, needsSignature]
  )

  const handleOnSubscribeExistingEmail = useCallback(async () => {
    const response = await subscribeExistingEmail(account)

    if (response.error && !response.needsSignature) {
      return response.error
    }

    if (!asyncCancelled.current) {
      if (email !== response.email) {
        setEmail(response.email)
        if (needsSignature !== Boolean(response.needsSignature)) {
          setNeedsSignature(!needsSignature)
        }
      }
    }
  }, [account, email, needsSignature])

  // Cancel any async requests if this provider is unmounted
  useEffect(() => {
    return () => {
      asyncCancelled.current = true
    }
  }, [])

  // When account connects, fetch their subscription details
  useEffect(() => {
    if (!account) {
      return
    }

    const fetchSubscriptionDetails = async () => {
      const response = await getSubscriptionDetails(account)

      if (!asyncCancelled.current) {
        setSubscriptionDetails({
          ...response,
          fetching: false,
        })
      }
    }

    setSubscriptionDetails(subscriptionDetails => ({
      ...subscriptionDetails,
      error: null,
      fetching: true,
    }))
    fetchSubscriptionDetails()
  }, [account])

  // Once we know the account has an associated email, fetch its email
  useEffect(() => {
    if (!subscriptionDetails.emailExists) {
      return
    }

    const getEmail = async () => {
      const { needsSignature, email } = await getJurorEmail(account)

      if (!asyncCancelled.current) {
        if (email) {
          setEmail(email)
        }
        if (needsSignature) {
          setNeedsSignature(true)
        }
      }
    }

    getEmail()
  }, [account, subscriptionDetails.emailExists])

  return (
    <EmailNotificationsContext.Provider
      value={{
        email,
        handleOnSubscribe,
        handleOnSubscribeExistingEmail,
        needsSignature,
        subscriptionDetails,
      }}
    >
      {children}
    </EmailNotificationsContext.Provider>
  )
}

EmailNotificationsProvider.propTypes = {
  children: PropTypes.node,
}

function useEmailNotifications() {
  return useContext(EmailNotificationsContext)
}

export { EmailNotificationsProvider, useEmailNotifications }
