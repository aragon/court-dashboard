import React from 'react'
import { GU } from '@aragon/ui'

import Balance from './Balance'
import walletIcon from '../../assets/wallet.svg'

function MyWallet({ amount, value }) {
  return (
    <div
      css={`
        padding: ${3 * GU}px;
      `}
    >
      <Balance
        label="My wallet"
        amount={amount}
        value={value}
        mainIcon={walletIcon}
        mainIconBackground="#FEF3F1"
      />
    </div>
  )
}

export default MyWallet
