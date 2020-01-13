import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  UnsupportedChainIdError,
  Web3ReactProvider,
  useWeb3React,
} from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { providers as EthersProviders } from 'ethers'
import { getNetworkName } from '../lib/web3-utils'
import environment from '../environment'

const { Web3Provider: EthersWeb3Provider } = EthersProviders
const CHAIN_ID = environment('CHAIN_ID')

const WEB3_REACT_CONNECTORS = new Map([
  ['injected', new InjectedConnector({ supportedChainIds: [CHAIN_ID] })],
])

export function useWeb3Connect() {
  const web3ReactContext = useWeb3React()

  const activate = useCallback(
    async type => {
      const connector = WEB3_REACT_CONNECTORS.get(type)
      if (connector) {
        try {
          await web3ReactContext.activate(connector, null, true)
        } catch (err) {
          const log = typeof window !== 'undefined' ? window.alert : console.log

          if (err instanceof UnsupportedChainIdError) {
            log(
              `Unsupported chain: please connect to the network called ${getNetworkName(
                CHAIN_ID
              )} in your Ethereum Provider.`
            )
            return
          }

          log('Unknown error, please try again.')
        }
      }
    },
    [web3ReactContext]
  )

  const {
    chainId,
    account,
    library: ethersProvider,
    deactivate,
  } = web3ReactContext

  return {
    account,
    activate,
    deactivate,
    ethersProvider,
    networkName: getNetworkName(chainId),
    web3ReactContext,
  }
}

export function useConnectedAccount() {
  const web3ReactContext = useWeb3React()
  return web3ReactContext.account
}

export function Web3ConnectProvider({ children }) {
  const getLibrary = useCallback(
    provider => new EthersWeb3Provider(provider),
    []
  )
  return (
    <Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>
  )
}

Web3ConnectProvider.propTypes = {
  children: PropTypes.node,
}

export default Web3ConnectProvider
