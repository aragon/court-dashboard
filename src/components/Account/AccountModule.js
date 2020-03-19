import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useWallet } from 'use-wallet'
import { Button, GU, IconConnect, springs, useViewport } from '@aragon/ui'
import { Transition, animated } from 'react-spring/renderprops'
import { shortenAddress, getUseWalletProviders } from '../../lib/web3-utils'
import AccountButton from './AccountButton'
import HeaderPopover from '../Header/HeaderPopover'
import ScreenConnected from './ScreenConnected'
import ScreenConnecting from './ScreenConnecting'
import ScreenError from './ScreenError'
import ScreenProviders from './ScreenProviders'

const SCREENS = [
  {
    id: 'providers',
    title: 'Ethereum providers',
    height:
      4 * GU + // header
      (12 + 1.5) * GU * (getUseWalletProviders().length / 2) + // buttons
      7 * GU, // footer
  },
  {
    id: 'connecting',
    title: 'Ethereum providers',
    height: 38 * GU,
  },
  {
    id: 'connected',
    title: 'Active wallet',
    height: 22 * GU,
  },
  {
    id: 'error',
    title: 'Ethereum providers',
    height: 50 * GU,
  },
]

function AccountModule() {
  const buttonRef = useRef()
  const wallet = useWallet()
  const [opened, setOpened] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [activatingDelayed, setActivatingDelayed] = useState(false)
  const [activationError, setActivationError] = useState(null)
  const popoverFocusElement = useRef()

  const { below } = useViewport()
  const compactMode = below('medium')

  const { account, activating } = wallet

  const clearError = useCallback(() => setActivationError(null), [])

  const toggle = useCallback(() => setOpened(opened => !opened), [])

  const handleCancelConnection = useCallback(() => {
    wallet.deactivate()
  }, [wallet])

  const activate = useCallback(
    async providerId => {
      try {
        await wallet.activate(providerId)
      } catch (error) {
        setActivationError(error)
      }
    },
    [wallet]
  )

  // Don’t animate the slider until the popover has opened
  useEffect(() => {
    if (!opened) {
      return
    }
    setAnimate(false)
    const timer = setTimeout(() => {
      setAnimate(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [opened])

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
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [activating, activationError])

  const previousScreenIndex = useRef(-1)

  const { screenIndex, direction } = useMemo(() => {
    const screenId = (() => {
      if (activationError) return 'error'
      if (activatingDelayed) return 'connecting'
      if (account) return 'connected'
      return 'providers'
    })()

    const screenIndex = SCREENS.findIndex(screen => screen.id === screenId)
    const direction = previousScreenIndex.current > screenIndex ? -1 : 1

    previousScreenIndex.current = screenIndex

    return { direction, screenIndex }
  }, [account, activationError, activatingDelayed])

  const screen = SCREENS[screenIndex]
  const screenId = screen.id

  const handlePopoverClose = useCallback(
    reject => {
      if (screenId === 'connecting' || screenId === 'error') {
        // reject closing the popover
        return false
      }
      setOpened(false)
      setActivationError(null)
    },
    [screenId]
  )

  // Prevents to lose the focus on the popover when a screen leaves while an
  // element inside is focused (e.g. when clicking on the “disconnect” button).
  useEffect(() => {
    if (popoverFocusElement.current) {
      popoverFocusElement.current.focus()
    }
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
          label="Enable account"
          onClick={toggle}
          display={compactMode ? 'icon' : 'all'}
        />
      )}

      <HeaderPopover
        animateHeight={animate}
        heading={screen.title}
        height={screen.height}
        width={51 * GU}
        onClose={handlePopoverClose}
        opener={buttonRef.current}
        visible={opened}
      >
        <div ref={popoverFocusElement} tabIndex="0" css="outline: 0">
          <Transition
            native
            immediate={!animate}
            config={springs.smooth}
            items={{
              screen,
              // This is needed because use-wallet throws an error when the
              // activation fails before React updates the state of `activating`.
              // A future version of use-wallet might return an
              // `activationError` object instead, making this unnecessary.
              activating: screen.id === 'error' ? null : activatingDelayed,
              wallet,
            }}
            keys={({ screen }) => screen.id + activatingDelayed}
            from={{
              opacity: 0,
              transform: `translate3d(${3 * GU * direction}px, 0, 0)`,
            }}
            enter={{ opacity: 1, transform: `translate3d(0, 0, 0)` }}
            leave={{
              opacity: 0,
              transform: `translate3d(${3 * GU * -direction}px, 0, 0)`,
            }}
          >
            {({ screen, activating, wallet }) => ({ opacity, transform }) => (
              <animated.div
                style={{ opacity, transform }}
                css={`
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                `}
              >
                {(() => {
                  if (screen.id === 'connecting') {
                    return (
                      <ScreenConnecting
                        providerId={activating}
                        onCancel={handleCancelConnection}
                      />
                    )
                  }
                  if (screen.id === 'connected') {
                    return <ScreenConnected wallet={wallet} />
                  }
                  if (screen.id === 'error') {
                    return (
                      <ScreenError
                        error={activationError}
                        onBack={clearError}
                      />
                    )
                  }
                  return <ScreenProviders onActivate={activate} />
                })()}
              </animated.div>
            )}
          </Transition>
        </div>
      </HeaderPopover>
    </div>
  )
}

export default AccountModule
