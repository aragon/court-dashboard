import React from 'react'
import { Button, GU, IconConnect, textStyle, useTheme } from '@aragon/ui'
import emailNotifcationIllustration from '../../../../src/assets/emailNotifications.svg'

const UnlockNotifications = React.memo(function UnlockNotifications({
  compactMode,
  needsUnlockSettings,
  onUnlock,
  onReturnToDashboard,
}) {
  const theme = useTheme()

  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        text-align: center;
      `}
    >
      <div>
        <img
          src={emailNotifcationIllustration}
          width={141}
          height={141}
          alt=""
        />
      </div>
      <h3
        css={`
          ${textStyle('title2')};
          margin-top: ${3 * GU}px;
        `}
      >
        Unlock notifications settings
      </h3>
      <div
        css={`
          display: flex;
          flex-direction: column;
          margin-top: ${1.5 * GU}px;
        `}
      >
        {needsUnlockSettings ? (
          <div>
            <div
              css={`
                ${textStyle('body2')};
                color: ${theme.surfaceContentSecondary};
                display: flex;
                flex-direction: column;
              `}
            >
              <span>You are required to sign a message to prove that you</span>
              <span>own the connected Ethereum account.</span>
            </div>
            <Button
              css={`
                margin-top: ${3 * GU}px;
              `}
              mode="strong"
              onClick={onUnlock}
            >
              Unlock notifications settings
            </Button>
          </div>
        ) : (
          <div>
            <div
              css={`
                background: ${theme.background};
                padding: ${3 * GU}px ${(compactMode ? 3 : 13) * GU}px;
              `}
            >
              <span
                css={`
                  display: block;
                  ${textStyle('body1')};
                  color: ${theme.surfaceContentSecondary};
                  font-weight: 600;
                `}
              >
                You must connect your account to access notifications settings
              </span>
              <div
                css={`
                  margin-top: ${1.5 * GU}px;
                `}
              >
                <span
                  css={`
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    ${textStyle('body2')};
                    color: ${theme.surfaceContentSecondary};
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
                  on the top right header, to access your notification settings
                </span>
              </div>
            </div>
            <Button
              css={`
                margin-top: ${2 * GU}px;
              `}
              mode="strong"
              onClick={onReturnToDashboard}
              wide
            >
              Go to dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  )
})

export default UnlockNotifications
