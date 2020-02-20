import React from 'react'
import { GU, textStyle } from '@aragon/ui'
import Account from './Account/Account'
import Clock from './Clock'
import ActivityButton from './Activity/ActivityButton'

import headerLogoSvg from '../assets/HeaderLogo.svg'

const Header = React.memo(function Header() {
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
      <div
        css={`
          display: flex;
          height: 100%;
          align-items: center;
        `}
      >
        <img
          alt=""
          src={headerLogoSvg}
          width={4 * GU}
          css={`
            margin-right: ${1 * GU}px;
          `}
        />
        <h1
          css={`
            display: flex;
            height: 100%;
            padding-left: ${2 * GU}px;
            align-items: center;
            ${textStyle('body1')};
          `}
        >
          Aragon Court
        </h1>
      </div>

      <div
        css={`
          display: flex;
          flex-grow: 1;
          justify-content: center;
        `}
      >
        <Clock />
      </div>

      <div
        css={`
          flex-grow: 0;
          display: flex;
          height: 100%;
        `}
      >
        <Account />
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
