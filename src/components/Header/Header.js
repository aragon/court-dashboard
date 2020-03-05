import React from 'react'
import { ButtonIcon, GU, IconMenu } from '@aragon/ui'
import Account from '../Account/Account'
import ClockModule from '../ClockModule'
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
        padding: 0 ${2 * GU}px;
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
          display: flex;
          align-self: stretch;

          & > * {
            align-self: stretch;
          }
        `}
      >
        {!compactMode && <ClockModule />}
        <Account />
      </div>
    </header>
  )
})

export default Header
