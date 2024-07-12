import { ethers } from 'ethers';
import stringify from 'json-stringify-deterministic';
import { getChecksumEthereumWalletAddress } from './galachain-type-helpers.js';
import {
  ChecksumEthereumWalletAddress,
  EthereumWalletAddress,
} from './galachain-types.js';
import {
  RequestBodyBuffer,
  Secp256k1PrivateKey,
  Signature,
  SignRequestBodyFn,
} from './sign-types.js';

export const getRequestBodyBuffer = <TRequestBody>(
  requestBody: TRequestBody,
) => {
  const unsignedRequestBodyString = stringify(requestBody);

  return Buffer.from(unsignedRequestBodyString) as RequestBodyBuffer;
};

export const getRequestBodySignature = async <TRequestBody>(args: {
  requestBody: TRequestBody;
  checksumEthereumWalletAddress: ChecksumEthereumWalletAddress;
  secp256k1PrivateKey: Secp256k1PrivateKey;
}): Promise<Signature | undefined> => {
  const wallet = new ethers.Wallet(args.secp256k1PrivateKey);

  const requestBodyBuffer = getRequestBodyBuffer(args.requestBody);

  const signature = await wallet.signMessage(requestBodyBuffer);

  return signature as Signature;
};

export const getSignRequestBodyWithSecp256k1PrivateKeyFn = (context: {
  getSepc256k1PrivateKeyFn: () => Promise<Secp256k1PrivateKey>;
  getEthereumWalletAddress: () => Promise<EthereumWalletAddress>;
}) => {
  const signRequestBodyFn: SignRequestBodyFn = async (requestBody) => {
    const secp256k1PrivateKey = await context.getSepc256k1PrivateKeyFn();

    const checksumEthereumWalletAddress = getChecksumEthereumWalletAddress(
      await context.getEthereumWalletAddress(),
    );

    const signature = await getRequestBodySignature({
      checksumEthereumWalletAddress,
      requestBody,
      secp256k1PrivateKey,
    });

    if (!signature) {
      throw new Error('Missing signature');
    }

    return {
      ...requestBody,
      signature,
    };
  };

  return signRequestBodyFn;
};
