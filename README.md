# Aragon Court Dashboard <a href="https://aragon.org/"><img align="right" src="docs/assets/LogoAccent.svg" height="80px" /></a>

### Aragon Court handles subjective disputes requiring judgment from human jurors.

<a href="https://court.aragon.org/dashboard"><img src="docs/assets/screenshot.png" /></a>

- 📚 Read the [User Guide](https://help.aragon.org/category/47-aragoncourt) first, if you have any questions as a user.
- 📝 Please report any issues and feedback in the [Aragon discord channels](https://discord.gg/zcKs8H).
- 🔧 For technical discussions, use this project's [issues](https://github.com/aragon/court-dashboard/issues) or join the technical conversation in our [Developer hangout](https://spectrum.chat/aragon/general-development) channel.
- 📖 To learn more about contributing to the Court Dashboard, please check the [contributing guide](./CONTRIBUTING.md)

## Quick start

`npm start` will launch the app, configured to connect to our Rinkeby deployment.

For connecting to other chains / deployments, a few useful npm scripts are provided:

- Mainnet: `npm run start:mainnet` will launch the app, configured to connect to Aragon Court's mainnet deployment
- Local: `npm run start:local` will launch the app, configured to connect to the local devchain.

Other [configuration options](docs/CONFIGURATION.md) are also available.

### Local development:

In order to start the dashboard locally, you will need to setup a few processes first.
  - Start ganache devchain
  - Deploy contracts to devchain
  - Deploy subgraph instance

 _For a detailed guide on how to achieve this, see more instructions [here](https://github.com/aragon/court-subgraph)._

You can also setup the [court services](https://github.com/aragonone/court-backend/tree/master/packages/services), which include some automation for auto-revealing commitments, penalty settlements and heartbeats. In order for auto-reveals to work, you will need also to setup the [court server](https://github.com/aragonone/court-backend/tree/master/packages/server).

To start populating the court with disputes, you can use the [CLI tool](https://github.com/aragonone/court-backend/tree/master/packages/cli).

## Contributing

#### 👋 Get started contributing with a [good first issue](https://github.com/aragon/court-dashboard/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).

Don't be shy to contribute even the smallest tweak. 🐲 There are still some dragons to be aware of, but we'll be here to help you get started!

For other details about contributing here, more information is available in the [contributing guide](./CONTRIBUTING.md).

#### Issues

If you come across an issue with the Court Dashboard, do a search in the [Issues](https://github.com/aragon/court-dashboard/issues?q=is%3Aissue+is%3Aopen) tab of this repo to make sure it hasn't been reported before. Follow these steps to help us prevent duplicate issues and unnecessary notifications going to the many people watching this repo:

- If the issue you found has been reported and is still open, and the details match your issue, give a "thumbs up" to the relevant posts in the issue thread to signal that you have the same issue. No further action is required on your part.
- If the issue you found has been reported and is still open, but the issue is missing some details, you can add a comment to the issue thread describing the additional details.
- If the issue you found has been reported but has been closed, you can comment on the closed issue thread and ask to have the issue reopened because you are still experiencing the issue. Alternatively, you can open a new issue, reference the closed issue by number or link, and state that you are still experiencing the issue. Provide any additional details in your post so we can better understand the issue and how to fix it.
