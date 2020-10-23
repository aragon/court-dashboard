import React from 'react'
import { GU } from '@aragon/ui'
import headerLogoSvg from '../../assets/headerLogo.svg'

function HeaderLogo() {
  return (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      <img alt="" src={headerLogoSvg} width={17.5 * GU} />
    </div>
  )
}

export default HeaderLogo
