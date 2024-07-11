import { BrowserProvider, Eip1193Provider, getAddress } from 'ethers';
import {
  ChecksumEthereumWalletAddress,
  EthereumWalletAddress,
  PrefixedRequestBody,
  RequestSignature,
} from './galachain-types.js';

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

export const getEthereumWalletAddress = async () => {
  if (!window.ethereum) {
    return;
  }

  const browserProvider = new BrowserProvider(window.ethereum);

  try {
    const accounts = (await browserProvider.send(
      'eth_requestAccounts',
      [],
    )) as string[];
    const address = accounts?.[0];

    if (!address) {
      return;
    }

    return address as EthereumWalletAddress;
  } catch (error: unknown) {
    console.error(error);

    return;
  }
};

// export const getRequestBodySignature = async <TRequestBody>(args: {
//   prefixedRequestBody: PrefixedRequestBody<TRequestBody>;
//   checksumEthereumWalletAddress: ChecksumEthereumWalletAddress;
// }): Promise<RequestSignature | undefined> => {
//   if (!window.ethereum) {
//     return;
//   }

//   const browserProvider = new BrowserProvider(window.ethereum);

//   return (await browserProvider.send('personal_sign', [
//     getAddress(args.checksumEthereumWalletAddress),
//     stringify(args.prefixedRequestBody),
//   ])) as RequestSignature;
// };

export const getRequestBodySignature = async <TRequestBody>(args: {
  prefixedRequestBody: PrefixedRequestBody<TRequestBody>;
  checksumEthereumWalletAddress: ChecksumEthereumWalletAddress;
}): Promise<RequestSignature | undefined> => {
  if (!window.ethereum) {
    return;
  }

  const browserProvider = new BrowserProvider(window.ethereum);

  //

  const domain = {
    name: 'GalaChain Token Transfer',
    version: '1',
    chainId: 11155111, // TODO not sure
    verifyingContract: '0x0000000000000000000000000000000000000000', // Replace with the contract address if applicable
  };

  const types = {
    TransferTokenRequestBody: [
      { name: 'to', type: 'string' },
      { name: 'tokenInstance', type: 'TokenInstance' },
      { name: 'quantity', type: 'string' },
    ],
    TokenInstance: [
      { name: 'collection', type: 'string' },
      { name: 'category', type: 'string' },
      { name: 'type', type: 'string' },
      { name: 'additionalKey', type: 'string' },
      { name: 'instance', type: 'string' },
    ],
  };

  // const signature = await browserProvider.send('eth_signTypedData_v4', [
  //   getAddress(args.checksumEthereumWalletAddress),
  //   JSON.stringify({
  //     domain,
  //     types,
  //     primaryType: 'TransferTokenRequestBody',
  //     message: stringify(args.prefixedRequestBody),
  //   }),
  // ]);

  const signature = await browserProvider.send('eth_signTypedData_v4', [
    getAddress(args.checksumEthereumWalletAddress),
    JSON.stringify({
      domain,
      types,
      primaryType: 'TransferTokenRequestBody',
      message: args.prefixedRequestBody,
    }),
  ]);

  return signature as RequestSignature;
};
