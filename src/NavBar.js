import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import menuIcon from './assets/menu.svg'
import { textStyle } from '@aragon/ui'

function NavBar() {
  return (
    <Nav>
      <div
        css={`
          text-decoration: none !important;
          padding: 0 24px;
        `}
      >
        <h2
          css={`
            ${textStyle('label2')}
            color: #abafba;
            margin-bottom: 8px;
          `}
        >
          Menu
        </h2>
        <NavItem>
          <Link to="/dashboard" className="link">
            <NavItemWrapper>
              <img src={menuIcon} />
              Dashboard
            </NavItemWrapper>
          </Link>
        </NavItem>

        <NavItem>
          <Link to="/tasks" className="link">
            <NavItemWrapper>
              <img src={menuIcon} />
              Tasks
            </NavItemWrapper>
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/disputes" className="link">
            <NavItemWrapper>
              <img src={menuIcon} />
              Disputes
            </NavItemWrapper>
          </Link>
        </NavItem>
      </div>
    </Nav>
  )
}

const Nav = styled.nav`
  box-shadow: rgba(0, 0, 0, 0.05) 2px 0px 3px;
  padding: 16px 0;
  background: white;
  margin-top: 2px;
`

const NavItem = styled.div`
  padding: 6px 0;

  & > a {
    text-decoration: none;
  }
`

const NavItemWrapper = styled.div`
  display: flex;
  align-itmes: center;

  & > :first-child {
    margin-right: 8px;
  }
`

export default NavBar
