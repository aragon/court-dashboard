import React, { useCallback } from 'react'
import ANJForm from './ANJForm'

const WithdrawANJ = React.memo(function WithdrawANJ({
  onWithdrawANJ,
  inactiveBalance,
  onDone,
  panelOpened,
}) {
  // TODO: Validation checks and possible errors
  const validation = useCallback(amount => {
    return null
  }, [])

  const errorToMessage = useCallback(err => {
    if (err) {
      console.log(err)
    }
    return ''
  }, [])

  return (
    <ANJForm
      actionLabel="Withdraw"
      onSubmit={onWithdrawANJ}
      onDone={onDone}
      panelOpened={panelOpened}
      validateForm={validation}
      errorToMessage={errorToMessage}
    />
  )
})

export default WithdrawANJ
