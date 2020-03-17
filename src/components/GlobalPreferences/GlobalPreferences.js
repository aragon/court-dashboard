import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Bar,
  ButtonIcon,
  GU,
  Header,
  IconClose,
  Layout,
  Tabs,
  breakpoint,
  springs,
  textStyle,
  useTheme,
  useViewport,
} from '@aragon/ui'
import { Transition, animated } from 'react-spring/renderprops'
import { useEsc } from '../../hooks/useKeyboardArrows'
import Network from './Network/Network'

const SECTIONS = new Map([['network', 'Network']])
const PATHS = Array.from(SECTIONS.keys())
const VALUES = Array.from(SECTIONS.values())

const NETWORK_INDEX = 0

const AnimatedDiv = animated.div

function GlobalPreferences({ compact, onClose, onNavigation, sectionIndex }) {
  const theme = useTheme()

  useEsc(onClose)

  const tabItems = VALUES.filter((_, index) => index === NETWORK_INDEX)

  const container = useRef()
  useEffect(() => {
    if (container.current) {
      container.current.focus()
    }
  }, [])

  return (
    <div ref={container} tabIndex="0" css="outline: 0">
      <Layout css="z-index: 2">
        <Close compact={compact} onClick={onClose} />
        <Header
          primary="Global preferences"
          css={`
            padding-top: ${!compact ? 10 * GU : 0}px;
          `}
        />
        <React.Fragment>
          {tabItems.length > 1 ? (
            <Tabs
              items={tabItems}
              onChange={onNavigation}
              selected={sectionIndex}
            />
          ) : (
            <Bar>
              <div
                css={`
                  display: flex;
                  height: 100%;
                  align-items: center;
                  padding-left: ${compact ? 2 * GU : 3 * GU}px;
                  color: ${compact
                    ? theme.surfaceContent
                    : theme.surfaceContentSecondary};
                  ${textStyle('body2')}
                `}
              >
                {tabItems[0]}
              </div>
            </Bar>
          )}
          <main>{sectionIndex === NETWORK_INDEX && <Network />}</main>
        </React.Fragment>
      </Layout>
    </div>
  )
}

GlobalPreferences.propTypes = {
  compact: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onNavigation: PropTypes.func.isRequired,
  sectionIndex: PropTypes.number,
}

function useGlobalPreferences({ path = {}, onScreenChange }) {
  const [sectionIndex, setSectionIndex] = useState(null)
  const [subsection, setSubsection] = useState(null)
  const handleNavigation = useCallback(
    index => {
      onScreenChange(PATHS[index])
    },
    [onScreenChange]
  )

  useEffect(() => {
    if (!path) {
      setSectionIndex(null)
      return
    }
    const index = PATHS.findIndex(item => path.startsWith(item))

    if (index !== NETWORK_INDEX) {
      return
    }
    setSectionIndex(index === -1 ? null : index)

    // subsection is the part after the PATH, e.g. for `?p=/notifications/verify` - `/verify`
    const subsection = index !== -1 ? path.substring(PATHS[index].length) : null

    setSubsection(subsection)
    // Does the current path start with any of the declared route paths
  }, [path, sectionIndex])

  return { sectionIndex, subsection, handleNavigation }
}

function Close({ compact, onClick }) {
  const theme = useTheme()
  return (
    <div
      css={`
        position: absolute;
        right: 0;
        padding-top: ${2.5 * GU}px;
        padding-right: ${3 * GU}px;

        ${compact &&
          `
            padding-top: ${2 * GU}px;
            padding-right: ${1.5 * GU}px;
          `}
      `}
    >
      <ButtonIcon onClick={onClick} label="Close">
        <IconClose
          css={`
            color: ${theme.surfaceIcon};
          `}
        />
      </ButtonIcon>
    </div>
  )
}

Close.propTypes = {
  compact: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
}

function AnimatedGlobalPreferences(props) {
  const { sectionIndex, handleNavigation } = useGlobalPreferences({
    path: props.path,
    onScreenChange: props.onScreenChange,
  })

  const { below } = useViewport()
  const compact = below('medium')
  const theme = useTheme()

  return (
    <Transition
      native
      items={sectionIndex !== null}
      from={{ opacity: 0, enterProgress: 0, blocking: false }}
      enter={{ opacity: 1, enterProgress: 1, blocking: true }}
      leave={{ opacity: 0, enterProgress: 1, blocking: false }}
      config={springs.smooth}
    >
      {show =>
        show &&
        /* eslint-disable react/prop-types */
        // z-index 2 on mobile keeps the menu above this preferences modal
        (({ opacity, enterProgress, blocking }) => (
          <AnimatedDiv
            style={{
              zIndex: 1,
              pointerEvents: blocking ? 'auto' : 'none',
              opacity,
              transform: enterProgress.interpolate(
                v => `
                  translate3d(0, ${(1 - v) * 10}px, 0)
                  scale3d(${1 - (1 - v) * 0.03}, ${1 - (1 - v) * 0.03}, 1)
                `
              ),
            }}
            css={`
              position: fixed;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              overflow: auto;
              min-width: 360px;
              padding-bottom: ${2 * GU}px;
              border-top: 2px solid ${theme.accent};
              background: ${theme.surface};
              ${breakpoint('medium', `padding-bottom:0;`)}
            `}
          >
            <GlobalPreferences
              {...props}
              compact={compact}
              sectionIndex={sectionIndex}
              onNavigation={handleNavigation}
            />
          </AnimatedDiv>
        ))
      /* eslint-enable react/prop-types */
      }
    </Transition>
  )
}

AnimatedGlobalPreferences.propTypes = {
  onScreenChange: PropTypes.func.isRequired,
}

export default React.memo(AnimatedGlobalPreferences)
