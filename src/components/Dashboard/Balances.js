import React from 'react'
import { Button, textStyle, GU, useTheme } from '@aragon/ui'

import Balance from './Balance'

import { balances } from '../../mock-data'

function Balances() {
  const theme = useTheme()

  return (
    <div>
      <div
        css={`
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        `}
      >
        <div>
          <span
            css={`
              ${textStyle('body3')}
              color: ${theme.contentSecondary};
              display: inline-block;
              margin-bottom: ${1.5 * GU}px;
            `}
          >
            Wallet balance
          </span>
          {balances.wallet.map((balance, index) => (
            <Balance
              key={index}
              symbol={balance.tokenSymbol}
              amount={balance.amount}
              value={balance.value}
              iconSrc={balance.icon}
            />
          ))}
        </div>
        <div>
          <span
            css={`
              ${textStyle('body3')}
              color: ${theme.contentSecondary};
              display: inline-block;
              margin-bottom: ${1.5 * GU}px;
            `}
          >
            Staked balance
          </span>
          {balances.staked.map((balance, index) => (
            <Balance
              key={index}
              symbol={balance.tokenSymbol}
              amount={balance.amount}
              value={balance.value}
              iconSrc={balance.icon}
            />
          ))}
          <Button color="#636971">
            <span
              css={`
                color: #636971;
              `}
            >
              Unstake
            </span>
          </Button>
        </div>
        <div>
          <span
            css={`
              ${textStyle('body3')}
              color: ${theme.contentSecondary};
              display: inline-block;
              margin-bottom: ${1.5 * GU}px;
            `}
          >
            Active balance
          </span>
          {balances.active.map((balance, index) => (
            <Balance
              key={index}
              symbol={balance.tokenSymbol}
              amount={balance.amount}
              value={balance.value}
              iconSrc={balance.icon}
            />
          ))}
          <Button color="#636971">
            <span
              css={`
                color: #636971;
              `}
            >
              Deactivate
            </span>
          </Button>
        </div>
        <div>
          <span
            css={`
              ${textStyle('body3')}
              color: ${theme.contentSecondary};
              display: inline-block;
              margin-bottom: ${1.5 * GU}px;
            `}
          >
            Rewards
          </span>
          {balances.rewards.map((balance, index) => (
            <Balance
              key={index}
              symbol={balance.tokenSymbol}
              amount={balance.amount}
              value={balance.value}
              iconSrc={balance.icon}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Balances
