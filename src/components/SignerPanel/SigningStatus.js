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
  allSuccess,
  maxAttemptsReached,
  onClosePanel,
  onNextAttempt,
  transactions,
  transactionHashes,
  transactionsStatus,
}) {
  const theme = useTheme()

  const isMultiTx = transactions.length > 1

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
      <div
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        <SigningStatusInfo
          allSuccess={allSuccess}
          isMultiTx={isMultiTx}
          maxAttemptsReached={maxAttemptsReached}
          onClosePanel={onClosePanel}
          onNextAttempt={onNextAttempt}
          transactions={transactions}
          transactionsStatus={transactionsStatus}
        />
      </div>
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

function SigningStatusInfo({
  allSuccess,
  isMultiTx,
  maxAttemptsReached,
  onClosePanel,
  onNextAttempt,
  transactions,
  transactionsStatus,
}) {
  const { activated } = useWallet()
  const provider = getProviderFromUseWalletId(activated)

  if (allSuccess) {
    return (
      <Info>Transaction{isMultiTx ? 's' : ''} submitted successfully!</Info>
    )
  }

  const requiresMultipleSignatures =
    isMultiTx && transactions.filter(tx => !tx.skipSignature).length > 1
  const transactionFailedStatus = transactionsStatus.find(status =>
    [TRANSACTION_STATUS_SIGN_FAILED, TRANSACTION_STATUS_FAILED].includes(status)
  )

  if (transactionFailedStatus) {
    if (isMultiTx) {
      return (
        <TransactionReattempt
          maxAttemptsReached={maxAttemptsReached}
          onClosePanel={onClosePanel}
          onNextAttempt={onNextAttempt}
        />
      )
    }

    return (
      <>
        <Info>
          {transactionFailedStatus === TRANSACTION_STATUS_SIGN_FAILED
            ? "Your transaction wasn't signed"
            : 'Your transaction failed'}
        </Info>
        <Button
          css={`
            margin-top: ${2 * GU}px;
          `}
          label="Close"
          mode="strong"
          onClick={onClosePanel}
          wide
        />
      </>
    )
  }

  if (isMultiTx) {
    return (
      <Info>
        {requiresMultipleSignatures ? (
          <span>
            This action requires multiple transactions. Please sign them one
            after another and <b>do not close this window</b> until the process
            is finished. Open your Ethereum provider {provider.name} to sign the
            transactions.{' '}
            <Link href="#">I don’t see the Ethereum provider.</Link>
          </span>
        ) : (
          <span>
            This action requires multiple transactions. Please,{' '}
            <b>do not close this window</b> until the process is finished.
          </span>
        )}
      </Info>
    )
  }

  return <Info>Open {provider.name} to sign your transaction</Info>
}

const TransactionReattempt = ({
  maxAttemptsReached,
  onClosePanel,
  onNextAttempt,
}) => {
  return (
    <>
      <Info>
        {maxAttemptsReached
          ? `Seems that the transaction won't go through`
          : `An error has occurred during the signature process. Don't worry, you can
        try to send the transaction again.`}
      </Info>
      <Button
        css={`
          margin-top: ${2 * GU}px;
        `}
        label={maxAttemptsReached ? 'Close' : "OK, let's try again"}
        onClick={maxAttemptsReached ? onClosePanel : onNextAttempt}
        mode="strong"
        wide
      />
    </>
  )
}

export default SigningStatus
