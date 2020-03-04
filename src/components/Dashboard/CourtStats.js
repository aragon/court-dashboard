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
      <div>
        <span
          css={`
            ${textStyle('title2')}
            font-weight: 300;
          `}
        >
          {stats.token.value}
        </span>
        <img
          css={`
            margin-right: 5px;
          `}
          height="20"
          width="18"
          src={stats.token.icon}
          alt="ANJ"
        />
        <span
          css={` ${textStyle('body2')}
          color: ${theme.surfaceContentSecondary};`}
        >
          {stats.token.symbol}
        </span>
      </div>
    </Box>
  )
}

export default CourtStats
