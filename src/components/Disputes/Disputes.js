<<<<<<< HEAD
import React, { useCallback, useState } from 'react'
import { Button, GU, Header, SidePanel, Tabs, Tag } from '@aragon/ui'

import DisputeDetail from './DisputeDetail'
import DisputeList from './DisputeList'
import { DisputesStateProvider } from './DisputesStateProvider'
=======
import React, { useCallback, useMemo, useState } from 'react'
import { Button, GU, Header, Tabs, Tag } from '@aragon/ui'
import { useHistory } from 'react-router-dom'
import DisputeDetail from './DisputeDetail'
import DisputeList from './DisputeList'
import useDisputes from '../../hooks/useDisputes'
import useJurorDraftQuery from '../../hooks/useJurorDraftQuery'

import ANJIcon from '../../assets/anjButton.svg'

const useSelectedDispute = disputes => {
  const [selectedDisputeId, setSelectedDisputeId] = useState(-1)
>>>>>>> dispute-path

import { useDisputesLogic } from '../../disputes-logic'

import ANJIcon from '../../assets/anjButton.svg'

function Disputes() {
  const [screenIndex, setScreenIndex] = useState(0)
<<<<<<< HEAD
  const {
    disputes,
    myDisputes,
    panelState,
    selectDispute,
    selectedDispute,
  } = useDisputesLogic()
=======
  const [disputes] = useDisputes()
  const connectedAccount = '0xe11ba2b4d45eaed5996cd0823791e0c93114882d'
  const jurorDisputes = useJurorDraftQuery(connectedAccount)
  const [selectedDispute, selectDispute] = useSelectedDispute(disputes)
  const history = useHistory()

  const handleSelectDispute = useCallback(
    id => {
      history.push(`/disputes/${id}`)
    },
    [history]
  )
>>>>>>> dispute-path

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
<<<<<<< HEAD
              disputes={screenIndex === 0 ? disputes : myDisputes}
              selectDispute={selectDispute}
=======
              disputes={screenIndex === 0 ? disputes : jurorDisputes}
              onSelectDispute={handleSelectDispute}
>>>>>>> dispute-path
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
