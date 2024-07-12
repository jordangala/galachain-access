import {
  FetchBalancesRequestBody,
  FetchBalancesResponseBody,
  TransferTokenRequestBody,
  TransferTokenResponseBody,
} from './galachain-method-types.js';
import {
  getRequestFn,
  getSignedRequestFn,
} from './galachain-request-helpers.js';
import { GalaChainResponse } from './galachain-request-types.js';
import { SignRequestBodyFn } from './sign-types.js';

export type GetSignedMethodFn<TRequestBody, TResponseBody> = (args: {
  chainBaseUri: string;
  signRequestBodyFn: SignRequestBodyFn;
}) => (requestBody: TRequestBody) => Promise<GalaChainResponse<TResponseBody>>;

export type GetMethodFn<TRequestBody, TResponseBody> = (args: {
  chainBaseUri: string;
}) => (requestBody: TRequestBody) => Promise<GalaChainResponse<TResponseBody>>;

export const getTransferTokenMethod: GetSignedMethodFn<
  TransferTokenRequestBody,
  TransferTokenResponseBody
> = (args) =>
  getSignedRequestFn({
    signRequestBodyFn: args.signRequestBodyFn,
    baseUri: args.chainBaseUri,
    channel: 'asset',
    contract: 'token-contract',
    method: 'TransferToken',
  });

export const getFetchBalancesMethod: GetMethodFn<
  FetchBalancesRequestBody,
  FetchBalancesResponseBody
> = (args) => {
  return getRequestFn({
    baseUri: args.chainBaseUri,
    channel: 'asset',
    contract: 'token-contract',
    method: 'FetchBalances',
  });
};

export const getChainMethods = (args: {
  chainBaseUri: string;
  signRequestBodyFn: SignRequestBodyFn;
}) => {
  return {
    fetchBalances: getFetchBalancesMethod({ chainBaseUri: args.chainBaseUri }),
    transferToken: getTransferTokenMethod({
      signRequestBodyFn: args.signRequestBodyFn,
      chainBaseUri: args.chainBaseUri,
    }),
  };
};
