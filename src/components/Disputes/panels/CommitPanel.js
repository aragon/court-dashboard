import React from 'react'
import {
  Button,
  GU,
  IconCopy,
  IconDownload,
  Switch,
  TextInput,
  textStyle,
} from '@aragon/ui'
import IconKeyCode from '../../../assets/IconKeyCode.svg'

function CommitPanel({ dispute, onCommit, commitment }) {
  const handleCommit = async event => {
    try {
      event.preventDefault()

      const lastRoundId = dispute.lastRoundId
      const tx = await onCommit(dispute.id, lastRoundId, commitment) // TODO: Add password
      await tx.wait()
    } catch (err) {
      console.log('Error submitting tx: ', err)
    }
  }

  return (
    <form onSubmit={handleCommit}>
      <CodeSection />
      <RevealService onEnableRevealChange={() => {}} />
      <Button type="submit" mode="strong" wide>
        Commit your vote
      </Button>
    </form>
  )
}

function CodeSection() {
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
          css={`
            height: 88px;
          `}
          multiline
          wide
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
          onClick={() => {}}
          icon={<IconDownload />}
          label="Download"
        />
        <Button
          css={`
            margin-top: ${1 * GU}px;
            flex-grow: 1;
          `}
          onClick={() => {}}
          icon={<IconCopy />}
          label="Copy"
        />
      </div>
    </React.Fragment>
  )
}

function RevealService({ onEnableRevealChange }) {
  return (
    <React.Fragment>
      <div
        css={`
          display: flex;
          margin-top: ${4 * GU}px;
          align-items: center;
        `}
      >
        <Switch checked onChange={onEnableRevealChange} />
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
}

export default CommitPanel
