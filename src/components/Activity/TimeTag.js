import React from 'react'
import PropTypes from 'prop-types'
import { GU, textStyle, useTheme } from '@aragon/ui'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import useNow from '../../hooks/useNow'

dayjs.extend(relativeTime)

function getRelativeTime(now, targetDate) {
  return dayjs(targetDate)
    .from(now)
    .replace(/minutes?/, 'min')
    .replace(/seconds?/, 'sec')
    .trim()
}

function TimeTag({ date, label, ...props }) {
  const theme = useTheme()
  const now = useNow()
  const targetDate = new Date(date)
  return (
    <div
      css={`
        max-width: ${15.75 * GU}px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: ${theme.surfaceContentSecondary};
        ${textStyle('label2')};
      `}
      {...props}
    >
      {label || getRelativeTime(now, targetDate)}
    </div>
  )
}

TimeTag.propTypes = {
  date: PropTypes.number.isRequired, // unix timestamp
  label: PropTypes.node,
}

export default TimeTag
