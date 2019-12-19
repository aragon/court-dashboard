import React from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { ButtonBase, GU, useTheme, textStyle } from '@aragon/ui'

import menuIcon from './assets/menu.svg'
import dashboardMenuIcon from './assets/dashboardMenuIcon.svg'
import tasksMenuIcon from './assets/tasksMenuIcon.svg'

function NavBar() {
  const theme = useTheme()
  return (
    <nav
      css={`
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        padding: ${2 * GU}px 0;
        background: ${theme.surface};
        margin-top: 2px;
        box-shadow: rgba(0, 0, 0, 0.05) 2px 0px 3px;
      `}
    >
      <h2
        css={`
          color: ${theme.surfaceContentSecondary};
          margin-bottom: ${1 * GU}px;
          padding: 0 ${3 * GU}px;
          ${textStyle('label2')};
        `}
      >
        Menu
      </h2>

      <NavItem to="/dashboard" icon={dashboardMenuIcon} label="Dashboard" />
      <NavItem to="/tasks" icon={tasksMenuIcon} label="Tasks" />
      <NavItem to="/disputes" icon={menuIcon} label="Disputes" />
    </nav>
  )
}

function NavItem({ to, icon, label }) {
  const history = useHistory()
  const theme = useTheme()
  const active = useRouteMatch(to) !== null

  return (
    <ButtonBase
      onClick={() => history.push(to)}
      css={`
        display: flex;
        align-items: center;
        width: 100%;
        height: ${5 * GU}px;
        padding: 0 ${2 * GU}px 0 ${3 * GU}px;
        border-radius: 0;
        text-align: left;
        background: ${active ? theme.surfacePressed : 'transparent'};
        &:active {
          background: ${theme.surfacePressed};
        }
      `}
    >
      <div
        css={`
          position: absolute;
          left: 0;
          width: 3px;
          height: 100%;
          background: ${theme.accent};
          opacity: ${Number(active)};
          transform: translate3d(${active ? '0%' : '-100%'}, 0, 0);
          transform-position: 0 0;
          transition-property: transform, opacity;
          transition-duration: 150ms;
          transition-timing-function: ease-in-out;
        `}
      />

      <img src={icon} alt="" />
      <span
        css={`
          margin-left: ${1 * GU}px;
          overflow: hidden;
          text-overflow: ellipsis;
          ${textStyle('body2')};
          font-weight: ${active ? '600' : '400'};
        `}
      >
        {label}
      </span>
    </ButtonBase>
  )
}

export default NavBar
