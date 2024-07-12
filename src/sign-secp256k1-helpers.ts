import { ethers } from 'ethers';
import stringify from 'json-stringify-deterministic';
import {
  getChecksumEthereumWalletAddress,
  isEthereumWalletAddress,
  isSecp256k1PrivateKey,
} from './galachain-type-helpers.js';
import { ChecksumEthereumWalletAddress } from './galachain-types.js';
import {
  RequestBodyBuffer,
  RequestBodyLength,
  Secp256k1PrivateKey,
  Secp256k1SignPrefix,
  Secp256k1SignPrefixedRequestBody,
  Signature,
  SignRequestBodyFn,
} from './sign-types.js';

export const getRequestBodyLength = <TRequestBody>(
  payload: TRequestBody,
): RequestBodyLength => {
  return stringify(payload).length as RequestBodyLength;
};

export const getSecp256k1SignPrefix = (
  requestBodyLength: RequestBodyLength,
): Secp256k1SignPrefix => {
  return `\u0019Ethereum Signed Message:\n${requestBodyLength}` as Secp256k1SignPrefix;
};

export const getPrefixedRequestBody = <TRequestBody>(
  requestBody: TRequestBody,
): Secp256k1SignPrefixedRequestBody<TRequestBody> => {
  const requestBodyLength = getRequestBodyLength(requestBody);
  const prefix = getSecp256k1SignPrefix(requestBodyLength);

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

export const getRequestBodyBuffer = <TRequestBody>(
  requestBody: TRequestBody,
) => {
  const unsignedRequestBodyString = stringify(requestBody);

  return Buffer.from(unsignedRequestBodyString) as RequestBodyBuffer;
};

export const getRequestBodySignature = async <TRequestBody>(args: {
  prefixedRequestBody: Secp256k1SignPrefixedRequestBody<TRequestBody>;
  checksumEthereumWalletAddress: ChecksumEthereumWalletAddress;
  secp256k1PrivateKey: Secp256k1PrivateKey;
}): Promise<Signature | undefined> => {
  const wallet = new ethers.Wallet(args.secp256k1PrivateKey);

  const requestBodyBuffer = getRequestBodyBuffer(args.prefixedRequestBody);

  const signature = await wallet.signMessage(requestBodyBuffer);

  return signature as Signature;
};

export const getSignRequestBodyWithSecp256k1PrivateKeyFn = (context: {
  getSepc256k1PrivateKeyFn: () => Promise<string>;
  getEthereumWalletAddress: () => Promise<string>;
}) => {
  const signRequestBodyFn: SignRequestBodyFn = async (requestBody) => {
    const secp256k1PrivateKey = await context.getSepc256k1PrivateKeyFn();
    if (!isSecp256k1PrivateKey(secp256k1PrivateKey)) {
      throw new Error('Missing secp256k1 private key');
    }

    const ethereumWalletAddress = await context.getEthereumWalletAddress();
    if (!isEthereumWalletAddress(ethereumWalletAddress)) {
      throw new Error('Invalid Ethereum wallet address');
    }

    const checksumEthereumWalletAddress = getChecksumEthereumWalletAddress(
      ethereumWalletAddress,
    );

    const prefixedRequestBody = getPrefixedRequestBody(requestBody);

    const signature = await getRequestBodySignature({
      checksumEthereumWalletAddress,
      prefixedRequestBody,
      secp256k1PrivateKey,
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
