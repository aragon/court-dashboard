import React from 'react'
import { Box, GU, Text, textStyle, IdentityBadge } from '@aragon/ui'
import IconCourt from '../../assets/courtIcon.svg'

const DisputeInfo = ({ dispute }) => {
  const {
    id,
    // description,
    // status,
    creator,
    // rewardAmount,
    // stakedAmount,
    // term,
    // termDate,
  } = dispute

  return (
    <Box>
      <section
        css={`
          display: grid;
          grid-template-columns: auto;
          grid-gap: ${2.5 * GU}px;
          margin-top: ${2.5 * GU}px;
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
          `}
        >
          <div
            css={`
              background: #c8d7ea;
              border-radius: 50%;
              padding: 12px;
              display: inline-block;
            `}
          >
            <img src={IconCourt} />
          </div>
          <div
            css={`
              margin-left: ${3 * GU}px;
            `}
          >
            <Text
              css={`
                display: block;
                margin-bottom: ${GU}px;
                ${textStyle('title3')};
              `}
            >
              Dispute #{id}
            </Text>
            <IdentityBadge entity={creator} badgeOnly />
          </div>
        </div>
      </section>
    </Box>
  )
}

export default DisputeInfo
