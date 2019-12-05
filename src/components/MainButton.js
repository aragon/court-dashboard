import React from 'react'
import { Button, useTheme, useViewport } from '@aragon/ui'

function MainButton({ label, icon, onClick, primary }) {
  const { below } = useViewport()

  const theme = useTheme()

  return (
    <Button
      mode="strong"
      onClick={onClick}
      label={label}
      icon={icon}
      display={below('medium') ? 'icon' : 'label'}
      css={`
        background: ${primary
          ? 'linear-gradient(202.42deg, #FFB36D -50.51%, #FF8888 91.55%)'
          : theme.surfaceContentSecondary};
      `}
    />
  )
}

export default MainButton
