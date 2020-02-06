import React from 'react'

import large1 from './highlights/assets/rinkeby/large/1.png'
import large2 from './highlights/assets/rinkeby/large/2.png'
import large3 from './highlights/assets/rinkeby/large/3.png'
import large4 from './highlights/assets/rinkeby/large/4.png'
import large5 from './highlights/assets/rinkeby/large/5.png'

const highlights = {
  heading: 'Aragon Court',
  defaultVisualColor: '#FF9780',
}

highlights.rinkeby = [
  {
    title: {
      small: null,
      large: 'Welcome, juror',
    },
    description: {
      small: null,
      large: (
        <span>
          This is a preview release of the official Court Dashboard that will
          launch on Feb 10th. We'd love for you to explore it and tell us what
          you think!
        </span>
      ),
    },
    visual: {
      small: null,
      large: large1,
    },
  },
  {
    title: {
      small: null,
      large: 'Getting Rinkeby ANJ',
    },
    description: {
      small: null,
      large: (
        <span>
          We’ve airdropped 10,000 test ANJ on Rinkeby to the same Ethereum
          account you registered with on Mainnet. You can use this test ANJ to
          become an active juror and participate in the arbitration process.
        </span>
      ),
    },
    visual: {
      small: null,
      large: large2,
    },
  },
  {
    title: {
      small: null,
      large: 'Arbitrate your first dispute',
    },
    description: {
      small: null,
      large: (
        <span>
          Once you start exploring, you will find some mock disputes with
          realistic content that will allow you to become familiar with the
          functionality of this dashboard.
        </span>
      ),
    },
    visual: {
      small: null,
      large: large3,
    },
  },
  {
    title: {
      small: null,
      large: 'Earn rewards 🏆',
    },
    description: {
      small: null,
      large: (
        <span>
          When you vote in favor of the majority ruling, you will be rewarded
          with arbitration fees. Just note that these rewards will be awarded in
          Rinkeby tokens for the purpose of this test preview.
        </span>
      ),
    },
    visual: {
      small: null,
      large: large4,
    },
  },
  {
    title: {
      small: null,
      large: 'Stay up to date!',
    },
    description: {
      small: null,
      large: (
        <span>
          You will receive email notifications about important Aragon Court
          announcements, your assigned disputes, and upcoming tasks as a juror.
        </span>
      ),
    },
    visual: {
      small: null,
      large: large5,
    },
    start: {
      small: null,
      large: 'Discover Aragon Court',
    },
  },
]

export { highlights }
