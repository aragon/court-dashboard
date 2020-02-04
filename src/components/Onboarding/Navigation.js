import React from 'react'
import PropTypes from 'prop-types'
import { ButtonBase, springs } from '@aragon/ui'
import { useSpring, animated } from 'react-spring/hooks'
import arrowSvg from './assets/arrow.svg'

const buttonTransitionStyles = show => ({
  opacity: Number(show),
  transform: `translate3d(0, ${show ? 0 : 2}px, 0)`,
  config: springs.swift,
})

const Navigation = ({ step, steps, onPrev, onNext }) => {
  const showPrev = step > 0
  const showNext = step < steps - 1

  const prevTransitionStyles = useSpring(buttonTransitionStyles(showPrev))
  const nextTransitionStyles = useSpring(buttonTransitionStyles(showNext))

  return (
    <div
      css={`
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 20px;
        display: flex;
        align-items: center;
      `}
    >
      <div css="flex-shrink: 0">
        <animated.div style={prevTransitionStyles}>
          <NavButton onClick={onPrev} type="prev" />
        </animated.div>
      </div>
      <div
        css={`
          width: 100%;
          text-align: center;
          height: 100%;
        `}
      >
        {step + 1} of {steps}
      </div>
      <div css="flex-shrink: 0">
        <animated.div style={nextTransitionStyles}>
          <NavButton onClick={onNext} type="next" />
        </animated.div>
      </div>
    </div>
  )
}

Navigation.propTypes = {
  step: PropTypes.number.isRequired,
  steps: PropTypes.number.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
}

const NavButton = ({ type, ...props }) => (
  <ButtonBase {...props}>
    <div
      css={`
        display: flex;
        align-items: center;
        justify-content: center;
        height: 53px;
        width: 53px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.03);
        transform: rotate(${type === 'next' ? '0' : '180deg'});
        &:active {
          background: rgba(0, 0, 0, 0.1);
        }
      `}
    >
      <img src={arrowSvg} alt="" />
    </div>
  </ButtonBase>
)

NavButton.propTypes = {
  type: PropTypes.oneOf(['next', 'prev']),
}

export default Navigation
