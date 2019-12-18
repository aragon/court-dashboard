import React from 'react'

import { Bar, CardLayout, DateRangePicker, DropDown, GU } from '@aragon/ui'

import DisputeCard from './DisputeCard'

function DisputeList({ disputes, selectDispute, statusTypes, phaseTypes }) {
  // const theme = useTheme()
  return (
    <div>
      <Bar>
        <div
          css={`
            height: ${8 * GU}px;
            display: grid;
            grid-template-columns: auto auto 1fr auto;
            grid-gap: ${1 * GU}px;
            align-items: center;
            padding: 0 ${3 * GU}px;
          `}
        >
          <DropDown
            header="Phase"
            placeholder="Phase"
            // selected={disputeStatusFilter}
            // onChange={handleDisputeStatusFilterChange}
            items={phaseTypes}
            width="128px"
          />
          <DropDown
            header="Status"
            placeholder="Status"
            // selected={disputeStatusFilter}
            // onChange={handleDisputeStatusFilterChange}
            items={statusTypes}
            width="128px"
          />
          <DateRangePicker
          // startDate={disputeDateRangeFilter.start}
          // endDate={disputeDateRangeFilter.end}
          // onChange={handleDisputeDateRangeFilterChange}
          />
        </div>
      </Bar>
      <CardLayout columnWidthMin={30 * GU} rowHeight={307}>
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
