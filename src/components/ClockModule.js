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
import { useCourtClock } from '../providers/CourtClock'
import { useCourtConfig } from '../providers/CourtConfig'
import { useHeartbeat } from '../hooks/useCourtContracts'

import { formatDuration } from '../utils/date-utils'
import {
  getNetworkType,
  isLocalOrUnknownNetwork,
  shortenAddress,
} from '../lib/web3-utils'

import logoSvg from '../assets/LogoAccent.svg'

function ClockModule() {
  const buttonRef = useRef()
  const [opened, setOpened] = useState(false)

  const theme = useTheme()
  const wallet = useWallet()
  const { heartbeat: onHeartbeat } = useHeartbeat()
  const courtConfig = useCourtConfig()

  const {
    currentTermId,
    currentTermEndDate,
    isSynced,
    neededTransitions,
  } = useCourtClock()

  const toggle = useCallback(() => setOpened(opened => !opened), [])

  const handlePopoverClose = useCallback(() => {
    setOpened(false)
  }, [])

  const handleOnClick = useCallback(() => {
    handlePopoverClose()

    onHeartbeat(neededTransitions)
  }, [handlePopoverClose, neededTransitions, onHeartbeat])

  const IconSync = isSynced ? IconCheck : IconCross

  return (
    <div
      ref={buttonRef}
      tabIndex="0"
      css={`
        display: flex;
        align-items: center;
        justify-content: space-around;
        outline: 0;
      `}
    >
      <HeaderModule
        icon={
          <div
            css={`
              background-color: ${theme.background};
              display: flex;
              border-radius: 50%;
              padding: 2px;
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
              width: ${15 * GU}px;

              & span {
                line-height: 1;
              }
            `}
          >
            {currentTermId ? (
              <>
                {isSynced ? (
                  <Timer end={currentTermEndDate} showIcon={false} />
                ) : (
                  <div>
                    <span
                      css={`
                        ${textStyle('body2')}
                      `}
                    >
                      00
                    </span>{' '}
                    <span
                      css={`
                        ${textStyle('body2')}
                        color: ${theme.contentSecondary};
                      `}
                    >
                      S
                    </span>
                  </div>
                )}
                <span
                  css={`
                    ${textStyle('body4')};
                    color: ${isSynced
                      ? theme.contentSecondary
                      : theme.negative};
                  `}
                >
                  {`Term ${isSynced ? 'is up-to-date' : 'needs updating'}`}
                </span>
              </>
            ) : (
              <div
                css={`
                  background: ${theme.background};
                  height: ${5 * GU}px;
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
        heading="Court clock"
        height={(isSynced ? 27.5 : 26) * GU}
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
                  networkType: isLocalOrUnknownNetwork()
                    ? 'private'
                    : getNetworkType(),
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
              margin-top: ${1 * GU}px;
            `}
          >
            <IconSync />
            <span
              css={`
                ${textStyle('body4')}
                text-transform: uppercase;
              `}
            >
              {`Term ${isSynced ? 'is up-to-date' : 'needs updating'}`}
            </span>
          </div>
          <div
            css={`
              margin-top: ${1 * GU}px;
            `}
          >
            <span>
              <span
                css={`
                  color: ${theme.contentSecondary};
                  margin-right: ${0.5 * GU}px;
                `}
              >
                {isSynced ? 'Up to date' : 'Needs updating'}:
              </span>
              <span>
                {isSynced
                  ? `Current term ${currentTermId}`
                  : `Last term ${currentTermId - neededTransitions}`}
              </span>
            </span>
          </div>
          <div
            css={`
              margin-top: ${1.5 * GU}px;
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
                term lasts {formatDuration(courtConfig.termDuration / 1000)}.
              </span>
            ) : (
              <Button
                label="Update term"
                mode="strong"
                wide
                disabled={!courtConfig || !wallet.account}
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
