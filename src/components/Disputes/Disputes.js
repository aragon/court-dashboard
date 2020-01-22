import React, { useCallback, useState } from 'react'
import { Button, GU, Header, Tabs, Tag } from '@aragon/ui'

import DisputeList from './DisputeList'
import { DisputesStateProvider } from './DisputesStateProvider'
import { useHistory } from 'react-router-dom'

import ANJIcon from '../../assets/anjButton.svg'
import useDisputes from '../../hooks/useDisputes'

function Disputes() {
  const [screenIndex, setScreenIndex] = useState(0)
  const [disputes, myDisputes] = useDisputes()

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
    <React.Fragment>
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
              <Tag limitDigits={4} label={myDisputes.length} size="small" />
            </div>,
          ]}
          selected={screenIndex}
          onChange={handleTabChange}
        />
      </div>
      <div
        css={`
          margin-top: 0px;
          width: 100%;
        `}
      >
        <DisputeList
          disputes={screenIndex === 0 ? disputes : myDisputes}
          onSelectDispute={handleSelectDispute}
        />
      </div>
    </React.Fragment>
  )
}

export default function DisputesWithSubscritpion(props) {
  return (
    <DisputesStateProvider>
      <Disputes {...props} />
    </DisputesStateProvider>
  )
}
