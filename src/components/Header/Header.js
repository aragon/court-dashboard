import React from 'react'
import { ButtonIcon, GU, IconMenu } from '@aragon/ui'
import AccountModule from '../Account/AccountModule'
import ClockModule from '../ClockModule'
import ActivityButton from '../Activity/ActivityButton'
import HeaderLogo from './HeaderLogo'

const Header = React.memo(function Header({ compactMode, toggleMenuPanel }) {
  return (
    <header
      css={`
        position: relative;
        z-index: 3;
        height: ${8 * GU}px;
        background: #fff;
        box-shadow: rgba(0, 0, 0, 0.05) 0 2px 3px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0;
      `}
    >
      {compactMode ? (
        <ButtonIcon label="Open menu" onClick={toggleMenuPanel}>
          <IconMenu />
        </ButtonIcon>
      ) : (
        <HeaderLogo />
      )}

      <div
        css={`
          flex-grow: 0;
          display: flex;
          height: 100%;
        `}
      >
        {!compactMode && <ClockModule />}
        <div
          css={`
            display: flex;
            height: 100%;
            margin-left: ${1 * GU}px;
          `}
        >
          <AccountModule />
        </div>

        <div
          css={`
            display: flex;
            height: 100%;
            margin-left: ${2 * GU}px;
          `}
        >
          <ActivityButton />
        </div>
      </div>
    </header>
  )
})

export default Header
