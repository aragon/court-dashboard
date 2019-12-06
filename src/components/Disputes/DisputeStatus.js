import React from 'react'
import { useTheme } from '@aragon/ui'

import {
  DISPUTE_STATUS_OPEN,
  DISPUTE_STATUS_APPEAL,
  DISPUTE_STATUS_CLOSED,
} from '../../dispute-status-type'

const getStatusAttributes = (dispute, theme) => {
  if (dispute.status === DISPUTE_STATUS_OPEN) {
    return {
      label: 'Open',
      color: theme.positiveSurfaceContent,
      background: theme.green.alpha(0.2),
    }
  }
  if (dispute.status === DISPUTE_STATUS_APPEAL) {
    return {
      label: 'Appeal',
      color: '#564038', // TODO: use theme when available (colors.BrownDark)
      background: 'rgba(216, 188, 177, 0.2)', // colors.BrownLight
    }
  }
  if (dispute.status === DISPUTE_STATUS_CLOSED) {
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
