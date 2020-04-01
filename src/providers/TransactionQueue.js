import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const TransactionQueueContext = React.createContext()

function TransactionQueueProvider({ children }) {
  const [transactions, setTransactions] = useState([])

  const addTransaction = useCallback(
    tx => {
      const newTransactions = [...transactions, tx]
      setTransactions(newTransactions)
    },
    [transactions]
  )

  const addMultipleTxs = useCallback(
    txs => {
      const newTransactions = [...transactions, ...txs]
      setTransactions(newTransactions)
    },
    [transactions]
  )

  const updateTransaction = useCallback(
    (index, tx) => {
      const newTransactions = [
        ...transactions.slice(0, index),
        tx,
        ...transactions.slice(index + 1),
      ]
      setTransactions(newTransactions)
    },
    [transactions]
  )

  const clearTransactionQueue = useCallback(() => {
    setTransactions([])
  }, [])

  return (
    <TransactionQueueContext.Provider
      value={{
        addMultipleTxs,
        addTransaction,
        clearTransactionQueue,
        transactions,
        updateTransaction,
      }}
    >
      {children}
    </TransactionQueueContext.Provider>
  )
}

TransactionQueueProvider.propTypes = {
  children: PropTypes.node,
}

function useTransactionQueue() {
  return useContext(TransactionQueueContext)
}

export { TransactionQueueProvider, useTransactionQueue }
