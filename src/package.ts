export { makeChainMethods } from './method-helpers.js';
import {
  getPrefixedRequestBody,
  getSignedPrefixedRequestBody,
} from './signing-helpers.js';
import * as WalletBrowserHelpers from './wallet-browser-helpers.js';
import * as WalletOfflineHelpers from './wallet-offline-helpers.js';
export {
  getChecksumEthereumWalletAddress,
  getGalaChainAddress,
  isEthereumWalletAddress,
  isGalaChainClientAddress,
  isGalaChainEthereumAddress,
} from './galachain-type-helpers.js';
export * from './galachain-types.js';

export const signing = {
  getPrefixedRequestBody,
  getSignedPrefixedRequestBody,
};

export const offlineWallet = {
  makeRequestBodySignatureFn: WalletOfflineHelpers.makeRequestBodySignatureFn,
};

export const browserWallet = {
  getEthereumWalletAddress: WalletBrowserHelpers.getEthereumWalletAddress,
  getRequestBodySignature: WalletBrowserHelpers.getRequestBodySignature,
};
