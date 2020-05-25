import React from 'react'

import noResults from '../../assets/noResults.svg'
import MessageCard from '../MessageCard'

function NoFilterResults({ onClearFilters }) {
  const title = 'No results found'
  const paragraph =
    'We couldn’t find any dispute matching your filter selection'

  const link = {
    text: 'Clear all filters',
    action: onClearFilters,
  }

  return (
    <MessageCard
      title={title}
      paragraph={paragraph}
      icon={noResults}
      link={link}
    />
  )
}

export default NoFilterResults
