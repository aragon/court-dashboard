import React from 'react'
import { SyncIndicator } from '@aragon/ui'
import { useCourtConfig } from '../providers/CourtConfig'

function AppLoader({ children }) {
  const courtConfig = useCourtConfig()

  if (!courtConfig) return <SyncIndicator visible /> // TODO: Add better loader
  return <React.Fragment>{children}</React.Fragment>
}

export default AppLoader
