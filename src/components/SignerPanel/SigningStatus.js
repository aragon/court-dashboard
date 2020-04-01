import React, { useMemo } from 'react'
import { GU, IconCheck, IconCross, useTheme } from '@aragon/ui'
import TransactionStepItem from './TransactionStepItem'

function SigningStatus({ transactions }) {
  const theme = useTheme()

  // We'll display a multiStep component if the transaction queue has more than one tx
  // or if the single tx has a postTx action (e.g performing an action on a server)
  const isMultiTx = transactions.length > 1
  return (
    <div
      css={`
        background: ${theme.feedbackSurface};
        height: 350px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      `}
    >
      {(() => {
        if (isMultiTx) {
          return <MultiStepTx transactions={transactions} />
        }

        if (transactions[0].onMined) {
          return <SingleMultiStepTx transaction={transactions[0]} />
        }

        return <SingleTx transaction={transactions[0]} />
      })()}
    </div>
  )
}

function MultiStepTx({ transactions }) {
  return transactions.map((tx, index) => (
    <TransactionStepItem stepNumber={index + 1} transaction={tx} />
  ))
}

function SingleMultiStepTx({ transaction }) {
  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        height: 100%;
      `}
    >
      <TransactionStepItem stepNumber={1} transaction={transaction} />
      <TransactionStepItem
        stepNumber={2}
        transaction={transaction.onMined}
        requiresSignature={false}
      />
    </div>
  )
}

function SingleTx({ transaction }) {
  const theme = useTheme()

  const { iconColor, label } = useMemo(() => {
    if (transaction.signed) {
      return {
        label: 'Transaction signed!',
        iconColor: theme.positive,
      }
    }

    if (transaction.errorSigning) {
      return {
        label: 'Signing transaction failed!',
        iconColor: theme.negative,
      }
    }

    return {
      label: 'Waiting for signature...',
      iconColor: theme.hint,
    }
  }, [theme, transaction])

  return (
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
          width: 60px;
          height: 60px;
          border: 2px solid ${iconColor};
          border-radius: 50%;
          transition: border-color 150ms ease-in-out;
        `}
      >
        {transaction.errorSigning ? (
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
        {label}
      </p>
    </div>
  )
}

export default SigningStatus
