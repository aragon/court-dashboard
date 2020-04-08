import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import {
  Box,
  Button,
  GU,
  TextInput,
  textStyle,
  useLayout,
  useTheme,
} from '@aragon/ui'
import { defaultEthNode, defaultIpfsGateway } from '../../../networks'
import {
  clearLocalStorageNetworkSettings,
  setDefaultEthNode,
  setIpfsGateway,
} from '../../../local-settings'
import { InvalidNetworkType, InvalidURI, NoConnection } from '../../../errors'
import {
  checkValidEthNode,
  getNetworkType,
  sanitizeNetworkType,
} from '../../../lib/web3-utils'
import { useEnterKey } from '../../../hooks/useKeyboardArrows'

function Network() {
  const {
    ethNode,
    networkType,
    ipfsGateway,
    handleEthNodeChange,
    handleIpfsGatewayChange,
    networkError,
    handleNetworkChange,
    handleClearNetworkSettings,
  } = useNetwork()
  const theme = useTheme()

  const { layoutName } = useLayout()
  const compact = layoutName === 'small'

  return (
    <React.Fragment>
      <Box heading="Node settings">
        <Label theme={theme}>
          Ethereum node
          <TextInput
            value={ethNode}
            wide
            onChange={handleEthNodeChange}
            css={`
              ${textStyle('body2')};
              color: ${theme.contentSecondary};
            `}
          />
          {networkError && (
            <span
              css={`
                ${textStyle('body4')};
                color: ${theme.negative};
              `}
            >
              {(() => {
                if (networkError instanceof InvalidNetworkType) {
                  return `Node must be connected to ${sanitizeNetworkType(
                    networkType
                  )}`
                }
                if (networkError instanceof InvalidURI) {
                  return 'Must provide Http endpoint to node'
                }
                if (networkError instanceof NoConnection) {
                  return 'Could not connect to node'
                }
                return 'URI does not seem to be a ETH node'
              })()}
            </span>
          )}
        </Label>
        <Label theme={theme}>
          IPFS Gateway
          <TextInput
            value={ipfsGateway}
            wide
            onChange={handleIpfsGatewayChange}
            css={`
              ${textStyle('body2')};
              color: ${theme.contentSecondary};
            `}
          />
        </Label>
        <Button mode="strong" onClick={handleNetworkChange} wide={compact}>
          Save changes
        </Button>
      </Box>
      <Box heading="Troubleshooting">
        <div
          css={`
            margin-bottom: ${2 * GU}px;
          `}
        >
          <span>
            Press this button to reset the network settings to their defaults.
          </span>
        </div>
        <Button
          css={`
            margin-bottom: ${2 * GU}px;
          `}
          onClick={handleClearNetworkSettings}
          wide={compact}
        >
          Reset network settings
        </Button>
      </Box>
    </React.Fragment>
  )
}

const useNetwork = () => {
  const [networkError, setNetworkError] = useState(null)
  const [ethNode, setEthNodeValue] = useState(defaultEthNode)
  const [ipfsGateway, setIpfsGatewayValue] = useState(defaultIpfsGateway)
  const networkType = getNetworkType()

  const defaultsChanged =
    ipfsGateway !== defaultIpfsGateway || ethNode !== defaultEthNode

  const handleNetworkChange = useCallback(async () => {
    if (!defaultsChanged) {
      return
    }
    try {
      await checkValidEthNode(ethNode)
    } catch (err) {
      setNetworkError(err)
      return
    }
    setDefaultEthNode(ethNode)
    setIpfsGateway(ipfsGateway)
    window.location.reload()
  }, [ethNode, ipfsGateway, defaultsChanged])

  const handleClearNetworkSettings = useCallback(() => {
    clearLocalStorageNetworkSettings()
    window.location.reload()
  }, [])

  useEnterKey(handleNetworkChange)

  return {
    ethNode,
    networkType,
    ipfsGateway,
    handleNetworkChange,
    handleClearNetworkSettings,
    networkError,
    handleEthNodeChange: ({ currentTarget: { value } }) =>
      setEthNodeValue(value),
    handleIpfsGatewayChange: ({ currentTarget: { value } }) =>
      setIpfsGatewayValue(value),
  }
}

const Label = styled.label`
  color: ${({ theme }) => theme.content};
  display: block;
  margin-bottom: ${2 * GU}px;
`

export default React.memo(Network)
