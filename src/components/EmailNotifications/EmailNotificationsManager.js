import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { animated, Transition } from 'react-spring/renderprops'
import { Box, useViewport } from '@aragon/ui'
import { useWallet } from '../../providers/Wallet'
import { getProviderFromUseWalletId } from '../../ethereum-providers'

import EmailNotificationsForm from './EmailNotificationsForm'
import ExistingEmailSubscription from './ExistingEmailSubscription'
import StatusInfo from './StatusInfo'
import SignatureRequest from '../SignatureRequest'
import VerifyEmailAddress from './VerifyEmailAddress'

import { actions } from './actions'

import {
  createSession,
  resendVerificationEmail,
  subscribeToNotifications,
  subscribeExistingEmail,
  switchNotificationsStatus,
} from '../../services/servicesRequests'
import {
  EMAIL_NOTIFICATIONS_ERROR_SCREEN,
  EMAIL_NOTIFICATIONS_EXISTING_EMAIL_SCREEN,
  EMAIL_NOTIFICATIONS_FORM_SCREEN,
  NOTIFICATIONS_PREFERENCES_SCREEN,
  RESEND_EMAIL_ACTION,
  SIGNATURE_REQUEST_SCREEN,
  SIGNATURE_SUCCESS_SCREEN,
  SUBSCRIBE_EXISTING_ACTION,
  SUBSCRIBE_MODAL_ACTION,
  SUCCESS_INFO_SCREEN,
  VERIFY_YOUR_EMAIL_SCREEN,
  OPTOUT_ACTION,
  SETTINGS,
} from './constants'

const DEFAULT_ERROR_SETTINGS = {
  error: true,
  title: 'Cannot connect to Notifications server',
  description:
    'There was a problem when trying to connect to the Email Notifications server. Make sure your Internet connection is working and please try again. ',
}

const DEFAULT_SUBSCRIPTION_PROGRESS = {
  needSignature: false,
  serviceError: false,
  signatureError: false,
  startRequest: false,
  action: null,
  nextScreen: null,
  email: null,
  signHash: null,
  signTimestamp: null,
  signatureTitle: '',
  signRequestText: '',
  signSuccessText: '',
  statusInfoTitle: '',
  statusInfoText: '',
}

const EmailNotificationsManager = React.memo(
  function EmailNotificationsManager({
    isModal,
    account,
    needsUnlockSettings,
    emailExists,
    notificationsDisabled,
    email,
    onClose,
    visible,
    startingScreen,
  }) {
    const [screenId, setScreenId] = useState(
      emailExists
        ? EMAIL_NOTIFICATIONS_EXISTING_EMAIL_SCREEN
        : EMAIL_NOTIFICATIONS_FORM_SCREEN
    )
    const [subscriptionProgress, setSubscriptionProgress] = useState(
      DEFAULT_SUBSCRIPTION_PROGRESS
    )

    const wallet = useWallet()
    const provider = getProviderFromUseWalletId(wallet.activated)

    const { below } = useViewport()
    const compactMode = below('medium')

    const defaultSignRequestText = useMemo(() => {
      return `Open ${provider.name} to complete the
        signature request. Signing this message will prove ownership of your
        account and `
    }, [provider.name])

    const handleOnSubscribe = useCallback(
      async email => {
        const {
          needsSignature: subscribeNeedsSignature,
          error: errorSubscribing,
        } = await subscribeToNotifications(account, email)

        if (errorSubscribing && !subscribeNeedsSignature) {
          setSubscriptionProgress({ serviceError: true })
          return
        }

        if (!subscribeNeedsSignature) {
          setSubscriptionProgress(signatureProgress => ({
            ...signatureProgress,
            email: email,
          }))
          setScreenId(VERIFY_YOUR_EMAIL_SCREEN)
          return
        }

        const subscribeSettings = SETTINGS[SUBSCRIBE_MODAL_ACTION]

        setSubscriptionProgress(signatureProgress => ({
          ...signatureProgress,
          needSignature: subscribeNeedsSignature,
          mode: SUBSCRIBE_MODAL_ACTION,
          email: email,
          signatureTitle: subscribeSettings.signatureSettings.title,
          signRequestText:
            defaultSignRequestText +
            subscribeSettings.signatureSettings.requestText,
          signSuccessText: subscribeSettings.signatureSettings.successText,
        }))
      },
      [account, defaultSignRequestText]
    )

    const handleOnSubscribeExistingEmail = useCallback(async () => {
      const {
        needsSignature,
        email: existingEmail,
        error,
      } = await subscribeExistingEmail(account)

      console.log('existing EMAIL ', existingEmail)
      if (error && !needsSignature) {
        setSubscriptionProgress({ serviceError: true })
        return
      }

      if (!needsSignature) {
        setSubscriptionProgress(signatureProgress => ({
          ...signatureProgress,
          email: existingEmail,
        }))
        setScreenId(VERIFY_YOUR_EMAIL_SCREEN)
        return
      }

      const subscribeSettings = SETTINGS[SUBSCRIBE_EXISTING_ACTION]

      setSubscriptionProgress(signatureProgress => ({
        ...signatureProgress,
        needSignature: needsSignature,
        mode: SUBSCRIBE_EXISTING_ACTION,
        email: existingEmail,
        signatureTitle: subscribeSettings.signatureSettings.title,
        signRequestText:
          defaultSignRequestText +
          subscribeSettings.signatureSettings.requestText,
        signSuccessText: subscribeSettings.signatureSettings.successText,
      }))
    }, [account, defaultSignRequestText])

    const handleOnOptOut = useCallback(async () => {
      const { error, needsSignature } = await switchNotificationsStatus(
        account,
        true
      )

      if (error && !needsSignature) {
        setSubscriptionProgress({ serviceError: true })
        return
      }

      const optOutSettings = SETTINGS[OPTOUT_ACTION]

      if (!needsSignature) {
        setSubscriptionProgress(signatureProgress => ({
          ...signatureProgress,
          statusInfoTitle: optOutSettings.successInfo.title,
          statusInfoText: optOutSettings.successInfo.text,
        }))
        setScreenId(SUCCESS_INFO_SCREEN)
        return
      }

      setSubscriptionProgress(signatureProgress => ({
        ...signatureProgress,
        needSignature: needsSignature,
        mode: OPTOUT_ACTION,
        signatureTitle: optOutSettings.signatureSettings.title,
        signRequestText:
          defaultSignRequestText + optOutSettings.signatureSettings.requestText,
        signSuccessText: optOutSettings.signatureSettings.successText,
      }))
    }, [account, defaultSignRequestText])

    const handleOnResendEmail = useCallback(async () => {
      const { needsSignature, error } = await resendVerificationEmail(account)

      if (error && !needsSignature) {
        setSubscriptionProgress({ serviceError: true })
        return
      }

      if (!needsSignature) {
        setSubscriptionProgress(signatureProgress => ({
          ...signatureProgress,
        }))
        setScreenId(VERIFY_YOUR_EMAIL_SCREEN)
        return
      }

      const resendSettings = SETTINGS[RESEND_EMAIL_ACTION]

      setSubscriptionProgress(signatureProgress => ({
        ...signatureProgress,
        needSignature: needsSignature,
        mode: RESEND_EMAIL_ACTION,
        signatureTitle: resendSettings.signatureSettings.title,
        signRequestText:
          defaultSignRequestText + resendSettings.signatureSettings.requestText,
        signSuccessText: resendSettings.signatureSettings.successText,
      }))
    }, [account, defaultSignRequestText])

    const handleOnSignSuccess = useCallback((signHash, timestamp) => {
      setSubscriptionProgress(signatureProgress => ({
        ...signatureProgress,
        startRequest: true,
        signHash: signHash,
        signTimestamp: timestamp,
      }))
    }, [])

    useEffect(() => {
      let cancelled = false

      if (!subscriptionProgress.startRequest) {
        return
      }

      const requestAction = async () => {
        if (subscriptionProgress.needSignature) {
          const { error: errorCreatingSession } = await createSession(
            account,
            subscriptionProgress.signHash,
            subscriptionProgress.signTimestamp
          )
          if (errorCreatingSession && !cancelled) {
            setSubscriptionProgress(signatureProgress => ({
              ...signatureProgress,
              serviceError: true,
            }))
          }
        }

        const action = actions[subscriptionProgress.mode]

        let params = [account]

        if (action.params) {
          params = [...params, ...action.params]
        }

        if (action.requiresEmail) {
          params.push(subscriptionProgress.email)
        }

        const { error } = await action.request(...params)

        if (!cancelled) {
          if (error) {
            return setSubscriptionProgress(signatureProgress => ({
              ...signatureProgress,
              serviceError: true,
            }))
          }

          setScreenId(SIGNATURE_SUCCESS_SCREEN)

          if (action.successScreen) {
            const timer = setTimeout(() => {
              setScreenId(action.successScreen)
            }, 3000)

            return () => clearTimeout(timer)
          }
        }
      }
      requestAction()
      return () => {
        cancelled = true
      }
    }, [
      account,
      subscriptionProgress.email,
      subscriptionProgress.mode,
      subscriptionProgress.startRequest,
      subscriptionProgress.needSignature,
      subscriptionProgress.signHash,
      subscriptionProgress.signTimestamp,
    ])

    useEffect(() => {
      if (!subscriptionProgress.serviceError) {
        return
      }
      setScreenId(EMAIL_NOTIFICATIONS_ERROR_SCREEN)
    }, [subscriptionProgress.serviceError])

    useEffect(() => {
      if (!subscriptionProgress.signatureError) {
        return
      }
      setScreenId(EMAIL_NOTIFICATIONS_ERROR_SCREEN)
    }, [subscriptionProgress.signatureError])

    useEffect(() => {
      if (!subscriptionProgress.needSignature) {
        return
      }

      setScreenId(SIGNATURE_REQUEST_SCREEN)
    }, [subscriptionProgress.needSignature])

    console.log('screenId ', screenId)

    return (
      <WrappedContainer isModal={isModal} screenId={screenId}>
        {(() => {
          if (screenId === SIGNATURE_REQUEST_SCREEN) {
            return (
              <SignatureRequest
                mode="request"
                compactMode={compactMode}
                title={subscriptionProgress.signatureTitle}
                text={subscriptionProgress.signRequestText}
                onSignSuccess={handleOnSignSuccess}
              />
            )
          }

          if (screenId === SIGNATURE_SUCCESS_SCREEN) {
            return (
              <SignatureRequest
                mode="success"
                compactMode={compactMode}
                title={subscriptionProgress.signatureTitle}
                text={subscriptionProgress.signSuccessText}
              />
            )
          }

          if (screenId === EMAIL_NOTIFICATIONS_ERROR_SCREEN) {
            const { title, description } = DEFAULT_ERROR_SETTINGS
            return <StatusInfo error title={title} description={description} />
          }

          if (screenId === SUCCESS_INFO_SCREEN) {
            return (
              <StatusInfo
                error={false}
                title={subscriptionProgress.statusInfoTitle}
                description={subscriptionProgress.statusInfoText}
              />
            )
          }

          if (screenId === EMAIL_NOTIFICATIONS_FORM_SCREEN) {
            return (
              <EmailNotificationsForm
                isModal={isModal}
                account={account}
                compactMode={compactMode}
                onOptOut={handleOnOptOut}
                onSubscribeToNotifications={handleOnSubscribe}
              />
            )
          }

          if (screenId === EMAIL_NOTIFICATIONS_EXISTING_EMAIL_SCREEN) {
            return (
              <ExistingEmailSubscription
                account={account}
                compactMode={compactMode}
                onOptOut={handleOnOptOut}
                onSubscribeToNotifications={handleOnSubscribeExistingEmail}
              />
            )
          }

          if (screenId === VERIFY_YOUR_EMAIL_SCREEN) {
            return (
              <VerifyEmailAddress
                updateMode={emailExists}
                compactMode={compactMode}
                email={subscriptionProgress.email}
                onResendEmail={handleOnResendEmail}
                onSubscribe={handleOnSubscribe}
                onDeleteEmail={() => {}}
              />
            )
          }
        })()}
      </WrappedContainer>
    )
  }
)

const WrappedContainer = React.memo(function AnimatedModal({ ...props }) {
  const { isModal, screenId } = props

  if (isModal || screenId === NOTIFICATIONS_PREFERENCES_SCREEN) {
    return <AnimatedContainer {...props} />
  }

  return (
    <Box
      css={`
        display: flex;
        justify-content: center;
      `}
    >
      <div
        css={`
          max-width: 800px;
        `}
      >
        <AnimatedContainer {...props} />
      </div>
    </Box>
  )
})

const AnimatedContainer = React.memo(function AnimatedModal({
  isModal,
  screenId,
  children,
}) {
  return (
    <Transition
      items={{ children, screenId }}
      keys={({ screenId }) => screenId}
      from={{
        position: 'absolute',
        opacity: 0,
        transform: 'scale3d(1.20 1.20, 1)',
      }}
      enter={{
        position: 'static',
        opacity: 1,
        transform: 'scale3d(1, 1, 1)',
      }}
      leave={{
        position: 'absolute',
        opacity: 0,
        transform: 'scale3d(0.80, 0.80, 1)',
      }}
      native
    >
      {({ children, screenId }) => props =>
        isModal ? (
          <animated.div style={{ ...props }}>{children}</animated.div>
        ) : (
          <animated.div
            style={{
              ...props,
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            {children}
          </animated.div>
        )}
    </Transition>
  )
})

export default EmailNotificationsManager
