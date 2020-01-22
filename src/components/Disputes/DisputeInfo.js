import React from 'react'
import {
  Box,
  GU,
  IdentityBadge,
  Text,
  textStyle,
  TransactionBadge,
  useTheme,
} from '@aragon/ui'
import IconCourt from '../../assets/courtIcon.svg'
import DisputeStatus from './DisputeStatus'
import DisputeActions from './DisputeActions'

const DisputeInfo = ({
  dispute,
  onDraft,
  onRequestCommit,
  onReveal,
  onLeak,
}) => {
  const theme = useTheme()
  const { id, metadata, subject, txHash } = dispute

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
                background: linear-gradient(
                  232.86deg,
                  ${theme.accentEnd} -50.51%,
                  ${theme.accentStart} 91.55%
                );
                border-radius: 50%;
                padding: 12px;
                display: inline-block;
              `}
            >
              <img src={IconCourt} />
            </div>
            <div
              css={`
                display: flex;
                align-items: center;
              `}
            >
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
                <TransactionBadge transaction={txHash} />
              </div>
            </div>
          </div>
          <div
            css={`
              margin-left: ${GU}px;
            `}
          >
            <div
              css={`
                margin-top: 6px;
              `}
            />
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
              {metadata}
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
              Created by
            </h2>
            <div
              css={`
                display: flex;
                align-items: flex-start;
              `}
            >
              <IdentityBadge
                // connectedAccount={addressesEqual(creator, connectedAccount)} TODO- add connected account
                entity={subject.id}
              />
            </div>
          </div>
        </div>
        <DisputeActions
          dispute={dispute}
          onDraft={onDraft}
          onRequestCommit={onRequestCommit}
          onReveal={onReveal}
          onLeav={onLeak}
        />
      </section>
    </Box>
  )
}

export default DisputeInfo
