import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring/renderprops'
import { GU, useTheme } from '@aragon/ui'

const STROKE_WIDTH = 4

const VALUE_DEFAULT = 1
const SIZE_DEFAULT = 80
const LABEL_DEFAULT = value => `${Math.round(value * 100)}`

const { span: AnimatedSpan, circle: AnimatedCircle } = animated

function CircleGraph({ value, comparisonOperator, label, size, strokeWidth }) {
  const theme = useTheme()
  const length = Math.PI * 2 * (size - strokeWidth)
  const radius = (size - strokeWidth) / 2
  return (
    <Spring to={{ progressValue: value }} native>
      {({ progressValue }) => (
        <Main
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: `${size}px`,
            height: `${size}px`,
          }}
        >
          <CircleSvg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
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
          </CircleSvg>
          <div
            css={`
              display: flex;
              align-items: baseline;
              margin-left: ${comparisonOperator ? `0px ` : `${0.5 * GU}px`};
            `}
          >
            {comparisonOperator && <div>{comparisonOperator}</div>}
            <AnimatedSpan
              css={`
                font-size: 20px;
              `}
            >
              {progressValue.interpolate(t =>
                label(Math.min(1, Math.max(0, t)))
              )}
            </AnimatedSpan>
            <div
              css={`
                display: flex;
                font-size: 12px;
                color: ${theme.surfaceContentSecondary};
              `}
            >
              %
            </div>
          </div>
        </Main>
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

const Main = styled.div`
  position: relative;
`

const CircleSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
`

export default CircleGraph
