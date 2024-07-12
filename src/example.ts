import {
  getGalaChainAddress,
  isGalaChainClientAddress,
  getChainMethods,
  EthereumWalletAddress,
  Secp256k1PrivateKey,
  getSignRequestBodyWithSecp256k1PrivateKeyFn,
} from './galachain-access.js';
import { getSignRequestBodyWithPersonalSignPrefixFn } from './sign-personal-helpers.js';
// import { makeSignRequestBodyWithSecp256k1PrivateKey } from './sign-secp256k1-helpers.js';

const chainBaseUri = 'http://localhost:3002/api';

const getEthereumWalletAddress = async () => {
  return '0x' as EthereumWalletAddress;
};

const getSepc256k1PrivateKeyFn = async () => {
  return '' as Secp256k1PrivateKey;
};

const signRequestBodyFn = getSignRequestBodyWithSecp256k1PrivateKeyFn({
  getEthereumWalletAddress,
  getSepc256k1PrivateKeyFn,
});

// const signRequestBodyFn = getSignRequestBodyWithPersonalSignPrefixFn();

const main = async () => {
  const chainMethods = getChainMethods({
    chainBaseUri,
    signRequestBodyFn,
  });

  // const owner = getGalaChainAddress(await getEthereumWalletAddress());
  // if (!owner) {
  //   return;
  // }

  // const balances = await chainMethods.fetchBalances({
  //   owner,
  //   collection: 'GALA',
  // });

  // console.log('👉 balances', balances);

  const to = 'client|6617fdcffbe793ab3db0594d';
  if (!isGalaChainClientAddress(to)) {
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
