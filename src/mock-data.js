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
