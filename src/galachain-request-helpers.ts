import stringify from 'json-stringify-deterministic';
import { SignRequestBodyFn } from './sign-types.js';
import {
  GalaChainResponse,
  SignedRequestBody,
} from './galachain-request-types.js';

export const galaChainRequest = async <TRequestBody, TResponseBody>(
  context: {
    baseUri: string;
    channel: string;
    contract: string;
    method: string;
    httpMethod: 'POST' | 'GET';
  },
  body: TRequestBody,
): Promise<GalaChainResponse<TResponseBody>> => {
  const url = `${context.baseUri}/${context.channel}/${context.contract}/${context.method}`;

  const request = {
    method: context.httpMethod,
    headers: {
      'Content-Type': 'application/json',
    },
    body: stringify(body),
  };

  try {
    const response = await fetch(url, request);

    return {
      request: {
        ...request,
        url,
      },
      response: {
        status: response.status,
        body: (await response.json()) as {
          Status: number;
          Message: string;
          Data: TResponseBody;
        },
      },
    };
  } catch (exception) {
    return {
      request: {
        ...request,
        url,
      },
      exception,
    };
  }
};

export const getRequestFn = <TRequestBody, TResponseBody>(context: {
  baseUri: string;
  channel: string;
  contract: string;
  method: string;
}) => {
  return (
    requestBody: TRequestBody,
  ): Promise<GalaChainResponse<TResponseBody>> => {
    return galaChainRequest<TRequestBody, TResponseBody>(
      {
        baseUri: context.baseUri,
        channel: context.channel,
        contract: context.contract,
        method: context.method,
        httpMethod: 'POST',
      },
      requestBody,
    );
  };
};

export const getSignedRequestFn = <TRequestBody, TResponseBody>(context: {
  signRequestBodyFn: SignRequestBodyFn;
  baseUri: string;
  channel: string;
  contract: string;
  method: string;
}) => {
  return async (
    requestBody: TRequestBody,
  ): Promise<GalaChainResponse<TResponseBody>> => {
    const signedRequestBody = await context.signRequestBodyFn(requestBody);

    return galaChainRequest<SignedRequestBody<TRequestBody>, TResponseBody>(
      {
        baseUri: context.baseUri,
        channel: context.channel,
        contract: context.contract,
        method: context.method,
        httpMethod: 'POST',
      },
      signedRequestBody,
    );
  };
};
