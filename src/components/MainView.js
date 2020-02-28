import React, { useCallback, useEffect, useState } from 'react'
import { Layout, Root, ScrollView, useViewport } from '@aragon/ui'
import MenuPanel, { MENU_PANEL_WIDTH } from './MenuPanel'
import Header from './Header'

function MainView({ children }) {
  const { width: vw, below } = useViewport()
  const autoClosingPanel = below('medium')

  const [menuPanelOpen, setMenuPanelOpen] = useState(!autoClosingPanel)
  const toggleMenuPanel = useCallback(
    () => setMenuPanelOpen(opened => !opened),
    []
  )

  const handleCloseMenuPanel = useCallback(() => setMenuPanelOpen(false), [])

  const handleOpenPage = useCallback(() => {
    if (autoClosingPanel) {
      handleCloseMenuPanel()
    }
  }, [autoClosingPanel, handleCloseMenuPanel])

  useEffect(() => {
    setMenuPanelOpen(!autoClosingPanel)
  }, [autoClosingPanel])

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
            height: 100%;
          `}
        >
          <MenuPanel
            autoClosing={autoClosingPanel}
            opened={menuPanelOpen}
            onMenuPanelClose={handleCloseMenuPanel}
            onOpenPage={handleOpenPage}
          />
        </div>
        <Root.Provider
          css={`
            flex-grow: 1;
            height: 100%;
            position: relative;
          `}
        >
          <ScrollView>
            <Layout
              parentWidth={vw - (autoClosingPanel ? 0 : MENU_PANEL_WIDTH)}
              paddingBottom={0}
            >
              {children}
            </Layout>
          </ScrollView>
        </Root.Provider>
      </div>
    </div>
  )
}

export default MainView
