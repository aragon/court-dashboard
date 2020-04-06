import React, { useMemo } from 'react'
import {
  GU,
  IconCheck,
  IconCross,
  textStyle,
  TransactionBadge,
  useTheme,
} from '@aragon/ui'
import {
  TRANSACTION_STATUS_CONFIRMED,
  TRANSACTION_STATUS_FAILED,
  TRANSACTION_STATUS_PENDING,
  TRANSACTION_STATUS_SIGN_FAILED,
  TRANSACTION_STATUS_SIGNED,
} from './transaction-statuses'
import { numberToOrdinal } from '../../lib/math-utils'

// We could have transactions that are not cast to the network but perform another action e.g. requesting the auto-reveal service
// Nevertheless we treat them as another transaction and we differentiate it from the rest by the `skipSignature` prop
// For this particular transactions, if its status is signed then it means that the action executed successfuly
// Note that if we want to add more descriptive messages to this type of txs, then we should add `onError` and `onSuccess` props
// For an example, see CommitPanel
function TransactionStepItem({ hash, status, stepNumber, transaction }) {
  const theme = useTheme()

  const { background, iconColor, labelColor, labelText } = useMemo(() => {
    if (
      status === TRANSACTION_STATUS_SIGN_FAILED ||
      status === TRANSACTION_STATUS_FAILED
    ) {
      return {
        background: theme.negative,
        iconColor: theme.accentContent,
        labelColor: theme.negative,
        labelText:
          transaction.onError ||
          (status === TRANSACTION_STATUS_SIGN_FAILED
            ? 'Signing transaction failed!'
            : 'Transaction failed'),
      }
    }

    if (status === TRANSACTION_STATUS_CONFIRMED) {
      return {
        iconColor: theme.positive,
        labelColor: theme.positive,
        labelText: 'Transaction confirmed!',
      }
    }

    if (status === TRANSACTION_STATUS_PENDING) {
      return {
        background: theme.info,
        iconColor: theme.accentContent,
        labelColor: theme.contentSecondary.alpha(0.6),
        labelText: 'Transaction being mined...',
      }
    }

    if (status === TRANSACTION_STATUS_SIGNED) {
      return {
        iconColor: theme.positive,
        labelColor: theme.positive,
        labelText: transaction.onSuccess || 'Transaction signed!',
      }
    }

    return {
      background: theme.surfaceContentSecondary.alpha(0.2),
      iconColor: theme.contentSecondary,
      labelColor: theme.contentSecondary.alpha(0.6),
      labelText: transaction.skipSignature
        ? transaction.description
        : 'Waiting for signature...',
    }
  }, [status, theme, transaction])

  const success =
    status === TRANSACTION_STATUS_CONFIRMED ||
    (status === TRANSACTION_STATUS_SIGNED && !transaction.waitForConfirmation)

  return (
    <div
      css={`
        display: grid;
        grid-template-columns: 20% 80%;
        grid-gap: 16px;
        width: 280px;
      `}
    >
      <div
        css={`
          background: ${background};
          color: ${iconColor};
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-top: ${0.5 * GU}px;

          ${success && `border: 2px solid ${iconColor}`};
        `}
      >
        {(() => {
          if (status === TRANSACTION_STATUS_SIGN_FAILED) {
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
          {numberToOrdinal(stepNumber)} transaction
        </h3>
        <p
          css={`
            color: ${labelColor};
            ${textStyle('body3')};
          `}
        >
          {labelText}
        </p>

        {hash && (
          <div
            css={`
              margin-top: ${1 * GU}px;
            `}
          >
            <TransactionBadge transaction={hash} />
          </div>
        )}
      </div>
    </div>
  )
}

export default TransactionStepItem
