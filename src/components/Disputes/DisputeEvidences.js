import React from 'react'
import { Accordion, GU } from '@aragon/ui'
import FolderIcon from '../../assets/folderIcon.svg'

function DisputeEvidences({ evidences }) {
  // const theme = useTheme()
  return (
    <React.Fragment>
      {evidences.map((evidence, index) => {
        const { createdAt, submitter, data } = evidence
        console.log('createdAt ', createdAt)
        console.log('submitter ', submitter)
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
                    padding: ${3 * GU}px ${8 * GU}px;
                  `}
                >
                  {data}
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
