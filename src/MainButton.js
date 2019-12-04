import React from 'react'
import { Button, useViewport } from '@aragon/ui'

function MainButton({ label, icon, onClick }) {
  const { below } = useViewport()

  return (
    <Button
      mode="strong"
      onClick={onClick}
      label={label}
      icon={icon}
      display={below('medium') ? 'icon' : 'label'}
      style={{
        background:
          'linear-gradient(202.42deg, #FFB36D -50.51%, #FF8888 91.55%)',
      }}
    />
  )
}

export default MainButton
