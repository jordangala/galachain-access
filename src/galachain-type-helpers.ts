import { getAddress } from 'ethers';
import {
  ChecksumEthereumWalletAddress,
  EthereumWalletAddress,
  GalaChainAddress,
  GalaChainClientAddress,
  GalaChainEthereumAddress,
} from './galachain-types.js';

export function isEthereumWalletAddress(
  address: string,
): address is EthereumWalletAddress {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

export function isGalaChainEthereumAddress(
  address: string,
): address is GalaChainEthereumAddress {
  return /^eth\|[0-9a-fA-F]{40}$/.test(address);
}

export function isGalaChainClientAddress(
  address: string,
): address is GalaChainClientAddress {
  return /^client\|/.test(address);
}

export const getChecksumEthereumWalletAddress = (
  address: EthereumWalletAddress,
) => getAddress(address) as ChecksumEthereumWalletAddress;

export const getGalaChainAddress = (
  checksumEthereumWalletAddress: ChecksumEthereumWalletAddress,
): GalaChainAddress | undefined => {
  return `eth|${checksumEthereumWalletAddress.replace(/0x/, '')}` as GalaChainAddress;
};
