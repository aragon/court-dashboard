import React from 'react'

import { timeline } from '../../mock-data'
import Stepper from '../Stepper'
import Step from '../Step'

function Timeline() {
  const current = 0
  return (
    <div>
      <Stepper steps={timeline} color="#ECEFF4">
        {timeline.map(({ label, date, icon }, index) => (
          <Step key={index}>
            <div
              css={`
                background: ${props => (props.active ? '#8FA4B5' : '#ECEFF4')};
                border-radius: 80%;
                padding: 9px;
                height: 24px;
                margin-right: 20px;
                box-sizing: content-box;
                z-index: 2;
              `}
            >
              <img width="12" src={icon} />
            </div>
            <div>
              <span>{label}</span>
              <span>{date}</span>
              {current === index && <span>current</span>}
            </div>
          </Step>
        ))}
      </Stepper>
    </div>
  )
}

export default Timeline
