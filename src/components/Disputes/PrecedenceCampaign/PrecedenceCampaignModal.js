import React from 'react'
import { Button, GU, Modal, textStyle, useTheme, useViewport } from '@aragon/ui'

import pcModalSvg from './assets/PCModal.svg'

function PrecedenceCampaignModal({ opened, onClose }) {
  const theme = useTheme()
  const { below, height, width } = useViewport()

  const verticalMode = width < 125 * GU
  const compactMode = below('medium')

  const spacing = 5 * GU
  const modalWidth = Math.min(130 * GU, width - spacing)
  const modalHeight = verticalMode
    ? height - spacing
    : Math.max(90 * GU, Math.min(80 * GU, height - spacing))

  return (
    <div>
      <Modal
        closeButton={false}
        padding={0}
        visible={opened}
        width={modalWidth}
        css="z-index: 4"
      >
        <div
          css={`
            display: grid;
            grid-template-${
              verticalMode ? 'rows :  1fr 2fr' : 'columns : 1fr 1fr'
            };
            height: ${modalHeight}px;
          `}
        >
          {verticalMode ? (
            <div
              css={`
                position: relative;
              `}
            >
              <div
                css={`
                  background: url(${pcModalSvg}) 50% 50% / cover no-repeat;
                  position: absolute;
                  top: 0;
                  bottom: 0;
                  left: 0;
                  right: 0;
                `}
              />
            </div>
          ) : (
            <div
              css={`
                display: flex;
                align-items: flex-end;
                height: 100%;
              `}
            >
              <img src={pcModalSvg} height={modalHeight * 0.85} />
            </div>
          )}
          <div
            css={`
              display: flex;
              align-items: center;
              height: 100%;
            `}
          >
            <div
              css={`
                text-align: ${verticalMode ? 'center' : 'left'};
                padding: 0px ${(compactMode ? 3 : 7) * GU}px;
              `}
            >
              <p
                css={`
                  ${textStyle('body2')};
                  color: ${theme.contentSecondary};
                  text-transform: uppercase;
                `}
              >
                Aragon court
              </p>
              <h1
                css={`
                  font-size: ${compactMode ? 24 : 40}px;
                  margin: ${1.5 * GU}px 0;
                `}
              >
                Precedence Campaign Disclaimer
              </h1>
              <span
                css={`
                  ${textStyle(compactMode ? 'body3' : 'body1')}
                  line-height: 2;
                  display: block;
                `}
              >
                All information, arguments, and evidence presented in disputes
                related to the precedence campaign portray scenarios constructed
                by Aragon One and do not reflect the views, opinions, or
                associations of any person or entity.
              </span>
              <Button
                mode="strong"
                label="Ok, I understand"
                onClick={onClose}
                css={`
                  margin-top: ${2 * GU}px;
                `}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PrecedenceCampaignModal
