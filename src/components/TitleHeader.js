import React from 'react'
import { Button, GU, Header, useLayout } from '@aragon/ui'

function TitleHeader({ title, onlyTitle = false }) {
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  return (
    <Header
      primary={title}
      secondary={
        !onlyTitle && (
          <div
            css={`
              display: flex;
              align-items: center;
            `}
          >
            {!compactMode && (
              <Button
                label="User guide"
                href="https://help.aragon.org/article/41-aragon-court"
                css={`
                  margin-right: ${1.5 * GU}px;
                  width: 150px;
                `}
              />
            )}
          </div>
        )
      }
    />
  )
}

export default TitleHeader
