import React from 'react'
import styled from 'styled-components'

import {
  Card,
  GU,
  ContextMenu,
  ContextMenuItem,
  IconInfo,
  IdentityBadge,
  textStyle,
  useTheme,
} from '@aragon/ui'

import DisputeText from './DisputeText'
import DisputeStatus from './DisputeStatus'

function DisputeCard({ dispute, selectDispute }) {
  const theme = useTheme()

  return (
    <CardItem>
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <DisputeStatus dispute={dispute} />
        <ContextMenu>
          <ContextMenuItem onClick={() => selectDispute(dispute.id)}>
            <IconInfo />
            View
          </ContextMenuItem>
        </ContextMenu>
      </div>

      <div
        css={`
          & > * {
            margin-bottom: ${1 * GU}px;
          }
        `}
      >
        <h3
          css={`
            ${textStyle('body1')}
          `}
        >
          Dispute
          <strong> #{dispute.id}</strong>
        </h3>
        <DisputeText
          text={dispute.description}
          css={`
            overflow: hidden;
            ${textStyle('body2')};
            color: ${theme.contentSecondary};
            line-height: ${27}px; // 27px = line-height of textstyle('body1')
            height: ${27 * 2}px; // 27px * 2 = line-height * 2 lines
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          `}
        />
        <IdentityBadge entity={dispute.creator} badgeOnly />
      </div>
      <DisputeDetails labelColor={theme.contentSecondary}>
        <div>
          <span>Reward</span>
          <span>{dispute.rewardAmount} DAI</span>
        </div>
        <div>
          <span>Collateral staked</span>
          <span>{dispute.stakedAmount} ANJ</span>
        </div>
        <div>
          <span>Term Date</span>
          <span>{dispute.termDate}</span>
        </div>
      </DisputeDetails>
    </CardItem>
  )
}

const CardItem = styled(Card)`
  display: grid;
  grid-template-columns: 100%;
  grid-gap: ${1 * GU}px;
  padding: ${3 * GU}px;
  box-shadow: rgba(51, 77, 117, 0.2) 0px 1px 3px;
  border: 0;
`

const DisputeDetails = styled.div`
  line-height: 27px;

  & > div {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > span:first-child {
      ${textStyle('label2')}
      font-weight: 300;
      color: ${({ labelColor }) => labelColor};
    }
  }
`

export default DisputeCard
