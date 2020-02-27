import React, { useCallback, useRef, useState } from 'react'
import {
  Button,
  GU,
  IconCopy,
  IconDownload,
  Info,
  Switch,
  Tag,
  TextInput,
  textStyle,
  useToast,
  useTheme,
} from '@aragon/ui'
import useOneTimeCode from '../../../hooks/useOneTimeCode'
import { useWallet } from '../../../providers/Wallet'
import { saveCodeInLocalStorage } from '../../../utils/one-time-code-utils'

import IconOneTimeCode from '../../../assets/IconOneTimeCode.svg'

const AUTO_REVEAL_ENABLED = false // TODO: Remove when auto reveal service is running

const CommitPanel = React.memo(function CommitPanel({
  dispute,
  onCommit,
  commitment,
  onDone,
}) {
  const [codeSaved, setCodeSaved] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)
  const [revealService, setRevealService] = useState(false)
  const { account: connectedAccount } = useWallet()
  const { oneTimeCode, download } = useOneTimeCode()
  const toast = useToast()

  const handleCommit = useCallback(
    async event => {
      try {
        event.preventDefault()

        const tx = await onCommit(
          dispute.id,
          dispute.lastRoundId,
          commitment,
          oneTimeCode
        )
        await tx.wait()
        saveCodeInLocalStorage(connectedAccount, dispute.id, oneTimeCode)
        onDone()
      } catch (err) {
        console.log('Error submitting transaction: ', err)
      }
    },
    [
      commitment,
      connectedAccount,
      dispute.id,
      dispute.lastRoundId,
      onCommit,
      onDone,
      oneTimeCode,
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
        disabled={!(revealService || codeSaved || codeCopied)}
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
        <Switch
          checked={revealService}
          onChange={onRevealServiceChange}
          disabled={!AUTO_REVEAL_ENABLED}
        />
        <span
          css={`
            margin-left: ${2 * GU}px;
            ${textStyle('body1')};
          `}
        >
          Auto-reveal service.
        </span>
        {!AUTO_REVEAL_ENABLED && (
          <Tag
            css={`
              margin-left: ${1 * GU}px;
            `}
            mode="new"
          >
            Coming soon
          </Tag>
        )}
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
        {/* TODO: Add ref:  <Link>Learn more</Link>. */}
      </div>
    </React.Fragment>
  )
})

const InfoSection = React.memo(function InfoSection({
  commitEndTime,
  copiedOrSaved,
  revealService,
}) {
  const content = revealService
    ? 'This temporary code will be valid to commit and reveal your vote for this dispute only. You won’t be required to enter this code unless a problem occur with our services.'
    : 'You must copy or download this code before you can commit your vote. You will be asked to confirm it in order to reveal your vote. Failure to do so will result in a monetary penalty to your account.'

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
