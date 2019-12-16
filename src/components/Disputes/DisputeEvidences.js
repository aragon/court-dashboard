import React from 'react'
import { Accordion, GU, IconFolder, useTheme } from '@aragon/ui'

function DisputeEvidences({ evidences }) {
  const theme = useTheme()

  return (
    <React.Fragment>
      {evidences.map((evidence, index) => (
        <Accordion
          key={index}
          items={[
            [
              <div
                css={`
                  display: flex;
                  align-items: center;
                `}
              >
                <IconFolder
                  css={`
                    margin-right: ${1 * GU}px;
                  `}
                  color={theme.surfaceIcon}
                />
                <span>Evidence #{index + 1}</span>
              </div>,
              <div
                css={`
                  padding: ${3 * GU}px ${8 * GU}px;
                `}
              >
                {evidence}
              </div>,
            ],
          ]}
        />
      ))}
    </React.Fragment>
  )
}

export default DisputeEvidences
