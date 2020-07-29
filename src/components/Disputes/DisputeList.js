import React, { useCallback, useState } from 'react'
import { Bar, CardLayout, GU, useLayout, useTheme } from '@aragon/ui'
import DisputeCard from './DisputeCard'
import DisputeFilters from './DisputeFilters'
import DisputesLoading from '../LoadingCard'
import ErrorLoading from '../Errors/ErrorLoading'
import NoFilterResults from './NoFilterResults'
import MessageCard from '../MessageCard'
import { dayjs } from '../../utils/date-utils'
import * as DisputesTypes from '../../types/dispute-status-types'

import noDataSvg from '../../assets/noData.svg'
import noDraftSvg from '../../assets/noDraft.svg'

const ALL_FILTER = 0
const UNSELECTED_FILTER = -1
const INITIAL_DATE_RANGE = { start: null, end: null }
const DISPUTES_STATUS_TYPES = [
  DisputesTypes.Phase.All,
  DisputesTypes.Status.Open,
  DisputesTypes.Status.Closed,
]
const DISPUTES_STATUS_STRING = DISPUTES_STATUS_TYPES.map(
  DisputesTypes.convertToString
)

const DISPUTES_PHASE_TYPES = [
  DisputesTypes.Phase.All,
  DisputesTypes.Phase.Evidence,
  DisputesTypes.Phase.JuryDrafting,
  DisputesTypes.Phase.VotingPeriod,
  DisputesTypes.Phase.AppealRuling,
  DisputesTypes.Phase.ConfirmAppeal,
  DisputesTypes.Phase.ExecuteRuling,
  DisputesTypes.Phase.ClaimRewards,
]
const DISPUTES_PHASE_STRING = DISPUTES_PHASE_TYPES.map(
  DisputesTypes.convertToString
)

const getFilteredDisputes = ({
  disputes = [],
  selectedDateRange,
  selectedStatus,
  selectedPhase,
}) => {
  return disputes.filter(
    ({ createdAt, status, phase }) =>
      (selectedPhase === UNSELECTED_FILTER ||
        selectedPhase === ALL_FILTER ||
        phase === DISPUTES_PHASE_TYPES[selectedPhase]) &&
      (!selectedDateRange.start ||
        !selectedDateRange.end ||
        dayjs(createdAt).isBetween(
          dayjs(selectedDateRange.start).startOf('day'),
          dayjs(selectedDateRange.end).endOf('day'),
          '[]'
        )) &&
      (selectedStatus === UNSELECTED_FILTER ||
        selectedStatus === ALL_FILTER ||
        status === DISPUTES_STATUS_TYPES[selectedStatus])
  )
}

function DisputeList({
  disputes,
  loading,
  errorLoading,
  myDisputeSelected,
  onSelectDispute,
}) {
  const [selectedDateRange, setSelectedDateRange] = useState(INITIAL_DATE_RANGE)
  const [selectedStatus, setSelectedStatus] = useState(UNSELECTED_FILTER)
  const [selectedPhase, setSelectedPhase] = useState(UNSELECTED_FILTER)
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  const handleSelectedDateRangeChange = range => {
    setSelectedDateRange(range)
  }
  const handlePhaseChange = useCallback(index => {
    return setSelectedPhase(index)
  }, [])

  const handleStatusChange = useCallback(
    index => {
      setSelectedStatus(index)
    },
    [setSelectedStatus]
  )

  const handleOnClearAllFilters = useCallback(() => {
    setSelectedDateRange(INITIAL_DATE_RANGE)
    setSelectedStatus(UNSELECTED_FILTER)
    setSelectedPhase(UNSELECTED_FILTER)
  }, [])

  const filteredDisputes = getFilteredDisputes({
    disputes,
    selectedDateRange,
    selectedStatus,
    selectedPhase,
  })

  const filtersSelected =
    selectedDateRange !== INITIAL_DATE_RANGE ||
    selectedStatus !== UNSELECTED_FILTER ||
    selectedPhase !== UNSELECTED_FILTER

  return (
    <div
      css={`
        width: 100%;
        margin-top: ${compactMode ? 0 : -2 * GU}px;
        padding-bottom: ${3 * GU}px;
      `}
    >
      {!compactMode && (
        <Bar
          css={`
            border-top: 0;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
          `}
        >
          <DisputeFilters
            phaseTypes={DISPUTES_PHASE_STRING}
            statusTypes={DISPUTES_STATUS_STRING}
            dateRangeFilter={selectedDateRange}
            phaseFilter={selectedPhase}
            statusFilter={selectedStatus}
            onDateRangeChange={handleSelectedDateRangeChange}
            onPhaseChange={handlePhaseChange}
            onStatusChange={handleStatusChange}
          />
        </Bar>
      )}

      {(() => {
        if (filteredDisputes.length === 0 && filtersSelected)
          return <NoFilterResults onClearFilters={handleOnClearAllFilters} />

        if (errorLoading) {
          return (
            <ErrorLoading subject="dispute" errors={[errorLoading.message]} />
          )
        }

        if (loading) {
          return <DisputesLoading />
        }

        if (disputes.length === 0) {
          return myDisputeSelected ? <NoMyDisputes /> : <NoDisputes />
        }

        return (
          <CardLayout columnWidthMin={30 * GU} rowHeight={272}>
            {filteredDisputes.map(dispute => {
              return (
                <DisputeCard
                  key={dispute.id}
                  dispute={dispute}
                  onSelectDispute={onSelectDispute}
                />
              )
            })}
          </CardLayout>
        )
      })()}
    </div>
  )
}

const NoDisputes = () => {
  const title = 'No disputes yet!'
  return <MessageCard title={title} icon={noDataSvg} />
}

const NoMyDisputes = () => {
  const theme = useTheme()

  const title = 'You haven’t been drafted to arbitrate a dispute yet'
  const paragraph = (
    <span>
      The more{' '}
      <span
        css={`
          color: ${theme.help};
        `}
      >
        ANJ you activate
      </span>
      , more chances you have to be drafted to arbitrate a dispute
    </span>
  )

  return <MessageCard title={title} paragraph={paragraph} icon={noDraftSvg} />
}

export default DisputeList
