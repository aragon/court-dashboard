import React from 'react'
import large1 from './highlights/assets/rinkeby/large/1.png'
import large2 from './highlights/assets/rinkeby/large/2.png'
import large3 from './highlights/assets/rinkeby/large/3.png'
import large4 from './highlights/assets/rinkeby/large/4.png'
import large5 from './highlights/assets/rinkeby/large/5.png'

import small1 from './highlights/assets/rinkeby/small/1.png'
// import small2 from './highlights/assets/rinkeby/small/2.png'
import small3 from './highlights/assets/rinkeby/small/3.png'
import small4 from './highlights/assets/rinkeby/small/4.png'
import small5 from './highlights/assets/rinkeby/small/5.png'

const highlights = {}
highlights.latest = [
  {
    title: {
      small: null,
      large: 'Welcome, juror',
    },
    description: {
      small: null,
      large: `This is a preview release of the official Court Dashboard that will launch on Feb 10th. We'd love for you to explore it and tell us what you think!`,
    },
    visual: {
      small: small1,
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
          We've airdropped 10,000 test ANJ on Rinkeby to the same Ethereum
          account you registered with on mainnet. You can use this test ANJ to
          become an active juror and participate in the arbitration process.
          <br />
          <br />
          <br />
          <b>Include link to faucet once we have it</b>
        </span>
      ),
    },
    visual: {
      // small: small2,
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
      large: `Once you start exploring, you will find some mock disputes with realistic content that will allow you to become familiar with the functionality of this dashboard.`,
    },
    visual: {
      small: small3,
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
      large: `When you vote in favor of the majority ruling, you will be rewarded with arbitration fees. Just note that these rewards will be awarded in Rinkeby tokens for the purpose of this test preview.`,
    },
    visual: {
      small: small4,
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
      large: `You will receive email notifications about important Aragon Court announcements, your assigned disputes, and upcoming tasks as a juror.`,
    },
    visual: {
      small: small5,
      large: large5,
    },
    start: {
      small: 'Discover Aragon Court',
      large: 'Discover Aragon Court',
    },
  },
]

export { highlights }
