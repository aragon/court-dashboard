import React, { useMemo } from 'react'
import {
  Button,
  GU,
  IconCheck,
  IconCross,
  Info,
  Link,
  useTheme,
} from '@aragon/ui'
import TransactionStepItem from './TransactionStepItem'
import { useWallet } from '../../providers/Wallet'
import { getProviderFromUseWalletId } from '../../ethereum-providers'
import {
  TRANSACTION_STATUS_CONFIRMED,
  TRANSACTION_STATUS_FAILED,
  TRANSACTION_STATUS_PENDING,
  TRANSACTION_STATUS_SIGNED,
  TRANSACTION_STATUS_SIGN_FAILED,
} from './transaction-statuses'

function SigningStatus({
  maxAttemptsReached,
  onNextAttempt,
  transactions,
  transactionHashes,
  transactionsStatus,
}) {
  const theme = useTheme()
  const { activated } = useWallet()
  const provider = getProviderFromUseWalletId(activated)

  const isMultiTx = transactions.length > 1 || transactions[0].onMined
  const requiresMultipleSignatures =
    isMultiTx && transactions.filter(tx => !tx.skipSignature) > 1
  const transactionErrored = transactionsStatus.some(status =>
    [TRANSACTION_STATUS_SIGN_FAILED, TRANSACTION_STATUS_FAILED].includes(status)
  )
  return (
    <div>
      <div
        css={`
          background: ${theme.feedbackSurface};
          height: 350px;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: center;
        `}
      >
        {isMultiTx ? (
          <MultiStepTx
            onNextAttempt={onNextAttempt}
            transactions={transactions}
            transactionHashes={transactionHashes}
            transactionsStatus={transactionsStatus}
          />
        ) : (
          <SingleTx
            status={transactionsStatus[0]}
            transaction={transactions[0]}
          />
        )}
      </div>
      {isMultiTx && (
        <Info
          css={`
            margin-top: ${2 * GU}px;
          `}
        >
          {requiresMultipleSignatures ? (
            <span>
              This action requires multiple transactions. Please sign them one
              after another and <b>do not close this window</b> until the
              process is finished. Open your Ethereum provider {provider.name}{' '}
              to sign the transaction.{' '}
              <Link href="#">I don’t see the Ethereum provider.</Link>
            </span>
          ) : (
            <span>
              This action requires multiple transactions. Please,{' '}
              <b>do not close this window</b> until the process is finished.
            </span>
          )}
        </Info>
      )}

      {isMultiTx && transactionErrored && (
        <TransactionReattempt
          maxAttemptsReached={maxAttemptsReached}
          onNextAttempt={onNextAttempt}
        />
      )}
    </div>
  )
}

function MultiStepTx({ transactions, transactionHashes, transactionsStatus }) {
  return transactions.map((tx, index) => {
    const { hash } =
      transactionHashes.find(txHash => txHash.index === index) || {}
    const txStatus = transactionsStatus[index]

    return (
      <TransactionStepItem
        key={index}
        hash={hash}
        status={txStatus}
        stepNumber={index + 1}
        transaction={tx}
      />
    )
  })
}

function SingleTx({ status }) {
  const theme = useTheme()

  const { iconColor, label } = useMemo(() => {
    if (status === TRANSACTION_STATUS_SIGN_FAILED) {
      return {
        iconColor: theme.negative,
        label: 'Signing transaction failed!',
      }
    }

    if (status === TRANSACTION_STATUS_CONFIRMED) {
      return {
        iconColor: theme.positive,
        label: 'Transaction confirmed!',
      }
    }

    if (status === TRANSACTION_STATUS_PENDING) {
      return {
        iconColor: theme.info,
        label: 'Transaction being mined...',
      }
    }

    if (status === TRANSACTION_STATUS_SIGNED) {
      return {
        iconColor: theme.positive,
        label: 'Transaction signed!',
      }
    }

    return {
      iconColor: theme.hint,
      label: 'Waiting for signature...',
    }
  }, [theme, status])

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
        {status === TRANSACTION_STATUS_SIGN_FAILED ? (
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

function TransactionReattempt({ maxAttemptsReached, onNextAttempt }) {
  return (
    <div
      css={`
        margin-top: ${2 * GU}px;
      `}
    >
      {!maxAttemptsReached ? (
        <>
          <Info mode="warning">
            An error has occurred during the signature process. Don't worry, you
            can try to send the transaction again.
          </Info>
          <Button
            css={`
              margin-top: ${2 * GU}px;
            `}
            label="OK, let's try again"
            onClick={onNextAttempt}
            wide
          />
        </>
      ) : (
        <Info mode="warning">
          It seems possible that the transaction won't go through, please try
          again in a few minutes.
        </Info>
      )}
    </div>
  )
}

export default SigningStatus
