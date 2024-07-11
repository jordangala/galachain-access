import stringify from 'json-stringify-deterministic';
import {
  EthereumSignedMessagePrefix,
  PrefixedRequestBody,
  RequestBodyLength,
  SignedRequestBody,
  RequestSignature,
} from './galachain-types.js';

export const getRequestBodyLength = (payload: object): RequestBodyLength => {
  return stringify(payload).length as RequestBodyLength;
};

export const getEthereumSignedMessagePrefix = (
  requestBodyLength: RequestBodyLength,
): EthereumSignedMessagePrefix => {
  return `\u0019Ethereum Signed Message:\n${requestBodyLength}` as EthereumSignedMessagePrefix;
};
export const getPrefixedRequestBody = <T extends object>(
  requestBody: T,
): PrefixedRequestBody<T> => {
  const requestBodyLength = getRequestBodyLength(requestBody);
  const prefix = getEthereumSignedMessagePrefix(requestBodyLength);

  const prefixedRequestBody = {
    ...requestBody,
    prefix,
  };

  const prefixedRequestBodyLength = getRequestBodyLength(prefixedRequestBody);

  if (requestBodyLength === prefixedRequestBodyLength) {
    return prefixedRequestBody;
  }

  return getPrefixedRequestBody(prefixedRequestBody);
};

export const getSignedPrefixedRequestBody = async <TRequestBody>(args: {
  getRequestBodySignatureFn: <TRequestBodyA>(
    requestBody: PrefixedRequestBody<TRequestBodyA>,
  ) => Promise<RequestSignature | undefined>;
  prefixedRequestBody: PrefixedRequestBody<TRequestBody>;
}): Promise<SignedRequestBody<PrefixedRequestBody<TRequestBody>>> => {
  const signature = await args.getRequestBodySignatureFn(
    args.prefixedRequestBody,
  );

  if (!signature) {
    throw new Error('Missing signature');
  }

  return {
    ...args.prefixedRequestBody,
    signature,
  };
};
