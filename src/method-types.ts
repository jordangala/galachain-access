import { GalaChainAddress } from './galachain-types.js';

export type TransferTokenRequestBody = {
  to: GalaChainAddress;
  tokenInstance: {
    collection: string;
    category: string;
    type: string;
    additionalKey: string;
    instance: string;
  };
  quantity: string;
};

export type TransferTokenResponseBody = unknown;

export type FetchBalancesRequestBody = {
  owner: GalaChainAddress;
  collection: string;
  category?: string;
};

export type FetchBalancesResponseBodyToken = {
  owner: GalaChainAddress;
  collection: string;
  category: string;
  type: string;
  additionalKey: string;
  quantity: string;
  instanceIds: string[];
  lockedHolds: Array<{
    name: string;
    createdBy: string;
    instanceId: string;
    quantity: string;
    created: number;
    expires: number | undefined;
  }>;
};

export type FetchBalancesResponseBody = {
  Status: number;
  Message: string;
  Data: FetchBalancesResponseBodyToken[];
};
