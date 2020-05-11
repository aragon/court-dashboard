import React from 'react'
import { Button, GU, IconConnect, textStyle, useTheme } from '@aragon/ui'
import emailNotifcationIllustration from '../../../../src/assets/emailNotifications.svg'

const UnlockNotifications = React.memo(function UnlockNotifications({
  compactMode,
  needsUnlockSettings,
  onUnlock,
}) {
  const theme = useTheme()

  return (
    <div
      css={`
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
            background: ${needsUnlockSettings ? '' : theme.background};
            padding: ${3 * GU}px ${compactMode ? 3 : 13 * GU}px;
            margin-top: ${1.5 * GU}px;
          `}
        >
          {needsUnlockSettings ? (
            <>
              <div
                css={`
                  ${textStyle('body2')};
                  color: ${theme.surfaceContentSecondary};
                  margin-top: ${1 * GU}px;
                  display: flex;
                  flex-direction: column;
                `}
              >
                <span>
                  You are required to sign a message to prove that you
                </span>
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
            </>
          ) : (
            <>
              <span
                css={`
                  ${textStyle('body1')};
                  color: ${theme.surfaceContentSecondary};
                  font-weight: 600;
                `}
              >
                You must connect your account to access notifications settings
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
                <strong>Connect account</strong> button on the header. You may
                be temporarily redirected to a new screen.
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
})

export default UnlockNotifications
