import React from 'react'
import { Box, GU, Link, useTheme } from '@aragon/ui'

import { formatUnits } from '../../lib/math-utils'
import { useCourtConfig } from '../../providers/CourtConfig'
import iconLock from '../../assets/IconLock.svg'

const AppealColateralModule = React.memo(function AppealColateralModule({
  appeals,
}) {
  const { feeToken } = useCourtConfig()
  const theme = useTheme()
  return (
    <Box heading="Appeal collateral" padding={0}>
      {appeals.map(({ amountStaked, disputeId }) => (
        <div
          css={`
            padding: ${3 * GU}px;
            border-bottom: 1px solid ${theme.border};
          `}
        >
          <div
            css={`
              margin-bottom: ${1 * GU}px;
            `}
          >
            <img
              src={iconLock}
              height="14"
              css={`
                margin-right: ${1 * GU}px;
              `}
            />
            <span>
              <span
                css={`
                  color: ${theme.contentSecondary};
                  margin-right: ${0.5 * GU}px;
                `}
              >
                {formatUnits(amountStaked, { digits: feeToken.decimals })}{' '}
                {feeToken.symbol}
              </span>
              Staked
            </span>
          </div>
          <div>
            <Link href={`/disputes/${disputeId}`} external={false}>
              Dispute #{disputeId}
            </Link>
          </div>
        </div>
      ))}
    </Box>
  )
})

export default AppealColateralModule
