import React from 'react'
import { GU, Layout, useViewport } from '@aragon/ui'
import NavBar from './NavBar'
import Header from './Header'

const NAV_BAR_WIDTH = 25 * GU

function MainView({ children }) {
  const { width: vw } = useViewport()
  return (
    <div
      css={`
        height: 100vh;
      `}
    >
      <Header />
      <div
        css={`
          display: flex;
          height: 100%;
        `}
      >
        <div
          css={`
            flex-shrink: 0;
            width: ${NAV_BAR_WIDTH}px;
          `}
        >
          <NavBar />
        </div>
        <div
          css={`
            flex-grow: 1;
            overflow: auto;
          `}
        >
          <div
            css={`
              padding-bottom: ${6 * GU}px;
            `}
          >
            <Layout parentWidth={vw - NAV_BAR_WIDTH}>{children}</Layout>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainView
