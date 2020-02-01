import React from 'react'
import { Box, GU, LoadingRing, textStyle, useTheme, Link } from '@aragon/ui'

export default function MessageCard({
  icon,
  title,
  paragraph,
  loading,
  noBorder,
  link,
}) {
  const theme = useTheme()

  const Container = noBorder ? 'div' : Box
  return (
    <Container>
      <div
        css={`
          margin: ${9 * GU}px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <img
          src={icon}
          css={`
            display: block;
            width: 100%;
            max-width: 237px;
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
                ${textStyle('title2')}
              `}
            >
              Loading...
            </span>
          </div>
        ) : (
          <>
            <span
              css={`
                ${textStyle('title2')}
              `}
            >
              {title}
            </span>
            <div
              css={`
                ${textStyle('body2')}
                color: ${theme.contentSecondary};
                margin: ${1.5 * GU}px 0 ;
                width: 450px;
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
