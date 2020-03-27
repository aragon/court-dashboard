import React from 'react'
import { GU, textStyle } from '@aragon/ui'
import headerLogoSvg from '../../assets/HeaderLogo.svg'

function HeaderLogo() {
  return (
    <div
      css={`
        display: flex;
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
          align-items: center;
          ${textStyle('body1')};
        `}
      >
        Aragon Court
      </h1>
    </div>
  )
}

export default HeaderLogo
