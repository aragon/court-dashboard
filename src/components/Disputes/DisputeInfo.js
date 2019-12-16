import React from 'react'
import {
  Box,
  Button,
  GU,
  Text,
  textStyle,
  IdentityBadge,
  useTheme,
} from '@aragon/ui'
import IconCourt from '../../assets/courtIcon.svg'
import DisputeStatus from './DisputeStatus'

const DisputeInfo = ({ dispute }) => {
  const theme = useTheme()
  const {
    id,
    description,
    // status,
    creator,
    rewardAmount,
    stakedAmount,
    term,
    // termDate,
  } = dispute

  return (
    <Box>
      <section
        css={`
          display: grid;
          grid-template-columns: auto;
          grid-gap: ${2.5 * GU}px;
          align-items: center;
        `}
      >
        <div
          css={`
            display: flex;
            margin-bottom: ${3 * GU}px;
            justify-content: space-between;
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
          <div>
            <DisputeStatus dispute={dispute} />
          </div>
        </div>

        <div
          css={`
            display: grid;
            grid-template-columns: 1fr minmax(250px, auto);
            grid-gap: ${5 * GU}px;
            margin-bottom: ${2 * GU}px;
          `}
        >
          <div>
            <h2
              css={`
                ${textStyle('label2')};
                color: ${theme.surfaceContentSecondary};
                margin-bottom: ${2 * GU}px;
              `}
            >
              Description
            </h2>
            <Text
              css={`
                ${textStyle('body2')};
              `}
            >
              {description}
            </Text>
          </div>
          <div>
            <h2
              css={`
                ${textStyle('label2')};
                color: ${theme.surfaceContentSecondary};
                margin-bottom: ${2 * GU}px;
              `}
            >
              Organization
            </h2>
            <div
              css={`
                display: flex;
                align-items: flex-start;
              `}
            >
              <IdentityBadge
                // connectedAccount={addressesEqual(creator, connectedAccount)}
                entity={creator}
              />
            </div>
          </div>
        </div>
        <div
          css={`
            display: grid;
            grid-template-columns: repeat(3, 1fr) minmax(250px, auto);
            margin-bottom: ${5 * GU}px;
          `}
        >
          <div>
            <span
              css={`
                ${textStyle('label2')}
                color: ${theme.contentSecondary};
                font-weight: 200;
                display: block;
                margin-bottom: ${1.5 * GU}px;
              `}
            >
              Rewards
            </span>
            <Text
              css={`
                display: inline-block;
                ${textStyle('body2')};
              `}
            >
              {`${rewardAmount} DAI`}
            </Text>
          </div>
          <div>
            <span
              css={`
                ${textStyle('label2')}
                color: ${theme.contentSecondary};
                font-weight: 200;
                display: block;
                margin-bottom: ${1.5 * GU}px;
              `}
            >
              Collateral Staked
            </span>
            <Text
              css={`
                display: inline-block;
                ${textStyle('body2')};
              `}
            >
              {`${stakedAmount} ANJ`}
            </Text>
          </div>
          <div>
            <span
              css={`
                ${textStyle('label2')}
                color: ${theme.contentSecondary};
                font-weight: 200;
                display: block;
                margin-bottom: ${1.5 * GU}px;
              `}
            >
              Term Number
            </span>
            <Text
              css={`
                display: inline-block;
                ${textStyle('body2')};
              `}
            >
              {term}
            </Text>
          </div>
          <div>
            <span
              css={`
                ${textStyle('label2')}
                color: ${theme.contentSecondary};
                font-weight: 200;
                display: block;
                margin-bottom: ${1.5 * GU}px;
              `}
            >
              Created by
            </span>
            <IdentityBadge
              // connectedAccount={addressesEqual(creator, connectedAccount)}
              entity={creator}
            />
          </div>
        </div>
        <Button
          mode="strong"
          onClick={() => {}}
          wide
          css={`
            background: ${theme.surfaceContentSecondary};
          `}
        >
          Vote
        </Button>
      </section>
    </Box>
  )
}

export default DisputeInfo
