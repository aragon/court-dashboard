import React from 'react'
import { GU, Info, useTheme } from '@aragon/ui'

import errorLoadingSvg from '../assets/errorLoading.svg'
import MessageCard from './MessageCard'

function ErrorLoading({ subject, error }) {
  const theme = useTheme()

  const title = `We couldn't load ${subject} infromation`
  const paragraph = (
    <div>
      <span>
        Something went wrong! You can restart the app, or you can{' '}
        <span
          css={`
            color: ${theme.help};
          `}
        >
          {' '}
          tell us what went wrong {/* TODO: add link */}
        </span>{' '}
        if the problem persists.
      </span>
      <Info
        mode="error"
        css={`
          margin-top: ${3 * GU}px;
        `}
      >
        {error}
      </Info>
    </div>
  )

  return (
    <MessageCard title={title} paragraph={paragraph} icon={errorLoadingSvg} />
  )
}

export default ErrorLoading
