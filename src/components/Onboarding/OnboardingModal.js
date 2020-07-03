import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal, Viewport, springs } from '@aragon/ui'
import { Transition } from 'react-spring/renderprops'
import { useSteps } from '../../hooks/useOnboarding'
import useKeyboardArrows from '../../hooks/useKeyboardArrows'
import { highlights } from './content'
import Navigation from './Navigation'
import HighlightScreen, { RATIO_LEFT } from './HighlightScreen'
import { getNetworkType } from '../../lib/web3-utils'

const OnboardingModal = React.memo(function OnboardingModal({
  onComplete,
  visible,
}) {
  const content =
    getNetworkType() === 'main' ? highlights.main : highlights.rinkeby

  const steps = content.length
  const { step, next, prev, setStep, direction } = useSteps(steps)

  useKeyboardArrows(visible ? { onLeft: prev, onRight: next } : {})

  useEffect(() => {
    if (visible) {
      setStep(0)
    }
  }, [setStep, visible])

  return (
    <Viewport>
      {({ width, height }) => {
        const verticalMode = width < 900
        const compactMode = width < 500 || height < 400
        return (
          <Modal
            closeButton={false}
            padding={0}
            width={Math.min(1055, width - 40)}
            visible={visible}
            css="z-index: 4"
          >
            <div
              css="position: relative"
              style={{
                height: verticalMode
                  ? `${height - 40}px`
                  : `${Math.max(500, Math.min(620, height - 40))}px`,
              }}
            >
              <div
                css={`
                  position: relative;
                  z-index: 1;
                  width: 100%;
                  height: 100%;
                  overflow: hidden;
                  display: flex;
                `}
              >
                <Transition
                  native
                  items={step}
                  from={{
                    enterProgress: 1 * direction,
                    showProgress: 0,
                  }}
                  initial={{
                    enterProgress: 0,
                    showProgress: 1,
                  }}
                  enter={{
                    enterProgress: 0,
                    showProgress: 1,
                  }}
                  leave={{
                    enterProgress: -1 * direction,
                    showProgress: 0,
                  }}
                  config={springs.smooth}
                >
                  {(index, state) =>
                    /* eslint-disable react/prop-types */
                    ({ enterProgress, showProgress, status }) => (
                      <HighlightScreen
                        compactMode={compactMode}
                        defaultVisualColor={highlights.defaultVisualColor}
                        enterProgress={enterProgress}
                        heading={highlights.heading}
                        onDone={onComplete}
                        showProgress={showProgress}
                        state={state}
                        verticalMode={verticalMode}
                        {...content[index]}
                      />
                    )
                  /* eslint-enable react/prop-types */
                  }
                </Transition>
              </div>
              <div
                css={`
                  position: relative;
                  z-index: 2;
                `}
                style={{
                  width: verticalMode ? '100%' : `${RATIO_LEFT * 100}%`,
                }}
              >
                <Navigation
                  step={step}
                  steps={steps}
                  onPrev={prev}
                  onNext={next}
                />
              </div>
            </div>
          </Modal>
        )
      }}
    </Viewport>
  )
})

OnboardingModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onComplete: PropTypes.func.isRequired,
}

export default OnboardingModal
