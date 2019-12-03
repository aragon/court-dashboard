import React from 'react'
import styled from 'styled-components'

import DisputeText from './DisputeText'
import { Card, GU, ContextMenu, IdentityBadge, textStyle } from '@aragon/ui'

function DisputeCard({ dispute, selectDispute }) {
  return (
    <CardItem>
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <span
          css={`
            padding: 1px 20px;
            border-radius: 100px;
            background: #d2d2d2;
            text-transform: uppercase;
            font-size: 12px;
          `}
        >
          {dispute.status}
        </span>
        <ContextMenu />
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
            font-weight: 200;
          `}
        >
          Dispute
          <b
            css={`
              letter-spacing: 1px;
            `}
          >
            {' '}
            #{dispute.id}
          </b>
        </h3>
        <DisputeText
          text={dispute.description}
          css={`
            overflow: hidden;
            ${textStyle('body2')};
            color: #637381;
            font-weight: 200;
            line-height: ${27}px; // 27px = line-height of textstyle('body1')
            height: ${27 * 2}px; // 27px * 2 = line-height * 2 lines
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          `}
        />
        <IdentityBadge entity={dispute.creator} badgeOnly />
      </div>
      <DisputeDetails>
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
  grid-template-rows: auto auto auto;
  grid-gap: ${1 * GU}px;
  padding: ${3 * GU}px;
  box-shadow: rgba(51, 77, 117, 0.2) 0px 1px 3px;
  border: 0;
  font-weight: 200;
`

const DisputeDetails = styled.div`
  line-height: 27px;

  & > div {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > span:first-child {
      ${textStyle('label2')}
      font-weight: 200;
      color: #637381;
    }
  }
`

export default DisputeCard
