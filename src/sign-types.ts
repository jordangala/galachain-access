import { Brand } from './branding-types.js';
import { SignedRequestBody } from './galachain-request-types.js';

export type SignRequestBodyFn = <TRequestBody>(
  requestBody: TRequestBody,
) => Promise<SignedRequestBody<TRequestBody>>;

export type PersonalSignPrefix = Brand<string, 'PersonalSignPrefix'>;
export type EthSignTypedDataV4Prefix = Brand<
  string,
  'EthSignTypedDataV4Prefix'
>;

export type Signature = Brand<string, 'Signature'>;

export type Secp256k1PrivateKey = Brand<string, 'Secp256k1PrivateKey'>;
export type RequestBodyBuffer = Brand<Buffer, 'RequestBodyBuffer'>;
