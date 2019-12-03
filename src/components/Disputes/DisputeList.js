import React from 'react'
import { CardLayout, GU } from '@aragon/ui'

import DisputeCard from './DisputeCard'

function DisputeList({ disputes, selectDispute }) {
  return (
    <div>
      {' '}
      <CardLayout columnWidthMin={30 * GU} rowHeight={300}>
        {disputes.map(dispute => {
          return (
            <DisputeCard
              key={dispute.id}
              dispute={dispute}
              selectDispute={selectDispute}
            />
          )
        })}
      </CardLayout>
    </div>
  )
}

export default DisputeList
