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
