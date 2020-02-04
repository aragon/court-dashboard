import React, { useCallback, useState } from 'react'
import OnboardingModal from './Onboarding/OnboardingModal'

function OnboardingLoader({ children }) {
  const [onboardingVisible, setOnboardingVisible] = useState(true)

  const handleCloseModal = useCallback(() => {
    setOnboardingVisible(false)
  }, [])

  console.log('visible ', onboardingVisible)
  return (
    <React.Fragment>
      <OnboardingModal visible={onboardingVisible} onClose={handleCloseModal} />
      <React.Fragment>{children}</React.Fragment>
    </React.Fragment>
  )
}

export default OnboardingLoader
