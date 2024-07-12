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

export type TransferTokenResponseBodyToken = {
  additionalKey: string;
  category: string;
  collection: string;
  inUseHolds: [
    {
      created: number;
      createdBy: string;
      expires: number;
      instanceId: string;
      lockAuthority: string;
      name: string;
      quantity: string;
    },
  ];
  instanceIds: string;
  lockedHolds: [
    {
      created: number;
      createdBy: string;
      expires: number;
      instanceId: string;
      lockAuthority: string;
      name: string;
      quantity: string;
    },
  ];
  owner: string;
  quantity: string;
  type: string;
};

export type TransferTokenResponseBody = TransferTokenResponseBodyToken[];

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

export type FetchBalancesResponseBody = FetchBalancesResponseBodyToken[];
