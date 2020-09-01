import React from 'react'
import { Box, GU, Link, useTheme } from '@aragon/ui'

import { formatUnits } from '../../lib/math-utils'
import { useCourtConfig } from '../../providers/CourtConfig'
import iconLock from '../../assets/IconLock.svg'
import Loading from '../Loading'

const AppealColateralModule = React.memo(function AppealColateralModule({
  appeals,
  loading,
}) {
  const { feeToken } = useCourtConfig()
  const theme = useTheme()

  if (!loading && !appeals.length) return null

  return (
    <Box heading={!loading && 'Appeal collateral'} padding={0}>
      {loading ? (
        <Loading height={150} size="large" />
      ) : appeals.length ? (
        appeals.map(({ amountStaked, disputeId }, index) => (
          <div
            key={index}
            css={`
              padding: ${3 * GU}px;
              border-bottom: 1px solid ${theme.border};

              &:last-child {
                border: 0;
              }
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
                alt=""
                css={`
                  margin-right: ${1 * GU}px;
                `}
              />
              <span>
                <span
                  css={`
                    color: ${theme.surfaceContentSecondary};
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
              <Link href={`#/disputes/${disputeId}`} external={false}>
                Dispute #{disputeId}
              </Link>
            </div>
          </div>
        ))
      ) : (
        <div
          css={`
            padding: ${3 * GU}px;
          `}
        >
          No collaterals
        </div>
      )}
    </Box>
  )
})

export default AppealColateralModule
