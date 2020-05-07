import React, { useCallback } from 'react'
import { Button, GU, textStyle, useTheme } from '@aragon/ui'
import { DELETE_ACTION_MODAL, DELETE_ACTION_PREFERENCES } from './constants'

import emailNotifcationIllustration from '../../assets/emailNotifications.svg'

const DeleteEmail = React.memo(function DeleteEmail({
  isModal,
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
      onNeedsSignature(
        isModal ? DELETE_ACTION_MODAL : DELETE_ACTION_PREFERENCES
      )
      return
    }

    if (error) {
      onDeleteError()
      return
    }
    onDeleteSuccess()
  }, [isModal, onDelete, onDeleteError, onDeleteSuccess, onNeedsSignature])

  const handleOnCancel = useCallback(async () => {
    onCancel(isModal ? DELETE_ACTION_MODAL : DELETE_ACTION_PREFERENCES)
  }, [isModal, onCancel])

  return (
    <div
      css={`
        display: flex;
        padding-top: ${isModal ? 3 : 0 * GU}px;
        flex-direction: column;
      `}
    >
      {!isModal && (
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
          text-align: ${isModal ? 'left' : 'center'};
          margin-top: ${isModal ? 0 : 5 * GU}px;
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
            justify-content: ${isModal ? 'flex-end' : 'center'};
          `}
        >
          <Button
            css={`
            margin-right: ${GU}px;}
            `}
            onClick={handleOnCancel}
            size="medium"
            wide={!isModal}
          >
            Cancel
          </Button>
          <Button
            mode="negative"
            onClick={handleOnDelete}
            size="medium"
            wide={!isModal}
          >
            Delete email
          </Button>
        </div>
      </div>
    </div>
  )
})

export default DeleteEmail
