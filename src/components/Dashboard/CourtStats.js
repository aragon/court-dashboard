import React from 'react'
import { Box, Distribution } from '@aragon/ui'

const CourtStats = () => {
  return (
    <Box heading="Court Stats">
      <Distribution
        heading="Disputes"
        items={[
          { item: 'New', percentage: 37 },
          { item: 'Adjudicated', percentage: 22 },
          { item: 'Appeals', percentage: 15 },
          { item: 'Executed', percentage: 12 },
        ]}
      />
    </Box>
  )
}

export default CourtStats
