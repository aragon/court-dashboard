import React from 'react'
import { Box, GU, LoadingRing, textStyle, Link, useTheme } from '@aragon/ui'

export default function MessageCard({
  icon,
  title,
  paragraph,
  loading,
  border = true,
  mode = 'normal',
  link,
}) {
  const theme = useTheme()

  const isCompactMode = mode === 'compact'

  const Container = border ? Box : 'div'
  return (
    <Container>
      <div
        css={`
          margin: ${(isCompactMode ? 0 : 9) * GU}px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <img
          src={icon}
          alt=""
          css={`
            display: block;
            width: 100%;
            max-width: ${(isCompactMode ? 12 : 30) * GU}px;
            height: auto;
            margin: ${4 * GU}px 0;
          `}
        />
        {loading ? (
          <div
            css={`
              display: flex;
              align-items: center;
            `}
          >
            <LoadingRing
              css={`
                width: 30px;
              `}
            />
            <span
              css={`
                margin-left: ${1 * GU}px;
                ${textStyle('title2')};
              `}
            >
              Loading…
            </span>
          </div>
        ) : (
          <>
            <span
              css={`
                ${textStyle(isCompactMode ? 'title4' : 'title2')};
                text-align: center;
              `}
            >
              {title}
            </span>
            <div
              css={`
                ${textStyle('body2')};
                color: ${theme.surfaceContentSecondary};
                margin-top: ${1.5 * GU}px;
                width: ${(isCompactMode ? 25 : 55) * GU}px;
                display: flex;
                text-align: center;
              `}
            >
              {paragraph}
            </div>
            {link && <Link onClick={link.action}>{link.text}</Link>}
          </>
        )}
      </div>
    </Container>
  )
}
