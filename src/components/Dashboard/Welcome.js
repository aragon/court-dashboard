import React from 'react'
import { Button, GU, textStyle, useTheme } from '@aragon/ui'

import Logo from '../../assets/Welcome.svg'

function Welcome() {
  const theme = useTheme()

  return (
    <div
      css={`
        background: linear-gradient(200deg, #fffaf1 -3%, #ffebeb 216%);
        margin-bottom: ${2 * GU}px;
        border-radius: ${0.5 * GU}px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
      `}
    >
      <img src={Logo} alt="" height={35 * GU} width={60 * GU} />
      <div
        css={`
          padding: ${4 * GU}px;
          width: 550px;
        `}
      >
        <h1
          css={`
            ${textStyle('title1')}
            font-weight: 200;
            margin-bottom: ${1 * GU}px;
          `}
        >
          Welcome to Aragon Court
        </h1>
        <p
          css={`
            ${textStyle('body1')}
            color: ${theme.contentSecondary};
            margin-bottom: ${3 * GU}px;
          `}
        >
          Aragon Court handles subjective disputes that require the judgment of
          human jurors.
        </p>
        <div
          css={`
            display: flex;
            align-items: center;
          `}
        >
          <Button
            label="User guide"
            href="https://help.aragon.org/article/41-aragon-court"
            css={`
              width: ${19 * GU}px;
            `}
          />
        </div>
      </div>
    </div>
  )
}

export default Welcome
