import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const TransactionQueueContext = React.createContext()

function TransactionQueueProvider({ children }) {
  const [transactions, setTransactions] = useState([])

  const addTransaction = useCallback(
    tx => {
      const newTransactions = [...transactions, tx]
      return setTransactions(newTransactions)
    },
    [transactions]
  )

  const addTransactions = useCallback(
    txs => {
      const newTransactions = [...transactions, ...txs]
      return setTransactions(newTransactions)
    },
    [transactions]
  )

  const clearTransactionQueue = useCallback(() => {
    return setTransactions([])
  }, [])

  return (
    <TransactionQueueContext.Provider
      value={{
        addTransaction,
        addTransactions,
        clearTransactionQueue,
        transactions,
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
