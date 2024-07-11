import { Buffer } from 'buffer';
import * as ethers from 'ethers';
import stringify from 'json-stringify-deterministic';
import { Brand } from './branding-types.js';
import {
  ChecksumEthereumWalletAddress,
  PrefixedRequestBody,
  RequestSignature,
} from './galachain-types.js';

export type Secp256k1PrivateKey = Brand<string, 'Secp256k1PrivateKey'>;
type UnsignedRequestBodyBuffer = Brand<Buffer, 'UnsignedRequestBodyBuffer'>;

function getUnsignedRequestBodyBuffer<T extends Object>(
  unsignedRequestBodyObject: T,
) {
  const unsignedRequestBodyString = stringify(unsignedRequestBodyObject);

  return Buffer.from(unsignedRequestBodyString) as UnsignedRequestBodyBuffer;
}

export const getRequestBodySignature = async <TRequestBody>(args: {
  prefixedRequestBody: PrefixedRequestBody<TRequestBody>;
  checksumEthereumWalletAddress: ChecksumEthereumWalletAddress;
  getSecp256k1PrivateKeyFn: () => Promise<Secp256k1PrivateKey>;
}): Promise<RequestSignature | undefined> => {
  const secp256k1PrivateKey = await args.getSecp256k1PrivateKeyFn();

  const wallet = new ethers.Wallet(secp256k1PrivateKey);

  const unsignedRequestBodyBuffer = getUnsignedRequestBodyBuffer(
    args.prefixedRequestBody,
  );

  const signature = await wallet.signMessage(unsignedRequestBodyBuffer);

  return signature as RequestSignature;
};

export const makeRequestBodySignatureFn =
  (getSecp256k1PrivateKeyFn: () => Promise<Secp256k1PrivateKey>) =>
  <TRequestBody>(args: {
    checksumEthereumWalletAddress: ChecksumEthereumWalletAddress;
    prefixedRequestBody: PrefixedRequestBody<TRequestBody>;
  }) =>
    getRequestBodySignature({
      checksumEthereumWalletAddress: args.checksumEthereumWalletAddress,
      prefixedRequestBody: args.prefixedRequestBody,
      getSecp256k1PrivateKeyFn,
    });
