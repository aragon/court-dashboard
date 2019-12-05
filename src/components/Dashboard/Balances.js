import React from 'react'
import { Button, textStyle, GU } from '@aragon/ui'

import DAIIcon from '../../assets/dai.svg'
import ANTIcon from '../../assets/ant.svg'
import ANJIcon from '../../assets/anj.svg'

import Balance from './Balance'

function Balances() {
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
              color: #637381;
              font-weight: 200;
              display: inline-block;
              margin-bottom: ${1.5 * GU}px;
            `}
          >
            Wallet balance
          </span>
          <Balance
            symbol="DAI"
            amount="3.304,76"
            value="3.300"
            iconSrc={DAIIcon}
          />
          <Balance
            symbol="ANT"
            amount="3.304,76"
            value="3.300"
            iconSrc={ANTIcon}
          />
        </div>
        <div>
          <span
            css={`
              ${textStyle('body3')}
              color: #637381;
              font-weight: 200;
              display: inline-block;
              margin-bottom: ${1.5 * GU}px;
            `}
          >
            Staked balance
          </span>
          <Balance
            symbol="ANJ"
            amount="3.304,76"
            value="3.300"
            iconSrc={ANJIcon}
          />
          <Button color="#636971">
            {' '}
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
              color: #637381;
              font-weight: 200;
              display: inline-block;
              margin-bottom: ${1.5 * GU}px;
            `}
          >
            Active balance
          </span>
          <Balance
            symbol="ANJ"
            amount="3.304,76"
            value="3.300"
            iconSrc={ANJIcon}
          />
          <Button color="#636971">
            {' '}
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
              color: #637381;
              font-weight: 200;
              display: inline-block;
              margin-bottom: ${1.5 * GU}px;
            `}
          >
            Rewards
          </span>
          <Balance
            symbol="DAI"
            amount="3.304,76"
            value="3.300"
            iconSrc={DAIIcon}
          />
          <Balance
            symbol="ANJ"
            amount="3.304,76"
            value="3.300"
            iconSrc={ANJIcon}
          />
        </div>
      </div>
    </div>
  )
}

export default Balances
