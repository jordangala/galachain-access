import { Brand } from './branding-types.js';
import { SignedRequestBody } from './galachain-request-types.js';

export type SignRequestBodyFn = <TRequestBody>(
  requestBody: TRequestBody,
) => Promise<SignedRequestBody<TRequestBody>>;

export type Signature = Brand<string, 'Signature'>;

// --
export type PersonalSignPrefix = Brand<string, 'PersonalSignPrefix'>;

export type PersonalSignPrefixedRequestBody<TRequestBody> = TRequestBody & {
  prefix: PersonalSignPrefix;
};

// --

export type Secp256k1SignPrefix = Brand<string, 'Secp256k1SignPrefix'>;

export type Secp256k1PrivateKey = Brand<string, 'Secp256k1PrivateKey'>;
export type RequestBodyBuffer = Brand<Buffer, 'RequestBodyBuffer'>;

export type RequestBodyLength = Brand<number, 'RequestBodyLength'>;
export type Secp256k1SignPrefixedRequestBody<TRequestBody> = TRequestBody & {
  prefix: Secp256k1SignPrefix;
};

// --

// TODO:

export type EthSignTypedDataV4Prefix = Brand<
  string,
  'EthSignTypedDataV4Prefix'
>;
