import React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  GU,
  Link,
  TransactionBadge,
  isAddress,
  textStyle,
  useTheme,
} from '@aragon/ui'
import styled from 'styled-components'
import DisputeActions from './DisputeActions'
import DisputeCurrentRuling from './DisputeCurrentRuling'
import DisputeOutcomeText from './DisputeOutcomeText'
import DisputeRoundPill from './DisputeRoundPill'
import DisputeStatus from './DisputeStatus'
import DisputeVoided from './DisputeVoided'
import ErrorLoading from '../Errors/ErrorLoading'
import Loading from './Loading'
import LocalIdentityBadge from '../LocalIdentityBadge/LocalIdentityBadge'
import { useWallet } from '../../providers/Wallet'
import { Phase as DisputePhase, Status } from '../../types/dispute-status-types'
import { addressesEqual, getNetworkType } from '../../lib/web3-utils'

import iconCourt from '../../assets/courtIcon.svg'

const DisputeInfo = React.memo(function({
  id,
  error,
  dispute,
  loading,
  onDraft,
  onLeak,
  onExecuteRuling,
  onRequestAppeal,
  onRequestCommit,
  onRequestReveal,
}) {
  const {
    agreementText,
    agreementUrl,
    defendant,
    description,
    phase,
    plaintiff,
    status,
  } = dispute || {}

  const creator = plaintiff || dispute?.subject?.id

  const isFinalRulingEnsured =
    phase === DisputePhase.ExecuteRuling || status === Status.Closed

  const lastRound = dispute?.rounds?.[dispute.lastRoundId]
  const appealedRuling = lastRound?.appeal?.appealedRuling
  const voteWinningOutcome = lastRound?.vote?.winningOutcome

  const isDisputeVoided = dispute?.status === Status.Voided

  return (
    <Box padding={5 * GU}>
      <section
        css={`
          display: grid;
          grid-template-columns: auto;
          grid-gap: ${2.5 * GU}px;
          align-items: center;
        `}
      >
        <DisputeHeader id={id} dispute={dispute} error={error} />
        {(() => {
          if (error) {
            return (
              <ErrorLoading subject="dispute" errors={[error]} border={false} />
            )
          }

          if (loading) {
            return <Loading border={false} />
          }

          if (isDisputeVoided) {
            return (
              <DisputeVoided
                id={id}
                description={dispute.voidedDescription}
                link={dispute.voidedLink}
              />
            )
          }
          return (
            <>
              <Row>
                {(() => {
                  if (isFinalRulingEnsured) {
                    return (
                      <>
                        <Field
                          label="Final jury outcome"
                          value={
                            <DisputeOutcomeText
                              outcome={appealedRuling || voteWinningOutcome}
                              phase={
                                appealedRuling
                                  ? DisputePhase.AppealRuling
                                  : DisputePhase.RevealVote
                              }
                            />
                          }
                        />
                        <Field
                          label="Round number"
                          value={
                            <DisputeRoundPill roundId={dispute.lastRoundId} />
                          }
                        />
                      </>
                    )
                  }
                  return (
                    <>
                      <Field label="Description" value={description} />
                      <div />
                    </>
                  )
                })()}
                {creator && <Field label="Plaintiff" value={creator} />}
              </Row>
              <Row>
                {(() => {
                  if (isFinalRulingEnsured) {
                    return <Field label="Description" value={description} />
                  }
                  return agreementText ? (
                    <Field
                      label="Link to agreement"
                      value={
                        <Link external href={agreementUrl}>
                          {agreementText}
                        </Link>
                      }
                    />
                  ) : (
                    <div />
                  )
                })()}
                <div />
                {defendant && <Field label="Defendant" value={defendant} />}
              </Row>
            </>
          )
        })()}
        {!isDisputeVoided && !error && (
          <>
            {(phase === DisputePhase.AppealRuling ||
              phase === DisputePhase.ConfirmAppeal ||
              isFinalRulingEnsured) &&
              !loading && <DisputeCurrentRuling dispute={dispute} />}
            {!loading && (
              <DisputeActions
                dispute={dispute}
                onDraft={onDraft}
                onRequestCommit={onRequestCommit}
                onRequestReveal={onRequestReveal}
                onLeak={onLeak}
                onRequestAppeal={onRequestAppeal}
                onExecuteRuling={onExecuteRuling}
              />
            )}
          </>
        )}
      </section>
    </Box>
  )
})

function DisputeHeader({ id, dispute, error }) {
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
              ${theme.accentStart} -50%,
              ${theme.accentEnd} 91%
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
            {!error && dispute && (
              <DisputeStatus
                dispute={dispute}
                css={`
                  margin: 0 0 0 ${1 * GU}px;
                `}
              />
            )}
          </h1>
          {Boolean(dispute?.status !== Status.Voided && transaction) && (
            <TransactionBadge
              transaction={transaction}
              networkType={getNetworkType()}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, value }) {
  const theme = useTheme()
  const wallet = useWallet()

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
      {isAddress(value) ? (
        <div
          css={`
            display: flex;
            align-items: flex-start;
          `}
        >
          <LocalIdentityBadge
            connectedAccount={addressesEqual(value, wallet.account)}
            entity={value}
          />
        </div>
      ) : (
        <div
          css={`
            ${textStyle('body2')};
          `}
        >
          {value}
        </div>
      )}
    </div>
  )
}

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: ${5 * GU}px;
  margin-bottom: ${2 * GU}px;
`

DisputeInfo.propTypes = {
  dispute: PropTypes.object, // TODO: define DisputeType
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool,
}

export default DisputeInfo
