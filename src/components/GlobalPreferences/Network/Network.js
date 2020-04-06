import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import {
  Box,
  Button,
  Info,
  GU,
  TextInput,
  textStyle,
  useLayout,
  useTheme,
} from '@aragon/ui'
import { defaultEthNode, defaultIpfsGateway } from '../../../networks'
import { setDefaultEthNode, setIpfsGateway } from '../../../local-settings'
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
    handleClearCache,
    networkError,
    handleNetworkChange,
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
            Press this button to refresh the cache of the application in your
            browser.
          </span>
        </div>
        <Button
          css={`
            margin-bottom: ${2 * GU}px;
          `}
          onClick={handleClearCache}
          wide={compact}
        >
          Clear application cache
        </Button>
        <Info>
          This will only delete the data stored in your browser to make the app
          load faster. No data related to the organization itself will be
          altered.
        </Info>
      </Box>
    </React.Fragment>
  )
}

const useNetwork = () => {
  const [networkError, setNetworkError] = useState(null)
  const [ethNode, setEthNodeValue] = useState(defaultEthNode)
  const [ipfsGateway, setIpfsGatewayValue] = useState(defaultIpfsGateway)
  const networkType = getNetworkType()

  const handleNetworkChange = useCallback(async () => {
    try {
      await checkValidEthNode(ethNode)
    } catch (err) {
      setNetworkError(err)
      return
    }
    setDefaultEthNode(ethNode)
    setIpfsGateway(ipfsGateway)
    window.location.reload()
  }, [ethNode, ipfsGateway])

  const handleClearCache = useCallback(() => {
    window.localStorage.clear()
  }, [])

  const defaultsChanged =
    ipfsGateway !== defaultIpfsGateway || ethNode !== defaultEthNode

  useEnterKey(handleNetworkChange, defaultsChanged)

  return {
    ethNode,
    networkType,
    ipfsGateway,
    handleNetworkChange,
    handleClearCache,
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
