import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useWallet } from 'use-wallet'
import { Button, GU, IconConnect, useViewport } from '@aragon/ui'
import { shortenAddress } from '../../lib/web3-utils'
import AccountButton from './AccountButton'
import AccountPopover from './AccountPopover'
import ScreenConnected from './ScreenConnected'
import ScreenConnecting from './ScreenConnecting'
import ScreenError from './ScreenError'
import ScreenProviders from './ScreenProviders'

const SCREENS = [
  { id: 'providers', title: 'Use account from' },
  { id: 'connecting', title: 'Use account from' },
  { id: 'connected', title: 'Active account' },
  { id: 'error', title: 'Connection error' },
]

function AccountModule() {
  const [opened, setOpened] = useState(false)
  const [activatingDelayed, setActivatingDelayed] = useState(null)
  const buttonRef = useRef()
  const { below } = useViewport()
  const compactMode = below('medium')
  const wallet = useWallet()
  const { account, connector, error, status } = wallet

  const open = useCallback(() => setOpened(true), [])
  const toggle = useCallback(() => setOpened(opened => !opened), [])

  useEffect(() => {
    let timer

    if (status === 'error') {
      setActivatingDelayed(null)
    }

    if (status === 'connecting') {
      setActivatingDelayed(connector)
      timer = setTimeout(() => {
        setActivatingDelayed(null)
      }, 400)
    }

    return () => clearTimeout(timer)
  }, [connector, status])

  const handleResetConnection = useCallback(() => {
    wallet.reset()
  }, [wallet])

  const handleActivate = useCallback(providerId => wallet.connect(providerId), [
    wallet,
  ])

  const previousScreenIndex = useRef(-1)

  const { screenIndex, direction } = useMemo(() => {
    const screenId = status === 'disconnected' ? 'providers' : status

    const screenIndex = SCREENS.findIndex(screen => screen.id === screenId)
    const direction = previousScreenIndex.current > screenIndex ? -1 : 1

    previousScreenIndex.current = screenIndex

    return { direction, screenIndex }
  }, [status])

  const screen = SCREENS[screenIndex]
  const screenId = screen.id

  const handlePopoverClose = useCallback(() => {
    if (screenId === 'connecting' || screenId === 'error') {
      // reject closing the popover
      return false
    }
    setOpened(false)
  }, [screenId])

  return (
    <div
      ref={buttonRef}
      tabIndex="0"
      css={`
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: ${compactMode ? 'auto' : `${24.5 * GU}px`};
        outline: 0;
      `}
    >
      {screen.id === 'connected' ? (
        <AccountButton
          label={shortenAddress(wallet.account)}
          onClick={toggle}
        />
      ) : (
        <Button
          icon={<IconConnect />}
          label="Connect account"
          onClick={toggle}
          display={compactMode ? 'icon' : 'all'}
        />
      )}
      <AccountPopover
        direction={direction}
        heading={screen.title}
        keys={({ screenId }) => screenId + status + error.name}
        onClose={handlePopoverClose}
        onOpen={open}
        opener={buttonRef.current}
        screenId={screenId}
        screenData={{
          account,
          activating: activatingDelayed,
          activationError: error,
          status,
          screenId,
        }}
        screenKey={({ account, activating, activationError, screenId }) =>
          (activationError ? activationError.name : '') +
          account +
          activating +
          screenId
        }
        visible={opened}
      >
        {({ activating, activationError, screenId }) => {
          if (screenId === 'connecting') {
            return (
              <ScreenConnecting
                providerId={activating}
                onCancel={handleResetConnection}
              />
            )
          }
          if (screenId === 'connected') {
            return <ScreenConnected wallet={wallet} />
          }
          if (screenId === 'error') {
            return (
              <ScreenError
                error={activationError}
                onBack={handleResetConnection}
              />
            )
          }
          return <ScreenProviders onActivate={handleActivate} />
        }}
      </AccountPopover>
    </div>
  )
}

export default AccountModule
