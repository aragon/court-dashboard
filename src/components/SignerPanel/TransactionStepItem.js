import React, { useMemo } from 'react'
import { GU, IconCheck, textStyle, useTheme } from '@aragon/ui'

function TransactionStepItem({
  stepNumber,
  transaction,
  requiresSignature = true,
}) {
  const theme = useTheme()

  const { background, color, label } = useMemo(() => {
    if (requiresSignature) {
      if (transaction.error) {
        return {
          background: theme.negative,
          color: theme.accentContent,
          label: 'Signing transaction failed!',
        }
      }

      if (transaction.signed) {
        if (!transaction.mined) {
          return {
            background: theme.blue,
            color: theme.accentContent,
            label: 'Transaction being mined...',
          }
        } else {
          return {
            color: theme.positive,
            label: 'Transaction confirmed!',
          }
        }
      }
    }

    return {
      background: theme.hint,
      label: 'Waiting for signature...',
    }
  }, [requiresSignature, theme, transaction])

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        margin-bottom: ${2 * GU}px;
      `}
    >
      <div
        css={`
          background: ${background};
          color: ${color};
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin-right: ${2.5 * GU}px;

          ${transaction.mined && `border: 2px solid ${color}`};
        `}
      >
        {transaction.mined ? (
          <IconCheck
            size="medium"
            css={`
              color: ${color};
              transition: color 150ms ease-in-out;
            `}
          />
        ) : (
          <span>{stepNumber}</span>
        )}
      </div>
      <div>
        <h3
          css={`
            ${textStyle('title3')}
          `}
        >
          Transaction
        </h3>
        <p>{label}</p>
      </div>
    </div>
  )
}

export default TransactionStepItem
