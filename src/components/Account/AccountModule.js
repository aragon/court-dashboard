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
  const [activatingDelayed, setActivatingDelayed] = useState(false)
  const [activationError, setActivationError] = useState(null)
  const buttonRef = useRef()
  const { below } = useViewport()
  const compactMode = below('medium')
  const wallet = useWallet()
  const { account, activating } = wallet

  const clearError = useCallback(() => setActivationError(null), [])

  const open = useCallback(() => setOpened(true), [])
  const toggle = useCallback(() => setOpened(opened => !opened), [])

  const handleCancelConnection = useCallback(() => {
    wallet.deactivate()
  }, [wallet])

  const handleActivate = useCallback(
    async providerId => {
      try {
        await wallet.activate(providerId)
      } catch (error) {
        setActivationError(error)
      }
    },
    [wallet]
  )
  // Always show the “connecting…” screen, even if there are no delay
  useEffect(() => {
    if (activationError) {
      setActivatingDelayed(null)
    }

    if (activating) {
      setActivatingDelayed(activating)
      return
    }

    const timer = setTimeout(() => {
      setActivatingDelayed(null)
    }, 400)

    return () => clearTimeout(timer)
  }, [activating, activationError])

  const previousScreenIndex = useRef(-1)

  const { screenIndex, direction } = useMemo(() => {
    const screenId = (() => {
      if (activationError) {
        return 'error'
      }
      if (activatingDelayed) {
        return 'connecting'
      }
      if (account) {
        return 'connected'
      }
      return 'providers'
    })()

    const screenIndex = SCREENS.findIndex(screen => screen.id === screenId)
    const direction = previousScreenIndex.current > screenIndex ? -1 : 1

    previousScreenIndex.current = screenIndex

    return { direction, screenIndex }
  }, [account, activationError, activatingDelayed])

  const screen = SCREENS[screenIndex]
  const screenId = screen.id

  const handlePopoverClose = useCallback(() => {
    if (screenId === 'connecting' || screenId === 'error') {
      // reject closing the popover
      return false
    }
    setOpened(false)
    setActivationError(null)
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
        keys={({ screenId }) => screenId + activating + activationError.name}
        onClose={handlePopoverClose}
        onOpen={open}
        opener={buttonRef.current}
        screenId={screenId}
        screenData={{
          account,
          // This is needed because use-wallet throws an error when the
          // activation fails before React updates the state of `activating`.
          // A future version of use-wallet might return an
          // `activationError` object instead, making this unnecessary.
          activating: screen.id === 'error' ? null : activatingDelayed,
          activationError,
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
                onCancel={handleCancelConnection}
              />
            )
          }
          if (screenId === 'connected') {
            return <ScreenConnected wallet={wallet} />
          }
          if (screenId === 'error') {
            return <ScreenError error={activationError} onBack={clearError} />
          }
          return <ScreenProviders onActivate={handleActivate} />
        }}
      </AccountPopover>
    </div>
  )
}

export default AccountModule
