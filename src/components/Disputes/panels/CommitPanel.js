import React, { useCallback, useRef, useState } from 'react'
import {
  Button,
  GU,
  IconCopy,
  IconDownload,
  Info,
  Link,
  Switch,
  TextInput,
  textStyle,
  useToast,
  useTheme,
} from '@aragon/ui'
import useOneTimeCode from '../../../hooks/useOneTimeCode'
import { useWallet } from '../../../providers/Wallet'
import IconOneTimeCode from '../../../assets/IconOneTimeCode.svg'
import {
  getVoteId,
  saveAutoRevealPreference,
} from '../../../utils/crvoting-utils'

const CommitPanel = React.memo(function CommitPanel({
  dispute,
  onCommit,
  onDone,
  outcome,
}) {
  const [codeSaved, setCodeSaved] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)
  const [revealService, setRevealService] = useState(true)
  const { account: connectedAccount } = useWallet()
  const { oneTimeCode, download } = useOneTimeCode()
  const toast = useToast()

  const handleCommit = useCallback(
    event => {
      event.preventDefault()
      saveAutoRevealPreference(
        connectedAccount,
        getVoteId(dispute.id, dispute.lastRoundId),
        revealService
      )

      onDone()
      return onCommit(
        connectedAccount,
        dispute.id,
        dispute.lastRoundId,
        outcome,
        oneTimeCode,
        revealService
      )
    },
    [
      connectedAccount,
      dispute.id,
      dispute.lastRoundId,
      onCommit,
      onDone,
      oneTimeCode,
      outcome,
      revealService,
    ]
  )

  const handleDownloadCode = useCallback(() => {
    download()
    setCodeSaved(true)
  }, [download])

  const handleCopyCode = useCallback(() => {
    setCodeCopied(true)
    toast('One-time-use code copied')
  }, [toast])

  const handleRevealService = useCallback(
    checked => {
      setRevealService(checked)
      toast(
        checked
          ? 'Court auto-reveal service enabled'
          : 'Court auto-reveal service disabled'
      )
    },
    [toast]
  )

  return (
    <form onSubmit={handleCommit}>
      <OneTimeCode
        code={oneTimeCode}
        onDownload={handleDownloadCode}
        onCopy={handleCopyCode}
      />
      <RevealService
        onRevealServiceChange={handleRevealService}
        revealService={revealService}
      />
      <InfoSection
        commitEndTime={dispute.nextTransition}
        copiedOrSaved={codeCopied || codeSaved}
        revealService={revealService}
      />
      <Button
        css={`
          margin-top: ${2 * GU}px;
        `}
        disabled={!(codeSaved || codeCopied)}
        onClick={handleCommit}
        type="submit"
        mode="strong"
        wide
      >
        Commit your vote
      </Button>
    </form>
  )
})

const OneTimeCode = React.memo(function OneTimeCode({
  code,
  onDownload,
  onCopy,
}) {
  const theme = useTheme()
  const inputRef = useRef(null)

  const handleInputFocus = useCallback(event => event.target.select(), [])

  const handleCopy = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus()

      try {
        document.execCommand('copy')
        onCopy()
      } catch (err) {
        console.error('Error copying the one-time-use code')
      }
    }
  }, [onCopy])

  return (
    <React.Fragment>
      <div
        css={`
          display: flex;
        `}
      >
        <img height={6 * GU} src={IconOneTimeCode} alt="" />
        <div
          css={`
            margin-left: ${2 * GU}px;
          `}
        >
          <h2
            css={`
              display: block;
              ${textStyle('body2')};
              font-weight: 600;
            `}
          >
            One-time-use code
          </h2>
          <span
            css={`
              display: block;
              ${textStyle('body2')};
              margin-top: ${1 * GU}px;
            `}
          >
            Please save the code displayed below for maximum security.
          </span>
        </div>
      </div>
      <div
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        <TextInput
          ref={inputRef}
          onFocus={handleInputFocus}
          multiline
          readOnly
          value={code}
          wide
          css={`
            height: ${10 * GU}px;
            padding: ${1.5 * GU}px ${2 * GU}px;
            ${textStyle('body1')};
            font-weight: 600;
            resize: none;
            &:read-only {
              color: ${theme.accent};
            }
          `}
        />
      </div>
      <div
        css={`
          margin-top: ${2 * GU}px;
          display: flex;
        `}
      >
        <Button
          css={`
            margin-right: ${2 * GU}px;
            flex-grow: 1;
          `}
          onClick={onDownload}
          icon={<IconDownload />}
          label="Download"
        />
        <Button
          css={`
            flex-grow: 1;
          `}
          onClick={handleCopy}
          icon={<IconCopy />}
          label="Copy"
        />
      </div>
    </React.Fragment>
  )
})

const RevealService = React.memo(function RevealService({
  onRevealServiceChange,
  revealService,
}) {
  return (
    <React.Fragment>
      <div
        css={`
          display: flex;
          margin-top: ${4 * GU}px;
          align-items: center;
        `}
      >
        <Switch checked={revealService} onChange={onRevealServiceChange} />
        <span
          css={`
            margin-left: ${2 * GU}px;
            ${textStyle('body1')};
          `}
        >
          Auto-reveal service.
        </span>
      </div>
      <div
        css={`
          margin-top: ${1 * GU}px;
          ${textStyle('body2')};
        `}
      >
        By enabling this feature you trust Aragon One to reveal your vote on
        your behalf in this and following disputes. You can always turn off this
        service later if you choose.
        <Link href="https://help.aragon.org/article/43-dispute-lifecycle#onetime">
          Learn more
        </Link>
        .
      </div>
    </React.Fragment>
  )
})

const InfoSection = React.memo(function InfoSection({ revealService }) {
  const content = revealService
    ? `As a safety measure, you must copy or download this code before you can
       commit your vote. This code is valid for revealing your vote for this
       dispute only. You won’t be required to enter this code unless a problem
       occurs with our services.`
    : `You must copy or download this code before you can commit your vote. You
       will later be asked to provide this same code to reveal your vote.
       Failure to provide the correct code will result in a monetary penalty to
       your account.`

  return (
    <Info
      css={`
        margin-top: ${2 * GU}px;
      `}
      title={!revealService && 'Action requirement'}
      mode={revealService ? 'info' : 'warning'}
    >
      {content}
    </Info>
  )
})

export default CommitPanel
