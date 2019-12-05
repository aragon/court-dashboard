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
