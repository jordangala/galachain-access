import {
  FetchBalancesRequestBody,
  FetchBalancesResponseBody,
  TransferTokenRequestBody,
  TransferTokenResponseBody,
} from './method-types.js';
import { makeRequestFn, makeSignedRequestFn } from './request-helpers.js';

export const makeTransferTokenMethod = (baseUri: string) =>
  makeSignedRequestFn<TransferTokenRequestBody, TransferTokenResponseBody>({
    baseUri,
    channel: 'asset',
    contract: 'token-contract',
    method: 'TransferToken',
  });

export const makeFetchBalancesMethod = (baseUri: string) =>
  makeRequestFn<FetchBalancesRequestBody, FetchBalancesResponseBody>({
    baseUri,
    channel: 'asset',
    contract: 'token-contract',
    method: 'FetchBalances',
  });

export const makeChainMethods = (baseUri: string) => {
  return {
    fetchBalances: makeFetchBalancesMethod(baseUri),
    transferToken: makeTransferTokenMethod(baseUri),
  };
};
