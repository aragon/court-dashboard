import React, { useCallback, useRef, useState } from 'react'
import {
  blockExplorerUrl,
  Button,
  ButtonBase,
  GU,
  IconCheck,
  IconClock,
  IconCross,
  IconExternal,
  textStyle,
  Timer,
  useTheme,
} from '@aragon/ui'
import { useWallet } from 'use-wallet'

import HeaderModule from './Header/HeaderModule'
import HeaderPopover from './Header/HeaderPopover'
import useNetwork from '../hooks/useNetwork'
import { useHeartbeat } from '../hooks/useCourtContracts'
import { useCourtClock } from '../providers/CourtClock'
import { useCourtConfig } from '../providers/CourtConfig'

import { shortenAddress } from '../lib/web3-utils'
import { formatDuration } from '../utils/date-utils'

import logoSvg from '../assets/LogoAccent.svg'

function ClockModule() {
  const buttonRef = useRef()
  const [opened, setOpened] = useState(false)

  const theme = useTheme()
  const wallet = useWallet()
  const onHeartbeat = useHeartbeat()
  const courtConfig = useCourtConfig()
  const { type: networkType } = useNetwork()
  const {
    currentTermId,
    currentTermEndDate,
    neededTransitions,
  } = useCourtClock()

  const isSynced = neededTransitions === 0

  const toggle = useCallback(() => setOpened(opened => !opened), [])

  const handlePopoverClose = useCallback(() => {
    setOpened(false)
  }, [])

  const handleOnClick = useCallback(async () => {
    try {
      const tx = await onHeartbeat(neededTransitions)
      await tx.wait()
    } catch (err) {
      console.error(err)
    }
  }, [neededTransitions, onHeartbeat])

  const IconSync = isSynced ? IconCheck : IconCross

  return (
    <div
      ref={buttonRef}
      tabIndex="0"
      css={`
        display: flex;
        align-items: center;
        height: 100%;
        outline: 0;
      `}
    >
      <HeaderModule
        icon={
          <div
            css={`
              background-color: ${theme.background};
              display: flex;
              border-radius: 100px;
              padding: 2px;
              margin-right: ${0.5 * GU}px;
            `}
          >
            <IconClock
              color={isSynced ? theme.positive : theme.negative}
              width={4.5 * GU}
              height={4.5 * GU}
            />
          </div>
        }
        content={
          <div
            css={`
              line-height: 1;
              width: 120px;

              & > time {
                & > span:first-child {
                  display: none;
                }
                & * {
                  line-height: 1;
                }
              }
            `}
          >
            {currentTermId ? (
              <>
                {isSynced ? (
                  <Timer end={currentTermEndDate} />
                ) : (
                  <div>
                    <span
                      css={`
                        ${textStyle('body2')}
                        line-height: 1;
                      `}
                    >
                      0
                    </span>{' '}
                    S
                  </div>
                )}
                <span
                  css={`
                    ${textStyle('body4')};
                    color: ${isSynced
                      ? theme.contentSecondary
                      : theme.negative};
                    line-height: 1;
                  `}
                >
                  {isSynced ? 'Court term synced' : 'Term out of sync'}
                </span>
              </>
            ) : (
              <div
                css={`
                  background: ${theme.background};
                  height: 40px;
                  border-radius: 10px;
                `}
              />
            )}
          </div>
        }
        onClick={toggle}
      />

      <HeaderPopover
        animateHeight={false}
        heading="Court cLock"
        height={isSynced ? 250 : 230}
        width={45 * GU}
        onClose={handlePopoverClose}
        opener={buttonRef.current}
        visible={opened}
      >
        <div
          css={`
            padding: ${2 * GU}px;
          `}
        >
          <div
            css={`
              display: flex;
              align-items: center;
              justify-content: space-between;
            `}
          >
            <div
              css={`
                display: flex;
                align-items: center;
              `}
            >
              <img
                alt=""
                width={28}
                height={28}
                src={logoSvg}
                css={`
                  margin-right: ${0.5 * GU}px;
                `}
              />
              <span>Aragon Court</span>
            </div>
            <div
              css={`
                display: flex;
                align-items: center;
              `}
            >
              <span
                css={`
                  margin-right: ${0.5 * GU}px;
                `}
              >
                {shortenAddress(courtConfig?.id)}
              </span>
              <ButtonBase
                disabled={!courtConfig}
                href={blockExplorerUrl('address', courtConfig?.id, {
                  networkType,
                })}
              >
                <IconExternal
                  css={`
                    color: ${theme.contentSecondary};
                  `}
                />
              </ButtonBase>
            </div>
          </div>
          <div
            css={`
              color: ${isSynced ? theme.positive : theme.negative};
              display: flex;
              align-items: center;
              margin-top: ${2 * GU}px;
            `}
          >
            <IconSync />
            <span
              css={`
                ${textStyle('body4')}
                text-transform: uppercase;
              `}
            >
              {isSynced ? 'Term is in sync' : 'Term is out of sync'}
            </span>
          </div>
          <div
            css={`
              margin-top: ${2 * GU}px;
            `}
          >
            <span>
              <span
                css={`
                  color: ${theme.contentSecondary};
                  margin-right: ${0.5 * GU}px;
                `}
              >
                {isSynced ? 'Synced' : 'Out of sync'}:
              </span>
              {isSynced ? 'Current' : 'Last'} term {currentTermId}
            </span>
          </div>
          <div
            css={`
              margin-top: ${2 * GU}px;
            `}
          >
            {isSynced ? (
              <span
                css={`
                  ${textStyle('body3')};
                  color: ${theme.contentSecondary};
                `}
              >
                Term is the time unit for measuring Aragon Court phases. Each
                term lasts {formatDuration(courtConfig.termDuration / 1000)}
              </span>
            ) : (
              <Button
                label="Call Heartbeat"
                mode="strong"
                wide
                disabled={!wallet.account}
                onClick={handleOnClick}
              />
            )}
          </div>
        </div>
      </HeaderPopover>
    </div>
  )
}

export default ClockModule
