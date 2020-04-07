import React from 'react'
import PropTypes from 'prop-types'
import resolvePathname from 'resolve-pathname'
import {
  Box,
  GU,
  Link,
  TransactionBadge,
  textStyle,
  useTheme,
  useViewport,
} from '@aragon/ui'
import styled from 'styled-components'
import DisputeActions from './DisputeActions'
import DisputeCurrentRuling from './DisputeCurrentRuling'
import DisputeOutcomeText from './DisputeOutcomeText'
import DisputeStatus from './DisputeStatus'
import DisputeVoided from './DisputeVoided'
import ErrorLoading from '../Errors/ErrorLoading'
import Loading from './Loading'
import LocalIdentityBadge from '../LocalIdentityBadge/LocalIdentityBadge'
import { useWallet } from '../../providers/Wallet'
import { Phase as DisputePhase, Status } from '../../types/dispute-status-types'
import {
  addressesEqual,
  getNetworkType,
  transformAddresses,
} from '../../lib/web3-utils'
import { transformIPFSHash } from '../../lib/ipfs-utils'
import { IPFS_ENDPOINT } from '../../endpoints'

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
  const { below } = useViewport()
  const compactMode = below('medium')

  const {
    agreementText,
    agreementUrl,
    defendant,
    disputedActionText,
    disputedActionRadspec,
    organization,
    phase,
    plaintiff,
    status,
  } = dispute || {}

  const creator = plaintiff || dispute?.subject?.id

  const isFinalRulingEnsured =
    phase === DisputePhase.ExecuteRuling || status === Status.Closed
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
              <Row compactMode={compactMode}>
                {disputedActionText ? (
                  <Field
                    label="Disputed Action"
                    value={
                      <DisputeActionText
                        dispute={dispute}
                        isFinalRulingEnsured={isFinalRulingEnsured}
                      />
                    }
                  />
                ) : (
                  <div />
                )}
                {organization && (
                  <Field label="Organization" value={organization} />
                )}
              </Row>
              <Row compactMode={compactMode}>
                {disputedActionRadspec ? (
                  <Field label="Description" value={disputedActionRadspec} />
                ) : (
                  <div />
                )}
                {creator && <Field label="Plaintiff" value={creator} />}
              </Row>
              <Row compactMode={compactMode}>
                {agreementText ? (
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
                )}
                {defendant && <Field label="Defendant" value={defendant} />}
              </Row>
            </>
          )
        })()}
        {!isDisputeVoided && !error?.fromGraph && (
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

      {typeof value === 'string' ? (
        value.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {transformAddresses(line, (part, isAddress, index) =>
              isAddress ? (
                <span title={part} key={index}>
                  <LocalIdentityBadge
                    connectedAccount={addressesEqual(part, wallet.account)}
                    entity={part}
                  />
                </span>
              ) : (
                <React.Fragment key={index}>
                  {transformIPFSHash(part, (word, isIpfsHash, i) => {
                    if (isIpfsHash) {
                      const ipfsUrl = resolvePathname(
                        word,
                        `${IPFS_ENDPOINT}/${word}`
                      )
                      return (
                        <Link href={ipfsUrl} key={i}>
                          {word}
                        </Link>
                      )
                    }

                    return <span key={i}>{word}</span>
                  })}
                </React.Fragment>
              )
            )}
            <br />
          </React.Fragment>
        ))
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

function DisputeActionText({ dispute, isFinalRulingEnsured }) {
  const { disputedActionText, disputedActionURL } = dispute
  const lastRound = dispute?.rounds?.[dispute.lastRoundId]
  const voteWinningOutcome = lastRound?.vote?.winningOutcome
  const appealedRuling = lastRound?.appeal?.appealedRuling

  if (!isFinalRulingEnsured) {
    return (
      <Link external href={disputedActionURL}>
        {disputedActionText}
      </Link>
    )
  }

  return (
    <DisputeOutcomeText
      action={disputedActionText}
      outcome={appealedRuling || voteWinningOutcome}
      phase={
        appealedRuling ? DisputePhase.AppealRuling : DisputePhase.RevealVote
      }
      verbose
    />
  )
}

const Row = styled.div`
  display: grid;

  ${({ compactMode }) => `
    grid-gap: ${(compactMode ? 2.5 : 5) * GU}px;
    margin-bottom: ${compactMode ? 0 : 2 * GU}px;
    grid-template-columns: ${
      compactMode ? 'auto' : `1fr minmax(${25 * GU}px, auto)`
    };
  `}
`

DisputeInfo.propTypes = {
  dispute: PropTypes.object, // TODO: define DisputeType
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool,
}

export default DisputeInfo
