import React from 'react'
import { Button, GU, textStyle, useInside, useTheme } from '@aragon/ui'

import emailNotifcationIllustration from '../../assets/emailNotifications.svg'

const DeleteEmail = React.memo(function DeleteEmail({
  email,
  onDelete,
  onCancel,
}) {
  const theme = useTheme()
  const [insideModal] = useInside('NotificationsModal')

  return (
    <div
      css={`
        display: flex;
        padding-top: ${insideModal ? 3 : 0 * GU}px;
        flex-direction: column;
      `}
    >
      {!insideModal && (
        <div
          css={`
            text-align: center;
          `}
        >
          <img
            src={emailNotifcationIllustration}
            width={180}
            height={180}
            alt=""
          />
        </div>
      )}
      <div
        css={`
          display: flex;
          flex-direction: column;
          text-align: ${insideModal ? 'left' : 'center'};
          margin-top: ${insideModal ? 0 : 5 * GU}px;
        `}
      >
        <span
          css={`
            ${textStyle('title2')};
          `}
        >
          Delete “{email}”
        </span>
        <span
          css={`
            ${textStyle('body2')};
            color: ${theme.surfaceContentSecondary};
            margin-top: ${1.5 * GU}px;
          `}
        >
          This action will unsubscribe you from all email notifications and
          remove this email address from our databases. You can always
          re-subscribe from the notifications preferences later.
        </span>
        <div
          css={`
            margin-top: ${4 * GU}px;
            display: flex;
            justify-content: ${insideModal ? 'flex-end' : 'center'};
          `}
        >
          <Button
            css={`
              margin-right: ${1 * GU}px;
            `}
            onClick={onCancel}
            size="medium"
            wide={!insideModal}
          >
            Cancel
          </Button>
          <Button
            mode="negative"
            onClick={onDelete}
            size="medium"
            wide={!insideModal}
          >
            Delete email
          </Button>
        </div>
      </div>
    </div>
  )
})

export default DeleteEmail
