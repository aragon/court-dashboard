import React from 'react'
import { ButtonBase, GU, IconDown, useTheme, useViewport } from '@aragon/ui'
function HeaderModule({ icon, content, onClick }) {
  const { above } = useViewport()
  const theme = useTheme()

  return (
    <ButtonBase
      onClick={onClick}
      css={`
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 ${1 * GU}px;
        &:active {
          background: ${theme.surfacePressed};
        }
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          text-align: left;
          padding: 0 ${1 * GU}px 0 ${2 * GU}px;
        `}
      >
        <>
          {icon}
          {above('medium') && (
            <React.Fragment>
              <div
                css={`
                  padding-left: ${1 * GU}px;
                  padding-right: ${0.5 * GU}px;
                `}
              >
                {content}
              </div>
              <IconDown
                size="small"
                css={`
                  color: ${theme.surfaceIcon};
                `}
              />
            </React.Fragment>
          )}
        </>
      </div>
    </ButtonBase>
  )
}

export default HeaderModule
