import React, { useCallback } from 'react'
import ANJForm from './ANJForm'

const DeactivateANJ = React.memo(function DeactivateANJ({
  onDeactivateANJ,
  activeBalance,
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
      actionLabel="Deactivate"
      onSubmit={onDeactivateANJ}
      onDone={onDone}
      validateForm={validation}
      errorToMessage={errorToMessage}
    />
  )
})

export default DeactivateANJ
