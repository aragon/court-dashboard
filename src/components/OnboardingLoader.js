import React, { useCallback, useState } from 'react'
import OnboardingModal from './Onboarding/OnboardingModal'

function OnboardingLoader({ children }) {
  const [onboardingCompleted, setOnboardingCompleted] = useState(
    localStorage.getItem('onboardingCompleted')
  )

  const handleStartCourt = useCallback(() => {
    localStorage.setItem('onboardingCompleted', true)
    setOnboardingCompleted(true)
  }, [])

  return (
    <React.Fragment>
      {!onboardingCompleted && (
        <OnboardingModal
          visible={!onboardingCompleted}
          onStartCourt={handleStartCourt}
        />
      )}

      <React.Fragment>{children}</React.Fragment>
    </React.Fragment>
  )
}

export default OnboardingLoader
