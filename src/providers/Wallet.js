import React, { useContext } from 'react'
import PropTypes from 'prop-types'

const WalletContext = React.createContext()

function WalletProvider({ children }) {
  // TODO: get account from web3
  const connectedAccount = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'

  return (
    <WalletContext.Provider value={connectedAccount}>
      {children}
    </WalletContext.Provider>
  )
}

WalletProvider.propTypes = {
  children: PropTypes.node,
}

function useConnectedAccount() {
  return useContext(WalletContext)
}

export { WalletProvider, useConnectedAccount }
