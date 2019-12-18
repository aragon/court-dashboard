import React from 'react'
import styled from 'styled-components'

import { Split } from '@aragon/ui'

// import { balances } from '../../mock-data'

function BalanceModule({ active, connectedAccount }) {
  // const theme = useTheme()

  return (
    <Split
      primary={<Container>Profile</Container>}
      secondary={
        <Container>
          <div>Information</div>
          <div>inactive</div>
          <div>active</div>
        </Container>
      }
      invert="horizontal"
    />
  )
}

const Container = styled.div`
  border: 1px solid black;
`

export default BalanceModule
