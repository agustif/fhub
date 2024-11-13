# Fhub

`fhub` is a library for interacting with a Farcaster Hub. It provides a client to connect to a Farcaster Hub and perform various actions such as retrieving and creating casts, following users, liking casts, and more.

## Installation

To use `fhub`, install it as a dependency in your project:

```bash
npm install fhub
```

## Usage

Here is a basic example of how to use `fhub`:

1. Set up your environment variables:
   - `RPC_URL`: The URL of the Farcaster Hub RPC endpoint.
   - `FID`: Your Farcaster ID.
   - `PRIVATE_KEY`: Your private key in the format `0x<private_key>`.

2. Create a client and perform actions:

```typescript
import { Actions, Client, Transport } from 'fhub';

const RPC_URL = process.env.RPC_URL ?? 'https://hub-grpc.pinata.cloud';
const FID = BigInt(process.env.FID);
const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;

const client = Client.create(
  Transport.grpcNode({
    baseUrl: RPC_URL,
    httpVersion: '2',
  }),
);

// Example: Get user data bio
const myBio = await Actions.UserData.getUserDataBio(client, { fid: 11517n });
console.log(myBio);

// Example: Create a cast
const message = await Actions.Cast.create(client, {
  text: `Hello from fhub!`,
  account: {
    fid: FID,
    privateKey: PRIVATE_KEY,
  },
});
console.log(message);
```

## Available Actions

- Retrieve a cast: `Actions.Cast.getCast`
- Retrieve casts by FID: `Actions.Cast.getCastsByFid`
- Retrieve user data bio: `Actions.UserData.getUserDataBio`
- Create a cast: `Actions.Cast.create`
- Follow a user: `Actions.Follow.createByUsername`
- Like a cast: `Actions.Like.create`
- Recast: `Actions.Recast.create`

## Playground

The repository includes a playground for testing and experimenting with `fhub`. To run the playground:

1. Navigate to the `playground` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the playground:
   ```bash
   npm run dev
   ```

For more detailed examples, refer to the `playground/src/index.ts` file in the repository.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
