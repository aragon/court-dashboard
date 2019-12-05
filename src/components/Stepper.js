import React from 'react'

function Stepper({
  lineColor,
  lineHeight,
  lineTop,
  lineWidth,
  children,
  ...props
}) {
  return (
    <div
      css={`
        & > :not(:last-child) > :first-child ::after {
          background: ${lineColor};
          content: '';
          height: ${lineHeight}%;
          width: ${lineWidth}px;
          position: absolute;
          top: ${lineTop}px;
          left: calc(50% - (${lineWidth}px / 2));
          z-index: 1;
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
  lineHeight: 100, // %
  lineTop: 0, // px
  lineWidth: 1, // px
}

export default Stepper
