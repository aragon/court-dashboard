import React from 'react'
import { Button, GU, Header } from '@aragon/ui'

import ANJIcon from '../assets/IconANJButton.svg'

function TitleHeader({ title, onlyTitle = false }) {
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
            <Button
              label="User guide"
              href="https://help.aragon.org/article/41-aragon-court"
              css={`
                margin-right: ${1.5 * GU}px;
                width: 150px;
              `}
            />
            <Button
              icon={
                <div
                  css={`
                    display: flex;
                    height: ${GU * 3}px;
                    width: ${GU * 3}px;
                    margin-right: -6px;
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
              display="all"
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
