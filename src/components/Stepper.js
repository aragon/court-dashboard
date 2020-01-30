import React from 'react'

import { GU } from '@aragon/ui'

function Stepper({
  lineColor,
  lineExtraHeight,
  lineTop,
  lineWidth,
  children,
  ...props
}) {
  const stepVerticalPadding = 1.5 * GU
  return (
    <div
      css={`
        & > * {
          display: flex;
          align-items: stretch;

          padding: ${stepVerticalPadding}px 0;
          &:first-child {
            padding-top: 0;
          }
        }
        & > :not(:last-child) > div > :first-child ::after {
          background: ${lineColor};
          content: '';
          height: calc(100% + ${stepVerticalPadding}px + ${lineExtraHeight}px);
          width: ${lineWidth}px;
          position: absolute;
          top: ${lineTop}px;
          left: calc(50% - (${lineWidth}px / 2));
          z-index: -1;
        }
      `}
      {...props}
    >
      {children}
    </div>
  )
}

Stepper.defaultProps = {
  lineColor: '#000',
  lineExtraHeight: 0, // px
  lineTop: 0, // px
  lineWidth: 1, // px
}

export default Stepper
