import * as GalaChainAccess from './galachain-access.js';

const chainBaseUri = 'http://localhost:3002/api';

const getEthereumWalletAddress = async () => {
  return process.env.ETHEREUM_WALLET_ADDRESS ?? '';
};

const getSepc256k1PrivateKeyFn = async () => {
  return process.env.SECP256K1_PRIVATE_KEY ?? '';
};

const signRequestBodyFn =
  GalaChainAccess.getSignRequestBodyWithSecp256k1PrivateKeyFn({
    getEthereumWalletAddress,
    getSepc256k1PrivateKeyFn,
  });

const main = async () => {
  const chainMethods = GalaChainAccess.getChainMethods({
    chainBaseUri,
    signRequestBodyFn,
  });

  const owner = GalaChainAccess.getGalaChainAddress(
    await getEthereumWalletAddress(),
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
  if (!GalaChainAccess.isGalaChainAddress(to)) {
    return;
  }

  const transferTokenResult = await chainMethods.transferToken({
    to,
    tokenInstance: {
      collection: 'GALA',
      category: 'Unit',
      type: 'none',
      additionalKey: 'none',
      instance: '0',
    },
    quantity: '10',
  });

  console.log('👉 transferTokenResult', transferTokenResult);
};

main();
