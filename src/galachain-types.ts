import { Brand } from './branding-types.js';

export type EthereumWalletAddress = Brand<string, 'EthereumWalletAddress'>;
export type ChecksumEthereumWalletAddress = Brand<
  string,
  'ChecksumEthereumWalletAddress'
>;
export type GalaChainEthereumAddress = Brand<string, 'GalaChainEthAddress'>;
export type GalaChainClientAddress = Brand<string, 'GalaChainClientAddress'>;
export type GalaChainAddress =
  | GalaChainEthereumAddress
  | GalaChainClientAddress;
export type RequestSignature = Brand<string, 'RequestSignature'>;
export type RequestBodyLength = Brand<number, 'RequestBodyLength'>;
export type PrefixedRequestBody<T> = T & {
  prefix: EthereumSignedMessagePrefix;
};
export type EthereumSignedMessagePrefix = Brand<
  string,
  'EthereumSignedMessagePrefix'
>;
export type SignedRequestBody<TRequestBody> = TRequestBody & {
  signature: RequestSignature;
};
