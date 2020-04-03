import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { GU, SidePanel } from '@aragon/ui'
import { captureException } from '@sentry/browser'

import ConfirmTransaction from './ConfirmTransaction'
import SigningStatus from './SigningStatus'
import { useTransactionQueue } from '../../providers/TransactionQueue'
import {
  TRANSACTION_STATUS_CONFIRMED,
  TRANSACTION_STATUS_FAILED,
  TRANSACTION_STATUS_PENDING,
  TRANSACTION_STATUS_SIGN_FAILED,
  TRANSACTION_STATUS_SIGNED,
  TRANSACTION_STATUS_UPCOMING,
} from './transaction-statuses'

const MAX_ATTEMPTS = 3

const INITIAL_STATE = {
  confirmed: 0,
  erroredSigning: -1,
  failed: -1,
  signed: 0,
  signing: 0,
}

function SignerPanel() {
  const { clearTransactionQueue, transactions } = useTransactionQueue()
  const [attempts, setAttempts] = useState(0)
  const [transactionHashes, setTransactionHashes] = useState([])
  const [transactionProgress, setTransactionProgress] = useState({
    ...INITIAL_STATE,
  })

  const handleSignerClose = useCallback(() => {
    // Clear state
    setAttempts(0)
    setTransactionHashes([])
    setTransactionProgress({ ...INITIAL_STATE })
    clearTransactionQueue()
  }, [clearTransactionQueue])

  const handleNextAttempt = useCallback(() => {
    setAttempts(attempts => attempts + 1)
  }, [])

  const handleSign = useCallback(() => {
    setTransactionProgress(txProgress => ({ ...txProgress, signing: 1 }))
  }, [])

  const signTransaction = useCallback(async transaction => {
    try {
      const tx = await transaction.intent()
      // Mark tx as signed
      setTransactionProgress(({ signed, ...txProgress }) => ({
        ...txProgress,
        signed: signed + 1,
      }))

      return tx
    } catch (err) {
      // Mark tx as errored at signing
      setTransactionProgress(({ signed, ...txProgress }) => ({
        ...txProgress,
        signed,
        erroredSigning: signed,
      }))

      // Re throw error
      throw err
    }
  }, [])

  const waitForTxConfirmation = useCallback(
    async (index, signedTx) => {
      try {
        // Save tx hash
        setTransactionHashes(txHashes => [
          ...txHashes,
          { index, hash: signedTx.hash },
        ])

        // Wait for tx to be mined
        await signedTx.wait()
        return setTransactionProgress(txProgress => ({
          ...txProgress,
          confirmed: index + 1,
        }))
      } catch (err) {
        // Mark tx as failed
        setTransactionProgress(({ confirmed, ...txProgress }) => ({
          ...txProgress,
          confirmed,
          failed: confirmed,
        }))

        // Re throw error
        throw err
      }
    },
    [setTransactionProgress]
  )

  // Get transaction statuses
  const transactionsStatus = useMemo(() => {
    if (!transactions) {
      return []
    }

    const { confirmed, erroredSigning, failed, signed } = transactionProgress
    const status = (transaction, index) => {
      // Transaction signing failed
      if (erroredSigning !== -1 && index >= erroredSigning) {
        return TRANSACTION_STATUS_SIGN_FAILED
      }

      // Transaction confirmation failed
      if (failed !== -1 && index >= failed) {
        return TRANSACTION_STATUS_FAILED
      }

      // Transaction confirmed
      if (index < confirmed && transaction.waitForConfirmation) {
        return TRANSACTION_STATUS_CONFIRMED
      }

      // Transaction signed
      if (index < signed) {
        if (transaction.waitForConfirmation) {
          return TRANSACTION_STATUS_PENDING
        }

        return TRANSACTION_STATUS_SIGNED
      }

      // Transaction not processed
      return TRANSACTION_STATUS_UPCOMING
    }

    return transactions.map((transaction, index) => status(transaction, index))
  }, [transactions, transactionProgress])

  const maxAttemptsReached = attempts >= MAX_ATTEMPTS

  // Create transactions
  useEffect(
    () => {
      if (!transactionProgress.signing) {
        return
      }

      if (attempts === 0) {
        setTransactionProgress(({ signing }) => ({
          ...INITIAL_STATE,
          signing,
        }))
      } else {
        setTransactionProgress(txProgress => ({
          ...txProgress,
          erroredSigning: -1,
          failed: -1,
        }))
      }

      let cancelled = false

      const createTransactions = async () => {
        const filteredTransactions = transactions
          .slice(transactionProgress.signed)
          .entries()

        for (const [index, transaction] of filteredTransactions) {
          if (cancelled) {
            break
          }

          try {
            const signedTx = await signTransaction(transaction)

            if (!cancelled) {
              if (transaction.waitForConfirmation) {
                await waitForTxConfirmation(index, signedTx)

                // Execute callback function if required
                // Note that this function is treated differently from onConfirmed transactions since it's not neccessarily a blocking action
                if (transaction.callback) {
                  transaction.callback()
                }
              }
            }
          } catch (err) {
            console.error(
              `Error when executing: ${transaction.description}:`,
              err
            )
            captureException(err)

            if (transactions.length > 1) {
              // Cancel to stop later transactions from being signed
              cancelled = true
            }
          }
        }
      }

      createTransactions()

      return () => {
        cancelled = true
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      attempts,
      transactions,
      signTransaction,
      transactionProgress.signing,
      waitForTxConfirmation,
    ]
  )

  useEffect(() => {
    let timeout

    const startClearing = () => {
      timeout = setTimeout(() => {
        handleSignerClose()
      }, 3000)
    }

    const { confirmed, erroredSigning, failed, signed } = transactionProgress

    const requiredConfirmations = transactions.filter(
      tx => tx.waitForConfirmation
    ).length

    const allSigned = signed > 0 && signed === transactions.length
    const allConfirmed = confirmed === requiredConfirmations
    const success = allSigned && allConfirmed

    // We only close the panel if there's only one transaction to sign and it fails to do so
    // If we have multiple transactions we'll let the user to retry the signature process
    const onlyTxFailed =
      transactions.length === 1 && (erroredSigning === 0 || failed === 0)

    if (maxAttemptsReached || success || onlyTxFailed) {
      startClearing()
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [
    clearTransactionQueue,
    transactions,
    handleSignerClose,
    maxAttemptsReached,
    transactionProgress,
  ])

  const blockPanel = !maxAttemptsReached && transactions.length > 1

  return (
    <SidePanel
      blocking={blockPanel}
      title="Create transaction"
      opened={transactions.length > 0}
      onClose={handleSignerClose}
    >
      {transactions.length > 0 && (
        <div
          css={`
            margin-top: ${3 * GU}px;
          `}
        >
          {transactionProgress.signing ? (
            <SigningStatus
              maxAttemptsReached={maxAttemptsReached}
              onNextAttempt={handleNextAttempt}
              transactions={transactions}
              transactionHashes={transactionHashes}
              transactionsStatus={transactionsStatus}
            />
          ) : (
            <ConfirmTransaction
              descriptions={transactions.map(tx => tx.description)}
              onSign={handleSign}
            />
          )}
        </div>
      )}
    </SidePanel>
  )
}

export default React.memo(SignerPanel)
