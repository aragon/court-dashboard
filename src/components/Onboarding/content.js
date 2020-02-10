import React from 'react'

import large1 from './highlights/assets/rinkeby/large/1.png'
import large2 from './highlights/assets/rinkeby/large/2.png'
import large3 from './highlights/assets/rinkeby/large/3.png'
import large4 from './highlights/assets/rinkeby/large/4.png'
import large5 from './highlights/assets/rinkeby/large/5.png'

const highlights = {
  heading: 'Aragon Court',
  defaultVisualColor: '#FF9780',
  defaultButtonColor: '#FFFFFF',
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
      color: '#F9FAFC',
      buttonColor: '#FF9780',
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

highlights.mainnet = [
  {
    title: {
      small: null,
      large: 'Welcome, juror',
    },
    description: {
      small: null,
      large: (
        <span>
          Your first ANJ has been activated succesfully. Now, read the quick
          guide to be a good and active juror on the court.
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
      large: 'Balances 📊',
    },
    description: {
      small: null,
      large: (
        <>
          <span>
            View and manage your ANJ across three balances: Wallet, Inactive,
            and Active. You can read more about these different balances and
            what they mean in the [Juror Dashboard
            Guide](https://help.aragon.org/article/41-aragon-court).
          </span>
          <br />
          <span>
            Adjusting your active ANJ balance will affect the indicator that
            displays your chance of being drafted, and current draft status.
          </span>
        </>
      ),
    },
    visual: {
      small: null,
      large: large2,
      color: '#F9FAFC',
      buttonColor: '#FF9780',
    },
  },
  {
    title: {
      small: null,
      large: 'Buying ANJ ⚖️',
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
      large: 'Upcoming tasks',
    },
    description: {
      small: null,
      large: (
        <>
          <span>
            When drafted, you must perform certain actions on time to earn
            rewards and avoid penalties.
          </span>
          <br />
          <span>
            Check your pending actions in the Upcoming tasks section so you
            always know what to do.
          </span>
        </>
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
      large: 'Dispute list',
    },
    description: {
      small: null,
      large: (
        <span>
          View all live disputes or only ones your adjudicating. From here you
          can explore the details, evidence, and timeline for any dispute.
        </span>
      ),
    },
    visual: {
      small: null,
      large: large5,
    },
  },
  {
    title: {
      small: null,
      large: 'Dispute analysis',
    },
    description: {
      small: null,
      large: (
        <span>
          Upon viewing a dispute you will find the essential information
          required to assess the dispute before casting your vote or making an
          appeal.
        </span>
      ),
    },
    visual: {
      small: null,
      large: large5,
    },
  },
  {
    title: {
      small: null,
      large: 'Earn rewards 🏆 ',
    },
    description: {
      small: null,
      large: (
        <>
          <span>
            Earn Dispute Fees for successfully adjudicating disputes and monthy
            Subscription Fees for simply being an Active juror, whether you are
            drafted or not.
          </span>
          <br />
          <span>Use the Rewards modules to track your earnings over time.</span>
        </>
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
