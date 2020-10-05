import React from 'react'
import { Link } from '@aragon/ui'

import large1 from './highlights/assets/rinkeby/large/1.png'
import large2 from './highlights/assets/rinkeby/large/2.png'
import large3 from './highlights/assets/rinkeby/large/3.png'
import large4 from './highlights/assets/rinkeby/large/4.png'
import large5 from './highlights/assets/rinkeby/large/5.png'

import mainnetLarge1 from './highlights/assets/mainnet/large/1.png'
import mainnetLarge2 from './highlights/assets/mainnet/large/2.png'
import mainnetLarge4 from './highlights/assets/mainnet/large/4.png'
import mainnetLarge5 from './highlights/assets/mainnet/large/5.png'
import mainnetLarge6 from './highlights/assets/mainnet/large/6.png'
import mainnetLarge7 from './highlights/assets/mainnet/large/7.png'

import mainnetSmall1 from './highlights/assets/mainnet/small/1.png'
import mainnetSmall2 from './highlights/assets/mainnet/small/2.png'
import mainnetSmall4 from './highlights/assets/mainnet/small/4.png'
import mainnetSmall5 from './highlights/assets/mainnet/small/5.png'
import mainnetSmall6 from './highlights/assets/mainnet/small/6.png'
import mainnetSmall7 from './highlights/assets/mainnet/small/7.png'

const TYPEFORM_LINK = 'https://aragonone.typeform.com/to/g7zncn'
const MAIN_COURT_URL = 'https://court.aragon.org'

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
          This is a testnet release of the official Court Dashboard at{' '}
          <Link href={MAIN_COURT_URL}>court.aragon.org</Link>. We'd love for you
          to explore it and tell us what you think!
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
          When you vote in favor of the plurality ruling, you will be rewarded
          with Dispute Fees. Just note that these rewards will be awarded in
          Rinkeby tokens for the purpose of this test version.
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
        <>
          <p>
            If you didn’t receive any Rinkeby ANJ, just complete
            <Link href={TYPEFORM_LINK}>this form</Link> and we’ll send you some
            funds swiftly!
          </p>
          <p>
            You’ll also receive notifications about important announcements,
            your assigned disputes, and upcoming tasks as a juror.
          </p>
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

highlights.main = [
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
      small: mainnetSmall1,
      large: mainnetLarge1,
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
          <p>
            View and manage your ANJ across three balances: Wallet, Inactive,
            and Active. You can read more about these different balances and
            what they mean in the{' '}
            <Link href="https://help.aragon.org/article/42-aragon-court-dashboard">
              Juror Dashboard Guide
            </Link>
            .
          </p>

          <p>
            Adjusting your active ANJ balance will affect the indicator that
            displays your chance of being drafted and your current draft status.
          </p>
        </>
      ),
    },
    visual: {
      small: mainnetSmall2,
      large: mainnetLarge2,
      color: '#F9FAFC',
      buttonColor: '#FF9780',
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
          <p>
            When drafted, you must perform certain actions on time to earn
            rewards and avoid penalties.
          </p>
          <p>
            Check your pending actions in the “Upcoming tasks” section so you
            always know what to do.
          </p>
        </>
      ),
    },
    visual: {
      small: mainnetSmall4,
      large: mainnetLarge4,
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
          View all live disputes or only the ones you are adjudicating. From
          here you can explore the details, evidence, and timeline for any
          dispute.
        </span>
      ),
    },
    visual: {
      small: mainnetSmall5,
      large: mainnetLarge5,
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
      small: mainnetSmall6,
      large: mainnetLarge6,
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
          <p>
            Earn Dispute Fees for successfully adjudicating disputes and monthy
            Subscription Fees for simply being an Active juror, whether you are
            drafted or not.
          </p>
          <p>Use the Rewards modules to track your earnings over time.</p>
        </>
      ),
    },
    visual: {
      small: mainnetSmall7,
      large: mainnetLarge7,
    },
    start: {
      small: null,
      large: 'Discover Aragon Court',
    },
  },
]

export { highlights }
