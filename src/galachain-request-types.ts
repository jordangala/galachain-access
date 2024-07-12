import {
  EthSignTypedDataV4Prefix,
  PersonalSignPrefix,
  Signature,
} from './sign-types.js';

export type GalaChainResponse<TResponseBody> = {
  request: {
    method: 'POST' | 'GET';
    headers: Record<string, string>;
    body: string;
    url: string;
  };
} & (
  | {
      response: {
        status: number;
        body: {
          Status: number;
          Message: string;
          Data: TResponseBody;
        };
      };
    }
  | { exception: unknown }
);

export type SignedRequestBody<TRequestBody> = TRequestBody &
  (
    | {
        prefix: PersonalSignPrefix;
        signature: Signature;
      }
    | {
        prefix: EthSignTypedDataV4Prefix;
        signature: Signature;
      }
    | { signature: Signature }
  );
