import React, { useCallback, useState } from 'react'
import OnboardingModal from './Onboarding/OnboardingModal'

function OnboardingLoader({ children }) {
  const [onboardingCompleted, setOnboardingCompleted] = useState(
    localStorage.getItem('onboardingCompleted') === 'true'
  )

  const handleOnComplete = useCallback(() => {
    localStorage.setItem('onboardingCompleted', 'true')
    setOnboardingCompleted(true)
  }, [])

  return (
    <React.Fragment>
      <OnboardingModal
        onComplete={handleOnComplete}
        visible={!onboardingCompleted}
      />
      {children}
    </React.Fragment>
  )
}

export default OnboardingLoader
