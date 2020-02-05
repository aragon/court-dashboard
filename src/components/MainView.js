import React from 'react'
import { GU, Layout, Root, ScrollView, useViewport } from '@aragon/ui'
import NavBar from './NavBar'
import Header from './Header'

const NAV_BAR_WIDTH = 25 * GU

function MainView({ children }) {
  const { width: vw } = useViewport()
  // const theme = useTheme()
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
          position: relative;
          flex-grow: 1;
          flex-shrink: 1;
          height: 0;
          display: flex;
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
        <Root.Provider
          css={`
            flex-grow: 1;
            height: 100%;
<<<<<<< HEAD
            overflow-y: auto;
            padding-bottom: ${4 * GU}px;
=======
>>>>>>> onboarding
          `}
        >
          <ScrollView>
            <Layout parentWidth={vw - NAV_BAR_WIDTH} paddingBottom={0}>
              {children}
            </Layout>
          </ScrollView>
        </Root.Provider>
      </div>
    </div>
  )
}

export default MainView
