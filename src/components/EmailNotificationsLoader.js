import React, { useEffect, useCallback, useState } from 'react'
import { GU, useViewport, Modal } from '@aragon/ui'
import { useWallet } from '../providers/Wallet'
import { useSubscriptionDetails } from '../hooks/useEmailNotifications'
import EmailNotificationsManager from './EmailNotifications/EmailNotificationsManager'

function EmailNotificationsLoader({ children }) {
  const { width } = useViewport()
  const [modalVisible, setModalVisible] = useState(false)
  const wallet = useWallet()
  const { addressVerified, emailExists, fetching } = useSubscriptionDetails(
    wallet.account
  )

  console.log('verified ', addressVerified)
  useEffect(() => {
    const visible = wallet.account && !addressVerified
    setModalVisible(visible)
  }, [wallet.account, addressVerified])

  const handleOnClose = useCallback(() => {
    setModalVisible(false)
  }, [])

  return (
    <React.Fragment>
      {!fetching && (
        <Modal
          width={Math.min(76 * GU, width - 40)}
          visible={modalVisible}
          onClose={handleOnClose}
          css="z-index: 4"
        >
          <div css="">
            <EmailNotificationsManager
              isModal
              account={wallet.account}
              emailExists={emailExists}
              addressVerified={addressVerified}
            />
          </div>
        </Modal>
      )}
      {children}
    </React.Fragment>
  )
}

export default EmailNotificationsLoader
