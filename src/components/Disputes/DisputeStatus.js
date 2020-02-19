import React from 'react'
import { useTheme } from '@aragon/ui'

import { Status } from '../../types/dispute-status-types'

const getStatusAttributes = (dispute, theme) => {
  if (dispute.status === Status.Open) {
    return {
      label: 'Open',
      color: '#22B187',
      background: 'rgba(53, 214, 167, 0.1)',
    }
  }

  if (dispute.status === Status.Closed) {
    return {
      label: 'Closed',
      color: theme.content,
      background: 'rgba(200, 215, 234, 0.4)', // TODO: use theme when available
    }
  }

  // Voided dispute
  return {
    label: 'VOID',
    color: theme.accent,
    background: `linear-gradient(14deg, ${theme.accentStart.alpha(
      0.3
    )} 0, ${theme.accentEnd.alpha(0.3)} 88%)`,
  }
}

export default function DisputeStatus({ dispute, ...props }) {
  const theme = useTheme()
  const { label, color, background } = getStatusAttributes(dispute, theme)

  return (
    <span
      css={`
        padding: 1px 16px;
        border-radius: 100px;
        text-transform: uppercase;
        font-size: 12px;
        color: ${color};
        background: ${background};
        margin-top: 2px;
      `}
      {...props}
    >
      {label}
    </span>
  )
}
