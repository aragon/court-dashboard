import React from 'react'
import { Box, GU, textStyle, useTheme } from '@aragon/ui'
import IconANJ from '../../assets/IconANJ.svg'
// import { formatUnits, bigNum } from '../../lib/math-utils'
// import LatestActivity from './LatestActivity'
// import CourtStats from './CourtStats'

// const splitAmount = amount => {
//   const [integer, fractional] = amount.split('.')
//   return (
//     <span
//       css={`
//         margin-right: 5px;
//       `}
//     >
//       <span className="integer">{integer}</span>
//       {fractional && (
//         <span
//           css={`
//             font-size: 16px;
//           `}
//         >
//           .{fractional}
//         </span>
//       )}
//     </span>
//   )
// }

const CourtStats = () => {
  const theme = useTheme()
  const stats = {
    title: 'Total Active ANJ',
    token: {
      symbol: 'ANJ',
      value: 101490826,
      decimals: 18,
      icon: IconANJ,
      usdValue: 82501892,
    },
  }

  return (
    <Box heading="Court Metrics" padding={3 * GU}>
      <div
        css={`
          margin-bottom: ${2 * GU}px;
          &:last-child {
            margin-bottom: 0;
          }
        `}
      >
        <span
          css={`      
          ${textStyle('body2')}
          color: ${theme.surfaceContentSecondary};
          display:block;
          margin-bottom:${1 * GU}px;
        `}
        >
          {stats.title}
        </span>

        <TokenStats token={stats.token} theme={theme} />
      </div>
    </Box>
  )
}

function TokenStats({ token, theme }) {
  const { value, icon, symbol, usdValue } = token
  return (
    <>
      <div
        css={`
          margin-bottom: ${1 * GU}px;
        `}
      >
        <span
          css={`
            ${textStyle('title2')}
            font-weight: 300;
          `}
        >
          {value}
        </span>
        <img
          css={`
            margin-right: 5px;
          `}
          height="20"
          width="18"
          src={icon}
          alt="ANJ"
        />
        <span
          css={` ${textStyle('body2')}
          color: ${theme.surfaceContentSecondary};`}
        >
          {symbol}
        </span>
      </div>
      <span
        css={`
          ${textStyle('body2')}
          color: ${theme.positive};
        `}
      >
        ${usdValue}
      </span>
    </>
  )
}

export default CourtStats
