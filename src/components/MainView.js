import React, { useCallback, useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Layout, Root, ScrollView, useViewport } from '@aragon/ui'
import MenuPanel, { MENU_PANEL_WIDTH } from './MenuPanel'
import Header from './Header/Header'
import { getPreferencesSearch } from '../Routes'
import GlobalPreferences from './GlobalPreferences/GlobalPreferences'

const GLOBAL_PREFERENCES_QUERY_PARAM = '?preferences=/'

function MainView({ children }) {
  const history = useHistory()
  const sea = useLocation().search

  function parsePreferences(search = '') {
    const [, path = ''] = search.split(GLOBAL_PREFERENCES_QUERY_PARAM)
    // const params = new Map()

    return { path }
  }

  const pref = parsePreferences(sea)
  const openPreferences = useCallback(
    screen => {
      history.push('/' + getPreferencesSearch(screen))
    },
    [history]
  )
  const { width: vw, below } = useViewport()
  const compactMode = below('medium')

  const [menuPanelOpen, setMenuPanelOpen] = useState(!compactMode)
  const toggleMenuPanel = useCallback(
    () => setMenuPanelOpen(opened => !opened),
    []
  )

  const handleCloseMenuPanel = useCallback(() => setMenuPanelOpen(false), [])

  const handleOpenPage = useCallback(() => {
    if (compactMode) {
      handleCloseMenuPanel()
    }
  }, [compactMode, handleCloseMenuPanel])

  useEffect(() => {
    setMenuPanelOpen(!compactMode)
  }, [compactMode])

  if (pref.path) {
    return (
      <GlobalPreferences
        path={pref.path}
        onScreenChange={() => {}}
        onClose={() => {}}
        compact={false}
      />
    )
  }
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
          compactMode={compactMode}
          toggleMenuPanel={toggleMenuPanel}
          onOpenPreferences={openPreferences}
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
            autoClosing={compactMode}
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
              parentWidth={vw - (compactMode ? 0 : MENU_PANEL_WIDTH)}
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
