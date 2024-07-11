import { BrowserProvider, Eip1193Provider, getAddress } from 'ethers';
import stringify from 'json-stringify-deterministic';
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

export const getRequestBodySignature = async <TRequestBody>(args: {
  prefixedRequestBody: PrefixedRequestBody<TRequestBody>;
  checksumEthereumWalletAddress: ChecksumEthereumWalletAddress;
}): Promise<RequestSignature | undefined> => {
  if (!window.ethereum) {
    return;
  }

  const browserProvider = new BrowserProvider(window.ethereum);

  return (await browserProvider.send('personal_sign', [
    getAddress(args.checksumEthereumWalletAddress),
    stringify(args.prefixedRequestBody),
  ])) as RequestSignature;
};
