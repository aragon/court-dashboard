import React from 'react'
import { useTheme } from '@aragon/ui'
import { Status } from './types'

const getStatusAttributes = (dispute, theme) => {
  if (dispute.reducedState === Status.Open) {
    return {
      label: 'Open',
      color: '#22B187',
      background: 'rgba(53, 214, 167, 0.1)',
    }
  }
  if (dispute.reducedState === Status.Closed) {
    return {
      label: 'Closed',
      color: theme.content,
      background: 'rgba(200, 215, 234, 0.4)', // TODO: use theme when available
    }
  }
}

export default function DisputeStatus({ dispute }) {
  const theme = useTheme()
  const { label, color, background } = getStatusAttributes(dispute, theme)

  return (
    <span
      css={`
        padding: 1px 16px;
        border-radius: 100px;
        background: #d2d2d2;
        text-transform: uppercase;
        font-size: 12px;
        color: ${color};
        background: ${background};
      `}
    >
      {label}
    </span>
  )
}
