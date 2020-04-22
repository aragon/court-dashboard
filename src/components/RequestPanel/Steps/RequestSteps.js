import React, { useMemo } from 'react'
import { GU, IconCheck, IconCross, textStyle, useTheme } from '@aragon/ui'
import MultiStepRequest from './MultiStepRequest'
import SingleStepRequest from './SingleStepRequest'
import TransactionProgress from '../TransactionProgress'
import {
  REQUEST_STATUS_CONFIRMED,
  REQUEST_STATUS_FAILED,
  REQUEST_STATUS_PENDING,
  REQUEST_STATUS_PROCESSED,
  REQUEST_STATUS_PROCESSING_FAILED,
} from '../request-statuses'
import { numberToOrdinal } from '../../../lib/math-utils'
import {
  hasRequestFailed,
  hasRequestSucceeded,
  getRequestLabelText,
} from './helper'

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

function RequestSteps({
  lastProcessedAt,
  multipleRequests,
  requests,
  requestStatus,
}) {
  const theme = useTheme()
  return (
    <div
      css={`
        background: ${theme.feedbackSurface};
        display: grid;
        grid-row-gap: ${4 * GU}px;
        justify-content: space-evenly;
        padding: ${3 * GU}px 0;
        height: ${44 * GU}px;
        overflow-y: auto;
      `}
    >
      {multipleRequests ? (
        <MultiStepRequest
          lastProcessedAt={lastProcessedAt}
          requests={requests}
          requestStatus={requestStatus}
        />
      ) : (
        <SingleStepRequest request={requests[0]} status={requestStatus[0]} />
      )}
    </div>
  )
}

export function RequestStepItem({
  lastProcessedAt,
  request,
  status,
  stepNumber,
}) {
  const theme = useTheme()

  const {
    background,
    iconColor,
    labelColor,
    labelText,
    showProgress,
  } = useMemo(() => {
    const labelText = getRequestLabelText(request, status)

    if (
      status === REQUEST_STATUS_PROCESSING_FAILED ||
      status === REQUEST_STATUS_FAILED
    ) {
      return {
        background: theme.negative,
        iconColor: theme.accentContent,
        labelColor: theme.negative,
        labelText,
      }
    }

    if (status === REQUEST_STATUS_CONFIRMED) {
      return {
        iconColor: theme.positive,
        labelColor: theme.positive,
        labelText,
      }
    }

    if (status === REQUEST_STATUS_PENDING) {
      return {
        background: theme.info,
        iconColor: theme.accentContent,
        labelColor: theme.contentSecondary.alpha(0.6),
        labelText,
        showProgress: true,
      }
    }
    if (status === REQUEST_STATUS_PROCESSED) {
      return {
        iconColor: theme.positive,
        labelColor: theme.positive,
        labelText,
      }
    }

    return {
      background: theme.surfaceContentSecondary.alpha(0.2),
      iconColor: theme.contentSecondary,
      labelColor: theme.contentSecondary.alpha(0.6),
      labelText,
    }
  }, [request, status, theme])

  const success = hasRequestSucceeded(request, status)
  const error = !success && hasRequestFailed(status)

  return (
    <div
      css={`
        align-self: center;
      `}
    >
      <div
        css={`
          display: grid;
          grid-template-columns: 20% 80%;
          grid-gap: ${2 * GU}px;
          width: ${35 * GU}px;
        `}
      >
        <div
          css={`
            background: ${background};
            color: ${iconColor};
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${6 * GU}px;
            height: ${6 * GU}px;
            border-radius: 50%;
            margin-top: ${0.5 * GU}px;

            ${success && `border: 2px solid ${iconColor}`};
          `}
        >
          {(() => {
            if (error) {
              return (
                <IconCross
                  size="medium"
                  css={`
                    color: ${iconColor};
                    transition: color 150ms ease-in-out;
                  `}
                />
              )
            }

            if (success) {
              return (
                <IconCheck
                  size="medium"
                  css={`
                    color: ${iconColor};
                    transition: color 150ms ease-in-out;
                  `}
                />
              )
            }

            return (
              <span
                css={`
                  ${textStyle('body1')};
                `}
              >
                {stepNumber}
              </span>
            )
          })()}
        </div>
        <div>
          <h3
            css={`
              ${textStyle('title4')}
            `}
          >
            {capitalize(numberToOrdinal(stepNumber))} step
          </h3>
          <p
            css={`
              color: ${labelColor};
              ${textStyle('body3')};
            `}
          >
            {labelText}
          </p>
          {showProgress && <TransactionProgress createdAt={lastProcessedAt} />}
        </div>
      </div>
    </div>
  )
}

export default RequestSteps
