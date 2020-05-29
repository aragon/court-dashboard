import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react'
import { animated, Spring, Transition } from 'react-spring/renderprops'
import {
  Box,
  GU,
  IconConnect,
  springs,
  useInside,
  useToast,
  useViewport,
} from '@aragon/ui'
import { useWallet } from '../../providers/Wallet'
import { getProviderFromUseWalletId } from '../../ethereum-providers'

import DeleteEmail from './DeleteEmail'
import EmailNotificationsForm from './EmailNotificationsForm'
import ExistingEmailSubscription from './ExistingEmailSubscription'
import LoadingPreferences from '../GlobalPreferences/Notifications/LoadingPreferences'
import NotificationsPreferences from '../GlobalPreferences/Notifications/NotificationsPreferences'
import StatusInfo from './StatusInfo'
import SignatureRequest from '../SignatureRequest'
import UnlockNotifications from '../GlobalPreferences/Notifications/UnlockNotifications'
import VerifyEmailAddress from './VerifyEmailAddress'
import VerifyEmailAddressPreferences from '../GlobalPreferences/Notifications/VerifyEmailAddressPreferences'

import { actions } from './actions'

import {
  createSession,
  deleteCurrentSession,
  deleteJurorEmail,
  resendVerificationEmail,
  subscribeToNotifications,
  subscribeExistingEmail,
  switchNotificationsStatus,
} from '../../services/notificationServiceApi'
import {
  DELETE_ACTION,
  DELETE_ACTION_PREFERENCES,
  DELETE_EMAIL_SCREEN,
  EMAIL_NOTIFICATIONS_ERROR_SCREEN,
  EMAIL_NOTIFICATIONS_EXISTING_EMAIL_SCREEN,
  EMAIL_NOTIFICATIONS_FORM_SCREEN,
  LOADING_SCREEN,
  NOTIFICATIONS_PREFERENCES_SCREEN,
  OPTOUT_ACTION,
  RESEND_EMAIL_ACTION,
  SETTINGS,
  SIGNATURE_REQUEST_SCREEN,
  SIGNATURE_SUCCESS_SCREEN,
  SUBSCRIBE_EXISTING_ACTION,
  SUBSCRIBE_MODAL_ACTION,
  SUCCESS_INFO_SCREEN,
  UNLOCK_SETTINGS_ACTION,
  UNLOCK_SETTINGS_ACTION_NOT_EMAIL,
  UNLOCK_SETTINGS_ACTION_NOT_VERIFIED,
  UNLOCK_NOTIFICATIONS_SCREEN,
  VERIFICATION_ERROR_SCREEN,
  VERIFICATION_SUCCESS_SCREEN,
  VERIFY_EMAIL_ADDRESS_PREFERENCES,
  VERIFY_YOUR_EMAIL_SCREEN,
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
  verifyUpdateMode: false,
  previousScreen: null,
  needsUnlockSettings: false,
  emailVerified: false,
  emailExists: false,
}

const EmailNotificationsManager = React.memo(
  function EmailNotificationsManager({
    needsUnlockSettings,
    emailExists,
    emailVerified,
    notificationsDisabled,
    email,
    startingScreen,
    onReturnToDashboard,
  }) {
    const [screenId, setScreenId] = useState(
      emailExists
        ? EMAIL_NOTIFICATIONS_EXISTING_EMAIL_SCREEN
        : EMAIL_NOTIFICATIONS_FORM_SCREEN
    )

    const [subscriptionProgress, setSubscriptionProgress] = useState({
      ...DEFAULT_SUBSCRIPTION_PROGRESS,
      email,
      emailExists,
      notificationsDisabled,
      needsUnlockSettings,
      emailVerified,
    })

    const wallet = useWallet()
    const account = wallet.account
    const [insideModal] = useInside('NotificationsModal')
    const provider = getProviderFromUseWalletId(wallet.activated)
    const toast = useToast()

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
          setSubscriptionProgress(subscriptionProgress => ({
            ...subscriptionProgress,
            email: email,
            verifyUpdateMode: false,
          }))
          setScreenId(VERIFY_YOUR_EMAIL_SCREEN)
          return
        }

        const subscribeSettings = SETTINGS[SUBSCRIBE_MODAL_ACTION]

        setSubscriptionProgress(subscriptionProgress => ({
          ...subscriptionProgress,
          needSignature: subscribeNeedsSignature,
          mode: SUBSCRIBE_MODAL_ACTION,
          email: email,
          signatureTitle: subscribeSettings.signatureSettings.title,
          signRequestText:
            defaultSignRequestText +
            subscribeSettings.signatureSettings.requestText,
          signSuccessText: subscribeSettings.signatureSettings.successText,
          verifyUpdateMode: false,
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

      if (error && !needsSignature) {
        setSubscriptionProgress({ serviceError: true })
        return
      }

      if (!needsSignature) {
        setSubscriptionProgress(subscriptionProgress => ({
          ...subscriptionProgress,
          email: existingEmail,
          verifyUpdateMode: true,
        }))
        setScreenId(VERIFY_YOUR_EMAIL_SCREEN)
        return
      }

      const subscribeSettings = SETTINGS[SUBSCRIBE_EXISTING_ACTION]

      setSubscriptionProgress(subscriptionProgress => ({
        ...subscriptionProgress,
        needSignature: needsSignature,
        mode: SUBSCRIBE_EXISTING_ACTION,
        signatureTitle: subscribeSettings.signatureSettings.title,
        signRequestText:
          defaultSignRequestText +
          subscribeSettings.signatureSettings.requestText,
        signSuccessText: subscribeSettings.signatureSettings.successText,
        verifyUpdateMode: true,
      }))
    }, [account, defaultSignRequestText])

    const handleOnOptOut = useCallback(async () => {
      const optOutSettings = SETTINGS[OPTOUT_ACTION]

      setSubscriptionProgress(subscriptionProgress => ({
        ...subscriptionProgress,
        needSignature: true,
        mode: OPTOUT_ACTION,
        signatureTitle: optOutSettings.signatureSettings.title,
        signRequestText:
          defaultSignRequestText + optOutSettings.signatureSettings.requestText,
        signSuccessText: optOutSettings.signatureSettings.successText,
      }))
    }, [defaultSignRequestText])

    const handleOnResendEmail = useCallback(async () => {
      const { needsSignature, error } = await resendVerificationEmail(account)

      if (error && !needsSignature) {
        setSubscriptionProgress({ serviceError: true })
        return
      }

      if (!needsSignature) {
        setSubscriptionProgress(subscriptionProgress => ({
          ...subscriptionProgress,
        }))
        toast('A verification email has been resent.')
        return
      }

      const resendSettings = SETTINGS[RESEND_EMAIL_ACTION]

      setSubscriptionProgress(subscriptionProgress => ({
        ...subscriptionProgress,
        needSignature: needsSignature,
        mode: RESEND_EMAIL_ACTION,
        signatureTitle: resendSettings.signatureSettings.title,
        signRequestText:
          defaultSignRequestText + resendSettings.signatureSettings.requestText,
        signSuccessText: resendSettings.signatureSettings.successText,
      }))
    }, [account, defaultSignRequestText, toast])

    const handleOnDeleteConfirmation = useCallback(() => {
      setSubscriptionProgress(subscriptionProgress => ({
        ...subscriptionProgress,
        previousScreen: screenId,
      }))
      setScreenId(DELETE_EMAIL_SCREEN)
    }, [screenId])

    const handleOnCancelDelete = useCallback(() => {
      setScreenId(subscriptionProgress.previousScreen)
    }, [subscriptionProgress.previousScreen])

    const handleOnDelete = useCallback(async () => {
      const { error, needsSignature } = await deleteJurorEmail(account)

      if (error && !needsSignature) {
        setSubscriptionProgress({ serviceError: true })
        return
      }

      const deleteSettings = SETTINGS[DELETE_ACTION]

      if (!needsSignature) {
        if (insideModal) {
          setSubscriptionProgress(subscriptionProgress => ({
            ...subscriptionProgress,
            statusInfoTitle: deleteSettings.successInfo.title,
            statusInfoText: `Your email ${subscriptionProgress.email} was succefully deleted. You can always re-subscribe from the notifications preferences later.`,
          }))
        }
        setSubscriptionProgress(subscriptionProgress => ({
          ...subscriptionProgress,
          email: '',
        }))
        setScreenId(
          insideModal ? SUCCESS_INFO_SCREEN : EMAIL_NOTIFICATIONS_FORM_SCREEN
        )
        return
      }

      setSubscriptionProgress(subscriptionProgress => ({
        ...subscriptionProgress,
        needSignature: needsSignature,
        mode: insideModal ? DELETE_ACTION : DELETE_ACTION_PREFERENCES,
        signatureTitle: `Delete "${subscriptionProgress.email}"`,
        signRequestText:
          defaultSignRequestText + deleteSettings.signatureSettings.requestText,
        signSuccessText: deleteSettings.signatureSettings.successText,
      }))
    }, [account, defaultSignRequestText, insideModal])

    const handleOnUnlockSettings = useCallback(() => {
      const unlockSettings = SETTINGS[UNLOCK_SETTINGS_ACTION]

      setSubscriptionProgress(subscriptionProgress => ({
        ...subscriptionProgress,
        needSignature: true,
        mode: !subscriptionProgress.emailExists
          ? UNLOCK_SETTINGS_ACTION_NOT_EMAIL
          : subscriptionProgress.emailVerified
          ? UNLOCK_SETTINGS_ACTION
          : UNLOCK_SETTINGS_ACTION_NOT_VERIFIED,
        signatureTitle: unlockSettings.signatureSettings.title,
        signRequestText:
          defaultSignRequestText + unlockSettings.signatureSettings.requestText,
        signSuccessText: unlockSettings.signatureSettings.successText,
      }))
    }, [defaultSignRequestText])

    const handleOnUpdateEmail = useCallback(() => {
      setScreenId(EMAIL_NOTIFICATIONS_FORM_SCREEN)
    }, [])

    const handleOnLockSettings = useCallback(async () => {
      const { error, needsSignature } = await deleteCurrentSession(account)

      if (error && !needsSignature) {
        setSubscriptionProgress({ serviceError: true })
        return
      }
      setSubscriptionProgress(subscriptionProgress => ({
        ...subscriptionProgress,
        needsUnlockSettings: true,
      }))
      setScreenId(UNLOCK_NOTIFICATIONS_SCREEN)
    }, [account])

    const handleSwitchNotifications = useCallback(
      async disabled => {
        const {
          error,
          needsSignature,
          disabled: notificationsDisabled,
        } = await switchNotificationsStatus(account, disabled)

        if (error && !needsSignature) {
          setSubscriptionProgress({ serviceError: true })
          return
        }

        if (!needsSignature) {
          setSubscriptionProgress(subscriptionProgress => ({
            ...subscriptionProgress,
            notificationsDisabled: notificationsDisabled,
          }))
          setScreenId(NOTIFICATIONS_PREFERENCES_SCREEN)
          return
        }

        setScreenId(UNLOCK_NOTIFICATIONS_SCREEN)
      },
      [account]
    )

    const handleOnSignSuccess = useCallback((signHash, timestamp) => {
      setSubscriptionProgress(subscriptionProgress => ({
        ...subscriptionProgress,
        startRequest: true,
        signHash: signHash,
        signTimestamp: timestamp,
      }))
    }, [])

    useEffect(() => {
      if (!startingScreen) {
        return
      }
      setScreenId(startingScreen)
    }, [startingScreen])

    useEffect(() => {
      setSubscriptionProgress(subscriptionProgress => ({
        ...subscriptionProgress,
        needsUnlockSettings,
        email,
        emailVerified,
        emailExists,
        notificationsDisabled,
      }))
    }, [
      account,
      needsUnlockSettings,
      email,
      emailVerified,
      emailExists,
      notificationsDisabled,
    ])

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
            setSubscriptionProgress(subscriptionProgress => ({
              ...subscriptionProgress,
              serviceError: true,
            }))
          }
        }

        const action = actions[subscriptionProgress.mode]
        let returnedJurorEmail = ''

        if (action.request) {
          let params = [account]

          if (action.params) {
            params = [...params, ...action.params]
          }

          if (action.requiresEmail) {
            params.push(subscriptionProgress.email)
          }

          const { error, email } = await action.request(...params)

          if (!cancelled) {
            if (error) {
              return setSubscriptionProgress(subscriptionProgress => ({
                ...subscriptionProgress,
                serviceError: true,
              }))
            }

            if (email) {
              returnedJurorEmail = email
            }
          }
        }

        if (!cancelled) {
          setScreenId(SIGNATURE_SUCCESS_SCREEN)

          if (action.successScreen) {
            const timer = setTimeout(() => {
              setScreenId(action.successScreen)
            }, 3000)
            setSubscriptionProgress(subscriptionProgress => ({
              ...subscriptionProgress,
              needSignature: false,
              email: returnedJurorEmail || subscriptionProgress.email,
              startRequest: false,
            }))

            return () => clearTimeout(timer)
          }
          setSubscriptionProgress(subscriptionProgress => ({
            ...subscriptionProgress,
            needSignature: false,
            email: returnedJurorEmail || subscriptionProgress.email,
            startRequest: false,
          }))
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
      if (!subscriptionProgress.needSignature) {
        return
      }

      setScreenId(SIGNATURE_REQUEST_SCREEN)
    }, [subscriptionProgress.needSignature])

    return (
      <WrappedContainer screenId={screenId}>
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
                account={account}
                existingEmail={subscriptionProgress.email}
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
                updateMode={subscriptionProgress.verifyUpdateMode}
                compactMode={compactMode}
                email={subscriptionProgress.email}
                onResendEmail={handleOnResendEmail}
                onSubscribe={handleOnSubscribe}
                onDeleteEmail={handleOnDeleteConfirmation}
              />
            )
          }
          if (screenId === DELETE_EMAIL_SCREEN) {
            return (
              <DeleteEmail
                email={subscriptionProgress.email}
                onDelete={handleOnDelete}
                onCancel={handleOnCancelDelete}
              />
            )
          }
          if (screenId === UNLOCK_NOTIFICATIONS_SCREEN) {
            return (
              <UnlockNotifications
                compactMode={compactMode}
                onUnlock={handleOnUnlockSettings}
                needsUnlockSettings={
                  account && subscriptionProgress.needsUnlockSettings
                }
                onReturnToDashboard={onReturnToDashboard}
              />
            )
          }
          if (screenId === NOTIFICATIONS_PREFERENCES_SCREEN) {
            return (
              <NotificationsPreferences
                email={subscriptionProgress.email}
                notificationsDisabled={
                  subscriptionProgress.notificationsDisabled
                }
                onSwitchNotificationsStatus={handleSwitchNotifications}
                onLockSettings={handleOnLockSettings}
                onDeleteEmail={handleOnDeleteConfirmation}
                onUpdateEmail={handleOnUpdateEmail}
              />
            )
          }
          if (screenId === VERIFICATION_ERROR_SCREEN) {
            return (
              <StatusInfo
                error
                title="Verification failed"
                description="The email verification link was invalid or it has timed out. Please try again."
              />
            )
          }
          if (screenId === VERIFICATION_SUCCESS_SCREEN) {
            return (
              <StatusInfo
                error={false}
                title="Verification was successful"
                description={
                  <span
                    css={`
                      display: flex;
                      flex-wrap: wrap;
                      justify-content: center;
                    `}
                  >
                    Go back to the dashboard and
                    <span
                      css={`
                        display: inline-flex;
                        align-items: center;
                      `}
                    >
                      <IconConnect size="small" />
                      <strong>Connect your account</strong>,
                    </span>{' '}
                    on the top right header, to access your notification
                    settings
                  </span>
                }
                actionText="Go to Dashboard"
                onAction={onReturnToDashboard}
              />
            )
          }
          if (screenId === VERIFY_EMAIL_ADDRESS_PREFERENCES) {
            return (
              <VerifyEmailAddressPreferences
                email={subscriptionProgress.email}
                onResend={handleOnResendEmail}
              />
            )
          }

          if (screenId === LOADING_SCREEN) {
            return <LoadingPreferences />
          }
        })()}
      </WrappedContainer>
    )
  }
)

const WrappedContainer = React.memo(function WrappedContainer({ ...props }) {
  const [insideModal] = useInside('NotificationsModal')
  const { screenId } = props

  const Container =
    insideModal || screenId === NOTIFICATIONS_PREFERENCES_SCREEN
      ? AnimatedContainer
      : AnimatedBox

  return <Container {...props} />
})

const AnimatedBox = ({ ...props }) => {
  const ref = useRef(null)
  const [height, setHeight] = useState(0)

  const setRef = useCallback(node => {
    if (node) {
      setHeight(node.clientHeight)
    }

    ref.current = node
  }, [])

  return (
    <Box padding={5 * GU}>
      <div
        css={`
          position: relative;
          max-width: 800px;
          margin: 0 auto;
        `}
      >
        <Spring
          config={springs.smooth}
          from={{ height: `${38 * GU}px` }}
          to={{ height: `${height}px` }}
          native
        >
          {({ height }) => (
            <animated.div style={{ height }}>
              <AnimatedContainer {...props} refCallback={setRef} />
            </animated.div>
          )}
        </Spring>
      </div>
    </Box>
  )
}

const AnimatedContainer = React.memo(function AnimatedModal({
  screenId,
  children,
  refCallback,
}) {
  const [insideModal] = useInside('NotificationsModal')

  return (
    <Transition
      items={{ children, screenId }}
      keys={({ screenId }) => screenId}
      from={{
        position: 'absolute',
        opacity: 0,
        transform: 'scale3d(1.10 1.10, 1)',
      }}
      enter={{
        position: 'static',
        opacity: 1,
        transform: 'scale3d(1, 1, 1)',
      }}
      leave={{
        position: 'absolute',
        opacity: 0,
        transform: 'scale3d(0.90, 0.90, 1)',
      }}
      native
    >
      {({ children, screenId }) => props =>
        insideModal ? (
          <animated.div style={{ ...props }}>{children}</animated.div>
        ) : (
          <animated.div
            ref={refCallback}
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
