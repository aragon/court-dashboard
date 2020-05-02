import React, { useCallback } from 'react'
import { Button, GU, textStyle, useTheme } from '@aragon/ui'

const DeleteEmail = React.memo(function DeleteEmail({
  email,
  onDelete,
  onCancel,
  onDeleteSuccess,
  onDeleteError,
  onNeedsSignature,
}) {
  const theme = useTheme()

  const handleOnDelete = useCallback(async () => {
    const { needsSignature, error } = await onDelete()

    if (needsSignature) {
      onNeedsSignature()
      return
    }

    if (error) {
      onDeleteError()
      return
    }
    onDeleteSuccess()
  }, [onDelete, onDeleteError, onDeleteSuccess, onNeedsSignature])

  return (
    <div
      css={`
        display: flex;
        padding-top: ${3 * GU}px;
      `}
    >
      <div
        css={`
          display: flex;
          flex-direction: column;
          text-align: left;
        `}
      >
        <span
          css={`
            ${textStyle('title2')};
          `}
        >
          {`Delete "${email}"`}
        </span>
        <span
          css={`
            ${textStyle('body2')};
            color: ${theme.surfaceContentSecondary};
            margin-top: ${1.5 * GU}px;
          `}
        >
          This action will irreversibly unsubscribe you from all email
          notifications and remove this email address from our databases. You
          can always re-subscribe from Notifications preferences later.
        </span>
        <div
          css={`
            margin-top: ${4 * GU}px;
            display: flex;
            justify-content: flex-end;
          `}
        >
          <Button
            css={`
            margin-right: ${GU}px;}
            `}
            onClick={onCancel}
            size="medium"
          >
            Cancel
          </Button>
          <Button mode="negative" onClick={handleOnDelete} size="medium">
            Delete email
          </Button>
        </div>
      </div>
    </div>
  )
})

export default DeleteEmail
