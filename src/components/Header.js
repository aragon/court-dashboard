import React from 'react'
import { Button, useTheme } from '@aragon/ui'
import { useWeb3Connect } from '../providers/Web3'
import Clock from './Clock'

function Header() {
  const { account, activate } = useWeb3Connect()

  const theme = useTheme()

  return (
    <div
      css={`
        box-shadow: rgba(0, 0, 0, 0.05) 0px 2px 3px;
        background: rgb(255, 255, 255);
        position: relative;
        z-index: 3;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <div
          css={`
            padding: 20px;
          `}
        >
          <span>Court Demo</span>
        </div>

        <Clock />
        <div
          css={`
            margin-right: 12px;
          `}
        >
          {account ? (
            <span
              css={`
                background-color: ${theme.background};
                color: ${theme.content};
                padding: 3px 10px;
                border-radius: 5px;
              `}
            >
              {account}
            </span>
          ) : (
            <Button
              label="Enable account"
              onClick={() => activate('injected')}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
