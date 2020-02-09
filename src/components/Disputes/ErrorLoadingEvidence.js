import React from 'react'
import { GU, textStyle, Link, useTheme } from '@aragon/ui'

import errorLoadingSvg from '../../assets/errorLoading.svg'

export default function ErrorLoadingEvidence() {
  const theme = useTheme()
  return (
    <div
      css={`
        width: 100%;
        height: ${55 * GU}px;
        display: flex;
        align-items: center;
      `}
    >
      <div
        css={`
          margin: ${5 * GU}px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <img
          src={errorLoadingSvg}
          alt=""
          css={`
            display: block;
            width: 100%;
            max-width: ${30 * GU}px;
            height: auto;
            margin: ${4 * GU}px 0;
          `}
        />

        <span
          css={`
            ${textStyle('title2')}
          `}
        >
          We couldn't load evidence infromation
        </span>
        <div
          css={`
                ${textStyle('body2')}
                color: ${theme.contentSecondary};
                margin-top: ${1.5 * GU}px;
                width: ${55 * GU}px;
                display: flex;
                text-align: center; 
              `}
        >
          <span>
            Something went wrong! You can restart the app, or you can{' '}
            <span
              css={`
                color: ${theme.help};
              `}
            >
              {' '}
              <Link onClick={() => {}}> tell us what went wrong </Link>
            </span>{' '}
            if the problem persists.
          </span>
        </div>
      </div>
    </div>
  )
}
