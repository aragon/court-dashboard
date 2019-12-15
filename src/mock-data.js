import {
  DISPUTE_STATUS_OPEN,
  DISPUTE_STATUS_APPEAL,
  DISPUTE_STATUS_CLOSED,
} from './dispute-status-type'

import {
  IconCoin,
  IconFolder,
  IconFlag,
  IconGroup,
  IconSearch,
  IconVote,
  IconWrite,
} from '@aragon/ui'

import DAIIcon from './assets/dai.svg'
import ANTIcon from './assets/ant.svg'
import ANJIcon from './assets/anj.svg'

export const balances = {
  wallet: [
    { amount: '3.304,76', tokenSymbol: 'DAI', value: '3.300', icon: DAIIcon },
    { amount: '3.304,76', tokenSymbol: 'ANT', value: '3.300', icon: ANTIcon },
  ],
  staked: [
    { amount: '3.304,76', tokenSymbol: 'ANJ', value: '3.300', icon: ANJIcon },
  ],
  active: [
    { amount: '3.304,76', tokenSymbol: 'ANJ', value: '3.300', icon: ANJIcon },
  ],
  rewards: [
    { amount: '3.304,76', tokenSymbol: 'DAI', value: '3.300', icon: DAIIcon },
    { amount: '3.304,76', tokenSymbol: 'ANJ', value: '3.300', icon: ANJIcon },
  ],
}

export const latestActivity = [
  {
    account: '0x8401Eb5ff34cc943f096A32EF3d5113FEbE8D4Eb',
    action: 'Started',
    target: { label: 'review evidence', link: 'url' },
    date: '26/11/19 AT 16:00',
  },
  {
    account: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
    action: 'Comitted their',
    target: { label: 'vote', link: 'url' },
    date: '26/11/19 AT 16:00',
  },
  {
    account: '0x49C01b61Aa3e4cD4C4763c78EcFE75888b49ef50',
    action: 'Executed',
    target: { label: 'ruling', link: 'url' },
    date: '26/11/19 AT 16:00',
  },
]

export const disputes = [
  {
    id: 0,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    status: DISPUTE_STATUS_OPEN,
    creator: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
    rewardAmount: 1000,
    stakedAmount: 746,
    term: 1,
    termDate: '15/02/20',
    evidences: [
      "Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me.",
      "Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me.",
    ],
  },
  {
    id: 1,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    status: DISPUTE_STATUS_CLOSED,
    creator: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
    rewardAmount: 1080,
    stakedAmount: 865,
    term: 1,
    termDate: '15/02/20',
    evidences: [
      "Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me.",
      "Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me.",
    ],
  },
  {
    id: 2,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    status: DISPUTE_STATUS_APPEAL,
    creator: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
    rewardAmount: 870,
    stakedAmount: 500,
    term: 1,
    termDate: '15/02/20',
    evidences: [
      "Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me.",
      "Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me.",
    ],
  },
  {
    id: 3,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    status: DISPUTE_STATUS_CLOSED,
    creator: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
    rewardAmount: 908,
    stakedAmount: 1023,
    term: 1,
    termDate: '15/02/20',
    evidences: [
      "Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me.",
      "Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me.",
    ],
  },
  {
    id: 4,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    status: DISPUTE_STATUS_OPEN,
    creator: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
    rewardAmount: 385,
    stakedAmount: 985,
    term: 1,
    termDate: '15/02/20',
    evidences: [
      "Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me.",
      "Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me.",
    ],
  },
  {
    id: 5,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    status: DISPUTE_STATUS_APPEAL,
    creator: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
    rewardAmount: 930,
    stakedAmount: 495,
    term: 1,
    termDate: '15/02/20',
    evidences: [
      "Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me.",
      "Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me.",
    ],
  },
  {
    id: 6,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    status: DISPUTE_STATUS_OPEN,
    creator: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
    rewardAmount: 1093,
    stakedAmount: 385,
    term: 1,
    termDate: '15/02/20',
    evidences: [
      "Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me.",
      "Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me.",
    ],
  },
]

export const timeline = [
  {
    label: 'Open dispute #62',
    date: '20/11/2019',
    Icon: IconFlag,
  },
  {
    label: 'Submit evidence',
    date: '20/11/2019',
    Icon: IconFolder,
  },
  {
    label: 'Jurors drafted',
    date: '20/11/2019',
    Icon: IconGroup,
  },
  {
    label: 'Review evidence',
    date: '20/11/2019',
    Icon: IconSearch,
  },
  {
    label: 'Voting period',
    date: '20/11/2019',
    Icon: IconVote,
  },
  {
    label: 'Apeal Ruling',
    date: '20/11/2019',
    Icon: IconWrite,
  },
  {
    label: 'Claim rewards',
    date: '20/11/2019',
    Icon: IconCoin,
  },
  {
    label: 'Milestone',
    date: '20/11/2019',
    Icon: IconFlag,
  },
]

export const tasks = [
  {
    taskName: 'Finish reviewing evidence',
    disputeId: 12,
    priority: 'High',
    juror: '0x593e1F9809658d0c92e9f092cF01Aad7D0d734f3',
    dueDate: 1575391948390,
  },
  {
    taskName: 'Reveal vote',
    disputeId: 15,
    priority: 'Medium',
    juror: '0x099278297012066d61c9505132b3Aa71F625E414',
    dueDate: 1575592000000,
  },
  {
    taskName: 'Start reviewing evidence',
    disputeId: 20,
    priority: 'Low',
    juror: '0x593e1F9809658d0c92e9f092cF01Aad7D0d734f3',
    dueDate: 1576393000000,
  },
  {
    taskName: 'Commit vote',
    disputeId: 14,
    priority: 'Medium',
    juror: '0x099278297012066d61c9505132b3Aa71F625E414',
    dueDate: 1575394000000,
  },
]
