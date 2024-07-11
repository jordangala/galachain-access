import {
  EthereumWalletAddress,
  PrefixedRequestBody,
  Secp256k1PrivateKey,
  getChecksumEthereumWalletAddress,
  getGalaChainAddress,
  getPrefixedRequestBody,
  getSignedPrefixedRequestBody,
  isGalaChainClientAddress,
  makeChainMethods,
  makeOfflineRequestBodySignatureFn,
} from './galachain-access.js';

// Browser Wallet
// const getEthereumWalletAddress = GalaChainAccess.getEthereumWalletAddress;
// const getRequestBodySignature = GalaChainAccess.getRequestBodySignature;

// Offline Wallet
const getEthereumWalletAddress = async () => {
  return '0xTBD' as EthereumWalletAddress;
};

const getSecp256k1PrivateKey = async () => {
  return 'TBD' as Secp256k1PrivateKey;
};

const getRequestBodySignature = makeOfflineRequestBodySignatureFn(
  getSecp256k1PrivateKey,
);

const chainBaseUri = 'http://localhost:3002/api';

const main = async () => {
  const chainMethods = makeChainMethods(chainBaseUri);

  const ethereumWalletAddress = await getEthereumWalletAddress();

  if (!ethereumWalletAddress) {
    return;
  }

  const checksumEthereumWalletAddress = getChecksumEthereumWalletAddress(
    ethereumWalletAddress,
  );

  const getRequestBodySignatureFn = <TRequestBody>(
    prefixedRequestBody: PrefixedRequestBody<TRequestBody>,
  ) =>
    getRequestBodySignature({
      checksumEthereumWalletAddress,
      prefixedRequestBody,
    });

  const owner = getGalaChainAddress(checksumEthereumWalletAddress);
  if (!owner) {
    return;
  }

  const balances = await chainMethods.fetchBalances({
    owner,
    collection: 'GALA',
  });

  console.log('👉 balances', balances);

  const to = 'client|6617fdcffbe793ab3db0594d';
  if (!isGalaChainClientAddress(to)) {
    return;
  }

  const transferTokenResult = await chainMethods.transferToken(
    await getSignedPrefixedRequestBody({
      getRequestBodySignatureFn,
      prefixedRequestBody: getPrefixedRequestBody({
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
