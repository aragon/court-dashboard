import React from 'react'

function Stepper({ linePosition, lineColor, children, ...props }) {
  return (
    <div
      css={`
        & > :not(:last-child)::after {
          position: absolute;
          content: '';
          width: 1px;
          height: 100%;
          top: ${linePosition[0]};
          left: ${linePosition[1]};
          background: ${lineColor};
          z-index: 1;
        }
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export default Stepper
