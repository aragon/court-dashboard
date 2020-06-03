import React from 'react'
import { Button, GU, textStyle, useTheme, useViewport } from '@aragon/ui'
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
  const { below } = useViewport()
  const compact = below('medium')

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
      <div
        css={`
          ${textStyle('body2')};
          color: ${theme.surfaceContentSecondary};
          margin-top: ${1.5 * GU}px;
          padding: 0px ${(compact ? 3 : 20) * GU}px;
        `}
      >
        {description}
      </div>

      {actionText && (
        <div
          css={`
            justify-content: center;
          `}
        >
          <Button
            css={`
              margin-top: ${3 * GU}px;
              width: ${35 * GU}px;
            `}
            mode="strong"
            onClick={onAction}
          >
            {actionText}
          </Button>
        </div>
      )}
    </div>
  )
})

export default StatusInfo
