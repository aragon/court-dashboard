import React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  GU,
  IdentityBadge,
  textStyle,
  TransactionBadge,
  useTheme,
} from '@aragon/ui'
import DisputeStatus from './DisputeStatus'
import DisputeCurrentRuling from './DisputeCurrentRuling'
import DisputeActions from './DisputeActions'

import { Phase as DisputePhase } from '../../types/dispute-status-types'
import iconCourt from '../../assets/courtIcon.svg'

function DisputeInfo({
  id,
  dispute,
  loading,
  onDraft,
  onRequestCommit,
  onReveal,
  onLeak,
  onRequestAppeal,
  onExecuteRuling,
}) {
  const theme = useTheme()
  const { phase } = dispute || {}

  const description = loading ? 'Loading…' : dispute.metadata
  const creatorAddress = dispute && dispute.subject && dispute.subject.id
  const transaction = dispute && dispute.txHash

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
                  233deg,
                  ${theme.accentEnd} -50%,
                  ${theme.accentStart} 91%
                );
                border-radius: 50%;
                padding: 12px;
                display: inline-block;
              `}
            >
              <img src={iconCourt} alt="" width="39" height="32" />
            </div>
            <div
              css={`
                margin-left: ${3 * GU}px;
              `}
            >
              <h1
                css={`
                  display: flex;
                  align-items: center;
                  margin-bottom: ${1 * GU}px;
                  ${textStyle('title3')};
                `}
              >
                <span>Dispute #{id}</span>
                {dispute && (
                  <DisputeStatus
                    dispute={dispute}
                    css={`
                      margin: 0 0 0 ${1 * GU}px;
                    `}
                  />
                )}
              </h1>
              {transaction && <TransactionBadge transaction={transaction} />}
            </div>
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
            <span
              css={`
                ${textStyle('body2')};
              `}
            >
              {description}
            </span>
          </div>
          {creatorAddress && (
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
                  entity={creatorAddress}
                />
              </div>
            </div>
          )}
        </div>

        {(phase === DisputePhase.AppealRuling ||
          phase === DisputePhase.ConfirmAppeal ||
          phase === DisputePhase.ExecuteRuling) && (
          <DisputeCurrentRuling dispute={dispute} />
        )}
        {!loading && (
          <DisputeActions
            dispute={dispute}
            onDraft={onDraft}
            onRequestCommit={onRequestCommit}
            onReveal={onReveal}
            onLeavk={onLeak}
            onRequestAppeal={onRequestAppeal}
            onExecuteRuling={onExecuteRuling}
          />
        )}
      </section>
    </Box>
  )
}

DisputeInfo.propTypes = {
  dispute: PropTypes.object, // TODO: define DisputeType
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool,
}

export default DisputeInfo
