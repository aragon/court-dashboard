import React, { useEffect, useState } from 'react'
import { Accordion, GU, IdentityBadge, textStyle, useTheme } from '@aragon/ui'
import { ipfsGet } from '../../lib/ipfs-utils'

import dayjs from '../../lib/dayjs'

import folderIcon from '../../assets/folderIcon.svg'

const DisputeEvidences = React.memo(function DisputeEvidences({ evidences }) {
  const theme = useTheme()
  const [data, setData] = useState()

  useEffect(() => {
    async function fetchData() {
      const result = await ipfsGet(evidences[0].data)
      setData(result.data)
    }
    fetchData()
  }, [evidences])

  console.log('data ', data)
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
                  <img src={folderIcon} width="17" height="20" alt="" />
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
                      {dayjs(createdAt).format('DD/MM/YY')}
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
})

export default DisputeEvidences
