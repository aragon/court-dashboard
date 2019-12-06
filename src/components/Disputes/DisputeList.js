import React from 'react'
import styled from 'styled-components'

import {
  Bar,
  ButtonBase,
  CardLayout,
  DateRangePicker,
  DropDown,
  GU,
  Tag,
  textStyle,
  useTheme,
} from '@aragon/ui'

import DisputeCard from './DisputeCard'

function DisputeList({ disputes, selectDispute }) {
  const theme = useTheme()
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
            header="Disputes"
            placeholder="Disputes"
            // selected={disputeStatusFilter}
            // onChange={handleDisputeStatusFilterChange}
            items={[
              // eslint-disable-next-line
              <div>
                All
                <span
                  css={`
                    margin-left: ${1.5 * GU}px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    color: ${theme.info};
                    ${textStyle('label3')};
                  `}
                >
                  <Tag limitDigits={4} label={disputes.length} size="small" />
                </span>
              </div>,
              'Open',
              'Appeal',
              'Closed',
            ]}
            width="128px"
          />
          <DropDown
            header="Status"
            placeholder="Status"
            // selected={disputeStatusFilter}
            // onChange={handleDisputeStatusFilterChange}
            items={[]}
            width="128px"
          />
          <DateRangePicker
          // startDate={disputeDateRangeFilter.start}
          // endDate={disputeDateRangeFilter.end}
          // onChange={handleDisputeDateRangeFilterChange}
          />
          <Button element="button" borderColor={theme.contentSecondary}>
            My disputes
          </Button>
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

const Button = styled(ButtonBase)`
  padding: 0 24px;
  border: 1px solid ${({ borderColor }) => borderColor};
  height: 40px;
  ${textStyle('body2')}
`

export default DisputeList
