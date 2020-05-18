import React from 'react'
import { GU, LoadingRing, textStyle } from '@aragon/ui'
import emailNotifcationIllustration from '../../../../src/assets/emailNotifications.svg'

const LoadingPreferences = React.memo(function LoadingPreferences() {
  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: center;
      `}
    >
      <div>
        <img
          src={emailNotifcationIllustration}
          width={181}
          height={181}
          alt=""
        />
      </div>
      <div
        css={`
          ${textStyle('title2')};
          margin-top: ${4 * GU}px;
          display: flex;
          align-items: center;
        `}
      >
        <LoadingRing />
        <span
          css={`
            margin-left: ${1.5 * GU}px;
          `}
        >
          Loading…
        </span>
      </div>
    </div>
  )
})

export default LoadingPreferences
