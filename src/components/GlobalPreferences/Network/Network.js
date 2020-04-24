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
} from '../../../lib/web3-utils'
import { validHttpFormat, validWebSocketFormat } from '../../../lib/uri-utils'
import { useEnterKey } from '../../../hooks/useKeyboardArrows'
import { useSubgraph } from '../../../providers/Subgraph'

function Network() {
  const {
    ethNode,
    handleClearNetworkSettings,
    handleEthNodeChange,
    handleIpfsGatewayChange,
    handleNetworkChange,
    handleSubgraphHttpEndpointChange,
    handleSubgraphWsEndpointChange,
    ipfsGateway,
    settingsErrors,
    subgraphHttpEndpoint,
    subgraphWsEndpoint,
  } = useNetwork()

  const { layoutName } = useLayout()
  const compact = layoutName === 'small'
  const { ethError, httpSubgraphError, wsSubgraphError } = settingsErrors || {}

  return (
    <React.Fragment>
      <Box heading="Node settings">
        <Field
          label="Ethereum node"
          text={ethNode}
          onTextChange={handleEthNodeChange}
          error={ethError}
        />
        <Field
          label="IPFS Gateway"
          text={ipfsGateway}
          onTextChange={handleIpfsGatewayChange}
        />
        <Field
          label="Subgraph HTTP endpoint"
          text={subgraphHttpEndpoint}
          onTextChange={handleSubgraphHttpEndpointChange}
          error={httpSubgraphError}
        />
        <Field
          label="Subgraph WS endpoint"
          text={subgraphWsEndpoint}
          onTextChange={handleSubgraphWsEndpointChange}
          error={wsSubgraphError}
        />
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

function Field({ label, text, onTextChange, error }) {
  const theme = useTheme()
  return (
    <Label theme={theme}>
      {label}
      <TextInput
        value={text}
        wide
        onChange={onTextChange}
        css={`
          ${textStyle('body2')};
          color: ${theme.contentSecondary};
        `}
      />
      {error && (
        <span
          css={`
            ${textStyle('body4')};
            color: ${theme.negative};
          `}
        >
          {error}
        </span>
      )}
    </Label>
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

  const subgraphChanged =
    subgraphHttpEndpoint !== defaultSubgraphHttpEndpoint ||
    subgraphWsEndpoint !== defaultSubgraphWsEndpoint

  const defaultsChanged =
    ipfsGateway !== defaultIpfsGateway ||
    ethNode !== defaultEthNode ||
    subgraphChanged

  const handleNetworkChange = useCallback(async () => {
    if (!defaultsChanged) {
      setSettingsErrors(null)
      return
    }

    const errors = await validateNetworkSettings(
      ethNode,
      subgraphHttpEndpoint,
      subgraphWsEndpoint,
      networkType
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
    defaultsChanged,
    ethNode,
    subgraphHttpEndpoint,
    subgraphWsEndpoint,
    networkType,
    ipfsGateway,
    subgraphChanged,
    resetSubgraphClient,
  ])

  const handleClearNetworkSettings = useCallback(() => {
    clearLocalStorageNetworkSettings()
    window.location.reload()
  }, [])

  useEnterKey(handleNetworkChange)

  return {
    ethNode,
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
  subgraphWsEndpoint,
  networkType
) {
  const settingsErrors = {}
  try {
    await checkValidEthNode(ethNode)
  } catch (err) {
    if (err instanceof InvalidNetworkType) {
      settingsErrors.ethError = `Node must be connected to ${sanitizeNetworkType(
        networkType
      )}`
    }
    if (err instanceof InvalidURI) {
      settingsErrors.ethError = 'Must provide Http endpoint to node'
    }
    if (err instanceof NoConnection) {
      settingsErrors.ethError = 'Could not connect to node'
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
}

const Label = styled.label`
  color: ${({ theme }) => theme.content};
  display: block;
  margin-bottom: ${2 * GU}px;
`

export default React.memo(Network)
