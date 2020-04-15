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
import {
  defaultEthNode,
  defaultIpfsGateway,
  defaultSubgraphHttpEndpoint,
  defaultSubgraphWsEndpoint,
} from '../../../networks'
import {
  clearLocalStorageNetworkSettings,
  setDefaultEthNode,
  setIpfsGateway,
  setSubgraphHttpEndpoint,
  setSubgraphWsEndpoint,
} from '../../../local-settings'
import { InvalidNetworkType, InvalidURI, NoConnection } from '../../../errors'
import {
  checkValidEthNode,
  getNetworkType,
  sanitizeNetworkType,
  validHttpFormat,
  validWebSocketFormat,
} from '../../../lib/web3-utils'
import { useEnterKey } from '../../../hooks/useKeyboardArrows'
import { useSubgraph } from '../../../providers/Subgraph'

function Network() {
  const {
    ethNode,
    networkType,
    ipfsGateway,
    subgraphHttpEndpoint,
    subgraphWsEndpoint,
    handleEthNodeChange,
    handleIpfsGatewayChange,
    handleSubgraphHttpEndpointChange,
    handleSubgraphWsEndpointChange,
    settingsErrors,
    handleNetworkChange,
    handleClearNetworkSettings,
  } = useNetwork()
  const theme = useTheme()

  const { layoutName } = useLayout()
  const compact = layoutName === 'small'
  const { ethError, httpSubgraphError, wsSubgraphError } = settingsErrors || {}

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
          {ethError && (
            <span
              css={`
                ${textStyle('body4')};
                color: ${theme.negative};
              `}
            >
              {(() => {
                if (ethError instanceof InvalidNetworkType) {
                  return `Node must be connected to ${sanitizeNetworkType(
                    networkType
                  )}`
                }
                if (ethError instanceof InvalidURI) {
                  return 'Must provide Http endpoint to node'
                }
                if (ethError instanceof NoConnection) {
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
        <Label theme={theme}>
          Subgraph HTTP Endpoint
          <TextInput
            value={subgraphHttpEndpoint}
            wide
            onChange={handleSubgraphHttpEndpointChange}
            css={`
              ${textStyle('body2')};
              color: ${theme.contentSecondary};
            `}
          />
          {httpSubgraphError && (
            <span
              css={`
                ${textStyle('body4')};
                color: ${theme.negative};
              `}
            >
              {httpSubgraphError}
            </span>
          )}
        </Label>
        <Label theme={theme}>
          Subgraph WS Endpoint
          <TextInput
            value={subgraphWsEndpoint}
            wide
            onChange={handleSubgraphWsEndpointChange}
            css={`
              ${textStyle('body2')};
              color: ${theme.contentSecondary};
            `}
          />
          {wsSubgraphError && (
            <span
              css={`
                ${textStyle('body4')};
                color: ${theme.negative};
              `}
            >
              {wsSubgraphError}
            </span>
          )}
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
  const [settingsErrors, setSettingsErrors] = useState(null)
  const [ethNode, setEthNodeValue] = useState(defaultEthNode)
  const [ipfsGateway, setIpfsGatewayValue] = useState(defaultIpfsGateway)
  const [subgraphHttpEndpoint, setSubgraphHttpEndpointValue] = useState(
    defaultSubgraphHttpEndpoint
  )
  const [subgraphWsEndpoint, setSubgraphWsEndpointValue] = useState(
    defaultSubgraphWsEndpoint
  )

  const { resetSubgraphClient } = useSubgraph()
  const networkType = getNetworkType()

  const defaultsChanged =
    ipfsGateway !== defaultIpfsGateway ||
    ethNode !== defaultEthNode ||
    subgraphHttpEndpoint !== defaultSubgraphHttpEndpoint ||
    subgraphWsEndpoint !== defaultSubgraphWsEndpoint

  const subgraphChanged =
    subgraphHttpEndpoint !== defaultSubgraphHttpEndpoint ||
    subgraphWsEndpoint !== defaultSubgraphWsEndpoint

  const handleNetworkChange = useCallback(async () => {
    if (!defaultsChanged) {
      setSettingsErrors(null)
      return
    }

    const errors = await validateNetworkSettings(
      ethNode,
      subgraphHttpEndpoint,
      subgraphWsEndpoint
    )

    if (errors) {
      setSettingsErrors(errors)
      return
    }
    setDefaultEthNode(ethNode)
    setSubgraphHttpEndpoint(subgraphHttpEndpoint)
    setSubgraphWsEndpoint(subgraphWsEndpoint)
    setIpfsGateway(ipfsGateway)

    if (subgraphChanged) {
      resetSubgraphClient()
    }
    window.location.reload()
  }, [
    ethNode,
    ipfsGateway,
    defaultsChanged,
    subgraphChanged,
    subgraphHttpEndpoint,
    subgraphWsEndpoint,
    resetSubgraphClient,
  ])

  const handleClearNetworkSettings = useCallback(() => {
    clearLocalStorageNetworkSettings()
    window.location.reload()
  }, [])

  useEnterKey(handleNetworkChange)

  return {
    ethNode,
    networkType,
    ipfsGateway,
    subgraphHttpEndpoint,
    subgraphWsEndpoint,
    handleNetworkChange,
    handleClearNetworkSettings,
    settingsErrors,
    handleEthNodeChange: ({ currentTarget: { value } }) =>
      setEthNodeValue(value),
    handleIpfsGatewayChange: ({ currentTarget: { value } }) =>
      setIpfsGatewayValue(value),
    handleSubgraphHttpEndpointChange: ({ currentTarget: { value } }) =>
      setSubgraphHttpEndpointValue(value),
    handleSubgraphWsEndpointChange: ({ currentTarget: { value } }) =>
      setSubgraphWsEndpointValue(value),
  }
}

async function validateNetworkSettings(
  ethNode,
  subgraphHttpEndpoint,
  subgraphWsEndpoint
) {
  const settingsErrors = {}
  try {
    await checkValidEthNode(ethNode)
  } catch (err) {
    settingsErrors.ethError = err
  }

  if (!validHttpFormat(subgraphHttpEndpoint)) {
    settingsErrors.httpSubgraphError = 'The URI must use the HTTP protocol'
  }
  if (!validWebSocketFormat(subgraphWsEndpoint)) {
    settingsErrors.wsSubgraphError = 'The URI must use the WS protocol'
  }

  if (Object.entries(settingsErrors).length === 0) {
    return null
  }
  return settingsErrors
}
const Label = styled.label`
  color: ${({ theme }) => theme.content};
  display: block;
  margin-bottom: ${2 * GU}px;
`

export default React.memo(Network)
