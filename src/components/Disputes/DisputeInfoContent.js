import React, { useEffect, useState } from 'react'
import resolvePathname from 'resolve-pathname'
import { GU, Link, textStyle, useTheme, useViewport } from '@aragon/ui'
import styled from 'styled-components'
import DisputeDetailDescription from './DisputeDetailDescription'
import DisputeOutcomeText from './DisputeOutcomeText'
import IdentityBadge from '../IdentityBadge'
import Loading from '../Loading'
import { useWallet } from '../../providers/Wallet'

import { IPFS_ENDPOINT } from '../../endpoints'
import { transformIPFSHash } from '../../lib/ipfs-utils'
import { describeDisputedAction } from '../../disputables'
import { Phase as DisputePhase } from '../../types/dispute-status-types'
import { addressesEqual, transformAddresses } from '../../lib/web3-utils'

function DisputeInfoContent({ dispute, isFinalRulingEnsured }) {
  const { below } = useViewport()
  const compactMode = below('medium')

  const {
    agreementText,
    agreementUrl,
    defendant,
    organization,
    plaintiff,
    subject,
  } = dispute

  const creator = plaintiff || subject?.id

  const [
    {
      disputedActionRadspec,
      disputedActionText,
      disputedActionURL,
      executionPath,
    },
    loading,
  ] = useDisputedAction(dispute)

  return (
    <>
      <Row compactMode={compactMode}>
        <Field
          label="Disputed Action"
          loading={loading}
          value={
            <DisputeActionText
              dispute={dispute}
              disputedActionText={disputedActionText}
              disputedActionURL={disputedActionURL}
              isFinalRulingEnsured={isFinalRulingEnsured}
            />
          }
        />
        {organization && <Field label="Organization" value={organization} />}
      </Row>
      <Row compactMode={compactMode}>
        <Field
          label="Description"
          loading={loading}
          value={
            Array.isArray(executionPath) ? (
              <DisputeDetailDescription path={executionPath} />
            ) : (
              disputedActionRadspec
            )
          }
          css={`
            word-break: break-word;
            overflow-wrap: anywhere;
          `}
        />
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
}

function Field({ label, loading, value, ...props }) {
  const theme = useTheme()
  const wallet = useWallet()

  if (!loading && !value) {
    return <div />
  }

  return (
    <div {...props}>
      <h2
        css={`
          ${textStyle('label2')};
          color: ${theme.surfaceContentSecondary};
          margin-bottom: ${1 * GU}px;
        `}
      >
        {label}
      </h2>
      {loading ? (
        <Loading size="small" center={false} />
      ) : (
        <>
          {typeof value === 'string' ? (
            value.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {transformAddresses(line, (part, isAddress, index) =>
                  isAddress ? (
                    <span title={part} key={index}>
                      <IdentityBadge
                        connectedAccount={addressesEqual(part, wallet.account)}
                        compact
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
        </>
      )}
    </div>
  )
}

function DisputeActionText({
  dispute,
  disputedActionText,
  disputedActionURL,
  isFinalRulingEnsured,
}) {
  const { lastRoundId, rounds } = dispute
  const lastRound = rounds?.[lastRoundId]
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

function useDisputedAction({
  id,
  disputable,
  disputedActionRadspec,
  disputedActionText,
  disputedActionURL,
}) {
  const [disputedAction, setDisputedAction] = useState({
    disputedActionRadspec,
    disputedActionText,
    disputedActionURL,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // If the dispute was not created through an agreement, the disputed action
    // descriptions should be already available (initialized above)
    if (!disputable) {
      return
    }

    let cancelled = false
    setLoading(true)

    const describeDispute = async () => {
      // Get disputable long and short description
      // as well as the URL where the disputed action is taking place
      const disputedActionDescription = await describeDisputedAction(
        id,
        disputable.organization,
        disputable.address,
        disputable.disputableActionId
      )

      if (!cancelled) {
        setLoading(false)
        setDisputedAction(disputedActionDescription)
      }
    }

    describeDispute()

    return () => {
      cancelled = true
    }
  }, [disputable, id])

  return [disputedAction, loading]
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

export default DisputeInfoContent
