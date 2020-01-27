import React from 'react'
import { GU, Layout, useViewport, Main, useTheme } from '@aragon/ui'
import NavBar from './NavBar'
import Header from './Header'

const NAV_BAR_WIDTH = 25 * GU

function MainView({ children }) {
  const { width: vw } = useViewport()
  const theme = useTheme()
  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        height: 100vh;
      `}
    >
      <Header />
      <div
        css={`
          flex-grow: 1;
          flex-shrink: 1;
          height: 0;
          display: flex;
          height: 100%;
        `}
      >
        <div
          css={`
            flex-shrink: 0;
            z-index: 3;
            width: ${NAV_BAR_WIDTH}px;
          `}
        >
          <NavBar />
        </div>
        <div
          css={`
            flex-grow: 1;
            position: relative;
            z-index: 0;
            width: 100%;
            height: 100%;
            overflow-y: auto;
          `}
        >
          <Main assetsUrl="/aragon-ui/" layout={false} theme={theme}>
            <Layout parentWidth={vw - NAV_BAR_WIDTH}>{children}</Layout>
          </Main>
        </div>
      </div>
    </div>
  )
}

export default MainView
