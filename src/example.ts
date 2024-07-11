import * as GalaChainAccess from './galachain-access.js';

// Browser Wallet
// const getEthereumWalletAddress = GalaChainAccess.getEthereumWalletAddress;
// const getRequestBodySignature = GalaChainAccess.getRequestBodySignature;

// Offline Wallet
const getEthereumWalletAddress = async () => {
  return '0xTBD' as GalaChainAccess.EthereumWalletAddress;
};

const getSecp256k1PrivateKey = async () => {
  return 'TBD' as GalaChainAccess.Secp256k1PrivateKey;
};

const getRequestBodySignature =
  GalaChainAccess.makeOfflineRequestBodySignatureFn(getSecp256k1PrivateKey);

const chainBaseUri = 'http://localhost:3002/api';

const main = async () => {
  const chainMethods = GalaChainAccess.makeChainMethods(chainBaseUri);

  const ethereumWalletAddress = await getEthereumWalletAddress();

  if (!ethereumWalletAddress) {
    return;
  }

  const checksumEthereumWalletAddress =
    GalaChainAccess.getChecksumEthereumWalletAddress(ethereumWalletAddress);

  const getRequestBodySignatureFn = <TRequestBody>(
    prefixedRequestBody: GalaChainAccess.PrefixedRequestBody<TRequestBody>,
  ) =>
    getRequestBodySignature({
      checksumEthereumWalletAddress,
      prefixedRequestBody,
    });

  const owner = GalaChainAccess.getGalaChainAddress(
    checksumEthereumWalletAddress,
  );
  if (!owner) {
    return;
  }

  const balances = await chainMethods.fetchBalances({
    owner,
    collection: 'GALA',
  });

  console.log('👉 balances', balances);

  const to = 'client|6617fdcffbe793ab3db0594d';
  if (!GalaChainAccess.isGalaChainClientAddress(to)) {
    return;
  }

  const transferTokenResult = await chainMethods.transferToken(
    await GalaChainAccess.getSignedPrefixedRequestBody({
      getRequestBodySignatureFn,
      prefixedRequestBody: GalaChainAccess.getPrefixedRequestBody({
        to,
        tokenInstance: {
          collection: 'GALA',
          category: 'Unit',
          type: 'none',
          additionalKey: 'none',
          instance: '0',
        },
        quantity: '10',
      }),
    }),
  );

  console.log('👉 transferTokenResult', transferTokenResult);
};

main();
