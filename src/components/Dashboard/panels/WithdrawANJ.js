import React, { useCallback } from 'react'
import ANJForm from './ANJForm'

const WithdrawANJ = React.memo(function WithdrawANJ({
  onWithdrawANJ,
  inactiveBalance,
  onDone,
  panelOpened,
}) {
  const validation = useCallback(amount => {
    return null
  }, [])

  const errorToMessage = err => {
    if (err) {
      console.log(err)
    }
    return ''
  }
  return (
    <ANJForm
      onSubmit={onWithdrawANJ}
      onDone={onDone}
      panelOpened={panelOpened}
      validateForm={validation}
      errorToMessage={errorToMessage}
    />
  )
})

export default WithdrawANJ
