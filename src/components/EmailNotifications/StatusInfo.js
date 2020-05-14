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
        text-align: center;
      `}
    >
      <div>
        <img
          src={error ? errorIllustration : successIllustration}
          width={141}
          height={141}
          alt=""
        />
      </div>
      <h3
        css={`
          ${textStyle('title2')};
          margin-top: ${4 * GU}px;
        `}
      >
        {title}
      </h3>
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
  )
})

export default StatusInfo
