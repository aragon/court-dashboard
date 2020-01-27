import React, { useCallback, useRef, useState } from 'react'
import {
  Button,
  GU,
  IconCopy,
  IconDownload,
  Info,
  Switch,
  TextInput,
  textStyle,
  Timer,
  useToast,
} from '@aragon/ui'
import IconKeyCode from '../../../assets/IconKeyCode.svg'

const CommitPanel = React.memo(function CommitPanel({
  dispute,
  onCommit,
  commitment,
  keyCode,
  onDownloadKeyCode,
}) {
  const [codeSaved, setCodeSaved] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)
  const [revealService, setRevealService] = useState(true)
  const toast = useToast()

  const handleCommit = async event => {
    try {
      event.preventDefault()

      const lastRoundId = dispute.lastRoundId
      const tx = await onCommit(dispute.id, lastRoundId, commitment, keyCode) // TODO: Add password
      await tx.wait()
    } catch (err) {
      console.log('Error submitting tx: ', err)
    }
  }

  const handleDownloadKeyCode = useCallback(() => {
    onDownloadKeyCode()
    setCodeSaved(true)
  }, [onDownloadKeyCode])

  const handleCopyKeyCode = useCallback(() => {
    setCodeCopied(true)
    toast('One Time Password copied to clipboard')
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
      <CodeSection
        keyCode={keyCode}
        onDownloadKeyCode={handleDownloadKeyCode}
        onCopyKeyCode={handleCopyKeyCode}
      />
      <RevealService
        onRevealServiceChange={handleRevealService}
        revealService={revealService}
      />
      <InfoSection
        codeCopied={codeCopied}
        codeSaved={codeSaved}
        commitEndTime={dispute.nextTransition}
      />
      <Button
        css={`
          margin-top: ${2 * GU}px;
        `}
        disabled={!codeSaved && !codeCopied}
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

const CodeSection = React.memo(function CodeSection({
  keyCode,
  onDownloadKeyCode,
  onCopyKeyCode,
}) {
  const codeTextAreaRef = useRef(null)

  const handleCopyKeyCode = useCallback(() => {
    if (codeTextAreaRef.current) {
      codeTextAreaRef.current.select()

      try {
        document.execCommand('copy')
        onCopyKeyCode()
      } catch (err) {
        console.error('error copying the code')
      }
    }
  }, [onCopyKeyCode])

  return (
    <React.Fragment>
      <div
        css={`
          display: flex;
        `}
      >
        <img
          css={`
            height: 50px;
          `}
          src={IconKeyCode}
        />
        <div
          css={`
            margin-left: ${2 * GU}px;
          `}
        >
          <span
            css={`
              display: block;
              ${textStyle('body2')};
              font-weight: 600;
            `}
          >
            One-Time-Use Code
          </span>
          <span
            css={`
              display: block;
              ${textStyle('body2')};
              margin-top: ${1 * GU}px;
            `}
          >
            Please save the temporary password displayed below for maximum
            security.
          </span>
        </div>
      </div>
      <div
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        <TextInput
          ref={codeTextAreaRef}
          value={keyCode}
          css={`
            height: 88px;
          `}
          multiline
          wide
          readOnly
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
          onClick={onDownloadKeyCode}
          icon={<IconDownload />}
          label="Download"
        />
        <Button
          css={`
            flex-grow: 1;
          `}
          onClick={handleCopyKeyCode}
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
          Enable Court auto-reveal service.
        </span>
      </div>
      <div
        css={`
          margin-top: ${1 * GU}px;
        `}
      >
        <span
          css={`
            ${textStyle('body2')};
          `}
        >
          By enabling this feature you trust Aragon One to revel your vote on
          your behalf in this and following disputes. You can always turn off
          this service later if you choose. Learn more
        </span>
      </div>
    </React.Fragment>
  )
})

const InfoSection = React.memo(function InfoSection({
  codeCopied,
  codeSaved,
  commitEndTime,
}) {
  const copiedOrSaved = codeCopied || codeSaved
  const content = copiedOrSaved
    ? 'This temporary code will be valid to commit and reveal your vote for this dispute only. You won’t be required to enter this code unless a problem occur with our services.'
    : `You must copy or download this code before you can commit your vote. You’ll be asked to enter it in order to reveal your vote in: ${commitEndTime}`

  return (
    <Info
      css={`
        margin-top: ${3 * GU}px;
      `}
      title={!copiedOrSaved && 'ACTION REQUIREMENT'}
      mode={copiedOrSaved ? 'info' : 'warning'}
    >
      {content}
      {!copiedOrSaved && (
        <div
          css={`
            margin-top: ${1 * GU}px;
          `}
        >
          <Timer end={commitEndTime} />
        </div>
      )}
    </Info>
  )
})
export default CommitPanel
