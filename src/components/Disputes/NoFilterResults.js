import React from 'react'
import { Box, textStyle, GU, Link, useTheme } from '@aragon/ui'

import noResults from '../../assets/noResults.svg'

function NoFilterResults({ onClearFilters }) {
  const theme = useTheme()
  return (
    <Box>
      <div
        css={`
          margin: ${15 * GU}px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <img
          src={noResults}
          alt="No Evidence"
          css={`
            display: block;
            width: 100%;
            max-width: 237px;
            height: auto;
            margin: ${4 * GU}px 0;
          `}
        />
        <span
          css={`
            ${textStyle('title2')}
          `}
        >
          No results found.
        </span>
        <div
          css={`
            ${textStyle('body2')}
            color: ${theme.contentSecondary};
            margin-top: ${GU * 1.5}px;
            width: 500px;
            display: flex; 
            text-align:center;
          `}
        >
          <span
            css={`
              display: inline-block;
            `}
          >
            We couldn’t find any dispute matching your filter selection.
            <TextLink text="Clear all filters" onLinkClick={onClearFilters} />
          </span>
        </div>
      </div>
    </Box>
  )
}

function TextLink({ text, onLinkClick }) {
  return <Link onClick={onLinkClick}>{text}</Link>
}

export default NoFilterResults
