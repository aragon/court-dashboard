import React from 'react'
import { GU, Layout, useViewport } from '@aragon/ui'
import NavBar from './NavBar'
import Header from './Header'

const NAV_BAR_WIDTH = 25 * GU

function MainView({ children }) {
  const { width: vw } = useViewport()
  return (
    <>
      <Header />
      <div
        css={`
          display: flex;
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
    </>
  )
}

export default MainView
