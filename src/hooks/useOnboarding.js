import { useCallback, useEffect, useReducer } from 'react'

function stepsReducer(state, { type, value, steps }) {
  const { step } = state

  let newStep = null

  if (type === 'set') {
    newStep = value
  }
  if (type === 'next' && step < steps - 1) {
    newStep = step + 1
  }
  if (type === 'prev' && step > 0) {
    newStep = step - 1
  }

  if (newStep !== null && step !== newStep) {
    return {
      step: newStep,
      direction: newStep > step ? 1 : -1,
    }
  }

  return state
}
// Simple hook to manage a given number of steps.
export function useSteps(steps) {
  const [{ step, direction }, updateStep] = useReducer(stepsReducer, {
    step: 0,
    direction: 0,
  })

  // If the number of steps change, we reset the current step
  useEffect(() => {
    updateStep({ type: 'set', value: 0, steps })
  }, [steps])

  const setStep = useCallback(
    value => {
      updateStep({ type: 'set', value, steps })
    },
    [steps]
  )

  const next = useCallback(() => {
    updateStep({ type: 'next', steps })
  }, [steps])

  const prev = useCallback(() => {
    updateStep({ type: 'prev', steps })
  }, [steps])

  return {
    direction,
    next,
    prev,
    setStep,
    step,
  }
}
