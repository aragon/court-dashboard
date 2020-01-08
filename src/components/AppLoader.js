import React from 'react'
import { useCourtConfig } from '../providers/CourtConfig'

function AppLoader({ children }) {
  const courtConfig = useCourtConfig()

  if (!courtConfig) return <p>Loading</p> // TODO: Add better loader
  return <React.Fragment>{children}</React.Fragment>
}

export default AppLoader
