import React from 'react'
import { Box, GU, IdentityBadge, textStyle, useTheme } from '@aragon/ui'

import Stepper from '../Stepper'
import Step from '../Step'

import { latestActivity } from '../../mock-data'

function LatestActivity() {
  const theme = useTheme()

  return (
    <Box heading="latest activity" padding={0}>
      <Stepper
        lineColor="rgba(255, 151, 128, 0.2)"
        lineHeight={125}
        lineWidth={2}
        lineTop={12}
        css={`
          padding: ${3 * GU}px 0;
        `}
      >
        {latestActivity.map(activity => (
          <Step
            primary={
              <div
                css={`
                  border-radius: 50%;
                  border: 2px solid rgb(255, 151, 128, 0.2);
                  padding: 8px;
                `}
              >
                <span
                  css={`
                    background: rgb(255, 151, 128);
                    border-radius: 50%;
                    display: block;
                    padding: 5px;
                  `}
                />
              </div>
            }
            secondary={
              <div
                css={`
                  line-height: 2;
                `}
              >
                <IdentityBadge entity={activity.account} badgeOnly />
                <div>
                  {activity.action}{' '}
                  <a href={activity.target.link}>{activity.target.label}</a>
                </div>
                <div
                  css={`
                      ${textStyle('body4')}
                      color: ${theme.contentSecondary}
                    `}
                >
                  {activity.date}
                </div>
              </div>
            }
          />
        ))}
      </Stepper>
    </Box>
  )
}

export default LatestActivity
