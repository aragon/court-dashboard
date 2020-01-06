import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useWeb3React } from '@web3-react/core'

const Web3Context = React.createContext()

function Web3Provider({ children }) {
  // TODO: get account from web3
  const web3React = useWeb3React()
  console.log('web3', web3React)
  return (
    <Web3Context.Provider value={web3React}>{children}</Web3Context.Provider>
  )
}

Web3Provider.propTypes = {
  children: PropTypes.node,
}

function useConnectedAccount() {
  return useContext(Web3Context)
}

export { Web3Provider, useConnectedAccount }
