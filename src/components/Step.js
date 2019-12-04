import React from 'react'
import styled from 'styled-components'

import { GU, useTheme } from '@aragon/ui'

export default function Step({ primary, secondary, active }) {
  const theme = useTheme()

  return (
    <div
      css={`
        display: flex;
        align-items: flex-start;
        position: relative;
        background: ${active ? theme.surfaceSelected : ''};
        padding: ${1 * GU}px ${3 * GU}px;

        &:first-child {
          padding-top: 0;
        }

        &:last-child {
          padding-bottom: 0;
        }
      `}
    >
      <Primary>{primary}</Primary>
      <Secondary>{secondary}</Secondary>
    </div>
  )
}

const Primary = styled.div`
  z-index: 2;
  margin-right: 24px;
`
const Secondary = styled.div``
