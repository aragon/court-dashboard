import React, { useCallback, useState } from 'react'
import { Button, GU, Header, SidePanel, Tabs, Tag } from '@aragon/ui'

import DisputeDetail from './DisputeDetail'
import DisputeList from './DisputeList'
import { DisputesStateProvider } from './DisputesStateProvider'

import { useDisputesLogic } from '../../disputes-logic'

import ANJIcon from '../../assets/anjButton.svg'

function Disputes() {
  const [screenIndex, setScreenIndex] = useState(0)
  const {
    disputes,
    myDisputes,
    panelState,
    selectDispute,
    selectedDispute,
  } = useDisputesLogic()

  const handleBack = useCallback(() => {
    selectDispute(-1)
  }, [selectDispute])

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
      {selectedDispute ? (
        <DisputeDetail dispute={selectedDispute} onBack={handleBack} />
      ) : (
        <React.Fragment>
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
              selectDispute={selectDispute}
            />
          </div>
        </React.Fragment>
      )}
      <SidePanel
        title="Commit"
        opened={panelState.visible}
        onClose={panelState.requestClose}
        onTransitionEnd={panelState.endTransition}
      >
        <div
          css={`
            margin-top: ${2 * GU}px;
          `}
        />
        <PanelComponent
          mode={mode}
          actions={actions}
          balances={balances}
          onDone={panelState.requestClose}
        />
      </SidePanel>
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
