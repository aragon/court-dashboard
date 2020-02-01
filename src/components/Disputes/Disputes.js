import React, { useCallback, useState } from 'react'
import { Button, GU, Header, Tabs, Tag } from '@aragon/ui'
import { useHistory } from 'react-router-dom'

import DisputeList from './DisputeList'
import useDisputes from '../../hooks/useDisputes'
import { useJurorDraftQuery } from '../../hooks/query-hooks'
import { useConnectedAccount } from '../../providers/Web3'

import ANJIcon from '../../assets/anjButton.svg'

function Disputes() {
  const [screenIndex, setScreenIndex] = useState(0)
  const { disputes, fetching: disputesFetching } = useDisputes()
  const connectedAccount = useConnectedAccount()
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
          items={[
            <div>
              <span>All disputes </span>
              <Tag
                limitDigits={4}
                label={disputes ? disputes.length : 0}
                size="small"
              />
            </div>,
            <div>
              <span>My disputes </span>
              <Tag
                limitDigits={4}
                label={jurorDisputes ? jurorDisputes.length : 0}
                size="small"
              />
            </div>,
          ]}
          selected={screenIndex}
          onChange={handleTabChange}
        />
      </div>
      <div
        css={`
          width: 100%;
          margin-top: -${2 * GU}px;
        `}
      >
        <DisputeList
          disputes={screenIndex === 0 ? disputes : jurorDisputes}
          loading={disputesFetching}
          myDisputeSelected={screenIndex === 1}
          onSelectDispute={handleSelectDispute}
        />
      </div>
    </>
  )
}

export default Disputes
