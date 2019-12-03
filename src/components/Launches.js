import React, { useState } from 'react'

import { useQuery } from 'urql'
import gql from 'graphql-tag'

const launchesQuery = gql`
  query launches($offset: Int) {
    launches(offset: $offset) {
      flight_number
      mission_name
      launch_year
      launch_success
    }
  }
`

function Launches() {
  const [offset, setOffset] = useState(0)

  const [result] = useQuery({
    query: launchesQuery,
    variables: { offset },
  })

  console.log(result)

  if (result.fetching) {
    return <p>Loading...</p>
  } else if (result.error) {
    return <p>Error fetching: {result.error.message}</p>
  }

  return (
    <div className>
      <h1>Launches</h1>
      <div className="launches">
        {result.data.launches.map(launch => {
          return (
            <div
              key={launch.flight_number}
              className={`launch ${launch.launch_success ? 'success' : 'fail'}`}
            >
              <h4>{launch.mission_name}</h4>
              <p>{launch.launch_year}</p>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', marginTop: '20px' }}>
        <button
          disabled={offset === 0}
          onClick={() => setOffset(Math.max(0, offset - 1))}
        >
          Previous
        </button>
        <button onClick={() => setOffset(offset + 1)}>Next</button>
      </div>
    </div>
  )
}

export default Launches
