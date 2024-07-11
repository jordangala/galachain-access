import stringify from 'json-stringify-deterministic';
import { SignedRequestBody, PrefixedRequestBody } from './galachain-types.js';

export async function makeGalaChainRequest<TRequestBody, TResponseBody>(
  context: {
    baseUri: string;
    channel: string;
    contract: string;
    method: string;
    httpMethod: 'POST' | 'GET';
  },
  body: TRequestBody,
) {
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
        body: (await response.json()) as TResponseBody,
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
}

export const makeRequestFn = <TRequestBody, TResponseBody>(context: {
  baseUri: string;
  channel: string;
  contract: string;
  method: string;
}) => {
  return (requestBody: TRequestBody) => {
    return makeGalaChainRequest<TRequestBody, TResponseBody>(
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

export const makeSignedRequestFn = <TRequestBody, TResponseBody>(context: {
  baseUri: string;
  channel: string;
  contract: string;
  method: string;
}) => {
  return (
    requestBody: SignedRequestBody<PrefixedRequestBody<TRequestBody>>,
  ) => {
    return makeGalaChainRequest<
      SignedRequestBody<PrefixedRequestBody<TRequestBody>>,
      TResponseBody
    >(
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
