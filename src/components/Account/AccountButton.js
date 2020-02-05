import React from 'react'
import PropTypes from 'prop-types'
import {
  ButtonBase,
  EthIdenticon,
  GU,
  IconDown,
  RADIUS,
  textStyle,
  useTheme,
  useViewport,
} from '@aragon/ui'
import { shortenAddress } from '../../lib/web3-utils'
import { useWallet } from 'use-wallet'

function AccountButton({ label, onClick }) {
  const theme = useTheme()
  const wallet = useWallet()
  const { above } = useViewport()
  return (
    <ButtonBase
      onClick={onClick}
      css={`
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 ${1 * GU}px;
        &:active {
          background: ${theme.surfacePressed};
        }
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          text-align: left;
          padding: 0 ${1 * GU}px 0 ${2 * GU}px;
        `}
      >
        <div css="position: relative">
          <EthIdenticon address={wallet.account} radius={RADIUS} />
          <div
            css={`
              position: absolute;
              bottom: -3px;
              right: -3px;
              width: 10px;
              height: 10px;
              background: ${theme.positive};
              border: 2px solid ${theme.surface};
              border-radius: 50%;
            `}
          />
        </div>
        {above('medium') && (
          <React.Fragment>
            <div
              css={`
                padding-left: ${1 * GU}px;
                padding-right: ${0.5 * GU}px;
              `}
            >
              <div
                css={`
                  margin-bottom: -5px;
                  ${textStyle('body2')}
                `}
              >
                {label ? (
                  <div
                    css={`
                      overflow: hidden;
                      max-width: ${16 * GU}px;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                    `}
                  >
                    {label}
                  </div>
                ) : (
                  <div>{shortenAddress(wallet.account)}</div>
                )}
              </div>
              <div
                css={`
                  font-size: 11px; /* doesn’t exist in aragonUI */
                  color: ${theme.positive};
                `}
              >
                Connected.
              </div>
            </div>

            <IconDown
              size="small"
              css={`
                color: ${theme.surfaceIcon};
              `}
            />
          </React.Fragment>
        )}
      </div>
    </ButtonBase>
  )
}
AccountButton.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func.isRequired,
}

export default AccountButton
