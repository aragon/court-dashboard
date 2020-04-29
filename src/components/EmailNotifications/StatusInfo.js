import React from 'react'
import { Button, GU, textStyle, useTheme } from '@aragon/ui'
import successIllustration from '../../assets/notificationsSuccess.svg'
import errorIllustration from '../../assets/notificationsError.png'

const StatusInfo = React.memo(function StatusInfo({
  error,
  title,
  description,
  actionText,
  onAction,
}) {
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
            src={error ? errorIllustration : successIllustration}
            width={141}
            height={141}
            alt=""
          />
        </div>
        <span
          css={`
            ${textStyle('title2')};
            margin-top: ${4 * GU}px;
          `}
        >
          {title}
        </span>
        <span
          css={`
            ${textStyle('body2')};
            color: ${theme.surfaceContentSecondary};
            margin-top: ${1.5 * GU}px;
          `}
        >
          {description}
        </span>

        {actionText && (
          <Button
            css={`
              margin-top: ${3 * GU}px;
            `}
            mode="strong"
            onClick={onAction}
          >
            {actionText}
          </Button>
        )}
      </div>
    </div>
  )
})

export default StatusInfo
