// Generated by dts-bundle-generator v8.1.2

/** Used by Brand to mark a type in a readable way. */
export type Branding<TBrand> = {
	_type: TBrand;
};
/** Create a "flavored" version of a type. TypeScript will disallow mixing flavors, but will allow unflavored values of that type to be passed in where a flavored version is expected. This is a less restrictive form of branding. */
export type Brand<TType, TBrand> = TType & Branding<TBrand>;
export type EthereumWalletAddress = Brand<string, "EthereumWalletAddress">;
export type ChecksumEthereumWalletAddress = Brand<string, "ChecksumEthereumWalletAddress">;
export type GalaChainEthereumAddress = Brand<string, "GalaChainEthAddress">;
export type GalaChainClientAddress = Brand<string, "GalaChainClientAddress">;
export type GalaChainAddress = GalaChainEthereumAddress | GalaChainClientAddress;
export type RequestSignature = Brand<string, "RequestSignature">;
export type RequestBodyLength = Brand<number, "RequestBodyLength">;
export type PrefixedRequestBody<T> = T & {
	prefix: EthereumSignedMessagePrefix;
};
export type EthereumSignedMessagePrefix = Brand<string, "EthereumSignedMessagePrefix">;
export type SignedRequestBody<TRequestBody> = TRequestBody & {
	signature: RequestSignature;
};
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
export declare const makeChainMethods: (baseUri: string) => {
	fetchBalances: (requestBody: FetchBalancesRequestBody) => Promise<{
		request: {
			url: string;
			method: "POST" | "GET";
			headers: {
				"Content-Type": string;
			};
			body: string;
		};
		response: {
			status: number;
			body: FetchBalancesResponseBody;
		};
		exception?: undefined;
	} | {
		request: {
			url: string;
			method: "POST" | "GET";
			headers: {
				"Content-Type": string;
			};
			body: string;
		};
		exception: unknown;
		response?: undefined;
	}>;
	transferToken: (requestBody: SignedRequestBody<PrefixedRequestBody<TransferTokenRequestBody>>) => Promise<{
		request: {
			url: string;
			method: "POST" | "GET";
			headers: {
				"Content-Type": string;
			};
			body: string;
		};
		response: {
			status: number;
			body: unknown;
		};
		exception?: undefined;
	} | {
		request: {
			url: string;
			method: "POST" | "GET";
			headers: {
				"Content-Type": string;
			};
			body: string;
		};
		exception: unknown;
		response?: undefined;
	}>;
};
export type Secp256k1PrivateKey = Brand<string, "Secp256k1PrivateKey">;
export declare function isEthereumWalletAddress(address: string): address is EthereumWalletAddress;
export declare function isGalaChainEthereumAddress(address: string): address is GalaChainEthereumAddress;
export declare function isGalaChainClientAddress(address: string): address is GalaChainClientAddress;
export declare const getChecksumEthereumWalletAddress: (address: EthereumWalletAddress) => ChecksumEthereumWalletAddress;
export declare const getGalaChainAddress: (checksumEthereumWalletAddress: ChecksumEthereumWalletAddress) => GalaChainAddress | undefined;
export declare const signing: {
	getPrefixedRequestBody: <T extends object>(requestBody: T) => PrefixedRequestBody<T>;
	getSignedPrefixedRequestBody: <TRequestBody>(args: {
		getRequestBodySignatureFn: <TRequestBodyA>(requestBody: PrefixedRequestBody<TRequestBodyA>) => Promise<RequestSignature | undefined>;
		prefixedRequestBody: PrefixedRequestBody<TRequestBody>;
	}) => Promise<SignedRequestBody<PrefixedRequestBody<TRequestBody>>>;
};
export declare const offlineWallet: {
	makeRequestBodySignatureFn: (getSecp256k1PrivateKeyFn: () => Promise<WalletOfflineHelpers.Secp256k1PrivateKey>) => <TRequestBody>(args: {
		checksumEthereumWalletAddress: ChecksumEthereumWalletAddress;
		prefixedRequestBody: PrefixedRequestBody<TRequestBody>;
	}) => Promise<RequestSignature | undefined>;
};
export declare const browserWallet: {
	getEthereumWalletAddress: () => Promise<EthereumWalletAddress | undefined>;
	getRequestBodySignature: <TRequestBody>(args: {
		prefixedRequestBody: PrefixedRequestBody<TRequestBody>;
		checksumEthereumWalletAddress: ChecksumEthereumWalletAddress;
	}) => Promise<RequestSignature | undefined>;
};

export {};
