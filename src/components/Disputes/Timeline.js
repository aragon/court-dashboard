import React from 'react'
import { GU, textStyle, useTheme } from '@aragon/ui'

import { timeline } from '../../mock-data'
import Stepper from '../Stepper'
import Step from '../Step'

function Timeline() {
  const theme = useTheme()
  const current = 3

  return (
    <div>
      <Stepper
        linePosition={['25%', '47px']}
        lineColor={theme.surfaceIcon}
        css={`
          padding: ${3 * GU}px 0;
        `}
      >
        {timeline.map(({ label, date, Icon }, index) => {
          const active = current === index
          return (
            <Step
              key={index}
              active={active}
              primary={
                <div
                  css={`
                    background: ${active ? '#8FA4B5' : '#ECEFF4'};
                    border-radius: 80%;
                    padding: 10px;
                    z-index: 2;
                    display: inline-flex;
                  `}
                >
                  <Icon color={active ? '#fff' : theme.surfaceIcon} />
                </div>
              }
              secondary={
                <div>
                  <div>
                    <span css={textStyle('body1')}>{label}</span>
                  </div>
                  <div>
                    <span
                      css={`
                        color: ${theme.contentSecondary};
                        opacity: 0.6;
                      `}
                    >
                      {date}
                    </span>
                  </div>
                  {active && (
                    <div>
                      <span
                        css={`
                          ${textStyle('label3')}
                          text-transform: Uppercase;
                          background: rgba(200, 215, 234, 0.4);
                          border-radius: 100px;
                          padding: 5px 10px;
                        `}
                      >
                        current
                      </span>
                    </div>
                  )}
                </div>
              }
            />
          )
        })}
      </Stepper>
    </div>
  )
}

export default Timeline
