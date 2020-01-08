import React, { useCallback, useMemo, useState } from 'react'
import { Button, GU, Header, Tabs, Tag } from '@aragon/ui'
import DisputeDetail from './DisputeDetail'
import DisputeList from './DisputeList'
import ANJIcon from '../../assets/anjButton.svg'
// import useDisputesSubscription from '../../hooks/useDisputesSubscription'
import useDisputes from '../../hooks/useDisputes'
import useJurorDraftQuery from '../../hooks/useJurorDraftQuery'

const useSelectedDispute = disputes => {
  const [selectedDisputeId, setSelectedDisputeId] = useState(-1)

  const selectDispute = disputeId => setSelectedDisputeId(disputeId)

  const selectedDispute = useMemo(
    () => disputes.find(dispute => dispute.id === selectedDisputeId) || null,
    [disputes, selectedDisputeId]
  )

  return [selectedDispute, selectDispute]
}

function Disputes() {
  const [screenIndex, setScreenIndex] = useState(0)
  // const { currentTerm } = useCourtSettings()
  const [disputes] = useDisputes()
  console.log('Disputes!!! ', disputes)
  const connectedAccount = '0xe11ba2b4d45eaed5996cd0823791e0c93114882d'
  const jurorDisputes = useJurorDraftQuery(connectedAccount)
  const [selectedDispute, selectDispute] = useSelectedDispute(disputes)

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
          !selectedDispute && (
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
          )
        }
      />
      {selectedDispute ? (
        <DisputeDetail dispute={selectedDispute} onBack={handleBack} />
      ) : (
        <>
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
                  <Tag
                    limitDigits={4}
                    label={jurorDisputes.length}
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
              margin-top: -${GU * 1}px;
              width: 100%;
            `}
          >
            <DisputeList
              disputes={screenIndex === 0 ? disputes : jurorDisputes}
              selectDispute={selectDispute}
            />
          </div>
        </>
      )}
    </React.Fragment>
  )
}

export default Disputes
