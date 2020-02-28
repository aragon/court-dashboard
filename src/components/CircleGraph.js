import React from 'react'
import PropTypes from 'prop-types'
import { Spring, animated } from 'react-spring/renderprops'
import { GU, useTheme } from '@aragon/ui'

const STROKE_WIDTH = 4

const SIZE_DEFAULT = 80
const VALUE_DEFAULT = 1
const LABEL_DEFAULT = value => {
  if (value === 0) {
    return { value: '0', suffix: '%' }
  }
  if (Math.round(value * 100) < 1) {
    return { prefix: '<', value: '1', suffix: '%' }
  }
  return {
    value: String(Math.round(value * 100)),
    suffix: '%',
  }
}

const { span: AnimatedSpan, circle: AnimatedCircle } = animated

function CircleGraph({ value, label, size, strokeWidth }) {
  const theme = useTheme()
  const length = Math.PI * 2 * (size - strokeWidth)
  const radius = (size - strokeWidth) / 2
  const { prefix, suffix } = label(value)
  return (
    <Spring to={{ progressValue: value }} native>
      {({ progressValue }) => (
        <div
          css={`
            position: relative;
            display: flex;
            align-items: center;
            justify-content center;
            width: ${size}px;
            height: ${size}px;
          `}
        >
          <svg
            css={`
              position: absolute;
              top: 0;
              left: 0;
            `}
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              style={{ strokeWidth }}
              fill="none"
              stroke={theme.border}
            />
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={theme.accent}
              strokeLinecap="round"
              strokeDasharray={length}
              strokeWidth={strokeWidth}
              style={{
                strokeDashoffset: progressValue.interpolate(
                  t => length - (length * t) / 2
                ),
              }}
              css={`
                transform: rotate(270deg);
                transform-origin: 50% 50%;
              `}
            />
          </svg>
          <div
            css={`
              display: flex;
              align-items: baseline;
              margin-left: ${prefix ? `0px ` : `${0.5 * GU}px`};
            `}
          >
            {prefix && <div>{prefix}</div>}
            <AnimatedSpan
              css={`
                font-size: 18px;
              `}
            >
              {progressValue.interpolate(t => {
                const { value: stringValue } = label(
                  Math.min(1, Math.max(0, t))
                )
                return stringValue
              })}
            </AnimatedSpan>
            <div
              css={`
                display: flex;
                font-size: 12px;
                color: ${theme.surfaceContentSecondary};
              `}
            >
              {suffix}
            </div>
          </div>
        </div>
      )}
    </Spring>
  )
}

CircleGraph.propTypes = {
  value: PropTypes.number,
  size: PropTypes.number,
  label: PropTypes.func,
  strokeWidth: PropTypes.number,
}

CircleGraph.defaultProps = {
  value: VALUE_DEFAULT,
  size: SIZE_DEFAULT,
  label: LABEL_DEFAULT,
  strokeWidth: STROKE_WIDTH,
}

export default CircleGraph
