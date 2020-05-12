import React from 'react'
import {
  Box,
  Button,
  GU,
  IconTrash,
  IconCheck,
  LoadingRing,
  useTheme,
  useToast,
  Split,
} from '@aragon/ui'

// import { DeleteAccountConfirmationModal } from './NotificationModals'
import emailNotifcationIllustration from '../../../../src/assets/emailNotifications.svg'

export default function ManageNotifications() {
  const toast = useToast()

  return (
    <React.Fragment>
      <Split
        primary={<EmailNotificationBox />}
        secondary={
          <React.Fragment>
            <Box heading="Signed In With Email">
              test@gmail.com
              <Button
                css={`
                  margin-top: ${2 * GU}px;
                `}
                wide
                onClick={() => {}}
              >
                Sign out
              </Button>
            </Box>
            <DeleteAccount
              onApiError={() => {}}
              token=""
              onLogout={() => {}}
              toast={toast}
            />
          </React.Fragment>
        }
      />
    </React.Fragment>
  )
}

function EmailNotificationBox() {
  return (
    <Box heading="Signed In With Email">
      <div
        css={`
          display: flex;
          justify-content: center;
        `}
      >
        <img src={emailNotifcationIllustration} />
      </div>
    </Box>
  )
}

function DeleteAccount({ token, onLogout, onApiError, toast }) {
  const theme = useTheme()

  //   const [isFetching, setIsFetching] = useState(false)
  //   const [isAccountDeleted, setIsAccountDeleted] = useState(false)
  //   const [deleteAccountModalOpened, setDeleteAccountModalOpened] = useState(
  //     false
  //   )

  //   const handleDeleteAccount = useCallback(async () => {
  //     try {
  //       setIsFetching(true)
  //       await deleteAccount(token)
  //       localStorage.removeItem(NOTIFICATION_SERVICE_TOKEN_KEY)
  //       localStorage.removeItem(NOTIFICATION_SERVICE_EMAIL_KEY)
  //       setIsAccountDeleted(true)
  //       onLogout()
  //       toast('Email notifications account deleted')
  //     } catch (e) {
  //       onApiError(e)
  //     }
  //     setIsFetching(false)
  //   }, [token, onLogout, toast, onApiError])

  //   const onClick = useCallback(() => {
  //     setDeleteAccountModalOpened(true)
  //   }, [])

  //   const onCloseModal = useCallback(() => {
  //     setDeleteAccountModalOpened(false)
  //   }, [])

  //   const onModalConfirm = useCallback(() => {
  //     setDeleteAccountModalOpened(false)
  //     handleDeleteAccount()
  //   }, [handleDeleteAccount])
  const condition = false

  return (
    <React.Fragment>
      <Box heading="Email Notification Data">
        <Button wide onClick={() => {}}>
          {condition ? (
            <LoadingRing />
          ) : condition ? (
            <IconCheck />
          ) : (
            <IconTrash
              css={`
                color: ${theme.negative};
                margin-right: ${GU}px;
              `}
            />
          )}
          Delete your email
        </Button>
      </Box>
      {/* <DeleteAccountConfirmationModal
        visible
        onConfirm={() => {}}
        onClose={() => {}}
      /> */}
    </React.Fragment>
  )
}
