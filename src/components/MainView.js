import React, { useCallback, useState } from 'react'
import { GU, Layout, Root, ScrollView, useViewport } from '@aragon/ui'
import MenuPanel from './MenuPanel'
import Header from './Header'

const NAV_BAR_WIDTH = 25 * GU

function MainView({ children }) {
  const { width: vw, below } = useViewport()
  const autoClosingPanel = below('medium')

  const [menuPanelOpen, setMenuPanelOpen] = useState(!autoClosingPanel)
  const toggleMenuPanel = useCallback(
    () => setMenuPanelOpen(opened => !opened),
    []
  )

  // const handleCloseMenuPanel = useCallback(() => setMenuPanelOpen(false), [])

  // const handleOpenPage = useCallback(() => {
  //   if (autoClosingPanel) {
  //     handleCloseMenuPanel()
  //   }
  // }, [autoClosingPanel, handleCloseMenuPanel])

  // useEffect(() => {
  //   setMenuPanelOpen(!autoClosingPanel)
  // }, [autoClosingPanel])

  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        height: 100vh;
      `}
    >
      <div
        css={`
          flex-shrink: 0;
        `}
      >
        <Header
          autoClosingPanel={autoClosingPanel}
          toggleMenuPanel={toggleMenuPanel}
        />
      </div>
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
          <MenuPanel opened={menuPanelOpen} />
        </div>
        <Root.Provider
          css={`
            flex-grow: 1;
            height: 100%;
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
