import React, { useCallback, useState } from 'react'
import { GU, SidePanel } from '@aragon/ui'

import ConfirmTransaction from './ConfirmTransaction'
import SigningStatus from './SigningStatus'
import { useTransactionQueue } from '../../providers/TransactionQueue'

function SignerPanel() {
  const {
    clearTransactionQueue,
    transactions,
    updateTransaction,
  } = useTransactionQueue()
  const [blocking, setBlocking] = useState(false)
  const [signing, setSigning] = useState(false)

  const handleSignerClose = useCallback(() => {
    clearTransactionQueue()
  }, [clearTransactionQueue])

  const startClearing = useCallback(() => {
    setTimeout(() => {
      // Clear state
      setSigning(false)
      setBlocking(false)
      clearTransactionQueue()
    }, 3000)
  }, [clearTransactionQueue])

  const signTransaction = useCallback(
    async (index, transaction) => {
      try {
        const tx = await transaction.intent()
        updateTransaction(index, { ...transaction, signed: true })
        return tx
      } catch (err) {
        updateTransaction(index, { ...transaction, errorSigning: true })
      }
    },
    [updateTransaction]
  )

  const waitForTxMined = useCallback(
    async (index, transaction, signedTx) => {
      await signedTx.wait()

      return updateTransaction(index, { ...transaction, mined: true })
    },
    [updateTransaction]
  )

  const onTransactionMined = useCallback(async transaction => {
    await transaction.onMined.action()
  }, [])

  const handleSign = useCallback(async () => {
    setSigning(true)
    setBlocking(true)

    for (const [index, transaction] of transactions.entries()) {
      try {
        const signedTx = await signTransaction(index, transaction)

        if (transaction.waitTillMined) {
          await waitForTxMined(index, transaction, signedTx)

          // Callback function to execute once the tx has been mined
          if (transaction.onMined) {
            onTransactionMined(transaction)
          }
        }
      } catch (err) {
        console.error(err)
      }
    }

    startClearing()
  }, [
    onTransactionMined,
    signTransaction,
    startClearing,
    transactions,
    waitForTxMined,
  ])

  return (
    <SidePanel
      blocking={blocking}
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
          {signing ? (
            <SigningStatus transactions={transactions} />
          ) : (
            <ConfirmTransaction
              description={transactions[0].description}
              onSign={handleSign}
            />
          )}
          {/* TODO: Add description for multi txs */}
        </div>
      )}
    </SidePanel>
  )
}

export default SignerPanel
