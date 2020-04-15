import React, { useRef, useState, useCallback } from 'react'
import {
  ButtonBase,
  ButtonIcon,
  GU,
  IconExternal,
  IconSettings,
  Popover,
  RADIUS,
  textStyle,
  useTheme,
  useViewport,
} from '@aragon/ui'

import iconNetwork from '../../assets/global-preferences-network.svg'

function GlobalPreferencesButton({ onOpen }) {
  const theme = useTheme()
  const { below } = useViewport()

  const [opened, setOpened] = useState(false)
  const containerRef = useRef()

  const handleToggle = useCallback(() => setOpened(opened => !opened), [])
  const handleClose = useCallback(() => setOpened(false), [])
  const handleItemClick = useCallback(
    path => () => {
      setOpened(false)
      onOpen(path)
    },
    [onOpen]
  )

  return (
    <React.Fragment>
      <div ref={containerRef}>
        <ButtonIcon
          element="div"
          onClick={handleToggle}
          css={`
            width: ${4.25 * GU}px;
            height: 100%;
            border-radius: 0;
          `}
          label="Global preferences"
        >
          <IconSettings
            css={`
              color: ${theme.hint};
            `}
          />
        </ButtonIcon>
      </div>
      <Popover
        closeOnOpenerFocus
        placement="bottom-end"
        onClose={handleClose}
        visible={opened}
        opener={containerRef.current}
      >
        <ul
          css={`
            /* Use 20px as the padding setting for popper is 10px */
            width: ${below('medium') ? `calc(100vw - 20px)` : `${42 * GU}px`};
            padding: 0;
            margin: 0;
            list-style: none;
            background: ${theme.surface};
            color: ${theme.content};
            border-radius: ${RADIUS}px;
          `}
        >
          <li
            css={`
              display: flex;
              align-items: center;
              height: ${4 * GU}px;
              padding-left: ${2 * GU}px;
              border-bottom: 1px solid ${theme.border};
              ${textStyle('label2')}
              color: ${theme.surfaceContentSecondary};
            `}
          >
            Global preferences
          </li>
          <Item
            onClick={handleItemClick('network')}
            iconFirst
            icon={iconNetwork}
            label="Network"
          />
          <Item
            iconFirst={false}
            icon="IconExternal"
            label="Any questions? Visit our FAQ"
            href="https://help.aragon.org/article/48-aragon-court-faq"
          />
        </ul>
      </Popover>
    </React.Fragment>
  )
}

function Item({ icon, iconFirst, label, onClick, href }) {
  const theme = useTheme()
  let Icon

  switch (icon) {
    case 'IconExternal':
      Icon = IconExternal
      break
    default:
      Icon = () => <img src={icon} alt="" />
  }

  return (
    <li
      css={`
        & + & {
          border-top: 1px solid ${theme.border};
        }
      `}
    >
      <ButtonBase
        onClick={onClick}
        label={label}
        css={`
          width: 100%;
          height: ${7 * GU}px;
          border-radius: 0;
        `}
        external={Boolean(href)}
        href={href}
      >
        <div
          css={`
            display: flex;
            width: 100%;
            height: 100%;
            padding: ${2 * GU}px;
            justify-content: left;
            align-items: center;

            &:active,
            &:focus {
              background: ${theme.surfacePressed};
            }
          `}
        >
          {iconFirst && <Icon />}
          <div
            css={`
              flex-grow: 1;
              display: flex;
              align-items: center;
              margin-left: ${icon ? 1 * GU : 0}px;
            `}
          >
            {label}
          </div>
          {!iconFirst && (
            <div
              css={`
                color: ${theme.surfaceContentSecondary};
              `}
            >
              <Icon />
            </div>
          )}
        </div>
      </ButtonBase>
    </li>
  )
}

export default React.memo(GlobalPreferencesButton)
