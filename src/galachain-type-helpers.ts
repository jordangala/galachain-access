import { getAddress } from 'ethers';
import {
  ChecksumEthereumWalletAddress,
  EthereumWalletAddress,
  GalaChainAddress,
  GalaChainClientAddress,
  GalaChainEthereumAddress,
} from './galachain-types.js';
import { Secp256k1PrivateKey } from './sign-types.js';

export function isSecp256k1PrivateKey(
  privateKey: unknown,
): privateKey is Secp256k1PrivateKey {
  return typeof privateKey === 'string';
}

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

export function isGalaChainAddress(
  address: string,
): address is GalaChainAddress {
  return (
    isGalaChainEthereumAddress(address) || isGalaChainClientAddress(address)
  );
}

export const getChecksumEthereumWalletAddress = (
  address: ChecksumEthereumWalletAddress | EthereumWalletAddress,
) => getAddress(address) as ChecksumEthereumWalletAddress;

export const getGalaChainAddress = (
  address: string,
): GalaChainAddress | undefined => {
  if (isGalaChainAddress(address)) {
    return address;
  }

  if (!isEthereumWalletAddress(address)) {
    throw new Error('Invalid Ethereum wallet address');
  }

  const checksumEthereumWalletAddress =
    getChecksumEthereumWalletAddress(address);

  return `eth|${checksumEthereumWalletAddress.replace(/0x/, '')}` as GalaChainAddress;
};
