import React, { useMemo } from 'react'
import { GU, IconCheck, IconCross, textStyle, useTheme } from '@aragon/ui'
import TransactionProgress from './TransactionProgress'
import {
  REQUEST_STATUS_CONFIRMED,
  REQUEST_STATUS_FAILED,
  REQUEST_STATUS_PENDING,
  REQUEST_STATUS_PROCESSED,
  REQUEST_STATUS_PROCESSING_FAILED,
} from './request-statuses'
import { numberToOrdinal } from '../../lib/math-utils'

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

function RequestStepItem({ lastProcessedAt, request, status, stepNumber }) {
  const theme = useTheme()

  const {
    background,
    iconColor,
    labelColor,
    labelText,
    showProgress,
  } = useMemo(() => {
    if (
      status === REQUEST_STATUS_PROCESSING_FAILED ||
      status === REQUEST_STATUS_FAILED
    ) {
      return {
        background: theme.negative,
        iconColor: theme.accentContent,
        labelColor: theme.negative,
        labelText: request.isTx
          ? status === REQUEST_STATUS_PROCESSING_FAILED
            ? 'Signing transaction failed!'
            : 'Transaction failed'
          : request.onError,
      }
    }

    if (status === REQUEST_STATUS_CONFIRMED) {
      return {
        iconColor: theme.positive,
        labelColor: theme.positive,
        labelText: 'Transaction confirmed!',
      }
    }

    if (status === REQUEST_STATUS_PENDING) {
      return {
        background: theme.info,
        iconColor: theme.accentContent,
        labelColor: theme.contentSecondary.alpha(0.6),
        labelText: 'Transaction being mined…',
        showProgress: true,
      }
    }
    if (status === REQUEST_STATUS_PROCESSED) {
      return {
        iconColor: theme.positive,
        labelColor: theme.positive,
        labelText: request.isTx ? 'Transaction signed!' : request.onSuccess,
      }
    }

    return {
      background: theme.surfaceContentSecondary.alpha(0.2),
      iconColor: theme.contentSecondary,
      labelColor: theme.contentSecondary.alpha(0.6),
      labelText: request.isTx ? 'Waiting for signature…' : request.description,
    }
  }, [request, status, theme])

  const error =
    status === REQUEST_STATUS_PROCESSING_FAILED ||
    status === REQUEST_STATUS_FAILED
  const success =
    status === REQUEST_STATUS_CONFIRMED ||
    (status === REQUEST_STATUS_PROCESSED && !request.ensureConfirmation)

  return (
    <div
      css={`
        display: grid;
        grid-template-columns: 20% 80%;
        grid-gap: ${2 * GU}px;
        min-height: ${10 * GU}px;
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
          {capitalize(numberToOrdinal(stepNumber))} request
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
  )
}

export default RequestStepItem
