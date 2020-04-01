import React, { useCallback, useEffect, useState } from 'react'
import { Button, GU, useTheme } from '@aragon/ui'

import Modal from './PrecedenceCampaignModal'
import StoredList from '../../../StoredList'
import { getNetworkType } from '../../../lib/web3-utils'

const KEY_PREFIX = 'PCDisputeBannerRead'

const storedList = new StoredList(`${KEY_PREFIX}:${getNetworkType()}`)

function PrecedenceCampaignBanner({ disputeId }) {
  const theme = useTheme()
  const [bannerVisible, setBannerVisible] = useState(false)
  const [modalOpened, setModalOpened] = useState(false)

  const closeBanner = useCallback(() => {
    storedList.add(disputeId)
    setBannerVisible(false)
  }, [disputeId])

  const openModal = useCallback(() => setModalOpened(true), [])
  const markRead = useCallback(() => {
    closeBanner()
    setModalOpened(false)
  }, [closeBanner])

  useEffect(() => {
    if (!storedList.has(pcDisputeId => pcDisputeId === disputeId)) {
      setBannerVisible(true)
    }
  }, [disputeId])

  if (!bannerVisible) return null

  return (
    <>
      <div
        css={`
          height: ${7 * GU}px;
        `}
      >
        <div
          css={`
            background: linear-gradient(
              180deg,
              ${theme.blue.alpha(0.9)} 0%,
              ${theme.blue.alpha(0.8)} 100%
            );
            box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.25);
            padding: ${1 * GU}px ${2 * GU}px;
            position: absolute;
            left: 0;
            right: 0;
          `}
        >
          <div
            css={`
              display: flex;
              align-items: center;
              flex-direction: column;
            `}
          >
            <div>
              <span
                css={`
                  color: ${theme.accentContent};
                  margin-right: ${3 * GU}px;
                `}
              >
                Precedence campaign disclaimer information
              </span>
              <Button label="Read now" onClick={openModal} />
            </div>
          </div>
        </div>
      </div>
      <Modal opened={modalOpened} onClose={markRead} />
    </>
  )
}

export default PrecedenceCampaignBanner
