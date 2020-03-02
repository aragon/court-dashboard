import React from 'react'
import { Button, GU, Header, useLayout } from '@aragon/ui'

import ANJIcon from '../assets/IconANJButton.svg'

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
            <Button
              icon={
                <div
                  css={`
                    display: flex;
                    height: ${GU * 3}px;
                    width: ${GU * 3}px;
                    margin-right: ${compactMode ? 0 : -6}px;
                  `}
                >
                  <img
                    src={ANJIcon}
                    css={`
                      margin: auto;
                      width: 14px;
                      height: 16px;
                    `}
                  />
                </div>
              }
              label="Buy ANJ"
              mode="strong"
              display={compactMode ? 'icon' : 'all'}
              href="https://anj.aragon.org/"
              target="_blank"
            />
          </div>
        )
      }
    />
  )
}

export default TitleHeader
