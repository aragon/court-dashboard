import large1 from './highlights/assets/rinkeby/large/1.png'
import large2 from './highlights/assets/rinkeby/large/2.png'
import large3 from './highlights/assets/rinkeby/large/3.png'
import large4 from './highlights/assets/rinkeby/large/4.png'
import large5 from './highlights/assets/rinkeby/large/5.png'

// import small1 from './highlights/small/1.png'
// import small2 from './highlights/small/2.png'
// import small3 from './highlights/small/3.png'
// import small4 from './highlights/small/4.png'
// import small5 from './highlights/small/5.png'

const highlights = {}
highlights.latest = [
  {
    title: {
      small: null,
      large: 'Welcome, juror',
    },
    description: {
      small: null,
      large: `What you’ll see next is a preview release of the official Court Dashboard that will launch on Feb 10th. We’d love you to explore it and tell us what you think about it!`,
    },
    visual: {
      // small: small1,
      large: large1,
      // color: 'linear-gradient(135.76deg, #65AAFF 8.69%, #5D21D4 103.74%)',
    },
  },
  {
    title: {
      small: null,
      large: 'Getting Rinkeby ANJ',
    },
    description: {
      small: null,
      large: `
      We airdropped 10,000 ANJ to the Rinkeby Ethereum account that you registered with so you can use to become an active juror and participate in the arbitration process.`,
    },
    visual: {
      // small: small2,
      large: large2,
      // color: 'linear-gradient(141.36deg, #A8ED2F -9.7%, #68DFB1 93.28%)',
    },
  },
  {
    title: {
      small: null,
      large: 'Arbitrate your first dispute',
    },
    description: {
      small: null,
      large: `Once you start exploring, you will find some dummy disputes with realistic content that can help you familiarize yourself with the functionality of this dashboard.`,
    },
    visual: {
      // small: small3,
      large: large3,
      // color: 'linear-gradient(324.69deg, #FFF886 -112.1%, #FF4E78 91.91%)',
    },
  },
  {
    title: {
      small: null,
      large: 'Earn rewards 🏆',
    },
    description: {
      small: null,
      large: `When you vote in favor of the consensus ruling, you will be rewarded with arbitration fees. Just note that these rewards will be awarded in Rinkeby tokens for the purpose of this test preview.`,
    },
    visual: {
      // small: small4,
      large: large4,
      // color: 'linear-gradient(135.76deg, #65AAFF 8.69%, #5D21D4 103.74%)',
    },
  },
  {
    title: {
      small: null,
      large: 'Stay up to date!',
    },
    description: {
      small: null,
      large: `You will receive email notifications about important Aragon Court announcements, your assigned disputes, and upcoming tasks.`,
    },
    visual: {
      // small: small5,
      large: large5,
      // color: 'linear-gradient(131.84deg, #FF9372 -58.49%, #FFD770 100%)',
    },
    start: {
      small: 'Discover Aragon Court',
      large: 'Discover Aragon Court',
    },
  },
]

export { highlights }
