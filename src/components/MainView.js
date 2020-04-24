import React, { useCallback, useEffect, useState } from 'react'
import {
  GU,
  Layout,
  Link,
  Root,
  ScrollView,
  textStyle,
  useTheme,
  useViewport,
} from '@aragon/ui'
import usePreferences from '../hooks/usePreferences'
import MenuPanel, { MENU_PANEL_WIDTH } from './MenuPanel'
import Header from './Header/Header'
import GlobalPreferences from './GlobalPreferences/GlobalPreferences'

function MainView({ children }) {
  const { width: vw, below } = useViewport()
  const theme = useTheme()
  const compactMode = below('medium')
  const [menuPanelOpen, setMenuPanelOpen] = useState(!compactMode)

  const [openPreferences, closePreferences, preferenceOption] = usePreferences()

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

  if (preferenceOption) {
    return (
      <GlobalPreferences
        path={preferenceOption}
        onScreenChange={openPreferences}
        onClose={closePreferences}
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
            <div
              css={`
                display: flex;
                flex-direction: column;
                height: 100%;
              `}
            >
              <div
                css={`
                  flex: 1 0 auto;
                `}
              >
                <Layout
                  parentWidth={vw - (compactMode ? 0 : MENU_PANEL_WIDTH)}
                  paddingBottom={0}
                >
                  {children}
                </Layout>
              </div>
              <footer
                css={`
                  flex-shrink: 0;
                  margin-bottom: ${5 * GU}px;
                  width: 100%;
                  text-align: center;
                  ${textStyle('body2')};
                  color: ${theme.surfaceContentSecondary};
                `}
              >
                Supporting services provided by{' '}
                <Link href="https://aragon.one">Aragon One</Link>. Read Aragon
                Court's{' '}
                <Link href="https://anj.aragon.org/legal/terms-general.pdf">
                  Terms of Service
                </Link>
                .
              </footer>
            </div>
          </ScrollView>
        </Root.Provider>
      </div>
    </div>
  )
}

export default MainView
