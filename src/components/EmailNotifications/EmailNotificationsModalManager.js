// import React, { useState, useCallback } from 'react'
// import { animated, Transition } from 'react-spring/renderprops'
// import { Box, useViewport } from '@aragon/ui'
// import { useNotificationActions } from '../../hooks/useEmailNotifications'
// import EmailNotificationsForm from './EmailNotificationsForm'
// import ExistingEmailSubscription from './ExistingEmailSubscription'
// import VerifyEmailAddress from './VerifyEmailAddress'
// import SignatureRequest from '../SignatureRequest'
// import StatusInfo from './StatusInfo'
// import DeleteEmail from './DeleteEmail'
// import UnlockNotifications from '../GlobalPreferences/Notifications/UnlockNotifications'
// import NotificationsPreferences from '../GlobalPreferences/Notifications/NotificationsPreferences'
// import {
//   DELETE_ACTION,
//   DELETE_ACTION_MODAL,
//   DELETE_ACTION_PREFERENCES,
//   DELETE_SIGNATURE_PREFERENCES_SETTINGS,
//   DELETE_EMAIL_SCREEN,
//   DELETE_SIGNATURE_SETTINGS,
//   EMAIL_NOTIFICATIONS_EXISTING_EMAIL,
//   EMAIL_NOTIFICATIONS_ERROR_SCREEN,
//   EMAIL_NOTIFICATIONS_FORM_SCREEN,
//   EMAIL_NOTIFICATIONS_SUCCESS_SCREEN,
//   UNLOCK_NOTIFICATIONS_SCREEN,
//   LOCK_SETTINGS_ACTION,
//   NOTIFICATIONS_PREFERENCES_SCREEN,
//   OPTOUT_ACTION,
//   OPTOUT_SIGNATURE_SETTINGS,
//   PREFERENCES_UPDATE_EMAIL_SCREEN,
//   SIGNATURE_REQUEST_SCREEN,
//   SUBSCRIBE_ACTION,
//   SUBSCRIBE_EXISTING_ACTION,
//   SUBSCRIBE_SIGNATURE_SETTINGS,
//   SUBSCRIBE_EXISTING_SIGNATURE_SETTINGS,
//   UNLOCK_SETTINGS_ACTION,
//   UNLOCK_SIGNATURE_SETTINGS,
//   VERIFY_YOUR_EMAIL_SCREEN,
//   VERIFY_YOUR_EMAIL_UPDATE_SCREEN,
//   LOCK_SETTINGS_SIGNATURE_SETTINGS,
// } from './constants'

// const DEFAULT_ERROR_SETTINGS = {
//   error: true,
//   title: 'Cannot connect to Notifications server',
//   description:
//     'There was a problem when trying to connect to the Email Notifications server. Make sure your Internet connection is working and please try again. ',
// }

// const EmailNotificationsModalManager = React.memo(
//   function EmailNotificationsModalManager({
//     isModal,
//     account,
//     needsUnlockSettings,
//     emailExists,
//     notificationsDisabled,
//     email,
//     onClose,
//     visible,
//     startingScreen,
//   }) {
//     const { width, below } = useViewport()
//     const compactMode = below('medium')

//     const [screenId, setScreenId] = useState(
//       startingScreen ||
//         (emailExists
//           ? EMAIL_NOTIFICATIONS_EXISTING_EMAIL
//           : EMAIL_NOTIFICATIONS_FORM_SCREEN)
//     )
//     const [jurorEmail, setJurorEmail] = useState(email)
//     const [singatureRequestSettings, setSingatureRequestSettings] = useState({
//       successAction: '',
//       title: '',
//       actionText: '',
//       successText: '',
//       email: '',
//     })
//     const [statusInfoSettings, setStatusInfoSettings] = useState({})
//     const [needsUnlock, setNeedsUnlock] = useState(needsUnlockSettings)

//     const handleOnClose = useCallback(() => {
//       onClose()
//     }, [onClose])

//     const {
//       createSession,
//       deleteJurorEmail,
//       deleteCurrentSession,
//       getJurorEmail,
//       resendVerificationEmail,
//       switchNotificationsStatus,
//       subscribeToNotifications,
//     } = useNotificationActions(account)

//     const handleOnNeedsSignature = useCallback(
//       (action, email) => {
//         if (action === LOCK_SETTINGS_ACTION) {
//           setSingatureRequestSettings(LOCK_SETTINGS_SIGNATURE_SETTINGS)
//           setScreenId(SIGNATURE_REQUEST_SCREEN)
//         }

//         if (action === DELETE_ACTION_MODAL) {
//           setSingatureRequestSettings({
//             ...DELETE_SIGNATURE_SETTINGS,
//             title: `Delete "${jurorEmail}"`,
//           })
//           setScreenId(SIGNATURE_REQUEST_SCREEN)
//         }
//         if (action === DELETE_ACTION_PREFERENCES) {
//           console.log('from preferencesss!!!')
//           setSingatureRequestSettings({
//             ...DELETE_SIGNATURE_PREFERENCES_SETTINGS,
//             title: `Delete "${jurorEmail}"`,
//           })
//           setScreenId(SIGNATURE_REQUEST_SCREEN)
//         }
//         if (action === SUBSCRIBE_ACTION) {
//           setSingatureRequestSettings({
//             ...SUBSCRIBE_SIGNATURE_SETTINGS,
//             email: email,
//           })
//           setScreenId(SIGNATURE_REQUEST_SCREEN)
//         }
//         if (action === SUBSCRIBE_EXISTING_ACTION) {
//           setSingatureRequestSettings({
//             ...SUBSCRIBE_EXISTING_SIGNATURE_SETTINGS,
//             email: email,
//           })
//           setScreenId(SIGNATURE_REQUEST_SCREEN)
//         }
//         if (action === OPTOUT_ACTION) {
//           setSingatureRequestSettings(OPTOUT_SIGNATURE_SETTINGS)
//           setScreenId(SIGNATURE_REQUEST_SCREEN)
//         }
//       },
//       [jurorEmail]
//     )

//     const handleOnSubscribeSuccess = useCallback(
//       email => {
//         setJurorEmail(email)
//         const screen = emailExists
//           ? VERIFY_YOUR_EMAIL_UPDATE_SCREEN
//           : VERIFY_YOUR_EMAIL_SCREEN
//         setScreenId(screen)
//       },
//       [emailExists]
//     )

//     // SUBSCRIPTION HANDLERS

//     const handleOnSubscribeExistingEmail = useCallback(async () => {
//       const {
//         needsSignature,
//         email: existingEmail,
//         error: errorGettingEmail,
//       } = await getJurorEmail()

//       if (errorGettingEmail && !needsSignature) {
//         setScreenId(EMAIL_NOTIFICATIONS_ERROR_SCREEN)
//         return
//       }

//       const {
//         needsSignature: reSendNeedsSignature,
//         error: errorResending,
//       } = await resendVerificationEmail()

//       if (errorResending && !reSendNeedsSignature) {
//         setScreenId(EMAIL_NOTIFICATIONS_ERROR_SCREEN)
//         return
//       }

//       if (reSendNeedsSignature) {
//         handleOnNeedsSignature(SUBSCRIBE_EXISTING_ACTION, existingEmail)
//         return
//       }

//       handleOnSubscribeSuccess(existingEmail)
//     }, [
//       getJurorEmail,
//       handleOnSubscribeSuccess,
//       handleOnNeedsSignature,
//       resendVerificationEmail,
//     ])

//     const handleOnSubscribe = useCallback(
//       async email => {
//         const {
//           subscribedEmail,
//           needsSignature: subscribeNeedsSignature,
//           error: errorSubscribing,
//         } = await subscribeToNotifications(email)

//         if (errorSubscribing && !subscribeNeedsSignature) {
//           setScreenId(EMAIL_NOTIFICATIONS_ERROR_SCREEN)
//           return
//         }

//         if (subscribeNeedsSignature) {
//           handleOnNeedsSignature(SUBSCRIBE_ACTION, email)
//           return
//         }

//         handleOnSubscribeSuccess(subscribedEmail)
//       },
//       [
//         handleOnNeedsSignature,
//         handleOnSubscribeSuccess,
//         subscribeToNotifications,
//       ]
//     )

//     // OPT OUT HANDLER
//     const handleOnOptOutSuccess = useCallback(() => {
//       setStatusInfoSettings({
//         error: false,
//         title: 'Opt out',
//         description:
//           'You have successfully opted out of the email notifications service. You can always opt in again if you go to the Notifications settings, in Global preferences.',
//       })
//       setScreenId(EMAIL_NOTIFICATIONS_SUCCESS_SCREEN)
//     }, [])

//     const handleOnOptOut = useCallback(async () => {
//       const { error, needsSignature } = await switchNotificationsStatus(true)

//       console.log('Needs signature , ', needsSignature, error)

//       if (error && !needsSignature) {
//         setScreenId(EMAIL_NOTIFICATIONS_ERROR_SCREEN)
//         return
//       }

//       if (needsSignature) {
//         handleOnNeedsSignature(OPTOUT_ACTION)
//         return
//       }
//       handleOnOptOutSuccess()
//     }, [
//       handleOnNeedsSignature,
//       handleOnOptOutSuccess,
//       switchNotificationsStatus,
//     ])

//     // DELETE HANDLERS
//     const handleOnCallDeleteScreen = useCallback(() => {
//       setScreenId(DELETE_EMAIL_SCREEN)
//     }, [])

//     const handleOnDeleteSuccess = useCallback(() => {
//       if (!isModal) {
//         setScreenId(EMAIL_NOTIFICATIONS_FORM_SCREEN)
//         return
//       }

//       setStatusInfoSettings({
//         error: false,
//         title: 'Email deleted',
//         description: `Your email ${jurorEmail} was succefully deleted. You can always re-subscribe from Notifications preferences later.`,
//       })
//       setScreenId(EMAIL_NOTIFICATIONS_SUCCESS_SCREEN)
//     }, [isModal, jurorEmail])

//     const handleOnDelete = useCallback(async () => {
//       const { needsSignature, error } = await deleteJurorEmail()

//       if (needsSignature) {
//         handleOnNeedsSignature(
//           isModal ? DELETE_ACTION_MODAL : DELETE_ACTION_PREFERENCES
//         )
//         return
//       }

//       if (error) {
//         setScreenId(EMAIL_NOTIFICATIONS_ERROR_SCREEN)
//         return
//       }
//       handleOnDeleteSuccess()
//     }, [
//       deleteJurorEmail,
//       handleOnNeedsSignature,
//       handleOnDeleteSuccess,
//       isModal,
//     ])

//     // UPDATE EMAIL FROM PREFERENCES HANDLER
//     const handleOnPreferencesUpdateEmail = useCallback(() => {
//       setScreenId(PREFERENCES_UPDATE_EMAIL_SCREEN)
//     }, [])

//     const handleOnSignSuccessAction = useCallback(
//       async (signHash, timestamp) => {
//         const { error: errorCreatingSession } = await createSession(
//           signHash,
//           timestamp
//         )

//         if (errorCreatingSession) {
//           return { error: errorCreatingSession }
//         }

//         if (singatureRequestSettings.successAction === SUBSCRIBE_ACTION) {
//           const email = singatureRequestSettings.email

//           const {
//             subscribedEmail,
//             error: errorSubscribing,
//           } = await subscribeToNotifications(email)

//           if (errorSubscribing) {
//             setScreenId(EMAIL_NOTIFICATIONS_ERROR_SCREEN)
//             return
//           }

//           setJurorEmail(subscribedEmail)

//           return { error: false }
//         }

//         if (
//           singatureRequestSettings.successAction === SUBSCRIBE_EXISTING_ACTION
//         ) {
//           const { error: errorResending } = await resendVerificationEmail()

//           if (errorResending) {
//             setScreenId(EMAIL_NOTIFICATIONS_ERROR_SCREEN)
//             return
//           }

//           return { error: false }
//         }

//         if (
//           singatureRequestSettings.successAction === DELETE_ACTION ||
//           singatureRequestSettings.successAction === DELETE_ACTION_PREFERENCES
//         ) {
//           const { error: errorDeleting } = await deleteJurorEmail()

//           if (errorDeleting) {
//             setScreenId(EMAIL_NOTIFICATIONS_ERROR_SCREEN)
//             return
//           }

//           return { error: false }
//         }

//         if (singatureRequestSettings.successAction === OPTOUT_ACTION) {
//           const { error: errorOptingOut } = await switchNotificationsStatus(
//             true
//           )

//           if (errorOptingOut) {
//             setScreenId(EMAIL_NOTIFICATIONS_ERROR_SCREEN)
//             return
//           }

//           return { error: false }
//         }
//         if (singatureRequestSettings.successAction === UNLOCK_SETTINGS_ACTION) {
//           // After unlocking we need the juror email
//           const { error: errorGettingEmail, email } = await getJurorEmail()

//           if (errorGettingEmail) {
//             setScreenId(EMAIL_NOTIFICATIONS_ERROR_SCREEN)
//             return
//           }
//           setJurorEmail(email)
//           return { error: false }
//         }

//         if (singatureRequestSettings.successAction === LOCK_SETTINGS_ACTION) {
//           const { error: errorLocking } = await deleteCurrentSession()

//           if (errorLocking) {
//             setScreenId(EMAIL_NOTIFICATIONS_ERROR_SCREEN)
//             return
//           }

//           return { error: false }
//         }

//         return { error: false }
//       },
//       [
//         createSession,
//         deleteJurorEmail,
//         deleteCurrentSession,
//         getJurorEmail,
//         resendVerificationEmail,
//         switchNotificationsStatus,
//         singatureRequestSettings.email,
//         singatureRequestSettings.successAction,
//         subscribeToNotifications,
//       ]
//     )

//     const handleOnActionSuccessScreenChange = useCallback(() => {
//       console.log(
//         'singatureRequestSettings.successAction  ',
//         singatureRequestSettings.successAction
//       )
//       if (singatureRequestSettings.successAction === SUBSCRIBE_ACTION) {
//         // setJurorEmail(singatureRequestSettings.email)
//         setScreenId(VERIFY_YOUR_EMAIL_SCREEN)
//       }

//       if (SignatureRequest.successAction === SUBSCRIBE_EXISTING_ACTION) {
//         setScreenId(VERIFY_YOUR_EMAIL_UPDATE_SCREEN)
//       }
//       if (singatureRequestSettings.successAction === DELETE_ACTION) {
//         return null
//       }
//       if (
//         singatureRequestSettings.successAction === DELETE_ACTION_PREFERENCES
//       ) {
//         setScreenId(EMAIL_NOTIFICATIONS_FORM_SCREEN)
//       }
//       if (singatureRequestSettings.successAction === UNLOCK_SETTINGS_ACTION) {
//         setScreenId(NOTIFICATIONS_PREFERENCES_SCREEN)
//       }
//       if (singatureRequestSettings.successAction === LOCK_SETTINGS_ACTION) {
//         setScreenId(UNLOCK_NOTIFICATIONS_SCREEN)
//       }
//     }, [singatureRequestSettings.successAction])

//     const handleOnVerifySubscribeSuccess = useCallback(email => {
//       setJurorEmail(email)
//       setScreenId(VERIFY_YOUR_EMAIL_SCREEN)
//     }, [])

//     // UNLOCK - unlock allways needs signature
//     const handleOnUnlock = useCallback(() => {
//       setSingatureRequestSettings(UNLOCK_SIGNATURE_SETTINGS)
//       // GET JUROR EMAIL
//       setScreenId(SIGNATURE_REQUEST_SCREEN)
//     }, [])

//     const handleOnActionSuccess = useCallback(action => {
//       if (action === LOCK_SETTINGS_ACTION) {
//         setNeedsUnlock(true)
//         setScreenId(UNLOCK_NOTIFICATIONS_SCREEN)
//       }
//     }, [])

//     console.log('SCREEEN IDDD ', screenId)

//     return (
//       <WrappedContainer
//         isModal={isModal}
//         screenId={screenId}
//         onClose={handleOnClose}
//         visible={visible}
//         width={width}
//       >
//         {(() => {
//           if (screenId === SIGNATURE_REQUEST_SCREEN) {
//             return (
//               <SignatureRequest
//                 compactMode={compactMode}
//                 title={singatureRequestSettings.title}
//                 actionText={singatureRequestSettings.actionText}
//                 successText={singatureRequestSettings.successText}
//                 onSignSuccess={handleOnSignSuccessAction}
//                 onActionSuccess={handleOnActionSuccessScreenChange}
//               />
//             )
//           }

//           if (screenId === EMAIL_NOTIFICATIONS_FORM_SCREEN) {
//             /* Passing the responsability to get the existing email to the form because the cookie might be
//             expired or not and we might need to sign to get the email */
//             return (
//               <EmailNotificationsForm
//                 isModal={isModal}
//                 account={account}
//                 compactMode={compactMode}
//                 onOptOut={handleOnOptOut}
//                 onSubscribeToNotifications={handleOnSubscribe}
//               />
//             )
//           }

//           if (screenId === PREFERENCES_UPDATE_EMAIL_SCREEN) {
//             return (
//               <EmailNotificationsForm
//                 isModal={isModal}
//                 existingEmail={jurorEmail}
//                 account={account}
//                 compactMode={compactMode}
//                 onOptOut={handleOnOptOut}
//                 onSubscribeToNotifications={handleOnSubscribe}
//               />
//             )
//           }

//           if (screenId === EMAIL_NOTIFICATIONS_EXISTING_EMAIL) {
//             return (
//               <ExistingEmailSubscription
//                 account={account}
//                 compactMode={compactMode}
//                 onOptOut={handleOnOptOut}
//                 onSubscribeToNotifications={handleOnSubscribeExistingEmail}
//               />
//             )
//           }
//           if (screenId === VERIFY_YOUR_EMAIL_SCREEN) {
//             return (
//               <VerifyEmailAddress
//                 updateMode={false}
//                 compactMode={compactMode}
//                 email={jurorEmail}
//                 onSubscribe={subscribeToNotifications}
//                 onSubscribeSuccess={handleOnSubscribeSuccess}
//               />
//             )
//           }

//           if (screenId === VERIFY_YOUR_EMAIL_UPDATE_SCREEN) {
//             return (
//               <VerifyEmailAddress
//                 updateMode={isModal}
//                 compactMode={compactMode}
//                 email={jurorEmail}
//                 onSubscribe={subscribeToNotifications}
//                 onSubscribeSuccess={handleOnVerifySubscribeSuccess}
//                 onDeleteEmail={handleOnCallDeleteScreen}
//               />
//             )
//           }

//           if (screenId === DELETE_EMAIL_SCREEN) {
//             return (
//               <DeleteEmail
//                 isModal={isModal}
//                 email={jurorEmail}
//                 onDelete={handleOnDelete}
//                 onCancel={() => {
//                   console.log('cancellll')
//                 }}
//               />
//             )
//           }

//           if (screenId === EMAIL_NOTIFICATIONS_ERROR_SCREEN) {
//             const { error, title, description } = DEFAULT_ERROR_SETTINGS
//             return (
//               <StatusInfo
//                 error={error}
//                 title={title}
//                 description={description}
//               />
//             )
//           }

//           if (screenId === EMAIL_NOTIFICATIONS_SUCCESS_SCREEN) {
//             return (
//               <StatusInfo
//                 error={statusInfoSettings.error}
//                 title={statusInfoSettings.title}
//                 description={statusInfoSettings.description}
//               />
//             )
//           }

//           if (screenId === UNLOCK_NOTIFICATIONS_SCREEN) {
//             return (
//               <UnlockNotifications
//                 needsUnlockSettings={needsUnlock}
//                 onUnlock={handleOnUnlock}
//               />
//             )
//           }

//           if (screenId === NOTIFICATIONS_PREFERENCES_SCREEN) {
//             return (
//               <NotificationsPreferences
//                 email={jurorEmail}
//                 notificationsDisabled={notificationsDisabled}
//                 onSwitchNotificationsStatus={switchNotificationsStatus}
//                 onLockSettings={deleteCurrentSession}
//                 onNeedsSignature={handleOnNeedsSignature}
//                 onActionSuccess={handleOnActionSuccess}
//                 onDeleteEmail={handleOnCallDeleteScreen}
//                 onUpdateEmail={handleOnPreferencesUpdateEmail}
//               />
//             )
//           }
//         })()}
//       </WrappedContainer>
//     )
//   }
// )

// const WrappedContainer = React.memo(function AnimatedModal({ ...props }) {
//   const { isModal, screenId } = props

//   console.log('is modal ', isModal, screenId)
//   if (isModal || screenId === NOTIFICATIONS_PREFERENCES_SCREEN) {
//     return <AnimatedContainer {...props} />
//   }

//   return (
//     <Box
//       css={`
//         display: flex;
//         justify-content: center;
//       `}
//     >
//       <div
//         css={`
//           max-width: 800px;
//         `}
//       >
//         <AnimatedContainer {...props} />
//       </div>
//     </Box>
//   )
// })

// const AnimatedContainer = React.memo(function AnimatedModal({
//   isModal,
//   screenId,
//   onClose,
//   visible,
//   width,
//   children,
// }) {
//   return (
//     <Transition
//       items={{ children, screenId }}
//       keys={({ screenId }) => screenId}
//       from={{
//         position: 'absolute',
//         opacity: 0,
//         transform: 'scale3d(1.05, 1.05, 1)',
//       }}
//       enter={{
//         position: 'static',
//         opacity: 1,
//         transform: 'scale3d(1, 1, 1)',
//       }}
//       leave={{
//         position: 'absolute',
//         opacity: 0,
//         transform: 'scale3d(0.95, 0.95, 1)',
//       }}
//       native
//     >
//       {({ children, screenId }) => props =>
//         isModal ? (
//           <animated.div style={{ ...props }}>{children}</animated.div>
//         ) : (
//           <animated.div
//             style={{
//               ...props,
//               top: 0,
//               left: 0,
//               right: 0,
//             }}
//           >
//             {children}
//           </animated.div>
//         )}
//     </Transition>
//   )
// })

// export default EmailNotificationsModalManager
