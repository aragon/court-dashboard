import React from 'react'
import PropTypes from 'prop-types'
import { Box, GU, TransactionBadge, textStyle, useTheme } from '@aragon/ui'
import DisputeActions from './DisputeActions'
import DisputeCurrentRuling from './DisputeCurrentRuling'
import DisputeInfoContent from './DisputeInfoContent'
import DisputeStatus from './DisputeStatus'
import DisputeVoided from './DisputeVoided'
import ErrorLoading from '../Errors/ErrorLoading'
import LoadingCard from '../LoadingCard'
import { Phase as DisputePhase, Status } from '../../types/dispute-status-types'
import { getNetworkType } from '../../lib/web3-utils'

import iconCourt from '../../assets/courtIcon.svg'

const DisputeInfo = React.memo(function({
  id,
  error,
  dispute,
  loading,
  onDraft,
  onLeak,
  onAutoReveal,
  onExecuteRuling,
  onRequestAppeal,
  onRequestCommit,
  onRequestReveal,
}) {
  const { phase, status } = dispute || {}

  const isDisputeVoided = status === Status.Voided
  const isFinalRulingEnsured =
    phase === DisputePhase.ExecuteRuling || status === Status.Closed

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
        <DisputeHeader dispute={dispute} error={error?.message} />
        {(() => {
          if (error) {
            return (
              <ErrorLoading
                subject="dispute"
                errors={[error.message]}
                border={false}
              />
            )
          }

          if (loading) {
            return <LoadingCard border={false} />
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
            <DisputeInfoContent
              dispute={dispute}
              isFinalRulingEnsured={isFinalRulingEnsured}
            />
          )
        })()}
        {!loading && !isDisputeVoided && !error?.fromGraph && (
          <>
            {(phase === DisputePhase.AppealRuling ||
              phase === DisputePhase.ConfirmAppeal ||
              isFinalRulingEnsured) && (
              <DisputeCurrentRuling dispute={dispute} />
            )}
            <DisputeActions
              dispute={dispute}
              onAutoReveal={onAutoReveal}
              onDraft={onDraft}
              onRequestCommit={onRequestCommit}
              onRequestReveal={onRequestReveal}
              onLeak={onLeak}
              onRequestAppeal={onRequestAppeal}
              onExecuteRuling={onExecuteRuling}
            />
          </>
        )}
      </section>
    </Box>
  )
})

function DisputeHeader({ dispute, error }) {
  const theme = useTheme()
  const { id, description, txHash } = dispute || {}

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
          width: 100%;
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
            width: 100%;
          `}
        >
          <h1
            css={`
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: ${1 * GU}px;
              ${textStyle('title3')};
              width: 100%;
            `}
          >
            <span>
              Dispute #{id}: {description}
            </span>
            {!error && dispute && (
              <DisputeStatus
                dispute={dispute}
                css={`
                  margin: 0 0 0 ${1 * GU}px;
                `}
              />
            )}
          </h1>
          {Boolean(dispute?.status !== Status.Voided && txHash) && (
            <TransactionBadge
              transaction={txHash}
              networkType={getNetworkType()}
            />
          )}
        </div>
      </div>
    </div>
  )
}

DisputeInfo.propTypes = {
  dispute: PropTypes.object, // TODO: define DisputeType
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool,
}

export default DisputeInfo
