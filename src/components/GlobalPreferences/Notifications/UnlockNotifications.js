import React from 'react'
import { GU, IconConnect, textStyle, useTheme } from '@aragon/ui'
import emailNotifcationIllustration from '../../../../src/assets/emailNotifications.svg'

const UnlockNotifications = React.memo(function UnlockNotifications() {
  const theme = useTheme()

  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: ${3 * GU}px;
      `}
    >
      <div
        css={`
          display: flex;
          flex-direction: column;
          text-align: center;
        `}
      >
        <div
          css={`
            align-items: center;
          `}
        >
          <img
            src={emailNotifcationIllustration}
            width={141}
            height={141}
            alt=""
          />
        </div>
        <div
          css={`
            display: flex;
            flex-direction: column;
            background: #f9fafc;
            padding: ${3 * GU}px ${15 * GU}px;
            margin-top: ${3 * GU}px;
          `}
        >
          <span
            css={`
              ${textStyle('title2')};
            `}
          >
            Unlock notifications settings
          </span>
          <span
            css={`
              ${textStyle('body1')};
              color: ${theme.surfaceContentSecondary};
              margin-top: ${1.5 * GU}px;
              font-weight: 600;
            `}
          >
            You must enable your account to access notifications settings
          </span>
          <span
            css={`
              ${textStyle('body2')};
              color: ${theme.surfaceContentSecondary};
              margin-top: ${1.5 * GU}px;
            `}
          >
            Connect to your Ethereum provider by clicking on the{' '}
            <IconConnect size="small" />
            Enable account button on the header. You may be temporarily
            redirected to a new screen.
          </span>
        </div>
      </div>
    </div>
  )
})

export default UnlockNotifications
