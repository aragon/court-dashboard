import React, { useCallback, useState } from 'react'
import { Button, GU, Header, Tabs, Tag } from '@aragon/ui'
import { useHistory } from 'react-router-dom'
import DisputeList from './DisputeList'
import useDisputes from '../../hooks/useDisputes'
import useJurorDraftQuery from '../../hooks/useJurorDraftQuery'

import ANJIcon from '../../assets/anjButton.svg'

function Disputes() {
  const [screenIndex, setScreenIndex] = useState(0)
  const [disputes] = useDisputes()
  const connectedAccount = '0xe11ba2b4d45eaed5996cd0823791e0c93114882d'
  const jurorDisputes = useJurorDraftQuery(connectedAccount)
  const history = useHistory()

  const handleSelectDispute = useCallback(
    id => {
      history.push(`/disputes/${id}`)
    },
    [history]
  )

  const handleTabChange = screenIndex => {
    setScreenIndex(screenIndex)
  }

  return (
    <>
      <Header
        primary="Disputes"
        secondary={
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
            display="all"
            mode="strong"
          />
        }
      />
      <div>
        <Tabs
          css={`
            margin-bottom: 0px;
          `}
          items={[
            <div>
              <span>All disputes </span>
              <Tag limitDigits={4} label={disputes.length} size="small" />
            </div>,
            <div>
              <span>My disputes </span>
              <Tag limitDigits={4} label={jurorDisputes.length} size="small" />
            </div>,
          ]}
          selected={screenIndex}
          onChange={handleTabChange}
        />
      </div>
      <div
        css={`
          margin-top: -${GU * 1}px;
          width: 100%;
        `}
      >
        <DisputeList
          disputes={screenIndex === 0 ? disputes : jurorDisputes}
          onSelectDispute={handleSelectDispute}
        />
      </div>
    </>
  )
}

export default Disputes
