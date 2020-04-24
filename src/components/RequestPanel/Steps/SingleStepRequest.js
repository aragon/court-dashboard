import React, { useMemo } from 'react'
import { GU, IconCheck, IconCross, useTheme } from '@aragon/ui'
import {
  REQUEST_STATUS_CONFIRMED,
  REQUEST_STATUS_PENDING,
  REQUEST_STATUS_PROCESSED,
  REQUEST_STATUS_PROCESSING_FAILED,
} from '../request-statuses'
import { getRequestLabelText } from './helper'

function SingleStepRequest({ request, status }) {
  const theme = useTheme()

  const { iconColor, labelText } = useMemo(() => {
    const labelText = getRequestLabelText(request, status)

    if (status === REQUEST_STATUS_PROCESSING_FAILED) {
      return {
        iconColor: theme.negative,
        labelText,
      }
    }

    if (status === REQUEST_STATUS_CONFIRMED) {
      return {
        iconColor: theme.positive,
        labelText,
      }
    }

    if (status === REQUEST_STATUS_PENDING) {
      return {
        iconColor: theme.info,
        labelText,
      }
    }

    if (status === REQUEST_STATUS_PROCESSED) {
      return {
        iconColor: theme.positive,
        labelText,
      }
    }

    return {
      iconColor: theme.hint,
      labelText,
    }
  }, [request, status, theme])

  return (
    <div
      css={`
        align-self: center;
      `}
    >
      <div
        css={`
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${7.5 * GU}px;
            height: ${7.5 * GU}px;
            border: 2px solid ${iconColor};
            border-radius: 50%;
            transition: border-color 150ms ease-in-out;
          `}
        >
          {status === REQUEST_STATUS_PROCESSING_FAILED ? (
            <IconCross
              size="medium"
              css={`
                color: ${iconColor};
                transition: color 150ms ease-in-out;
              `}
            />
          ) : (
            <IconCheck
              size="medium"
              css={`
                color: ${iconColor};
                transition: color 150ms ease-in-out;
              `}
            />
          )}
        </div>
        <p
          css={`
            margin-top: ${3 * GU}px;
          `}
        >
          {labelText}
        </p>
      </div>
    </div>
  )
}

export default SingleStepRequest
