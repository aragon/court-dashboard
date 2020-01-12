import React, { useCallback } from 'react'
import ANJForm from './ANJForm'

const DeactivateANJ = React.memo(function DeactivateANJ({
  onDeactivateANJ,
  activeBalance,
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
      onSubmit={onDeactivateANJ}
      onDone={onDone}
      panelOpened={panelOpened}
      validateForm={validation}
      errorToMessage={errorToMessage}
    />
  )
})

export default DeactivateANJ
