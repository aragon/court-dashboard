import React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  GU,
  IdentityBadge,
  textStyle,
  TransactionBadge,
  useTheme,
  isAddress,
} from '@aragon/ui'
import styled from 'styled-components'

import DisputeStatus from './DisputeStatus'
import DisputeCurrentRuling from './DisputeCurrentRuling'
import DisputeActions from './DisputeActions'
import Loading from './Loading'
import { useConnectedAccount } from '../../providers/Web3'

import {
  Phase as DisputePhase,
  Status as DipsuteStatus,
} from '../../types/dispute-status-types'
import iconCourt from '../../assets/courtIcon.svg'
import { addressesEqual } from '../../lib/web3-utils'
import DisputeRoundPill from './DisputeRoundPill'
import DisputeOutcomeText from './DisputeOutcomeText'

const DisputeInfo = React.memo(function({
  id,
  dispute,
  loading,
  onDraft,
  onRequestCommit,
  onRequestReveal,
  onLeak,
  onRequestAppeal,
  onExecuteRuling,
}) {
  const { phase, status } = dispute || {}

  const description = dispute && dispute.metadata
  const creatorAddress = dispute && dispute.subject && dispute.subject.id

  const isFinalRulingEnsured =
    phase === DisputePhase.ExecuteRuling || status === DipsuteStatus.Closed

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
        <DisputeHeader id={id} dispute={dispute} />
        {loading ? (
          <Loading border={false} />
        ) : (
          <>
            {isFinalRulingEnsured && (
              <Row>
                <Field
                  label="Final jury outcome"
                  value={
                    <DisputeOutcomeText
                      outcome={
                        dispute.rounds[dispute.lastRoundId].vote.winningOutcome
                      }
                      phase={dispute.phase}
                      disputeEnded={isFinalRulingEnsured}
                    />
                  }
                />
                <Field
                  label="Round number"
                  value={<DisputeRoundPill roundId={dispute.lastRoundId} />}
                  isNode
                />
              </Row>
            )}
            <Row>
              <Field label="Description" value={description} />
              {creatorAddress && (
                <Field label="Plaintiff" value={creatorAddress} />
              )}
            </Row>
          </>
        )}

        {(phase === DisputePhase.AppealRuling ||
          phase === DisputePhase.ConfirmAppeal ||
          isFinalRulingEnsured) && <DisputeCurrentRuling dispute={dispute} />}
        {!loading && (
          <DisputeActions
            dispute={dispute}
            onDraft={onDraft}
            onRequestCommit={onRequestCommit}
            onRequestReveal={onRequestReveal}
            onLeavk={onLeak}
            onRequestAppeal={onRequestAppeal}
            onExecuteRuling={onExecuteRuling}
          />
        )}
      </section>
    </Box>
  )
})

function DisputeHeader({ id, dispute }) {
  const theme = useTheme()
  const transaction = dispute && dispute.txHash

  return (
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
            padding: ${1.5 * GU}px;
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
  )
}

function Field({ label, value, isNode }) {
  const theme = useTheme()
  const connectedAccount = useConnectedAccount()

  return (
    <div>
      <h2
        css={`
          ${textStyle('label2')};
          color: ${theme.surfaceContentSecondary};
          margin-bottom: ${1 * GU}px;
        `}
      >
        {label}
      </h2>

      {(() => {
        if (isAddress(value))
          return (
            <div
              css={`
                display: flex;
                align-items: flex-start;
              `}
            >
              <IdentityBadge
                connectedAccount={addressesEqual(value, connectedAccount)}
                entity={value}
              />
            </div>
          )

        if (isNode) return <>{value}</>

        return (
          <span
            css={`
              ${textStyle('body2')};
            `}
          >
            {value}
          </span>
        )
      })()}
    </div>
  )
}

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(250px, auto);
  grid-gap: ${5 * GU}px;
  margin-bottom: ${2 * GU}px;
`

DisputeInfo.propTypes = {
  dispute: PropTypes.object, // TODO: define DisputeType
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool,
}

export default DisputeInfo
