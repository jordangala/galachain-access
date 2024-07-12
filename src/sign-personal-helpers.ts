import { BrowserProvider, Eip1193Provider, getAddress } from 'ethers';
import stringify from 'json-stringify-deterministic';
import { Brand } from './branding-types.js';
import { getChecksumEthereumWalletAddress } from './galachain-type-helpers.js';
import {
  ChecksumEthereumWalletAddress,
  EthereumWalletAddress,
} from './galachain-types.js';
import {
  PersonalSignPrefix,
  Signature,
  SignRequestBodyFn,
} from './sign-types.js';

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

export type RequestBodyLength = Brand<number, 'RequestBodyLength'>;
export type PrefixedRequestBody<TRequestBody> = TRequestBody & {
  prefix: PersonalSignPrefix;
};

export const getRequestBodyLength = <TRequestBody>(
  payload: TRequestBody,
): RequestBodyLength => {
  return stringify(payload).length as RequestBodyLength;
};

export const getPersonalSignPrefix = (
  requestBodyLength: RequestBodyLength,
): PersonalSignPrefix => {
  return `\u0019Ethereum Signed Message:\n${requestBodyLength}` as PersonalSignPrefix;
};

export const getPrefixedRequestBody = <TRequestBody>(
  requestBody: TRequestBody,
): PrefixedRequestBody<TRequestBody> => {
  const requestBodyLength = getRequestBodyLength(requestBody);
  const prefix = getPersonalSignPrefix(requestBodyLength);

  const prefixedRequestBody = {
    ...requestBody,
    prefix,
  };

  const prefixedRequestBodyLength = getRequestBodyLength(prefixedRequestBody);

  if (requestBodyLength === prefixedRequestBodyLength) {
    return prefixedRequestBody;
  }

  return getPrefixedRequestBody(prefixedRequestBody);
};

export const getRequestBodySignature = async <TRequestBody>(args: {
  prefixedRequestBody: PrefixedRequestBody<TRequestBody>;
  checksumEthereumWalletAddress: ChecksumEthereumWalletAddress;
}): Promise<Signature | undefined> => {
  if (!window.ethereum) {
    return;
  }

  const browserProvider = new BrowserProvider(window.ethereum);

  return (await browserProvider.send('personal_sign', [
    getAddress(args.checksumEthereumWalletAddress),
    stringify(args.prefixedRequestBody),
  ])) as Signature;
};

export const getSignRequestBodyWithPersonalSignPrefixFn = () => {
  const signRequestBodyFn: SignRequestBodyFn = async (requestBody) => {
    const ethereumWalletAddress = await getEthereumWalletAddress();
    if (!ethereumWalletAddress) {
      throw new Error('Missing ethereum wallet address');
    }

    const checksumEthereumWalletAddress = getChecksumEthereumWalletAddress(
      ethereumWalletAddress,
    );
    if (!checksumEthereumWalletAddress) {
      throw new Error('Missing checksum ethereum wallet address');
    }

    const prefixedRequestBody = getPrefixedRequestBody(requestBody);

    const signature = await getRequestBodySignature({
      prefixedRequestBody,
      checksumEthereumWalletAddress,
    });

    if (!signature) {
      throw new Error('Missing signature');
    }

    return {
      ...prefixedRequestBody,
      signature,
    };
  };

  return signRequestBodyFn;
};
