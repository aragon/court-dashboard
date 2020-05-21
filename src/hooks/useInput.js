import { useCallback, useRef, useState } from 'react'
import { useFocusEnter, useFocusLeave } from '@aragon/ui'

export function useInput(validationFn) {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('empty')

  const inputRef = useRef()

  const handleBlur = useCallback(() => {
    const invalidValue = !validationFn(value)
    if (invalidValue) {
      return setStatus('invalid')
    }
    return setStatus('valid')
  }, [validationFn, value])

  const handleInputFocus = useCallback(event => event.target.select(), [])

  const { handleFocusLeave } = useFocusLeave(handleBlur, inputRef)

  const { handleFocusEnter } = useFocusEnter(handleInputFocus, inputRef)

  const handleValueChange = useCallback(e => {
    const val = e.target.value
    setValue(val)
    // Set only as valid while user typing. Use blur to set invalid
    setStatus(val.trim() ? 'valid' : 'empty')
  }, [])

  return {
    inputProps: {
      inputRef,
      value,
      onBlur: handleFocusLeave,
      onFocus: handleFocusEnter,
      onChange: handleValueChange,
    },
    status,
  }
}
