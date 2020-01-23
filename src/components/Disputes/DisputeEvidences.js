import React from 'react'
import { Accordion, GU, IdentityBadge, textStyle, useTheme } from '@aragon/ui'
import FolderIcon from '../../assets/folderIcon.svg'
import { dateFormat } from '../../utils/date-utils'

function DisputeEvidences({ evidences }) {
  const theme = useTheme()
  return (
    <React.Fragment>
      {evidences.map((evidence, index) => {
        const { createdAt, submitter, data } = evidence
        return (
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
                  <img src={FolderIcon} width={17} height={20} />
                  <span
                    css={`
                      margin-left: ${GU * 1.5}px;
                    `}
                  >
                    Evidence #{index + 1}
                  </span>
                </div>,
                <div
                  css={`
                    display: grid;
                    grid-template-columns: minmax(250px, auto) minmax(
                        250px,
                        auto
                      );
                    grid-gap: ${5 * GU}px;
                    margin-bottom: ${2 * GU}px;
                    padding: ${3 * GU}px ${8 * GU}px;
                  `}
                >
                  <div>
                    <h2
                      css={`
                        ${textStyle('label2')};
                        color: ${theme.surfaceContentSecondary};
                        margin-bottom: ${2 * GU}px;
                      `}
                    >
                      Submitted by
                    </h2>
                    <div
                      css={`
                        display: flex;
                        align-items: flex-start;
                      `}
                    >
                      <IdentityBadge
                        // connectedAccount={addressesEqual(creator, connectedAccount)} TODO- ADD connnected account
                        entity={submitter}
                      />
                    </div>
                  </div>
                  <div>
                    <h2
                      css={`
                        ${textStyle('label2')};
                        color: ${theme.surfaceContentSecondary};
                        margin-bottom: ${2 * GU}px;
                      `}
                    >
                      Date
                    </h2>
                    <span
                      css={`
                        ${textStyle('body2')};
                      `}
                    >
                      {dateFormat(createdAt, 'DD/MM/YY')}
                    </span>
                  </div>
                  <div>
                    <h2
                      css={`
                        ${textStyle('label2')};
                        color: ${theme.surfaceContentSecondary};
                        margin-bottom: ${2 * GU}px;
                      `}
                    >
                      Data
                    </h2>
                    <div
                      css={`
                        display: flex;
                        align-items: flex-start;
                      `}
                    >
                      {data}
                    </div>
                  </div>
                </div>,
              ],
            ]}
          />
        )
      })}
    </React.Fragment>
  )
}

export default DisputeEvidences
