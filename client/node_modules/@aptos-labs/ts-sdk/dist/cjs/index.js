"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  APTOS_PATH_REGEX: () => APTOS_PATH_REGEX,
  Account: () => Account,
  AccountAddress: () => AccountAddress,
  AccountAuthenticator: () => AccountAuthenticator,
  AccountAuthenticatorEd25519: () => AccountAuthenticatorEd25519,
  AccountAuthenticatorMultiEd25519: () => AccountAuthenticatorMultiEd25519,
  AccountAuthenticatorMultiKey: () => AccountAuthenticatorMultiKey,
  AccountAuthenticatorSingleKey: () => AccountAuthenticatorSingleKey,
  AccountAuthenticatorVariant: () => AccountAuthenticatorVariant,
  AddressInvalidReason: () => AddressInvalidReason,
  AnyPublicKeyVariant: () => AnyPublicKeyVariant,
  AnySignatureVariant: () => AnySignatureVariant,
  Aptos: () => Aptos,
  AptosApiError: () => AptosApiError,
  AptosConfig: () => AptosConfig,
  AuthenticationKey: () => AuthenticationKey,
  Bool: () => Bool,
  ChainId: () => ChainId,
  DeriveScheme: () => DeriveScheme,
  Deserializer: () => Deserializer,
  Ed25519PrivateKey: () => Ed25519PrivateKey,
  Ed25519PublicKey: () => Ed25519PublicKey,
  Ed25519Signature: () => Ed25519Signature,
  EntryFunction: () => EntryFunction,
  EntryFunctionBytes: () => EntryFunctionBytes,
  FeePayerRawTransaction: () => FeePayerRawTransaction,
  FixedBytes: () => FixedBytes,
  Hex: () => Hex,
  HexInvalidReason: () => HexInvalidReason,
  Identifier: () => Identifier,
  KeyType: () => KeyType,
  MimeType: () => MimeType,
  ModuleId: () => ModuleId,
  MoveAbility: () => MoveAbility,
  MoveFunctionVisibility: () => MoveFunctionVisibility,
  MoveOption: () => MoveOption,
  MoveString: () => MoveString,
  MoveVector: () => MoveVector,
  MultiAgentRawTransaction: () => MultiAgentRawTransaction,
  MultiEd25519PublicKey: () => MultiEd25519PublicKey,
  MultiEd25519Signature: () => MultiEd25519Signature,
  MultiKey: () => MultiKey,
  MultiSig: () => MultiSig,
  MultisigTransactionPayload: () => MultisigTransactionPayload,
  Network: () => Network,
  NetworkToChainId: () => NetworkToChainId,
  NetworkToFaucetAPI: () => NetworkToFaucetAPI,
  NetworkToIndexerAPI: () => NetworkToIndexerAPI,
  NetworkToNodeAPI: () => NetworkToNodeAPI,
  ParsingError: () => ParsingError,
  PrivateKey: () => PrivateKey,
  PublicKey: () => PublicKey,
  RawTransaction: () => RawTransaction,
  RawTransactionWithData: () => RawTransactionWithData,
  RoleType: () => RoleType,
  Script: () => Script,
  ScriptTransactionArgumentVariants: () => ScriptTransactionArgumentVariants,
  Secp256k1PrivateKey: () => Secp256k1PrivateKey,
  Secp256k1PublicKey: () => Secp256k1PublicKey,
  Secp256k1Signature: () => Secp256k1Signature,
  Serializable: () => Serializable,
  Serializer: () => Serializer,
  Signature: () => Signature,
  SignedTransaction: () => SignedTransaction,
  SigningScheme: () => SigningScheme,
  SigningSchemeInput: () => SigningSchemeInput,
  StructTag: () => StructTag,
  TransactionAuthenticator: () => TransactionAuthenticator,
  TransactionAuthenticatorEd25519: () => TransactionAuthenticatorEd25519,
  TransactionAuthenticatorFeePayer: () => TransactionAuthenticatorFeePayer,
  TransactionAuthenticatorMultiAgent: () => TransactionAuthenticatorMultiAgent,
  TransactionAuthenticatorMultiEd25519: () => TransactionAuthenticatorMultiEd25519,
  TransactionAuthenticatorSingleSender: () => TransactionAuthenticatorSingleSender,
  TransactionAuthenticatorVariant: () => TransactionAuthenticatorVariant,
  TransactionPayload: () => TransactionPayload,
  TransactionPayloadEntryFunction: () => TransactionPayloadEntryFunction,
  TransactionPayloadMultisig: () => TransactionPayloadMultisig,
  TransactionPayloadScript: () => TransactionPayloadScript,
  TransactionPayloadVariants: () => TransactionPayloadVariants,
  TransactionResponseType: () => TransactionResponseType,
  TransactionVariants: () => TransactionVariants,
  TypeTag: () => TypeTag,
  TypeTagAddress: () => TypeTagAddress,
  TypeTagBool: () => TypeTagBool,
  TypeTagGeneric: () => TypeTagGeneric,
  TypeTagParserError: () => TypeTagParserError,
  TypeTagParserErrorType: () => TypeTagParserErrorType,
  TypeTagReference: () => TypeTagReference,
  TypeTagSigner: () => TypeTagSigner,
  TypeTagStruct: () => TypeTagStruct,
  TypeTagU128: () => TypeTagU128,
  TypeTagU16: () => TypeTagU16,
  TypeTagU256: () => TypeTagU256,
  TypeTagU32: () => TypeTagU32,
  TypeTagU64: () => TypeTagU64,
  TypeTagU8: () => TypeTagU8,
  TypeTagVariants: () => TypeTagVariants,
  TypeTagVector: () => TypeTagVector,
  U128: () => U128,
  U16: () => U16,
  U256: () => U256,
  U32: () => U32,
  U64: () => U64,
  U8: () => U8,
  aptosCoinStructTag: () => aptosCoinStructTag,
  aptosRequest: () => aptosRequest,
  buildTransaction: () => buildTransaction,
  convertArgument: () => convertArgument,
  derivePrivateKeyFromMnemonic: () => derivePrivateKeyFromMnemonic,
  deriveTransactionType: () => deriveTransactionType,
  deserializeFromScriptArgument: () => deserializeFromScriptArgument,
  ensureBoolean: () => ensureBoolean,
  fetchEntryFunctionAbi: () => fetchEntryFunctionAbi,
  findFirstNonSignerArg: () => findFirstNonSignerArg,
  generateMultiSignersSignedTransaction: () => generateMultiSignersSignedTransaction,
  generateRawTransaction: () => generateRawTransaction,
  generateSignedTransaction: () => generateSignedTransaction,
  generateSignedTransactionForSimulation: () => generateSignedTransactionForSimulation,
  generateTransactionPayload: () => generateTransactionPayload,
  generateTransactionPayloadWithABI: () => generateTransactionPayloadWithABI,
  get: () => get,
  getAptosFullNode: () => getAptosFullNode,
  getAuthenticatorForSimulation: () => getAuthenticatorForSimulation,
  getFunctionParts: () => getFunctionParts,
  getSigningMessage: () => getSigningMessage,
  isBcsAddress: () => isBcsAddress,
  isBcsBool: () => isBcsBool,
  isBcsFixedBytes: () => isBcsFixedBytes,
  isBcsString: () => isBcsString,
  isBcsU128: () => isBcsU128,
  isBcsU16: () => isBcsU16,
  isBcsU256: () => isBcsU256,
  isBcsU32: () => isBcsU32,
  isBcsU64: () => isBcsU64,
  isBcsU8: () => isBcsU8,
  isBool: () => isBool,
  isLargeNumber: () => isLargeNumber,
  isNull: () => isNull,
  isNumber: () => isNumber,
  isScriptDataInput: () => isScriptDataInput,
  isString: () => isString,
  isValidPath: () => isValidPath,
  objectStructTag: () => objectStructTag,
  optionStructTag: () => optionStructTag,
  outOfRangeErrorMessage: () => outOfRangeErrorMessage,
  paginateWithCursor: () => paginateWithCursor,
  parseTypeTag: () => parseTypeTag,
  post: () => post,
  postAptosFaucet: () => postAptosFaucet,
  postAptosFullNode: () => postAptosFullNode,
  postAptosIndexer: () => postAptosIndexer,
  request: () => request,
  sign: () => sign,
  standardizeTypeTags: () => standardizeTypeTags,
  stringStructTag: () => stringStructTag,
  throwTypeMismatch: () => throwTypeMismatch,
  validateNumberInRange: () => validateNumberInRange
});
module.exports = __toCommonJS(src_exports);

// src/client/types.ts
var AptosApiError = class extends Error {
  constructor(request2, response, message) {
    super(message);
    this.name = "AptosApiError";
    this.url = response.url;
    this.status = response.status;
    this.statusText = response.statusText;
    this.data = response.data;
    this.request = request2;
  }
};

// src/version.ts
var VERSION = "2.0.0";

// src/types/index.ts
var MimeType = /* @__PURE__ */ ((MimeType2) => {
  MimeType2["JSON"] = "application/json";
  MimeType2["BCS"] = "application/x-bcs";
  MimeType2["BCS_SIGNED_TRANSACTION"] = "application/x.aptos.signed_transaction+bcs";
  return MimeType2;
})(MimeType || {});
var TypeTagVariants = /* @__PURE__ */ ((TypeTagVariants2) => {
  TypeTagVariants2[TypeTagVariants2["Bool"] = 0] = "Bool";
  TypeTagVariants2[TypeTagVariants2["U8"] = 1] = "U8";
  TypeTagVariants2[TypeTagVariants2["U64"] = 2] = "U64";
  TypeTagVariants2[TypeTagVariants2["U128"] = 3] = "U128";
  TypeTagVariants2[TypeTagVariants2["Address"] = 4] = "Address";
  TypeTagVariants2[TypeTagVariants2["Signer"] = 5] = "Signer";
  TypeTagVariants2[TypeTagVariants2["Vector"] = 6] = "Vector";
  TypeTagVariants2[TypeTagVariants2["Struct"] = 7] = "Struct";
  TypeTagVariants2[TypeTagVariants2["U16"] = 8] = "U16";
  TypeTagVariants2[TypeTagVariants2["U32"] = 9] = "U32";
  TypeTagVariants2[TypeTagVariants2["U256"] = 10] = "U256";
  TypeTagVariants2[TypeTagVariants2["Reference"] = 254] = "Reference";
  TypeTagVariants2[TypeTagVariants2["Generic"] = 255] = "Generic";
  return TypeTagVariants2;
})(TypeTagVariants || {});
var ScriptTransactionArgumentVariants = /* @__PURE__ */ ((ScriptTransactionArgumentVariants2) => {
  ScriptTransactionArgumentVariants2[ScriptTransactionArgumentVariants2["U8"] = 0] = "U8";
  ScriptTransactionArgumentVariants2[ScriptTransactionArgumentVariants2["U64"] = 1] = "U64";
  ScriptTransactionArgumentVariants2[ScriptTransactionArgumentVariants2["U128"] = 2] = "U128";
  ScriptTransactionArgumentVariants2[ScriptTransactionArgumentVariants2["Address"] = 3] = "Address";
  ScriptTransactionArgumentVariants2[ScriptTransactionArgumentVariants2["U8Vector"] = 4] = "U8Vector";
  ScriptTransactionArgumentVariants2[ScriptTransactionArgumentVariants2["Bool"] = 5] = "Bool";
  ScriptTransactionArgumentVariants2[ScriptTransactionArgumentVariants2["U16"] = 6] = "U16";
  ScriptTransactionArgumentVariants2[ScriptTransactionArgumentVariants2["U32"] = 7] = "U32";
  ScriptTransactionArgumentVariants2[ScriptTransactionArgumentVariants2["U256"] = 8] = "U256";
  return ScriptTransactionArgumentVariants2;
})(ScriptTransactionArgumentVariants || {});
var TransactionPayloadVariants = /* @__PURE__ */ ((TransactionPayloadVariants2) => {
  TransactionPayloadVariants2[TransactionPayloadVariants2["Script"] = 0] = "Script";
  TransactionPayloadVariants2[TransactionPayloadVariants2["EntryFunction"] = 2] = "EntryFunction";
  TransactionPayloadVariants2[TransactionPayloadVariants2["Multisig"] = 3] = "Multisig";
  return TransactionPayloadVariants2;
})(TransactionPayloadVariants || {});
var TransactionVariants = /* @__PURE__ */ ((TransactionVariants2) => {
  TransactionVariants2[TransactionVariants2["MultiAgentTransaction"] = 0] = "MultiAgentTransaction";
  TransactionVariants2[TransactionVariants2["FeePayerTransaction"] = 1] = "FeePayerTransaction";
  return TransactionVariants2;
})(TransactionVariants || {});
var TransactionAuthenticatorVariant = /* @__PURE__ */ ((TransactionAuthenticatorVariant2) => {
  TransactionAuthenticatorVariant2[TransactionAuthenticatorVariant2["Ed25519"] = 0] = "Ed25519";
  TransactionAuthenticatorVariant2[TransactionAuthenticatorVariant2["MultiEd25519"] = 1] = "MultiEd25519";
  TransactionAuthenticatorVariant2[TransactionAuthenticatorVariant2["MultiAgent"] = 2] = "MultiAgent";
  TransactionAuthenticatorVariant2[TransactionAuthenticatorVariant2["FeePayer"] = 3] = "FeePayer";
  TransactionAuthenticatorVariant2[TransactionAuthenticatorVariant2["SingleSender"] = 4] = "SingleSender";
  return TransactionAuthenticatorVariant2;
})(TransactionAuthenticatorVariant || {});
var AccountAuthenticatorVariant = /* @__PURE__ */ ((AccountAuthenticatorVariant2) => {
  AccountAuthenticatorVariant2[AccountAuthenticatorVariant2["Ed25519"] = 0] = "Ed25519";
  AccountAuthenticatorVariant2[AccountAuthenticatorVariant2["MultiEd25519"] = 1] = "MultiEd25519";
  AccountAuthenticatorVariant2[AccountAuthenticatorVariant2["SingleKey"] = 2] = "SingleKey";
  AccountAuthenticatorVariant2[AccountAuthenticatorVariant2["MultiKey"] = 3] = "MultiKey";
  return AccountAuthenticatorVariant2;
})(AccountAuthenticatorVariant || {});
var AnyPublicKeyVariant = /* @__PURE__ */ ((AnyPublicKeyVariant2) => {
  AnyPublicKeyVariant2[AnyPublicKeyVariant2["Ed25519"] = 0] = "Ed25519";
  AnyPublicKeyVariant2[AnyPublicKeyVariant2["Secp256k1"] = 1] = "Secp256k1";
  return AnyPublicKeyVariant2;
})(AnyPublicKeyVariant || {});
var AnySignatureVariant = /* @__PURE__ */ ((AnySignatureVariant2) => {
  AnySignatureVariant2[AnySignatureVariant2["Ed25519"] = 0] = "Ed25519";
  AnySignatureVariant2[AnySignatureVariant2["Secp256k1"] = 1] = "Secp256k1";
  return AnySignatureVariant2;
})(AnySignatureVariant || {});
var TransactionResponseType = /* @__PURE__ */ ((TransactionResponseType2) => {
  TransactionResponseType2["Pending"] = "pending_transaction";
  TransactionResponseType2["User"] = "user_transaction";
  TransactionResponseType2["Genesis"] = "genesis_transaction";
  TransactionResponseType2["BlockMetadata"] = "block_metadata_transaction";
  TransactionResponseType2["StateCheckpoint"] = "state_checkpoint_transaction";
  return TransactionResponseType2;
})(TransactionResponseType || {});
var MoveFunctionVisibility = /* @__PURE__ */ ((MoveFunctionVisibility2) => {
  MoveFunctionVisibility2["PRIVATE"] = "private";
  MoveFunctionVisibility2["PUBLIC"] = "public";
  MoveFunctionVisibility2["FRIEND"] = "friend";
  return MoveFunctionVisibility2;
})(MoveFunctionVisibility || {});
var MoveAbility = /* @__PURE__ */ ((MoveAbility2) => {
  MoveAbility2["STORE"] = "store";
  MoveAbility2["DROP"] = "drop";
  MoveAbility2["KEY"] = "key";
  MoveAbility2["COPY"] = "copy";
  return MoveAbility2;
})(MoveAbility || {});
var RoleType = /* @__PURE__ */ ((RoleType2) => {
  RoleType2["VALIDATOR"] = "validator";
  RoleType2["FULL_NODE"] = "full_node";
  return RoleType2;
})(RoleType || {});
var SigningScheme = /* @__PURE__ */ ((SigningScheme2) => {
  SigningScheme2[SigningScheme2["Ed25519"] = 0] = "Ed25519";
  SigningScheme2[SigningScheme2["MultiEd25519"] = 1] = "MultiEd25519";
  SigningScheme2[SigningScheme2["SingleKey"] = 2] = "SingleKey";
  SigningScheme2[SigningScheme2["MultiKey"] = 3] = "MultiKey";
  return SigningScheme2;
})(SigningScheme || {});
var SigningSchemeInput = /* @__PURE__ */ ((SigningSchemeInput2) => {
  SigningSchemeInput2[SigningSchemeInput2["Ed25519"] = 0] = "Ed25519";
  SigningSchemeInput2[SigningSchemeInput2["Secp256k1Ecdsa"] = 2] = "Secp256k1Ecdsa";
  return SigningSchemeInput2;
})(SigningSchemeInput || {});
var DeriveScheme = /* @__PURE__ */ ((DeriveScheme2) => {
  DeriveScheme2[DeriveScheme2["DeriveAuid"] = 251] = "DeriveAuid";
  DeriveScheme2[DeriveScheme2["DeriveObjectAddressFromObject"] = 252] = "DeriveObjectAddressFromObject";
  DeriveScheme2[DeriveScheme2["DeriveObjectAddressFromGuid"] = 253] = "DeriveObjectAddressFromGuid";
  DeriveScheme2[DeriveScheme2["DeriveObjectAddressFromSeed"] = 254] = "DeriveObjectAddressFromSeed";
  DeriveScheme2[DeriveScheme2["DeriveResourceAccountAddress"] = 255] = "DeriveResourceAccountAddress";
  return DeriveScheme2;
})(DeriveScheme || {});

// src/client/core.ts
var errors = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  429: "Too Many Requests",
  500: "Internal Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable"
};
async function request(options, client) {
  const { url, method, body, contentType, params, overrides } = options;
  const headers = {
    ...overrides == null ? void 0 : overrides.HEADERS,
    "x-aptos-client": `aptos-ts-sdk/${VERSION}`,
    "content-type": contentType != null ? contentType : "application/json" /* JSON */
  };
  if (overrides == null ? void 0 : overrides.TOKEN) {
    headers.Authorization = `Bearer ${overrides == null ? void 0 : overrides.TOKEN}`;
  }
  return client.provider({
    url,
    method,
    body,
    params,
    headers,
    overrides
  });
}
async function aptosRequest(options, aptosConfig) {
  var _a;
  const { url, path } = options;
  const fullUrl = `${url}/${path != null ? path : ""}`;
  const response = await request({ ...options, url: fullUrl }, aptosConfig.client);
  const result = {
    status: response.status,
    statusText: response.statusText,
    data: response.data,
    headers: response.headers,
    config: response.config,
    request: response.request,
    url: fullUrl
  };
  if (aptosConfig.isIndexerRequest(url)) {
    const indexerResponse = result.data;
    if (indexerResponse.errors) {
      throw new AptosApiError(
        options,
        result,
        (_a = indexerResponse.errors[0].message) != null ? _a : `Unhandled Error ${response.status} : ${response.statusText}`
      );
    }
    result.data = indexerResponse.data;
  }
  if (result.status >= 200 && result.status < 300) {
    return result;
  }
  const errorMessage = errors[result.status];
  throw new AptosApiError(
    options,
    result,
    errorMessage != null ? errorMessage : `Unhandled Error ${response.status} : ${response.statusText}`
  );
}

// src/utils/apiEndpoints.ts
var NetworkToIndexerAPI = {
  mainnet: "https://indexer.mainnet.aptoslabs.com/v1/graphql",
  testnet: "https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql",
  devnet: "https://indexer-devnet.staging.gcp.aptosdev.com/v1/graphql",
  local: "http://127.0.0.1:8090/v1/graphql"
};
var NetworkToNodeAPI = {
  mainnet: "https://fullnode.mainnet.aptoslabs.com/v1",
  testnet: "https://fullnode.testnet.aptoslabs.com/v1",
  devnet: "https://fullnode.devnet.aptoslabs.com/v1",
  local: "http://127.0.0.1:8080/v1"
};
var NetworkToFaucetAPI = {
  mainnet: "https://faucet.mainnet.aptoslabs.com",
  testnet: "https://faucet.testnet.aptoslabs.com",
  devnet: "https://faucet.devnet.aptoslabs.com",
  local: "http://127.0.0.1:8081"
};
var Network = /* @__PURE__ */ ((Network2) => {
  Network2["MAINNET"] = "mainnet";
  Network2["TESTNET"] = "testnet";
  Network2["DEVNET"] = "devnet";
  Network2["LOCAL"] = "local";
  Network2["CUSTOM"] = "custom";
  return Network2;
})(Network || {});
var NetworkToChainId = {
  mainnet: 1,
  testnet: 2
};

// src/utils/const.ts
var DEFAULT_NETWORK = "devnet" /* DEVNET */;
var DEFAULT_MAX_GAS_AMOUNT = 2e5;
var DEFAULT_TXN_EXP_SEC_FROM_NOW = 20;
var DEFAULT_TXN_TIMEOUT_SEC = 20;
var APTOS_COIN = "0x1::aptos_coin::AptosCoin";
var RAW_TRANSACTION_SALT = "APTOS::RawTransaction";
var RAW_TRANSACTION_WITH_DATA_SALT = "APTOS::RawTransactionWithData";

// src/client/get.ts
async function get(options) {
  const { aptosConfig, overrides, params, contentType, acceptType, path, originMethod, type } = options;
  const url = aptosConfig.getRequestUrl(type);
  return aptosRequest(
    {
      url,
      method: "GET",
      originMethod,
      path,
      contentType: contentType == null ? void 0 : contentType.valueOf(),
      acceptType: acceptType == null ? void 0 : acceptType.valueOf(),
      params,
      overrides: {
        ...aptosConfig.clientConfig,
        ...overrides
      }
    },
    aptosConfig
  );
}
async function getAptosFullNode(options) {
  return get({ ...options, type: 0 /* FULLNODE */ });
}
async function paginateWithCursor(options) {
  const out = [];
  let cursor;
  const requestParams = options.params;
  while (true) {
    requestParams.start = cursor;
    const response = await getAptosFullNode({
      aptosConfig: options.aptosConfig,
      originMethod: options.originMethod,
      path: options.path,
      params: requestParams,
      overrides: options.overrides
    });
    cursor = response.headers["x-aptos-cursor"];
    delete response.headers;
    out.push(...response.data);
    if (cursor === null || cursor === void 0) {
      break;
    }
  }
  return out;
}

// src/client/post.ts
async function post(options) {
  const { type, originMethod, path, body, acceptType, contentType, params, aptosConfig, overrides } = options;
  const url = aptosConfig.getRequestUrl(type);
  return aptosRequest(
    {
      url,
      method: "POST",
      originMethod,
      path,
      body,
      contentType: contentType == null ? void 0 : contentType.valueOf(),
      acceptType: acceptType == null ? void 0 : acceptType.valueOf(),
      params,
      overrides: {
        ...aptosConfig.clientConfig,
        ...overrides
      }
    },
    aptosConfig
  );
}
async function postAptosFullNode(options) {
  return post({ ...options, type: 0 /* FULLNODE */ });
}
async function postAptosIndexer(options) {
  return post({ ...options, type: 1 /* INDEXER */ });
}
async function postAptosFaucet(options) {
  return post({ ...options, type: 2 /* FAUCET */ });
}

// src/core/accountAddress.ts
var import_utils2 = require("@noble/hashes/utils");

// src/bcs/consts.ts
var MAX_U8_NUMBER = 2 ** 8 - 1;
var MAX_U16_NUMBER = 2 ** 16 - 1;
var MAX_U32_NUMBER = 2 ** 32 - 1;
var MAX_U64_BIG_INT = BigInt(2) ** BigInt(64) - BigInt(1);
var MAX_U128_BIG_INT = BigInt(2) ** BigInt(128) - BigInt(1);
var MAX_U256_BIG_INT = BigInt(2) ** BigInt(256) - BigInt(1);

// src/core/hex.ts
var import_utils = require("@noble/hashes/utils");

// src/core/common.ts
var ParsingError = class extends Error {
  constructor(message, invalidReason) {
    super(message);
    this.invalidReason = invalidReason;
  }
};

// src/core/hex.ts
var HexInvalidReason = /* @__PURE__ */ ((HexInvalidReason2) => {
  HexInvalidReason2["TOO_SHORT"] = "too_short";
  HexInvalidReason2["INVALID_LENGTH"] = "invalid_length";
  HexInvalidReason2["INVALID_HEX_CHARS"] = "invalid_hex_chars";
  return HexInvalidReason2;
})(HexInvalidReason || {});
var Hex = class {
  constructor(data) {
    this.data = data;
  }
  toUint8Array() {
    return this.data;
  }
  toStringWithoutPrefix() {
    return (0, import_utils.bytesToHex)(this.data);
  }
  toString() {
    return `0x${this.toStringWithoutPrefix()}`;
  }
  static fromString(str) {
    let input = str;
    if (input.startsWith("0x")) {
      input = input.slice(2);
    }
    if (input.length === 0) {
      throw new ParsingError(
        "Hex string is too short, must be at least 1 char long, excluding the optional leading 0x.",
        "too_short" /* TOO_SHORT */
      );
    }
    if (input.length % 2 !== 0) {
      throw new ParsingError("Hex string must be an even number of hex characters.", "invalid_length" /* INVALID_LENGTH */);
    }
    try {
      return new Hex((0, import_utils.hexToBytes)(input));
    } catch (e) {
      const error = e;
      throw new ParsingError(
        `Hex string contains invalid hex characters: ${error.message}`,
        "invalid_hex_chars" /* INVALID_HEX_CHARS */
      );
    }
  }
  static fromHexInput(hexInput) {
    if (hexInput instanceof Uint8Array)
      return new Hex(hexInput);
    return Hex.fromString(hexInput);
  }
  static isValid(str) {
    try {
      Hex.fromString(str);
      return { valid: true };
    } catch (e) {
      const error = e;
      return {
        valid: false,
        invalidReason: error.invalidReason,
        invalidReasonMessage: error.message
      };
    }
  }
  equals(other) {
    if (this.data.length !== other.data.length)
      return false;
    return this.data.every((value, index) => value === other.data[index]);
  }
};

// src/bcs/serializer.ts
var Serializable = class {
  bcsToBytes() {
    const serializer = new Serializer();
    this.serialize(serializer);
    return serializer.toUint8Array();
  }
  bcsToHex() {
    const bcsBytes = this.bcsToBytes();
    return Hex.fromHexInput(bcsBytes);
  }
};
var Serializer = class {
  constructor(length = 64) {
    if (length <= 0) {
      throw new Error("Length needs to be greater than 0");
    }
    this.buffer = new ArrayBuffer(length);
    this.offset = 0;
  }
  ensureBufferWillHandleSize(bytes) {
    while (this.buffer.byteLength < this.offset + bytes) {
      const newBuffer = new ArrayBuffer(this.buffer.byteLength * 2);
      new Uint8Array(newBuffer).set(new Uint8Array(this.buffer));
      this.buffer = newBuffer;
    }
  }
  appendToBuffer(values) {
    this.ensureBufferWillHandleSize(values.length);
    new Uint8Array(this.buffer, this.offset).set(values);
    this.offset += values.length;
  }
  serializeWithFunction(fn, bytesLength, value) {
    this.ensureBufferWillHandleSize(bytesLength);
    const dv = new DataView(this.buffer, this.offset);
    fn.apply(dv, [0, value, true]);
    this.offset += bytesLength;
  }
  serializeStr(value) {
    const textEncoder = new TextEncoder();
    this.serializeBytes(textEncoder.encode(value));
  }
  serializeBytes(value) {
    this.serializeU32AsUleb128(value.length);
    this.appendToBuffer(value);
  }
  serializeFixedBytes(value) {
    this.appendToBuffer(value);
  }
  serializeBool(value) {
    ensureBoolean(value);
    const byteValue = value ? 1 : 0;
    this.appendToBuffer(new Uint8Array([byteValue]));
  }
  serializeU8(value) {
    this.appendToBuffer(new Uint8Array([value]));
  }
  serializeU16(value) {
    this.serializeWithFunction(DataView.prototype.setUint16, 2, value);
  }
  serializeU32(value) {
    this.serializeWithFunction(DataView.prototype.setUint32, 4, value);
  }
  serializeU64(value) {
    const low = BigInt(value) & BigInt(MAX_U32_NUMBER);
    const high = BigInt(value) >> BigInt(32);
    this.serializeU32(Number(low));
    this.serializeU32(Number(high));
  }
  serializeU128(value) {
    const low = BigInt(value) & MAX_U64_BIG_INT;
    const high = BigInt(value) >> BigInt(64);
    this.serializeU64(low);
    this.serializeU64(high);
  }
  serializeU256(value) {
    const low = BigInt(value) & MAX_U128_BIG_INT;
    const high = BigInt(value) >> BigInt(128);
    this.serializeU128(low);
    this.serializeU128(high);
  }
  serializeU32AsUleb128(val) {
    let value = val;
    const valueArray = [];
    while (value >>> 7 !== 0) {
      valueArray.push(value & 127 | 128);
      value >>>= 7;
    }
    valueArray.push(value);
    this.appendToBuffer(new Uint8Array(valueArray));
  }
  toUint8Array() {
    return new Uint8Array(this.buffer).slice(0, this.offset);
  }
  serialize(value) {
    value.serialize(this);
  }
  serializeVector(values) {
    this.serializeU32AsUleb128(values.length);
    values.forEach((item) => {
      item.serialize(this);
    });
  }
};
__decorateClass([
  checkNumberRange(0, MAX_U8_NUMBER)
], Serializer.prototype, "serializeU8", 1);
__decorateClass([
  checkNumberRange(0, MAX_U16_NUMBER)
], Serializer.prototype, "serializeU16", 1);
__decorateClass([
  checkNumberRange(0, MAX_U32_NUMBER)
], Serializer.prototype, "serializeU32", 1);
__decorateClass([
  checkNumberRange(BigInt(0), MAX_U64_BIG_INT)
], Serializer.prototype, "serializeU64", 1);
__decorateClass([
  checkNumberRange(BigInt(0), MAX_U128_BIG_INT)
], Serializer.prototype, "serializeU128", 1);
__decorateClass([
  checkNumberRange(BigInt(0), MAX_U256_BIG_INT)
], Serializer.prototype, "serializeU256", 1);
__decorateClass([
  checkNumberRange(0, MAX_U32_NUMBER)
], Serializer.prototype, "serializeU32AsUleb128", 1);
function ensureBoolean(value) {
  if (typeof value !== "boolean") {
    throw new Error(`${value} is not a boolean value`);
  }
}
var outOfRangeErrorMessage = (value, min, max) => `${value} is out of range: [${min}, ${max}]`;
function validateNumberInRange(value, minValue, maxValue) {
  const valueBigInt = BigInt(value);
  if (valueBigInt > BigInt(maxValue) || valueBigInt < BigInt(minValue)) {
    throw new Error(outOfRangeErrorMessage(value, minValue, maxValue));
  }
}
function checkNumberRange(minValue, maxValue) {
  return (target, propertyKey, descriptor) => {
    const childFunction = descriptor.value;
    descriptor.value = function deco(value) {
      validateNumberInRange(value, minValue, maxValue);
      return childFunction.apply(this, [value]);
    };
    return descriptor;
  };
}

// src/core/accountAddress.ts
var AddressInvalidReason = /* @__PURE__ */ ((AddressInvalidReason2) => {
  AddressInvalidReason2["INCORRECT_NUMBER_OF_BYTES"] = "incorrect_number_of_bytes";
  AddressInvalidReason2["INVALID_HEX_CHARS"] = "invalid_hex_chars";
  AddressInvalidReason2["TOO_SHORT"] = "too_short";
  AddressInvalidReason2["TOO_LONG"] = "too_long";
  AddressInvalidReason2["LEADING_ZERO_X_REQUIRED"] = "leading_zero_x_required";
  AddressInvalidReason2["LONG_FORM_REQUIRED_UNLESS_SPECIAL"] = "long_form_required_unless_special";
  AddressInvalidReason2["INVALID_PADDING_ZEROES"] = "INVALID_PADDING_ZEROES";
  return AddressInvalidReason2;
})(AddressInvalidReason || {});
var _AccountAddress = class extends Serializable {
  constructor(args) {
    super();
    if (args.data.length !== _AccountAddress.LENGTH) {
      throw new ParsingError(
        "AccountAddress data should be exactly 32 bytes long",
        "incorrect_number_of_bytes" /* INCORRECT_NUMBER_OF_BYTES */
      );
    }
    this.data = args.data;
  }
  isSpecial() {
    return this.data.slice(0, this.data.length - 1).every((byte) => byte === 0) && this.data[this.data.length - 1] < 16;
  }
  toString() {
    return `0x${this.toStringWithoutPrefix()}`;
  }
  toStringWithoutPrefix() {
    let hex = (0, import_utils2.bytesToHex)(this.data);
    if (this.isSpecial()) {
      hex = hex[hex.length - 1];
    }
    return hex;
  }
  toStringLong() {
    return `0x${this.toStringLongWithoutPrefix()}`;
  }
  toStringLongWithoutPrefix() {
    return (0, import_utils2.bytesToHex)(this.data);
  }
  toUint8Array() {
    return this.data;
  }
  serialize(serializer) {
    serializer.serializeFixedBytes(this.data);
  }
  serializeForEntryFunction(serializer) {
    const bcsBytes = this.bcsToBytes();
    serializer.serializeBytes(bcsBytes);
  }
  serializeForScriptFunction(serializer) {
    serializer.serializeU32AsUleb128(3 /* Address */);
    serializer.serialize(this);
  }
  static deserialize(deserializer) {
    const bytes = deserializer.deserializeFixedBytes(_AccountAddress.LENGTH);
    return new _AccountAddress({ data: bytes });
  }
  static fromString(input) {
    if (!input.startsWith("0x")) {
      throw new ParsingError("Hex string must start with a leading 0x.", "leading_zero_x_required" /* LEADING_ZERO_X_REQUIRED */);
    }
    const address = _AccountAddress.fromStringRelaxed(input);
    if (input.length !== _AccountAddress.LONG_STRING_LENGTH + 2) {
      if (!address.isSpecial()) {
        throw new ParsingError(
          `The given hex string ${address} is not a special address, it must be represented as 0x + 64 chars.`,
          "long_form_required_unless_special" /* LONG_FORM_REQUIRED_UNLESS_SPECIAL */
        );
      } else if (input.length !== 3) {
        throw new ParsingError(
          `The given hex string ${input} is a special address not in LONG form, it must be 0x0 to 0xf without padding zeroes.`,
          "INVALID_PADDING_ZEROES" /* INVALID_PADDING_ZEROES */
        );
      }
    }
    return address;
  }
  static fromStringRelaxed(input) {
    let parsedInput = input;
    if (input.startsWith("0x")) {
      parsedInput = input.slice(2);
    }
    if (parsedInput.length === 0) {
      throw new ParsingError(
        "Hex string is too short, must be 1 to 64 chars long, excluding the leading 0x.",
        "too_short" /* TOO_SHORT */
      );
    }
    if (parsedInput.length > 64) {
      throw new ParsingError(
        "Hex string is too long, must be 1 to 64 chars long, excluding the leading 0x.",
        "too_long" /* TOO_LONG */
      );
    }
    let addressBytes;
    try {
      addressBytes = (0, import_utils2.hexToBytes)(parsedInput.padStart(64, "0"));
    } catch (e) {
      const error = e;
      throw new ParsingError(`Hex characters are invalid: ${error.message}`, "invalid_hex_chars" /* INVALID_HEX_CHARS */);
    }
    return new _AccountAddress({ data: addressBytes });
  }
  static fromHexInput(input) {
    if (input instanceof Uint8Array) {
      return new _AccountAddress({ data: input });
    }
    return _AccountAddress.fromString(input);
  }
  static fromHexInputRelaxed(hexInput) {
    if (hexInput instanceof Uint8Array) {
      return new _AccountAddress({ data: hexInput });
    }
    return _AccountAddress.fromStringRelaxed(hexInput);
  }
  static isValid(args) {
    try {
      if (args.relaxed) {
        _AccountAddress.fromStringRelaxed(args.input);
      } else {
        _AccountAddress.fromString(args.input);
      }
      return { valid: true };
    } catch (e) {
      const error = e;
      return {
        valid: false,
        invalidReason: error.invalidReason,
        invalidReasonMessage: error.message
      };
    }
  }
  equals(other) {
    if (this.data.length !== other.data.length)
      return false;
    return this.data.every((value, index) => value === other.data[index]);
  }
};
var AccountAddress = _AccountAddress;
AccountAddress.LENGTH = 32;
AccountAddress.LONG_STRING_LENGTH = 64;
AccountAddress.ZERO = _AccountAddress.fromString("0x0");
AccountAddress.ONE = _AccountAddress.fromString("0x1");
AccountAddress.TWO = _AccountAddress.fromString("0x2");
AccountAddress.THREE = _AccountAddress.fromString("0x3");
AccountAddress.FOUR = _AccountAddress.fromString("0x4");

// src/core/authenticationKey.ts
var import_sha32 = require("@noble/hashes/sha3");

// src/core/crypto/ed25519.ts
var import_tweetnacl = __toESM(require("tweetnacl"));

// src/bcs/deserializer.ts
var Deserializer = class {
  constructor(data) {
    this.buffer = new ArrayBuffer(data.length);
    new Uint8Array(this.buffer).set(data, 0);
    this.offset = 0;
  }
  read(length) {
    if (this.offset + length > this.buffer.byteLength) {
      throw new Error("Reached to the end of buffer");
    }
    const bytes = this.buffer.slice(this.offset, this.offset + length);
    this.offset += length;
    return bytes;
  }
  deserializeStr() {
    const value = this.deserializeBytes();
    const textDecoder = new TextDecoder();
    return textDecoder.decode(value);
  }
  deserializeBytes() {
    const len = this.deserializeUleb128AsU32();
    return new Uint8Array(this.read(len));
  }
  deserializeFixedBytes(len) {
    return new Uint8Array(this.read(len));
  }
  deserializeBool() {
    const bool = new Uint8Array(this.read(1))[0];
    if (bool !== 1 && bool !== 0) {
      throw new Error("Invalid boolean value");
    }
    return bool === 1;
  }
  deserializeU8() {
    return new DataView(this.read(1)).getUint8(0);
  }
  deserializeU16() {
    return new DataView(this.read(2)).getUint16(0, true);
  }
  deserializeU32() {
    return new DataView(this.read(4)).getUint32(0, true);
  }
  deserializeU64() {
    const low = this.deserializeU32();
    const high = this.deserializeU32();
    return BigInt(BigInt(high) << BigInt(32) | BigInt(low));
  }
  deserializeU128() {
    const low = this.deserializeU64();
    const high = this.deserializeU64();
    return BigInt(high << BigInt(64) | low);
  }
  deserializeU256() {
    const low = this.deserializeU128();
    const high = this.deserializeU128();
    return BigInt(high << BigInt(128) | low);
  }
  deserializeUleb128AsU32() {
    let value = BigInt(0);
    let shift = 0;
    while (value < MAX_U32_NUMBER) {
      const byte = this.deserializeU8();
      value |= BigInt(byte & 127) << BigInt(shift);
      if ((byte & 128) === 0) {
        break;
      }
      shift += 7;
    }
    if (value > MAX_U32_NUMBER) {
      throw new Error("Overflow while parsing uleb128-encoded uint32 value");
    }
    return Number(value);
  }
  deserialize(cls) {
    return cls.deserialize(this);
  }
  deserializeVector(cls) {
    const length = this.deserializeUleb128AsU32();
    const vector = new Array();
    for (let i = 0; i < length; i += 1) {
      vector.push(this.deserialize(cls));
    }
    return vector;
  }
};

// src/bcs/serializable/fixedBytes.ts
var FixedBytes = class extends Serializable {
  constructor(value) {
    super();
    this.value = Hex.fromHexInput(value).toUint8Array();
  }
  serialize(serializer) {
    serializer.serializeFixedBytes(this.value);
  }
  serializeForEntryFunction(serializer) {
    serializer.serialize(this);
  }
  serializeForScriptFunction(serializer) {
    serializer.serialize(this);
  }
  static deserialize(deserializer, length) {
    const bytes = deserializer.deserializeFixedBytes(length);
    return new FixedBytes(bytes);
  }
};

// src/bcs/serializable/entryFunctionBytes.ts
var EntryFunctionBytes = class extends Serializable {
  constructor(value) {
    super();
    this.value = new FixedBytes(value);
  }
  serialize(serializer) {
    serializer.serialize(this.value);
  }
  serializeForEntryFunction(serializer) {
    serializer.serializeU32AsUleb128(this.value.value.length);
    serializer.serialize(this);
  }
  static deserialize(deserializer, length) {
    const fixedBytes = FixedBytes.deserialize(deserializer, length);
    return new EntryFunctionBytes(fixedBytes.value);
  }
};

// src/bcs/serializable/movePrimitives.ts
var Bool = class extends Serializable {
  constructor(value) {
    super();
    ensureBoolean(value);
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeBool(this.value);
  }
  serializeForEntryFunction(serializer) {
    const bcsBytes = this.bcsToBytes();
    serializer.serializeBytes(bcsBytes);
  }
  serializeForScriptFunction(serializer) {
    serializer.serializeU32AsUleb128(5 /* Bool */);
    serializer.serialize(this);
  }
  static deserialize(deserializer) {
    return new Bool(deserializer.deserializeBool());
  }
};
var U8 = class extends Serializable {
  constructor(value) {
    super();
    validateNumberInRange(value, 0, MAX_U8_NUMBER);
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU8(this.value);
  }
  serializeForEntryFunction(serializer) {
    const bcsBytes = this.bcsToBytes();
    serializer.serializeBytes(bcsBytes);
  }
  serializeForScriptFunction(serializer) {
    serializer.serializeU32AsUleb128(0 /* U8 */);
    serializer.serialize(this);
  }
  static deserialize(deserializer) {
    return new U8(deserializer.deserializeU8());
  }
};
var U16 = class extends Serializable {
  constructor(value) {
    super();
    validateNumberInRange(value, 0, MAX_U16_NUMBER);
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU16(this.value);
  }
  serializeForEntryFunction(serializer) {
    const bcsBytes = this.bcsToBytes();
    serializer.serializeBytes(bcsBytes);
  }
  serializeForScriptFunction(serializer) {
    serializer.serializeU32AsUleb128(6 /* U16 */);
    serializer.serialize(this);
  }
  static deserialize(deserializer) {
    return new U16(deserializer.deserializeU16());
  }
};
var U32 = class extends Serializable {
  constructor(value) {
    super();
    validateNumberInRange(value, 0, MAX_U32_NUMBER);
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32(this.value);
  }
  serializeForEntryFunction(serializer) {
    const bcsBytes = this.bcsToBytes();
    serializer.serializeBytes(bcsBytes);
  }
  serializeForScriptFunction(serializer) {
    serializer.serializeU32AsUleb128(7 /* U32 */);
    serializer.serialize(this);
  }
  static deserialize(deserializer) {
    return new U32(deserializer.deserializeU32());
  }
};
var U64 = class extends Serializable {
  constructor(value) {
    super();
    validateNumberInRange(value, BigInt(0), MAX_U64_BIG_INT);
    this.value = BigInt(value);
  }
  serialize(serializer) {
    serializer.serializeU64(this.value);
  }
  serializeForEntryFunction(serializer) {
    const bcsBytes = this.bcsToBytes();
    serializer.serializeBytes(bcsBytes);
  }
  serializeForScriptFunction(serializer) {
    serializer.serializeU32AsUleb128(1 /* U64 */);
    serializer.serialize(this);
  }
  static deserialize(deserializer) {
    return new U64(deserializer.deserializeU64());
  }
};
var U128 = class extends Serializable {
  constructor(value) {
    super();
    validateNumberInRange(value, BigInt(0), MAX_U128_BIG_INT);
    this.value = BigInt(value);
  }
  serialize(serializer) {
    serializer.serializeU128(this.value);
  }
  serializeForEntryFunction(serializer) {
    const bcsBytes = this.bcsToBytes();
    serializer.serializeBytes(bcsBytes);
  }
  serializeForScriptFunction(serializer) {
    serializer.serializeU32AsUleb128(2 /* U128 */);
    serializer.serialize(this);
  }
  static deserialize(deserializer) {
    return new U128(deserializer.deserializeU128());
  }
};
var U256 = class extends Serializable {
  constructor(value) {
    super();
    validateNumberInRange(value, BigInt(0), MAX_U256_BIG_INT);
    this.value = BigInt(value);
  }
  serialize(serializer) {
    serializer.serializeU256(this.value);
  }
  serializeForEntryFunction(serializer) {
    const bcsBytes = this.bcsToBytes();
    serializer.serializeBytes(bcsBytes);
  }
  serializeForScriptFunction(serializer) {
    serializer.serializeU32AsUleb128(8 /* U256 */);
    serializer.serialize(this);
  }
  static deserialize(deserializer) {
    return new U256(deserializer.deserializeU256());
  }
};

// src/bcs/serializable/moveStructs.ts
var MoveVector = class extends Serializable {
  constructor(values) {
    super();
    this.values = values;
  }
  serializeForEntryFunction(serializer) {
    const bcsBytes = this.bcsToBytes();
    serializer.serializeBytes(bcsBytes);
  }
  serializeForScriptFunction(serializer) {
    const isU8 = this.values[0] instanceof U8;
    if (!isU8) {
      throw new Error("Script function arguments only accept u8 vectors");
    }
    serializer.serializeU32AsUleb128(4 /* U8Vector */);
    serializer.serialize(this);
  }
  static U8(values) {
    let numbers;
    if (Array.isArray(values) && typeof values[0] === "number") {
      numbers = values;
    } else if (typeof values === "string") {
      const hex = Hex.fromHexInput(values);
      numbers = Array.from(hex.toUint8Array());
    } else if (values instanceof Uint8Array) {
      numbers = Array.from(values);
    } else {
      throw new Error("Invalid input type");
    }
    return new MoveVector(numbers.map((v) => new U8(v)));
  }
  static U16(values) {
    return new MoveVector(values.map((v) => new U16(v)));
  }
  static U32(values) {
    return new MoveVector(values.map((v) => new U32(v)));
  }
  static U64(values) {
    return new MoveVector(values.map((v) => new U64(v)));
  }
  static U128(values) {
    return new MoveVector(values.map((v) => new U128(v)));
  }
  static U256(values) {
    return new MoveVector(values.map((v) => new U256(v)));
  }
  static Bool(values) {
    return new MoveVector(values.map((v) => new Bool(v)));
  }
  static MoveString(values) {
    return new MoveVector(values.map((v) => new MoveString(v)));
  }
  serialize(serializer) {
    serializer.serializeVector(this.values);
  }
  static deserialize(deserializer, cls) {
    const length = deserializer.deserializeUleb128AsU32();
    const values = new Array();
    for (let i = 0; i < length; i += 1) {
      values.push(cls.deserialize(deserializer));
    }
    return new MoveVector(values);
  }
};
var MoveString = class extends Serializable {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeStr(this.value);
  }
  serializeForEntryFunction(serializer) {
    const bcsBytes = this.bcsToBytes();
    serializer.serializeBytes(bcsBytes);
  }
  serializeForScriptFunction(serializer) {
    const vectorU8 = MoveVector.U8(this.bcsToBytes());
    vectorU8.serializeForScriptFunction(serializer);
  }
  static deserialize(deserializer) {
    return new MoveString(deserializer.deserializeStr());
  }
};
var MoveOption = class extends Serializable {
  constructor(value) {
    super();
    if (typeof value !== "undefined" && value !== null) {
      this.vec = new MoveVector([value]);
    } else {
      this.vec = new MoveVector([]);
    }
    [this.value] = this.vec.values;
  }
  serializeForEntryFunction(serializer) {
    const bcsBytes = this.bcsToBytes();
    serializer.serializeBytes(bcsBytes);
  }
  unwrap() {
    if (!this.isSome()) {
      throw new Error("Called unwrap on a MoveOption with no value");
    } else {
      return this.vec.values[0];
    }
  }
  isSome() {
    return this.vec.values.length === 1;
  }
  serialize(serializer) {
    this.vec.serialize(serializer);
  }
  static U8(value) {
    return new MoveOption(value !== null && value !== void 0 ? new U8(value) : void 0);
  }
  static U16(value) {
    return new MoveOption(value !== null && value !== void 0 ? new U16(value) : void 0);
  }
  static U32(value) {
    return new MoveOption(value !== null && value !== void 0 ? new U32(value) : void 0);
  }
  static U64(value) {
    return new MoveOption(value !== null && value !== void 0 ? new U64(value) : void 0);
  }
  static U128(value) {
    return new MoveOption(value !== null && value !== void 0 ? new U128(value) : void 0);
  }
  static U256(value) {
    return new MoveOption(value !== null && value !== void 0 ? new U256(value) : void 0);
  }
  static Bool(value) {
    return new MoveOption(value !== null && value !== void 0 ? new Bool(value) : void 0);
  }
  static MoveString(value) {
    return new MoveOption(value !== null && value !== void 0 ? new MoveString(value) : void 0);
  }
  static deserialize(deserializer, cls) {
    const vector = MoveVector.deserialize(deserializer, cls);
    return new MoveOption(vector.values[0]);
  }
};

// src/core/crypto/asymmetricCrypto.ts
var PublicKey = class extends Serializable {
};
var PrivateKey = class extends Serializable {
};
var Signature = class extends Serializable {
};

// src/core/crypto/ed25519.ts
var _Ed25519PublicKey = class extends PublicKey {
  constructor(hexInput) {
    super();
    const hex = Hex.fromHexInput(hexInput);
    if (hex.toUint8Array().length !== _Ed25519PublicKey.LENGTH) {
      throw new Error(`PublicKey length should be ${_Ed25519PublicKey.LENGTH}`);
    }
    this.key = hex;
  }
  toUint8Array() {
    return this.key.toUint8Array();
  }
  toString() {
    return this.key.toString();
  }
  verifySignature(args) {
    const { message, signature } = args;
    const rawMessage = Hex.fromHexInput(message).toUint8Array();
    const rawSignature = Hex.fromHexInput(signature.toUint8Array()).toUint8Array();
    return import_tweetnacl.default.sign.detached.verify(rawMessage, rawSignature, this.key.toUint8Array());
  }
  serialize(serializer) {
    serializer.serializeBytes(this.key.toUint8Array());
  }
  static deserialize(deserializer) {
    const bytes = deserializer.deserializeBytes();
    return new _Ed25519PublicKey(bytes);
  }
  static load(deserializer) {
    const bytes = deserializer.deserializeBytes();
    return new _Ed25519PublicKey(bytes);
  }
};
var Ed25519PublicKey = _Ed25519PublicKey;
Ed25519PublicKey.LENGTH = 32;
var _Ed25519PrivateKey = class extends PrivateKey {
  constructor(hexInput) {
    super();
    const privateKeyHex = Hex.fromHexInput(hexInput);
    if (privateKeyHex.toUint8Array().length !== _Ed25519PrivateKey.LENGTH) {
      throw new Error(`PrivateKey length should be ${_Ed25519PrivateKey.LENGTH}`);
    }
    this.signingKeyPair = import_tweetnacl.default.sign.keyPair.fromSeed(privateKeyHex.toUint8Array().slice(0, _Ed25519PrivateKey.LENGTH));
  }
  toUint8Array() {
    return this.signingKeyPair.secretKey.slice(0, _Ed25519PrivateKey.LENGTH);
  }
  toString() {
    return Hex.fromHexInput(this.toUint8Array()).toString();
  }
  sign(message) {
    const hex = Hex.fromHexInput(message);
    const signature = import_tweetnacl.default.sign.detached(hex.toUint8Array(), this.signingKeyPair.secretKey);
    return new Ed25519Signature(signature);
  }
  serialize(serializer) {
    serializer.serializeBytes(this.toUint8Array());
  }
  static deserialize(deserializer) {
    const bytes = deserializer.deserializeBytes();
    return new _Ed25519PrivateKey(bytes);
  }
  static generate() {
    const keyPair = import_tweetnacl.default.sign.keyPair();
    return new _Ed25519PrivateKey(keyPair.secretKey.slice(0, _Ed25519PrivateKey.LENGTH));
  }
  publicKey() {
    const bytes = this.signingKeyPair.publicKey;
    return new Ed25519PublicKey(bytes);
  }
};
var Ed25519PrivateKey = _Ed25519PrivateKey;
Ed25519PrivateKey.LENGTH = 32;
var _Ed25519Signature = class extends Signature {
  constructor(hexInput) {
    super();
    const hex = Hex.fromHexInput(hexInput);
    if (hex.toUint8Array().length !== _Ed25519Signature.LENGTH) {
      throw new Error(`Signature length should be ${_Ed25519Signature.LENGTH}`);
    }
    this.data = hex;
  }
  toUint8Array() {
    return this.data.toUint8Array();
  }
  toString() {
    return this.data.toString();
  }
  serialize(serializer) {
    serializer.serializeBytes(this.data.toUint8Array());
  }
  static deserialize(deserializer) {
    const bytes = deserializer.deserializeBytes();
    return new _Ed25519Signature(bytes);
  }
  static load(deserializer) {
    const bytes = deserializer.deserializeBytes();
    return new _Ed25519Signature(bytes);
  }
};
var Ed25519Signature = _Ed25519Signature;
Ed25519Signature.LENGTH = 64;

// src/core/crypto/multiEd25519.ts
var _MultiEd25519PublicKey = class extends PublicKey {
  constructor(args) {
    super();
    const { publicKeys, threshold } = args;
    if (publicKeys.length > _MultiEd25519PublicKey.MAX_KEYS || publicKeys.length < _MultiEd25519PublicKey.MIN_KEYS) {
      throw new Error(
        `Must have between ${_MultiEd25519PublicKey.MIN_KEYS} and ${_MultiEd25519PublicKey.MAX_KEYS} public keys, inclusive`
      );
    }
    if (threshold < _MultiEd25519PublicKey.MIN_THRESHOLD || threshold > publicKeys.length) {
      throw new Error(
        `Threshold must be between ${_MultiEd25519PublicKey.MIN_THRESHOLD} and ${publicKeys.length}, inclusive`
      );
    }
    this.publicKeys = publicKeys;
    this.threshold = threshold;
  }
  toUint8Array() {
    const bytes = new Uint8Array(this.publicKeys.length * Ed25519PublicKey.LENGTH + 1);
    this.publicKeys.forEach((k, i) => {
      bytes.set(k.toUint8Array(), i * Ed25519PublicKey.LENGTH);
    });
    bytes[this.publicKeys.length * Ed25519PublicKey.LENGTH] = this.threshold;
    return bytes;
  }
  toString() {
    return Hex.fromHexInput(this.toUint8Array()).toString();
  }
  verifySignature(args) {
    throw new Error("TODO - Method not implemented.");
  }
  serialize(serializer) {
    serializer.serializeBytes(this.toUint8Array());
  }
  static deserialize(deserializer) {
    const bytes = deserializer.deserializeBytes();
    const threshold = bytes[bytes.length - 1];
    const keys = [];
    for (let i = 0; i < bytes.length - 1; i += Ed25519PublicKey.LENGTH) {
      const begin = i;
      keys.push(new Ed25519PublicKey(bytes.subarray(begin, begin + Ed25519PublicKey.LENGTH)));
    }
    return new _MultiEd25519PublicKey({ publicKeys: keys, threshold });
  }
};
var MultiEd25519PublicKey = _MultiEd25519PublicKey;
MultiEd25519PublicKey.MAX_KEYS = 32;
MultiEd25519PublicKey.MIN_KEYS = 2;
MultiEd25519PublicKey.MIN_THRESHOLD = 1;
var _MultiEd25519Signature = class extends Signature {
  constructor(args) {
    super();
    const { signatures, bitmap } = args;
    if (bitmap.length !== _MultiEd25519Signature.BITMAP_LEN) {
      throw new Error(`"bitmap" length should be ${_MultiEd25519Signature.BITMAP_LEN}`);
    }
    if (signatures.length > _MultiEd25519Signature.MAX_SIGNATURES_SUPPORTED) {
      throw new Error(
        `The number of signatures cannot be greater than ${_MultiEd25519Signature.MAX_SIGNATURES_SUPPORTED}`
      );
    }
    this.signatures = signatures;
    this.bitmap = bitmap;
  }
  toUint8Array() {
    const bytes = new Uint8Array(this.signatures.length * Ed25519Signature.LENGTH + _MultiEd25519Signature.BITMAP_LEN);
    this.signatures.forEach((k, i) => {
      bytes.set(k.toUint8Array(), i * Ed25519Signature.LENGTH);
    });
    bytes.set(this.bitmap, this.signatures.length * Ed25519Signature.LENGTH);
    return bytes;
  }
  toString() {
    return Hex.fromHexInput(this.toUint8Array()).toString();
  }
  static createBitmap(args) {
    const { bits } = args;
    const firstBitInByte = 128;
    const bitmap = new Uint8Array([0, 0, 0, 0]);
    const dupCheckSet = /* @__PURE__ */ new Set();
    bits.forEach((bit) => {
      if (bit >= _MultiEd25519Signature.MAX_SIGNATURES_SUPPORTED) {
        throw new Error(`Cannot have a signature larger than ${_MultiEd25519Signature.MAX_SIGNATURES_SUPPORTED - 1}.`);
      }
      if (dupCheckSet.has(bit)) {
        throw new Error("Duplicate bits detected.");
      }
      dupCheckSet.add(bit);
      const byteOffset = Math.floor(bit / 8);
      let byte = bitmap[byteOffset];
      byte |= firstBitInByte >> bit % 8;
      bitmap[byteOffset] = byte;
    });
    return bitmap;
  }
  serialize(serializer) {
    serializer.serializeBytes(this.toUint8Array());
  }
  static deserialize(deserializer) {
    const bytes = deserializer.deserializeBytes();
    const bitmap = bytes.subarray(bytes.length - 4);
    const signatures = [];
    for (let i = 0; i < bytes.length - bitmap.length; i += Ed25519Signature.LENGTH) {
      const begin = i;
      signatures.push(new Ed25519Signature(bytes.subarray(begin, begin + Ed25519Signature.LENGTH)));
    }
    return new _MultiEd25519Signature({ signatures, bitmap });
  }
};
var MultiEd25519Signature = _MultiEd25519Signature;
MultiEd25519Signature.MAX_SIGNATURES_SUPPORTED = 32;
MultiEd25519Signature.BITMAP_LEN = 4;

// src/core/crypto/secp256k1.ts
var import_sha3 = require("@noble/hashes/sha3");
var import_secp256k1 = require("@noble/curves/secp256k1");
var _Secp256k1PublicKey = class extends PublicKey {
  constructor(hexInput) {
    super();
    const hex = Hex.fromHexInput(hexInput);
    if (hex.toUint8Array().length !== _Secp256k1PublicKey.LENGTH) {
      throw new Error(`PublicKey length should be ${_Secp256k1PublicKey.LENGTH}`);
    }
    this.key = hex;
  }
  toUint8Array() {
    return this.key.toUint8Array();
  }
  toString() {
    return this.key.toString();
  }
  verifySignature(args) {
    const { message, signature } = args;
    const msgHex = Hex.fromHexInput(message).toUint8Array();
    const sha3Message = (0, import_sha3.sha3_256)(msgHex);
    const rawSignature = signature.toUint8Array();
    return import_secp256k1.secp256k1.verify(rawSignature, sha3Message, this.toUint8Array());
  }
  serialize(serializer) {
    serializer.serializeBytes(this.key.toUint8Array());
  }
  static deserialize(deserializer) {
    const bytes = deserializer.deserializeBytes();
    return new _Secp256k1PublicKey(bytes);
  }
  static load(deserializer) {
    const bytes = deserializer.deserializeBytes();
    return new _Secp256k1PublicKey(bytes);
  }
};
var Secp256k1PublicKey = _Secp256k1PublicKey;
Secp256k1PublicKey.LENGTH = 65;
var _Secp256k1PrivateKey = class extends PrivateKey {
  constructor(hexInput) {
    super();
    const privateKeyHex = Hex.fromHexInput(hexInput);
    if (privateKeyHex.toUint8Array().length !== _Secp256k1PrivateKey.LENGTH) {
      throw new Error(`PrivateKey length should be ${_Secp256k1PrivateKey.LENGTH}`);
    }
    this.key = privateKeyHex;
  }
  toUint8Array() {
    return this.key.toUint8Array();
  }
  toString() {
    return this.key.toString();
  }
  sign(message) {
    const msgHex = Hex.fromHexInput(message);
    const sha3Message = (0, import_sha3.sha3_256)(msgHex.toUint8Array());
    const signature = import_secp256k1.secp256k1.sign(sha3Message, this.key.toUint8Array());
    return new Secp256k1Signature(signature.toCompactRawBytes());
  }
  serialize(serializer) {
    serializer.serializeBytes(this.toUint8Array());
  }
  static deserialize(deserializer) {
    const bytes = deserializer.deserializeBytes();
    return new _Secp256k1PrivateKey(bytes);
  }
  static generate() {
    const hexInput = import_secp256k1.secp256k1.utils.randomPrivateKey();
    return new _Secp256k1PrivateKey(hexInput);
  }
  publicKey() {
    const bytes = import_secp256k1.secp256k1.getPublicKey(this.key.toUint8Array(), false);
    return new Secp256k1PublicKey(bytes);
  }
};
var Secp256k1PrivateKey = _Secp256k1PrivateKey;
Secp256k1PrivateKey.LENGTH = 32;
var _Secp256k1Signature = class extends Signature {
  constructor(hexInput) {
    super();
    const hex = Hex.fromHexInput(hexInput);
    if (hex.toUint8Array().length !== _Secp256k1Signature.LENGTH) {
      throw new Error(`Signature length should be ${_Secp256k1Signature.LENGTH}, recieved ${hex.toUint8Array().length}`);
    }
    this.data = hex;
  }
  toUint8Array() {
    return this.data.toUint8Array();
  }
  toString() {
    return this.data.toString();
  }
  serialize(serializer) {
    serializer.serializeBytes(this.data.toUint8Array());
  }
  static deserialize(deserializer) {
    const hex = deserializer.deserializeBytes();
    return new _Secp256k1Signature(hex);
  }
  static load(deserializer) {
    const bytes = deserializer.deserializeBytes();
    return new _Secp256k1Signature(bytes);
  }
};
var Secp256k1Signature = _Secp256k1Signature;
Secp256k1Signature.LENGTH = 64;

// src/core/crypto/anyPublicKey.ts
var AnyPublicKey = class extends PublicKey {
  constructor(publicKey) {
    super();
    this.publicKey = publicKey;
  }
  toUint8Array() {
    return this.publicKey.toUint8Array();
  }
  toString() {
    return this.publicKey.toString();
  }
  verifySignature(args) {
    const { message, signature } = args;
    return this.publicKey.verifySignature({ message, signature });
  }
  serialize(serializer) {
    if (this.publicKey instanceof Ed25519PublicKey) {
      serializer.serializeU32AsUleb128(0 /* Ed25519 */);
      this.publicKey.serialize(serializer);
    } else if (this.publicKey instanceof Secp256k1PublicKey) {
      serializer.serializeU32AsUleb128(1 /* Secp256k1 */);
      this.publicKey.serialize(serializer);
    } else {
      throw new Error("Unknown public key type");
    }
  }
  static deserialize(deserializer) {
    const index = deserializer.deserializeUleb128AsU32();
    switch (index) {
      case 0 /* Ed25519 */:
        return new AnyPublicKey(Ed25519PublicKey.load(deserializer));
      case 1 /* Secp256k1 */:
        return new AnyPublicKey(Secp256k1PublicKey.load(deserializer));
      default:
        throw new Error(`Unknown variant index for AnyPublicKey: ${index}`);
    }
  }
};

// src/core/crypto/multiKey.ts
var MultiKey = class extends PublicKey {
  constructor(args) {
    super();
    const { publicKeys, signaturesRequired } = args;
    if (signaturesRequired < 1) {
      throw new Error("The number of required signatures needs to be greater then 0");
    }
    if (publicKeys.length < signaturesRequired) {
      throw new Error(
        `Provided ${publicKeys.length} public keys is smaller than the ${signaturesRequired} required signatures`
      );
    }
    const keys = [];
    publicKeys.forEach((publicKey) => {
      if (publicKey instanceof AnyPublicKey) {
        keys.push(publicKey);
      } else {
        keys.push(new AnyPublicKey(publicKey));
      }
    });
    this.publicKeys = keys;
    this.signaturesRequired = signaturesRequired;
  }
  toUint8Array() {
    return this.bcsToBytes();
  }
  createBitmap(args) {
    const { bits } = args;
    const firstBitInByte = 128;
    const bitmap = new Uint8Array([0, 0, 0, 0]);
    const dupCheckSet = /* @__PURE__ */ new Set();
    bits.forEach((bit, idx) => {
      if (idx + 1 > this.publicKeys.length) {
        throw new Error(`Signature index ${idx + 1} is out of public keys range, ${this.publicKeys.length}.`);
      }
      if (dupCheckSet.has(bit)) {
        throw new Error(`Duplicate bit ${bit} detected.`);
      }
      dupCheckSet.add(bit);
      const byteOffset = Math.floor(bit / 8);
      let byte = bitmap[byteOffset];
      byte |= firstBitInByte >> bit % 8;
      bitmap[byteOffset] = byte;
    });
    return bitmap;
  }
  toString() {
    return Hex.fromHexInput(this.toUint8Array()).toString();
  }
  verifySignature(args) {
    throw new Error("not implemented");
  }
  serialize(serializer) {
    serializer.serializeVector(this.publicKeys);
    serializer.serializeU8(this.signaturesRequired);
  }
  static deserialize(deserializer) {
    const keys = deserializer.deserializeVector(AnyPublicKey);
    const signaturesRequired = deserializer.deserializeU8();
    return new MultiKey({ publicKeys: keys, signaturesRequired });
  }
};

// src/core/authenticationKey.ts
var _AuthenticationKey = class extends Serializable {
  constructor(args) {
    super();
    const { data } = args;
    const hex = Hex.fromHexInput(data);
    if (hex.toUint8Array().length !== _AuthenticationKey.LENGTH) {
      throw new Error(`Authentication Key length should be ${_AuthenticationKey.LENGTH}`);
    }
    this.data = hex;
  }
  serialize(serializer) {
    serializer.serializeFixedBytes(this.data.toUint8Array());
  }
  static deserialize(deserializer) {
    const bytes = deserializer.deserializeFixedBytes(_AuthenticationKey.LENGTH);
    return new _AuthenticationKey({ data: bytes });
  }
  toString() {
    return this.data.toString();
  }
  toUint8Array() {
    return this.data.toUint8Array();
  }
  static fromPublicKeyAndScheme(args) {
    const { publicKey, scheme } = args;
    let authKeyBytes;
    switch (scheme) {
      case 3 /* MultiKey */:
      case 2 /* SingleKey */: {
        const singleKeyBytes = publicKey.bcsToBytes();
        authKeyBytes = new Uint8Array([...singleKeyBytes, scheme]);
        break;
      }
      case 0 /* Ed25519 */:
      case 1 /* MultiEd25519 */: {
        const ed25519PublicKeyBytes = publicKey.toUint8Array();
        const inputBytes = Hex.fromHexInput(ed25519PublicKeyBytes).toUint8Array();
        authKeyBytes = new Uint8Array([...inputBytes, scheme]);
        break;
      }
      default:
        throw new Error(`Scheme ${scheme} is not supported`);
    }
    const hash = import_sha32.sha3_256.create();
    hash.update(authKeyBytes);
    const hashDigest = hash.digest();
    return new _AuthenticationKey({ data: hashDigest });
  }
  static fromPublicKey(args) {
    const { publicKey } = args;
    let scheme;
    if (publicKey instanceof Ed25519PublicKey) {
      scheme = 0 /* Ed25519 */.valueOf();
    } else if (publicKey instanceof MultiEd25519PublicKey) {
      scheme = 1 /* MultiEd25519 */.valueOf();
    } else if (publicKey instanceof AnyPublicKey) {
      scheme = 2 /* SingleKey */.valueOf();
    } else if (publicKey instanceof MultiKey) {
      scheme = 3 /* MultiKey */.valueOf();
    } else {
      throw new Error("No supported authentication scheme for public key");
    }
    return _AuthenticationKey.fromPublicKeyAndScheme({ publicKey, scheme });
  }
  derivedAddress() {
    return new AccountAddress({ data: this.data.toUint8Array() });
  }
};
var AuthenticationKey = _AuthenticationKey;
AuthenticationKey.LENGTH = 32;

// src/utils/hdKey.ts
var import_hmac = require("@noble/hashes/hmac");
var import_sha512 = require("@noble/hashes/sha512");
var bip39 = __toESM(require("@scure/bip39"));
var APTOS_PATH_REGEX = /^m\/44'\/637'\/[0-9]+'\/[0-9]+'\/[0-9]+'?$/;
var KeyType = /* @__PURE__ */ ((KeyType2) => {
  KeyType2["ED25519"] = "ed25519 seed";
  return KeyType2;
})(KeyType || {});
var HARDENED_OFFSET = 2147483648;
var deriveKey = (hashSeed, data) => {
  const digest = import_hmac.hmac.create(import_sha512.sha512, hashSeed).update(data).digest();
  return {
    key: digest.slice(0, 32),
    chainCode: digest.slice(32)
  };
};
var CKDPriv = ({ key, chainCode }, index) => {
  const buffer = new ArrayBuffer(4);
  new DataView(buffer).setUint32(0, index);
  const indexBytes = new Uint8Array(buffer);
  const zero = new Uint8Array([0]);
  const data = new Uint8Array([...zero, ...key, ...indexBytes]);
  return deriveKey(chainCode, data);
};
var removeApostrophes = (val) => val.replace("'", "");
var splitPath = (path) => path.split("/").slice(1).map(removeApostrophes);
var isValidPath = (path) => {
  if (!APTOS_PATH_REGEX.test(path)) {
    return false;
  }
  return !splitPath(path).some(Number.isNaN);
};
var mnemonicToSeed = (mnemonic) => {
  const normalizedMnemonic = mnemonic.trim().split(/\s+/).map((part) => part.toLowerCase()).join(" ");
  return bip39.mnemonicToSeedSync(normalizedMnemonic);
};
var derivePrivateKeyFromMnemonic = (keyType, path, seedPhrase, offset = HARDENED_OFFSET) => {
  if (!isValidPath(path)) {
    throw new Error("Invalid derivation path");
  }
  const { key, chainCode } = deriveKey(keyType, mnemonicToSeed(seedPhrase));
  const segments = splitPath(path).map((el) => parseInt(el, 10));
  return segments.reduce((parentKeys, segment) => CKDPriv(parentKeys, segment + offset), { key, chainCode });
};

// src/core/account.ts
var Account = class {
  constructor(args) {
    const { privateKey, address, legacy } = args;
    this.publicKey = privateKey.publicKey();
    if (this.publicKey instanceof Ed25519PublicKey) {
      if (legacy) {
        this.signingScheme = 0 /* Ed25519 */;
      } else {
        this.publicKey = new AnyPublicKey(this.publicKey);
        this.signingScheme = 2 /* SingleKey */;
      }
    } else if (this.publicKey instanceof MultiEd25519PublicKey) {
      this.signingScheme = 1 /* MultiEd25519 */;
    } else if (this.publicKey instanceof Secp256k1PublicKey) {
      this.publicKey = new AnyPublicKey(this.publicKey);
      this.signingScheme = 2 /* SingleKey */;
    } else {
      throw new Error("Can not create new Account, unsupported public key type");
    }
    this.privateKey = privateKey;
    this.accountAddress = address;
  }
  static generate(args) {
    let privateKey;
    switch (args == null ? void 0 : args.scheme) {
      case 2 /* Secp256k1Ecdsa */:
        privateKey = Secp256k1PrivateKey.generate();
        break;
      default:
        privateKey = Ed25519PrivateKey.generate();
    }
    let publicKey = privateKey.publicKey();
    if (!(args == null ? void 0 : args.legacy)) {
      publicKey = new AnyPublicKey(privateKey.publicKey());
    }
    const address = new AccountAddress({
      data: Account.authKey({
        publicKey
      }).toUint8Array()
    });
    return new Account({ privateKey, address, legacy: args == null ? void 0 : args.legacy });
  }
  static fromPrivateKeyAndAddress(args) {
    const { privateKey, address, legacy } = args;
    return new Account({ privateKey, address, legacy });
  }
  static fromDerivationPath(args) {
    const { path, mnemonic } = args;
    const { key } = derivePrivateKeyFromMnemonic("ed25519 seed" /* ED25519 */, path, mnemonic);
    const privateKey = new Ed25519PrivateKey(key);
    const publicKey = privateKey.publicKey();
    const authKey = Account.authKey({ publicKey });
    const address = new AccountAddress({ data: authKey.toUint8Array() });
    return new Account({ privateKey, address, legacy: true });
  }
  static authKey(args) {
    const { publicKey } = args;
    const authKey = AuthenticationKey.fromPublicKey({ publicKey });
    return authKey.data;
  }
  sign(data) {
    return this.privateKey.sign(data);
  }
  verifySignature(args) {
    const { message, signature } = args;
    const rawMessage = Hex.fromHexInput(message).toUint8Array();
    return this.publicKey.verifySignature({ message: rawMessage, signature });
  }
};

// src/types/generated/queries.ts
var CurrentTokenOwnershipFieldsFragmentDoc = `
    fragment CurrentTokenOwnershipFields on current_token_ownerships_v2 {
  token_standard
  token_properties_mutated_v1
  token_data_id
  table_type_v1
  storage_id
  property_version_v1
  owner_address
  last_transaction_version
  last_transaction_timestamp
  is_soulbound_v2
  is_fungible_v2
  amount
  current_token_data {
    collection_id
    description
    is_fungible_v2
    largest_property_version_v1
    last_transaction_timestamp
    last_transaction_version
    maximum
    supply
    token_data_id
    token_name
    token_properties
    token_standard
    token_uri
    current_collection {
      collection_id
      collection_name
      creator_address
      current_supply
      description
      last_transaction_timestamp
      last_transaction_version
      max_supply
      mutable_description
      mutable_uri
      table_handle_v1
      token_standard
      total_minted_v2
      uri
    }
  }
}
    `;
var TokenActivitiesFieldsFragmentDoc = `
    fragment TokenActivitiesFields on token_activities_v2 {
  after_value
  before_value
  entry_function_id_str
  event_account_address
  event_index
  from_address
  is_fungible_v2
  property_version_v1
  to_address
  token_amount
  token_data_id
  token_standard
  transaction_timestamp
  transaction_version
  type
}
    `;
var GetAccountCoinsCount = `
    query getAccountCoinsCount($address: String) {
  current_fungible_asset_balances_aggregate(
    where: {owner_address: {_eq: $address}}
  ) {
    aggregate {
      count
    }
  }
}
    `;
var GetAccountCoinsData = `
    query getAccountCoinsData($where_condition: current_fungible_asset_balances_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_fungible_asset_balances_order_by!]) {
  current_fungible_asset_balances(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    amount
    asset_type
    is_frozen
    is_primary
    last_transaction_timestamp
    last_transaction_version
    owner_address
    storage_id
    token_standard
    metadata {
      token_standard
      symbol
      supply_aggregator_table_key_v1
      supply_aggregator_table_handle_v1
      project_uri
      name
      last_transaction_version
      last_transaction_timestamp
      icon_uri
      decimals
      creator_address
      asset_type
    }
  }
}
    `;
var GetAccountCollectionsWithOwnedTokens = `
    query getAccountCollectionsWithOwnedTokens($where_condition: current_collection_ownership_v2_view_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_collection_ownership_v2_view_order_by!]) {
  current_collection_ownership_v2_view(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    current_collection {
      collection_id
      collection_name
      creator_address
      current_supply
      description
      last_transaction_timestamp
      last_transaction_version
      mutable_description
      max_supply
      mutable_uri
      table_handle_v1
      token_standard
      total_minted_v2
      uri
    }
    collection_id
    collection_name
    collection_uri
    creator_address
    distinct_tokens
    last_transaction_version
    owner_address
    single_token_uri
  }
}
    `;
var GetAccountOwnedObjects = `
    query getAccountOwnedObjects($where_condition: current_objects_bool_exp, $offset: Int, $limit: Int, $order_by: [current_objects_order_by!]) {
  current_objects(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    allow_ungated_transfer
    state_key_hash
    owner_address
    object_address
    last_transaction_version
    last_guid_creation_num
    is_deleted
  }
}
    `;
var GetAccountOwnedTokens = `
    query getAccountOwnedTokens($where_condition: current_token_ownerships_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_token_ownerships_v2_order_by!]) {
  current_token_ownerships_v2(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    ...CurrentTokenOwnershipFields
  }
}
    ${CurrentTokenOwnershipFieldsFragmentDoc}`;
var GetAccountOwnedTokensByTokenData = `
    query getAccountOwnedTokensByTokenData($where_condition: current_token_ownerships_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_token_ownerships_v2_order_by!]) {
  current_token_ownerships_v2(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    ...CurrentTokenOwnershipFields
  }
}
    ${CurrentTokenOwnershipFieldsFragmentDoc}`;
var GetAccountOwnedTokensFromCollection = `
    query getAccountOwnedTokensFromCollection($where_condition: current_token_ownerships_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_token_ownerships_v2_order_by!]) {
  current_token_ownerships_v2(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    ...CurrentTokenOwnershipFields
  }
}
    ${CurrentTokenOwnershipFieldsFragmentDoc}`;
var GetAccountTokensCount = `
    query getAccountTokensCount($where_condition: current_token_ownerships_v2_bool_exp, $offset: Int, $limit: Int) {
  current_token_ownerships_v2_aggregate(
    where: $where_condition
    offset: $offset
    limit: $limit
  ) {
    aggregate {
      count
    }
  }
}
    `;
var GetAccountTransactionsCount = `
    query getAccountTransactionsCount($address: String) {
  account_transactions_aggregate(where: {account_address: {_eq: $address}}) {
    aggregate {
      count
    }
  }
}
    `;
var GetChainTopUserTransactions = `
    query getChainTopUserTransactions($limit: Int) {
  user_transactions(limit: $limit, order_by: {version: desc}) {
    version
  }
}
    `;
var GetCollectionData = `
    query getCollectionData($where_condition: current_collections_v2_bool_exp!) {
  current_collections_v2(where: $where_condition) {
    collection_id
    collection_name
    creator_address
    current_supply
    description
    last_transaction_timestamp
    last_transaction_version
    max_supply
    mutable_description
    mutable_uri
    table_handle_v1
    token_standard
    total_minted_v2
    uri
  }
}
    `;
var GetCurrentFungibleAssetBalances = `
    query getCurrentFungibleAssetBalances($where_condition: current_fungible_asset_balances_bool_exp, $offset: Int, $limit: Int) {
  current_fungible_asset_balances(
    where: $where_condition
    offset: $offset
    limit: $limit
  ) {
    amount
    asset_type
    is_frozen
    is_primary
    last_transaction_timestamp
    last_transaction_version
    owner_address
    storage_id
    token_standard
  }
}
    `;
var GetDelegatedStakingActivities = `
    query getDelegatedStakingActivities($delegatorAddress: String, $poolAddress: String) {
  delegated_staking_activities(
    where: {delegator_address: {_eq: $delegatorAddress}, pool_address: {_eq: $poolAddress}}
  ) {
    amount
    delegator_address
    event_index
    event_type
    pool_address
    transaction_version
  }
}
    `;
var GetEvents = `
    query getEvents($where_condition: events_bool_exp, $offset: Int, $limit: Int, $order_by: [events_order_by!]) {
  events(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    account_address
    creation_number
    data
    event_index
    sequence_number
    transaction_block_height
    transaction_version
    type
  }
}
    `;
var GetFungibleAssetActivities = `
    query getFungibleAssetActivities($where_condition: fungible_asset_activities_bool_exp, $offset: Int, $limit: Int) {
  fungible_asset_activities(
    where: $where_condition
    offset: $offset
    limit: $limit
  ) {
    amount
    asset_type
    block_height
    entry_function_id_str
    event_index
    gas_fee_payer_address
    is_frozen
    is_gas_fee
    is_transaction_success
    owner_address
    storage_id
    storage_refund_amount
    token_standard
    transaction_timestamp
    transaction_version
    type
  }
}
    `;
var GetFungibleAssetMetadata = `
    query getFungibleAssetMetadata($where_condition: fungible_asset_metadata_bool_exp, $offset: Int, $limit: Int) {
  fungible_asset_metadata(where: $where_condition, offset: $offset, limit: $limit) {
    icon_uri
    project_uri
    supply_aggregator_table_handle_v1
    supply_aggregator_table_key_v1
    creator_address
    asset_type
    decimals
    last_transaction_timestamp
    last_transaction_version
    name
    symbol
    token_standard
  }
}
    `;
var GetNumberOfDelegators = `
    query getNumberOfDelegators($where_condition: num_active_delegator_per_pool_bool_exp!, $order_by: [num_active_delegator_per_pool_order_by!]) {
  num_active_delegator_per_pool(where: $where_condition, order_by: $order_by) {
    num_active_delegator
    pool_address
  }
}
    `;
var GetProcessorStatus = `
    query getProcessorStatus {
  processor_status {
    last_success_version
    processor
    last_updated
  }
}
    `;
var GetTokenActivity = `
    query getTokenActivity($where_condition: token_activities_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [token_activities_v2_order_by!]) {
  token_activities_v2(
    where: $where_condition
    order_by: $order_by
    offset: $offset
    limit: $limit
  ) {
    ...TokenActivitiesFields
  }
}
    ${TokenActivitiesFieldsFragmentDoc}`;
var GetCurrentTokenOwnership = `
    query getCurrentTokenOwnership($where_condition: current_token_ownerships_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_token_ownerships_v2_order_by!]) {
  current_token_ownerships_v2(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    ...CurrentTokenOwnershipFields
  }
}
    ${CurrentTokenOwnershipFieldsFragmentDoc}`;
var GetTokenData = `
    query getTokenData($where_condition: current_token_datas_v2_bool_exp, $offset: Int, $limit: Int, $order_by: [current_token_datas_v2_order_by!]) {
  current_token_datas_v2(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    collection_id
    description
    is_fungible_v2
    largest_property_version_v1
    last_transaction_timestamp
    last_transaction_version
    maximum
    supply
    token_data_id
    token_name
    token_properties
    token_standard
    token_uri
    current_collection {
      collection_id
      collection_name
      creator_address
      current_supply
      description
      last_transaction_timestamp
      last_transaction_version
      max_supply
      mutable_description
      mutable_uri
      table_handle_v1
      token_standard
      total_minted_v2
      uri
    }
  }
}
    `;

// src/internal/general.ts
async function getLedgerInfo(args) {
  const { aptosConfig } = args;
  const { data } = await getAptosFullNode({
    aptosConfig,
    originMethod: "getLedgerInfo",
    path: ""
  });
  return data;
}
async function getBlockByVersion(args) {
  const { aptosConfig, ledgerVersion, options } = args;
  const { data } = await getAptosFullNode({
    aptosConfig,
    originMethod: "getBlockByVersion",
    path: `blocks/by_version/${ledgerVersion}`,
    params: { with_transactions: options == null ? void 0 : options.withTransactions }
  });
  return data;
}
async function getBlockByHeight(args) {
  const { aptosConfig, blockHeight, options } = args;
  const { data } = await getAptosFullNode({
    aptosConfig,
    originMethod: "getBlockByHeight",
    path: `blocks/by_height/${blockHeight}`,
    params: { with_transactions: options == null ? void 0 : options.withTransactions }
  });
  return data;
}
async function getTableItem(args) {
  const { aptosConfig, handle, data, options } = args;
  const response = await postAptosFullNode({
    aptosConfig,
    originMethod: "getTableItem",
    path: `tables/${handle}/item`,
    params: { ledger_version: options == null ? void 0 : options.ledgerVersion },
    body: data
  });
  return response.data;
}
async function view(args) {
  var _a, _b;
  const { aptosConfig, payload, options } = args;
  const { data } = await postAptosFullNode({
    aptosConfig,
    originMethod: "view",
    path: "view",
    params: { ledger_version: options == null ? void 0 : options.ledgerVersion },
    body: {
      function: payload.function,
      type_arguments: (_a = payload.typeArguments) != null ? _a : [],
      arguments: (_b = payload.functionArguments) != null ? _b : []
    }
  });
  return data;
}
async function getChainTopUserTransactions(args) {
  const { aptosConfig, limit } = args;
  const graphqlQuery = {
    query: GetChainTopUserTransactions,
    variables: { limit }
  };
  const data = await queryIndexer({
    aptosConfig,
    query: graphqlQuery,
    originMethod: "getChainTopUserTransactions"
  });
  return data.user_transactions;
}
async function queryIndexer(args) {
  const { aptosConfig, query, originMethod } = args;
  const { data } = await postAptosIndexer({
    aptosConfig,
    originMethod: originMethod != null ? originMethod : "queryIndexer",
    path: "",
    body: query,
    overrides: { WITH_CREDENTIALS: false }
  });
  return data;
}
async function getProcessorStatuses(args) {
  const { aptosConfig } = args;
  const graphqlQuery = {
    query: GetProcessorStatus
  };
  const data = await queryIndexer({
    aptosConfig,
    query: graphqlQuery,
    originMethod: "getProcessorStatuses"
  });
  return data.processor_status;
}
async function getIndexerLastSuccessVersion(args) {
  const response = await getProcessorStatuses({ aptosConfig: args.aptosConfig });
  return response[0].last_success_version;
}

// src/utils/memoize.ts
var cache = /* @__PURE__ */ new Map();
function memoizeAsync(func, key, ttlMs) {
  return async (...args) => {
    if (cache.has(key)) {
      const { value, timestamp } = cache.get(key);
      if (ttlMs === void 0 || Date.now() - timestamp <= ttlMs) {
        return value;
      }
    }
    const result = await func(...args);
    cache.set(key, { value: result, timestamp: Date.now() });
    return result;
  };
}

// src/internal/account.ts
async function getInfo(args) {
  const { aptosConfig, accountAddress } = args;
  const { data } = await getAptosFullNode({
    aptosConfig,
    originMethod: "getInfo",
    path: `accounts/${AccountAddress.fromHexInput(accountAddress).toString()}`
  });
  return data;
}
async function getModules(args) {
  var _a;
  const { aptosConfig, accountAddress, options } = args;
  return paginateWithCursor({
    aptosConfig,
    originMethod: "getModules",
    path: `accounts/${AccountAddress.fromHexInput(accountAddress).toString()}/modules`,
    params: {
      ledger_version: options == null ? void 0 : options.ledgerVersion,
      start: options == null ? void 0 : options.offset,
      limit: (_a = options == null ? void 0 : options.limit) != null ? _a : 1e3
    }
  });
}
async function getModule(args) {
  var _a;
  if (((_a = args.options) == null ? void 0 : _a.ledgerVersion) !== void 0) {
    return getModuleInner(args);
  }
  return memoizeAsync(
    async () => getModuleInner(args),
    `module-${args.accountAddress}-${args.moduleName}`,
    1e3 * 60 * 5
  )();
}
async function getModuleInner(args) {
  const { aptosConfig, accountAddress, moduleName, options } = args;
  const { data } = await getAptosFullNode({
    aptosConfig,
    originMethod: "getModule",
    path: `accounts/${AccountAddress.fromHexInput(accountAddress).toString()}/module/${moduleName}`,
    params: { ledger_version: options == null ? void 0 : options.ledgerVersion }
  });
  return data;
}
async function getTransactions(args) {
  const { aptosConfig, accountAddress, options } = args;
  return paginateWithCursor({
    aptosConfig,
    originMethod: "getTransactions",
    path: `accounts/${AccountAddress.fromHexInput(accountAddress).toString()}/transactions`,
    params: { start: options == null ? void 0 : options.offset, limit: options == null ? void 0 : options.limit }
  });
}
async function getResources(args) {
  var _a;
  const { aptosConfig, accountAddress, options } = args;
  return paginateWithCursor({
    aptosConfig,
    originMethod: "getResources",
    path: `accounts/${AccountAddress.fromHexInput(accountAddress).toString()}/resources`,
    params: {
      ledger_version: options == null ? void 0 : options.ledgerVersion,
      start: options == null ? void 0 : options.offset,
      limit: (_a = options == null ? void 0 : options.limit) != null ? _a : 999
    }
  });
}
async function getResource(args) {
  const { aptosConfig, accountAddress, resourceType, options } = args;
  const { data } = await getAptosFullNode({
    aptosConfig,
    originMethod: "getResource",
    path: `accounts/${AccountAddress.fromHexInput(accountAddress).toString()}/resource/${resourceType}`,
    params: { ledger_version: options == null ? void 0 : options.ledgerVersion }
  });
  return data.data;
}
async function lookupOriginalAccountAddress(args) {
  const { aptosConfig, authenticationKey, options } = args;
  const resource = await getResource({
    aptosConfig,
    accountAddress: "0x1",
    resourceType: "0x1::account::OriginatingAddress",
    options
  });
  const {
    address_map: { handle }
  } = resource;
  try {
    const originalAddress = await getTableItem({
      aptosConfig,
      handle,
      data: {
        key: Hex.fromHexInput(authenticationKey).toString(),
        key_type: "address",
        value_type: "address"
      },
      options
    });
    return AccountAddress.fromHexInput(originalAddress);
  } catch (err) {
    if (err instanceof AptosApiError && err.data.error_code === "table_item_not_found") {
      return AccountAddress.fromHexInput(authenticationKey);
    }
    throw err;
  }
}
async function getAccountTokensCount(args) {
  const { aptosConfig, accountAddress } = args;
  const address = AccountAddress.fromHexInput(accountAddress).toString();
  const whereCondition = {
    owner_address: { _eq: address },
    amount: { _gt: "0" }
  };
  const graphqlQuery = {
    query: GetAccountTokensCount,
    variables: { where_condition: whereCondition }
  };
  const data = await queryIndexer({
    aptosConfig,
    query: graphqlQuery,
    originMethod: "getAccountTokensCount"
  });
  if (!data.current_token_ownerships_v2_aggregate.aggregate) {
    throw Error("Failed to get the count of account tokens");
  }
  return data.current_token_ownerships_v2_aggregate.aggregate.count;
}
async function getAccountOwnedTokens(args) {
  var _a, _b;
  const { aptosConfig, accountAddress, options } = args;
  const address = AccountAddress.fromHexInput(accountAddress).toString();
  const whereCondition = {
    owner_address: { _eq: address },
    amount: { _gt: 0 }
  };
  if (options == null ? void 0 : options.tokenStandard) {
    whereCondition.token_standard = { _eq: options == null ? void 0 : options.tokenStandard };
  }
  const graphqlQuery = {
    query: GetAccountOwnedTokens,
    variables: {
      where_condition: whereCondition,
      offset: (_a = options == null ? void 0 : options.pagination) == null ? void 0 : _a.offset,
      limit: (_b = options == null ? void 0 : options.pagination) == null ? void 0 : _b.limit,
      order_by: options == null ? void 0 : options.orderBy
    }
  };
  const data = await queryIndexer({
    aptosConfig,
    query: graphqlQuery,
    originMethod: "getAccountOwnedTokens"
  });
  return data.current_token_ownerships_v2;
}
async function getAccountOwnedTokensFromCollectionAddress(args) {
  var _a, _b;
  const { aptosConfig, accountAddress, collectionAddress, options } = args;
  const ownerAddress = AccountAddress.fromHexInput(accountAddress).toString();
  const collAddress = Hex.fromHexInput(collectionAddress).toString();
  const whereCondition = {
    owner_address: { _eq: ownerAddress },
    current_token_data: { collection_id: { _eq: collAddress } },
    amount: { _gt: 0 }
  };
  if (options == null ? void 0 : options.tokenStandard) {
    whereCondition.token_standard = { _eq: options == null ? void 0 : options.tokenStandard };
  }
  const graphqlQuery = {
    query: GetAccountOwnedTokensFromCollection,
    variables: {
      where_condition: whereCondition,
      offset: (_a = options == null ? void 0 : options.pagination) == null ? void 0 : _a.offset,
      limit: (_b = options == null ? void 0 : options.pagination) == null ? void 0 : _b.limit,
      order_by: options == null ? void 0 : options.orderBy
    }
  };
  const data = await queryIndexer({
    aptosConfig,
    query: graphqlQuery,
    originMethod: "getAccountOwnedTokensFromCollectionAddress"
  });
  return data.current_token_ownerships_v2;
}
async function getAccountCollectionsWithOwnedTokens(args) {
  var _a, _b;
  const { aptosConfig, accountAddress, options } = args;
  const address = AccountAddress.fromHexInput(accountAddress).toString();
  const whereCondition = {
    owner_address: { _eq: address },
    amount: { _gt: 0 }
  };
  if (options == null ? void 0 : options.tokenStandard) {
    whereCondition.current_collection = {
      token_standard: { _eq: options == null ? void 0 : options.tokenStandard }
    };
  }
  const graphqlQuery = {
    query: GetAccountCollectionsWithOwnedTokens,
    variables: {
      where_condition: whereCondition,
      offset: (_a = options == null ? void 0 : options.pagination) == null ? void 0 : _a.offset,
      limit: (_b = options == null ? void 0 : options.pagination) == null ? void 0 : _b.limit,
      order_by: options == null ? void 0 : options.orderBy
    }
  };
  const data = await queryIndexer({
    aptosConfig,
    query: graphqlQuery,
    originMethod: "getAccountCollectionsWithOwnedTokens"
  });
  return data.current_collection_ownership_v2_view;
}
async function getAccountTransactionsCount(args) {
  const { aptosConfig, accountAddress } = args;
  const address = AccountAddress.fromHexInput(accountAddress).toString();
  const graphqlQuery = {
    query: GetAccountTransactionsCount,
    variables: { address }
  };
  const data = await queryIndexer({
    aptosConfig,
    query: graphqlQuery,
    originMethod: "getAccountTransactionsCount"
  });
  if (!data.account_transactions_aggregate.aggregate) {
    throw Error("Failed to get the count of account transactions");
  }
  return data.account_transactions_aggregate.aggregate.count;
}
async function getAccountCoinsData(args) {
  var _a, _b;
  const { aptosConfig, accountAddress, options } = args;
  const address = AccountAddress.fromHexInput(accountAddress).toString();
  const whereCondition = {
    owner_address: { _eq: address }
  };
  const graphqlQuery = {
    query: GetAccountCoinsData,
    variables: {
      where_condition: whereCondition,
      offset: (_a = options == null ? void 0 : options.pagination) == null ? void 0 : _a.offset,
      limit: (_b = options == null ? void 0 : options.pagination) == null ? void 0 : _b.limit,
      order_by: options == null ? void 0 : options.orderBy
    }
  };
  const data = await queryIndexer({
    aptosConfig,
    query: graphqlQuery,
    originMethod: "getAccountCoinsData"
  });
  return data.current_fungible_asset_balances;
}
async function getAccountCoinsCount(args) {
  const { aptosConfig, accountAddress } = args;
  const address = AccountAddress.fromHexInput(accountAddress).toString();
  const graphqlQuery = {
    query: GetAccountCoinsCount,
    variables: { address }
  };
  const data = await queryIndexer({
    aptosConfig,
    query: graphqlQuery,
    originMethod: "getAccountCoinsCount"
  });
  if (!data.current_fungible_asset_balances_aggregate.aggregate) {
    throw Error("Failed to get the count of account coins");
  }
  return data.current_fungible_asset_balances_aggregate.aggregate.count;
}
async function getAccountOwnedObjects(args) {
  var _a, _b;
  const { aptosConfig, accountAddress, options } = args;
  const address = AccountAddress.fromHexInput(accountAddress).toString();
  const whereCondition = {
    owner_address: { _eq: address }
  };
  const graphqlQuery = {
    query: GetAccountOwnedObjects,
    variables: {
      where_condition: whereCondition,
      offset: (_a = options == null ? void 0 : options.pagination) == null ? void 0 : _a.offset,
      limit: (_b = options == null ? void 0 : options.pagination) == null ? void 0 : _b.limit,
      order_by: options == null ? void 0 : options.orderBy
    }
  };
  const data = await queryIndexer({
    aptosConfig,
    query: graphqlQuery,
    originMethod: "getAccountOwnedObjects"
  });
  return data.current_objects;
}
async function deriveAccountFromPrivateKey(args) {
  const { aptosConfig, privateKey } = args;
  const publicKey = new AnyPublicKey(privateKey.publicKey());
  if (privateKey instanceof Secp256k1PrivateKey) {
    const authKey = AuthenticationKey.fromPublicKeyAndScheme({ publicKey, scheme: 2 /* SingleKey */ });
    const address = new AccountAddress({ data: authKey.toUint8Array() });
    return Account.fromPrivateKeyAndAddress({ privateKey, address });
  }
  if (privateKey instanceof Ed25519PrivateKey) {
    const SingleSenderTransactionAuthenticatorAuthKey = AuthenticationKey.fromPublicKeyAndScheme({
      publicKey,
      scheme: 2 /* SingleKey */
    });
    const isSingleSenderTransactionAuthenticator = await isAccountExist({
      authKey: SingleSenderTransactionAuthenticatorAuthKey,
      aptosConfig
    });
    if (isSingleSenderTransactionAuthenticator) {
      const address = new AccountAddress({ data: SingleSenderTransactionAuthenticatorAuthKey.toUint8Array() });
      return Account.fromPrivateKeyAndAddress({ privateKey, address });
    }
    const legacyAuthKey = AuthenticationKey.fromPublicKeyAndScheme({ publicKey, scheme: 0 /* Ed25519 */ });
    const isLegacyEd25519 = await isAccountExist({ authKey: legacyAuthKey, aptosConfig });
    if (isLegacyEd25519) {
      const address = new AccountAddress({ data: legacyAuthKey.toUint8Array() });
      return Account.fromPrivateKeyAndAddress({ privateKey, address, legacy: true });
    }
  }
  throw new Error(`Can't derive account from private key ${privateKey}`);
}
async function isAccountExist(args) {
  const { aptosConfig, authKey } = args;
  const accountAddress = await lookupOriginalAccountAddress({
    aptosConfig,
    authenticationKey: authKey.toString()
  });
  try {
    await getInfo({
      aptosConfig,
      accountAddress: accountAddress.toString()
    });
    return true;
  } catch (error) {
    if (error.status === 404) {
      return false;
    }
    throw new Error(`Error while looking for an account info ${accountAddress.toString()}`);
  }
}

// src/api/account.ts
var Account2 = class {
  constructor(config) {
    this.config = config;
  }
  async getAccountInfo(args) {
    return getInfo({ aptosConfig: this.config, ...args });
  }
  async getAccountModules(args) {
    return getModules({ aptosConfig: this.config, ...args });
  }
  async getAccountModule(args) {
    return getModule({ aptosConfig: this.config, ...args });
  }
  async getAccountTransactions(args) {
    return getTransactions({
      aptosConfig: this.config,
      ...args
    });
  }
  async getAccountResources(args) {
    return getResources({ aptosConfig: this.config, ...args });
  }
  async getAccountResource(args) {
    return getResource({ aptosConfig: this.config, ...args });
  }
  async lookupOriginalAccountAddress(args) {
    return lookupOriginalAccountAddress({ aptosConfig: this.config, ...args });
  }
  async getAccountTokensCount(args) {
    return getAccountTokensCount({
      aptosConfig: this.config,
      ...args
    });
  }
  async getAccountOwnedTokens(args) {
    return getAccountOwnedTokens({
      aptosConfig: this.config,
      ...args
    });
  }
  async getAccountOwnedTokensFromCollectionAddress(args) {
    return getAccountOwnedTokensFromCollectionAddress({
      aptosConfig: this.config,
      ...args
    });
  }
  async getAccountCollectionsWithOwnedTokens(args) {
    return getAccountCollectionsWithOwnedTokens({
      aptosConfig: this.config,
      ...args
    });
  }
  async getAccountTransactionsCount(args) {
    return getAccountTransactionsCount({
      aptosConfig: this.config,
      ...args
    });
  }
  async getAccountCoinsData(args) {
    return getAccountCoinsData({
      aptosConfig: this.config,
      ...args
    });
  }
  async getAccountCoinsCount(args) {
    return getAccountCoinsCount({ aptosConfig: this.config, ...args });
  }
  async getAccountOwnedObjects(args) {
    return getAccountOwnedObjects({
      aptosConfig: this.config,
      ...args
    });
  }
  async deriveAccountFromPrivateKey(args) {
    return deriveAccountFromPrivateKey({ aptosConfig: this.config, ...args });
  }
};

// src/api/aptosConfig.ts
var import_aptos_client = __toESM(require("@aptos-labs/aptos-client"));
var AptosConfig = class {
  constructor(settings) {
    var _a, _b, _c;
    this.network = (_a = settings == null ? void 0 : settings.network) != null ? _a : DEFAULT_NETWORK;
    this.fullnode = settings == null ? void 0 : settings.fullnode;
    this.faucet = settings == null ? void 0 : settings.faucet;
    this.indexer = settings == null ? void 0 : settings.indexer;
    this.client = (_b = settings == null ? void 0 : settings.client) != null ? _b : { provider: import_aptos_client.default };
    this.clientConfig = (_c = settings == null ? void 0 : settings.clientConfig) != null ? _c : {};
  }
  getRequestUrl(apiType) {
    switch (apiType) {
      case 0 /* FULLNODE */:
        if (this.fullnode !== void 0)
          return this.fullnode;
        if (this.network === "custom" /* CUSTOM */)
          throw new Error("Please provide a custom full node url");
        return NetworkToNodeAPI[this.network];
      case 2 /* FAUCET */:
        if (this.faucet !== void 0)
          return this.faucet;
        if (this.network === "custom" /* CUSTOM */)
          throw new Error("Please provide a custom faucet url");
        return NetworkToFaucetAPI[this.network];
      case 1 /* INDEXER */:
        if (this.indexer !== void 0)
          return this.indexer;
        if (this.network === "custom" /* CUSTOM */)
          throw new Error("Please provide a custom indexer url");
        return NetworkToIndexerAPI[this.network];
      default:
        throw Error(`apiType ${apiType} is not supported`);
    }
  }
  isIndexerRequest(url) {
    return NetworkToIndexerAPI[this.network] === url;
  }
};

// src/transactions/transactionBuilder/transactionBuilder.ts
var import_sha33 = require("@noble/hashes/sha3");

// src/core/crypto/anySignature.ts
var AnySignature = class extends Signature {
  constructor(signature) {
    super();
    this.signature = signature;
  }
  toUint8Array() {
    return this.signature.toUint8Array();
  }
  toString() {
    return this.signature.toString();
  }
  serialize(serializer) {
    if (this.signature instanceof Ed25519Signature) {
      serializer.serializeU32AsUleb128(0 /* Ed25519 */);
      this.signature.serialize(serializer);
    } else if (this.signature instanceof Secp256k1Signature) {
      serializer.serializeU32AsUleb128(1 /* Secp256k1 */);
      this.signature.serialize(serializer);
    } else {
      throw new Error("Unknown signature type");
    }
  }
  static deserialize(deserializer) {
    const index = deserializer.deserializeUleb128AsU32();
    switch (index) {
      case 0 /* Ed25519 */:
        return new AnySignature(Ed25519Signature.load(deserializer));
      case 1 /* Secp256k1 */:
        return new AnySignature(Secp256k1Signature.load(deserializer));
      default:
        throw new Error(`Unknown variant index for AnySignature: ${index}`);
    }
  }
};

// src/utils/helpers.ts
async function sleep(timeMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeMs);
  });
}

// src/internal/transaction.ts
async function getTransactions2(args) {
  const { aptosConfig, options } = args;
  return paginateWithCursor({
    aptosConfig,
    originMethod: "getTransactions",
    path: "transactions",
    params: { start: options == null ? void 0 : options.offset, limit: options == null ? void 0 : options.limit }
  });
}
async function getGasPriceEstimation(args) {
  const { aptosConfig } = args;
  return memoizeAsync(
    async () => {
      const { data } = await getAptosFullNode({
        aptosConfig,
        originMethod: "getGasPriceEstimation",
        path: "estimate_gas_price"
      });
      return data;
    },
    `gas-price-${aptosConfig.network}`,
    1e3 * 60 * 5
  )();
}
async function getTransactionByVersion(args) {
  const { aptosConfig, ledgerVersion } = args;
  const { data } = await getAptosFullNode({
    aptosConfig,
    originMethod: "getTransactionByVersion",
    path: `transactions/by_version/${ledgerVersion}`
  });
  return data;
}
async function getTransactionByHash(args) {
  const { aptosConfig, transactionHash } = args;
  const { data } = await getAptosFullNode({
    aptosConfig,
    path: `transactions/by_hash/${transactionHash}`,
    originMethod: "getTransactionByHash"
  });
  return data;
}
async function isTransactionPending(args) {
  const { aptosConfig, transactionHash } = args;
  try {
    const transaction = await getTransactionByHash({ aptosConfig, transactionHash });
    return transaction.type === "pending_transaction" /* Pending */;
  } catch (e) {
    if ((e == null ? void 0 : e.status) === 404) {
      return true;
    }
    throw e;
  }
}
async function waitForTransaction(args) {
  var _a, _b, _c;
  const { aptosConfig, transactionHash, options } = args;
  const timeoutSecs = (_a = options == null ? void 0 : options.timeoutSecs) != null ? _a : DEFAULT_TXN_TIMEOUT_SEC;
  const checkSuccess = (_b = options == null ? void 0 : options.checkSuccess) != null ? _b : true;
  const indexerVersionCheck = (_c = options == null ? void 0 : options.indexerVersionCheck) != null ? _c : true;
  let isPending = true;
  let timeElapsed = 0;
  let lastTxn;
  let lastError;
  let backoffIntervalMs = 200;
  const backoffMultiplier = 1.5;
  while (isPending) {
    if (timeElapsed >= timeoutSecs) {
      break;
    }
    try {
      lastTxn = await getTransactionByHash({ aptosConfig, transactionHash });
      isPending = lastTxn.type === "pending_transaction" /* Pending */;
      if (!isPending) {
        break;
      }
    } catch (e) {
      const isAptosApiError = e instanceof AptosApiError;
      if (!isAptosApiError) {
        throw e;
      }
      lastError = e;
      const isRequestError = e.status !== 404 && e.status >= 400 && e.status < 500;
      if (isRequestError) {
        throw e;
      }
    }
    await sleep(backoffIntervalMs);
    timeElapsed += backoffIntervalMs / 1e3;
    backoffIntervalMs *= backoffMultiplier;
  }
  if (lastTxn === void 0) {
    if (lastError) {
      throw lastError;
    } else {
      throw new WaitForTransactionError(
        `Fetching transaction ${transactionHash} failed and timed out after ${timeoutSecs} seconds`,
        lastTxn
      );
    }
  }
  if (lastTxn.type === "pending_transaction" /* Pending */) {
    throw new WaitForTransactionError(
      `Transaction ${transactionHash} timed out in pending state after ${timeoutSecs} seconds`,
      lastTxn
    );
  }
  if (!checkSuccess) {
    return lastTxn;
  }
  if (!lastTxn.success) {
    throw new FailedTransactionError(
      `Transaction ${transactionHash} failed with an error: ${lastTxn.vm_status}`,
      lastTxn
    );
  }
  if (indexerVersionCheck) {
    try {
      await waitForLastSuccessIndexerVersionSync({ aptosConfig, ledgerVersion: Number(lastTxn.version) });
    } catch (_e) {
      throw new WaitForTransactionError(
        `Transaction ${transactionHash} committed, but timed out waiting for indexer to sync with ledger version ${lastTxn.version}.You can disable this check by setting \`indexerVersionCheck\` to false in the \`extraArgs\` parameter.`,
        lastTxn
      );
    }
  }
  return lastTxn;
}
async function waitForLastSuccessIndexerVersionSync(args) {
  const { aptosConfig, ledgerVersion } = args;
  const timeoutMilliseconds = 3e3;
  const startTime = new Date().getTime();
  let indexerVersion = -1;
  while (indexerVersion < ledgerVersion) {
    if (new Date().getTime() - startTime > timeoutMilliseconds) {
      throw new Error("waitForLastSuccessIndexerVersionSync timeout");
    }
    indexerVersion = await getIndexerLastSuccessVersion({ aptosConfig });
    if (indexerVersion >= ledgerVersion) {
      break;
    }
    await sleep(200);
  }
}
var WaitForTransactionError = class extends Error {
  constructor(message, lastSubmittedTransaction) {
    super(message);
    this.lastSubmittedTransaction = lastSubmittedTransaction;
  }
};
var FailedTransactionError = class extends Error {
  constructor(message, transaction) {
    super(message);
    this.transaction = transaction;
  }
};

// src/transactions/authenticator/account.ts
var AccountAuthenticator = class extends Serializable {
  static deserialize(deserializer) {
    const index = deserializer.deserializeUleb128AsU32();
    switch (index) {
      case 0 /* Ed25519 */:
        return AccountAuthenticatorEd25519.load(deserializer);
      case 1 /* MultiEd25519 */:
        return AccountAuthenticatorMultiEd25519.load(deserializer);
      case 2 /* SingleKey */:
        return AccountAuthenticatorSingleKey.load(deserializer);
      case 3 /* MultiKey */:
        return AccountAuthenticatorMultiKey.load(deserializer);
      default:
        throw new Error(`Unknown variant index for AccountAuthenticator: ${index}`);
    }
  }
};
var AccountAuthenticatorEd25519 = class extends AccountAuthenticator {
  constructor(public_key, signature) {
    super();
    this.public_key = public_key;
    this.signature = signature;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(0 /* Ed25519 */);
    this.public_key.serialize(serializer);
    this.signature.serialize(serializer);
  }
  static load(deserializer) {
    const public_key = Ed25519PublicKey.deserialize(deserializer);
    const signature = Ed25519Signature.deserialize(deserializer);
    return new AccountAuthenticatorEd25519(public_key, signature);
  }
};
var AccountAuthenticatorMultiEd25519 = class extends AccountAuthenticator {
  constructor(public_key, signature) {
    super();
    this.public_key = public_key;
    this.signature = signature;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(1 /* MultiEd25519 */);
    this.public_key.serialize(serializer);
    this.signature.serialize(serializer);
  }
  static load(deserializer) {
    const public_key = MultiEd25519PublicKey.deserialize(deserializer);
    const signature = MultiEd25519Signature.deserialize(deserializer);
    return new AccountAuthenticatorMultiEd25519(public_key, signature);
  }
};
var AccountAuthenticatorSingleKey = class extends AccountAuthenticator {
  constructor(public_key, signature) {
    super();
    this.public_key = public_key;
    this.signature = signature;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(2 /* SingleKey */);
    this.public_key.serialize(serializer);
    this.signature.serialize(serializer);
  }
  static load(deserializer) {
    const public_key = AnyPublicKey.deserialize(deserializer);
    const signature = AnySignature.deserialize(deserializer);
    return new AccountAuthenticatorSingleKey(public_key, signature);
  }
};
var AccountAuthenticatorMultiKey = class extends AccountAuthenticator {
  constructor(public_keys, signatures, signatures_bitmap) {
    super();
    this.public_keys = public_keys;
    this.signatures = signatures;
    this.signatures_bitmap = signatures_bitmap;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(3 /* MultiKey */);
    this.public_keys.serialize(serializer);
    serializer.serializeVector(this.signatures);
    serializer.serializeBytes(this.signatures_bitmap);
  }
  static load(deserializer) {
    const public_keys = MultiKey.deserialize(deserializer);
    const signatures = deserializer.deserializeVector(AnySignature);
    const signatures_bitmap = deserializer.deserializeBytes();
    return new AccountAuthenticatorMultiKey(public_keys, signatures, signatures_bitmap);
  }
};

// src/transactions/authenticator/transaction.ts
var TransactionAuthenticator = class extends Serializable {
  static deserialize(deserializer) {
    const index = deserializer.deserializeUleb128AsU32();
    switch (index) {
      case 0 /* Ed25519 */:
        return TransactionAuthenticatorEd25519.load(deserializer);
      case 1 /* MultiEd25519 */:
        return TransactionAuthenticatorMultiEd25519.load(deserializer);
      case 2 /* MultiAgent */:
        return TransactionAuthenticatorMultiAgent.load(deserializer);
      case 3 /* FeePayer */:
        return TransactionAuthenticatorFeePayer.load(deserializer);
      case 4 /* SingleSender */:
        return TransactionAuthenticatorSingleSender.load(deserializer);
      default:
        throw new Error(`Unknown variant index for TransactionAuthenticator: ${index}`);
    }
  }
};
var TransactionAuthenticatorEd25519 = class extends TransactionAuthenticator {
  constructor(public_key, signature) {
    super();
    this.public_key = public_key;
    this.signature = signature;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(0 /* Ed25519 */);
    this.public_key.serialize(serializer);
    this.signature.serialize(serializer);
  }
  static load(deserializer) {
    const public_key = Ed25519PublicKey.deserialize(deserializer);
    const signature = Ed25519Signature.deserialize(deserializer);
    return new TransactionAuthenticatorEd25519(public_key, signature);
  }
};
var TransactionAuthenticatorMultiEd25519 = class extends TransactionAuthenticator {
  constructor(public_key, signature) {
    super();
    this.public_key = public_key;
    this.signature = signature;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(1 /* MultiEd25519 */);
    this.public_key.serialize(serializer);
    this.signature.serialize(serializer);
  }
  static load(deserializer) {
    const public_key = MultiEd25519PublicKey.deserialize(deserializer);
    const signature = MultiEd25519Signature.deserialize(deserializer);
    return new TransactionAuthenticatorMultiEd25519(public_key, signature);
  }
};
var TransactionAuthenticatorMultiAgent = class extends TransactionAuthenticator {
  constructor(sender, secondary_signer_addresses, secondary_signers) {
    super();
    this.sender = sender;
    this.secondary_signer_addresses = secondary_signer_addresses;
    this.secondary_signers = secondary_signers;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(2 /* MultiAgent */);
    this.sender.serialize(serializer);
    serializer.serializeVector(this.secondary_signer_addresses);
    serializer.serializeVector(this.secondary_signers);
  }
  static load(deserializer) {
    const sender = AccountAuthenticator.deserialize(deserializer);
    const secondary_signer_addresses = deserializer.deserializeVector(AccountAddress);
    const secondary_signers = deserializer.deserializeVector(AccountAuthenticator);
    return new TransactionAuthenticatorMultiAgent(sender, secondary_signer_addresses, secondary_signers);
  }
};
var TransactionAuthenticatorFeePayer = class extends TransactionAuthenticator {
  constructor(sender, secondary_signer_addresses, secondary_signers, fee_payer) {
    super();
    this.sender = sender;
    this.secondary_signer_addresses = secondary_signer_addresses;
    this.secondary_signers = secondary_signers;
    this.fee_payer = fee_payer;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(3 /* FeePayer */);
    this.sender.serialize(serializer);
    serializer.serializeVector(this.secondary_signer_addresses);
    serializer.serializeVector(this.secondary_signers);
    this.fee_payer.address.serialize(serializer);
    this.fee_payer.authenticator.serialize(serializer);
  }
  static load(deserializer) {
    const sender = AccountAuthenticator.deserialize(deserializer);
    const secondary_signer_addresses = deserializer.deserializeVector(AccountAddress);
    const secondary_signers = deserializer.deserializeVector(AccountAuthenticator);
    const address = AccountAddress.deserialize(deserializer);
    const authenticator = AccountAuthenticator.deserialize(deserializer);
    const fee_payer = { address, authenticator };
    return new TransactionAuthenticatorFeePayer(sender, secondary_signer_addresses, secondary_signers, fee_payer);
  }
};
var TransactionAuthenticatorSingleSender = class extends TransactionAuthenticator {
  constructor(sender) {
    super();
    this.sender = sender;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(4 /* SingleSender */);
    this.sender.serialize(serializer);
  }
  static load(deserializer) {
    const sender = AccountAuthenticator.deserialize(deserializer);
    return new TransactionAuthenticatorSingleSender(sender);
  }
};

// src/transactions/instances/chainId.ts
var ChainId = class extends Serializable {
  constructor(chainId) {
    super();
    this.chainId = chainId;
  }
  serialize(serializer) {
    serializer.serializeU8(this.chainId);
  }
  static deserialize(deserializer) {
    const chainId = deserializer.deserializeU8();
    return new ChainId(chainId);
  }
};

// src/transactions/instances/identifier.ts
var Identifier = class extends Serializable {
  constructor(identifier) {
    super();
    this.identifier = identifier;
  }
  serialize(serializer) {
    serializer.serializeStr(this.identifier);
  }
  static deserialize(deserializer) {
    const identifier = deserializer.deserializeStr();
    return new Identifier(identifier);
  }
};

// src/transactions/instances/moduleId.ts
var ModuleId = class extends Serializable {
  constructor(address, name) {
    super();
    this.address = address;
    this.name = name;
  }
  static fromStr(moduleId) {
    const parts = moduleId.split("::");
    if (parts.length !== 2) {
      throw new Error("Invalid module id.");
    }
    return new ModuleId(AccountAddress.fromString(parts[0]), new Identifier(parts[1]));
  }
  serialize(serializer) {
    this.address.serialize(serializer);
    this.name.serialize(serializer);
  }
  static deserialize(deserializer) {
    const address = AccountAddress.deserialize(deserializer);
    const name = Identifier.deserialize(deserializer);
    return new ModuleId(address, name);
  }
};

// src/transactions/typeTag/index.ts
var TypeTag = class extends Serializable {
  static deserialize(deserializer) {
    const index = deserializer.deserializeUleb128AsU32();
    switch (index) {
      case 0 /* Bool */:
        return TypeTagBool.load(deserializer);
      case 1 /* U8 */:
        return TypeTagU8.load(deserializer);
      case 2 /* U64 */:
        return TypeTagU64.load(deserializer);
      case 3 /* U128 */:
        return TypeTagU128.load(deserializer);
      case 4 /* Address */:
        return TypeTagAddress.load(deserializer);
      case 5 /* Signer */:
        return TypeTagSigner.load(deserializer);
      case 6 /* Vector */:
        return TypeTagVector.load(deserializer);
      case 7 /* Struct */:
        return TypeTagStruct.load(deserializer);
      case 8 /* U16 */:
        return TypeTagU16.load(deserializer);
      case 9 /* U32 */:
        return TypeTagU32.load(deserializer);
      case 10 /* U256 */:
        return TypeTagU256.load(deserializer);
      case 255 /* Generic */:
        return TypeTagGeneric.load(deserializer);
      default:
        throw new Error(`Unknown variant index for TypeTag: ${index}`);
    }
  }
  isBool() {
    return this instanceof TypeTagBool;
  }
  isAddress() {
    return this instanceof TypeTagAddress;
  }
  isGeneric() {
    return this instanceof TypeTagGeneric;
  }
  isSigner() {
    return this instanceof TypeTagSigner;
  }
  isVector() {
    return this instanceof TypeTagVector;
  }
  isStruct() {
    return this instanceof TypeTagStruct;
  }
  isU8() {
    return this instanceof TypeTagU8;
  }
  isU16() {
    return this instanceof TypeTagU16;
  }
  isU32() {
    return this instanceof TypeTagU32;
  }
  isU64() {
    return this instanceof TypeTagU64;
  }
  isU128() {
    return this instanceof TypeTagU128;
  }
  isU256() {
    return this instanceof TypeTagU256;
  }
};
var TypeTagBool = class extends TypeTag {
  toString() {
    return "bool";
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(0 /* Bool */);
  }
  static load(_deserializer) {
    return new TypeTagBool();
  }
};
var TypeTagU8 = class extends TypeTag {
  toString() {
    return "u8";
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(1 /* U8 */);
  }
  static load(_deserializer) {
    return new TypeTagU8();
  }
};
var TypeTagU16 = class extends TypeTag {
  toString() {
    return "u16";
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(8 /* U16 */);
  }
  static load(_deserializer) {
    return new TypeTagU16();
  }
};
var TypeTagU32 = class extends TypeTag {
  toString() {
    return "u32";
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(9 /* U32 */);
  }
  static load(_deserializer) {
    return new TypeTagU32();
  }
};
var TypeTagU64 = class extends TypeTag {
  toString() {
    return "u64";
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(2 /* U64 */);
  }
  static load(_deserializer) {
    return new TypeTagU64();
  }
};
var TypeTagU128 = class extends TypeTag {
  toString() {
    return "u128";
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(3 /* U128 */);
  }
  static load(_deserializer) {
    return new TypeTagU128();
  }
};
var TypeTagU256 = class extends TypeTag {
  toString() {
    return "u256";
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(10 /* U256 */);
  }
  static load(_deserializer) {
    return new TypeTagU256();
  }
};
var TypeTagAddress = class extends TypeTag {
  toString() {
    return "address";
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(4 /* Address */);
  }
  static load(_deserializer) {
    return new TypeTagAddress();
  }
};
var TypeTagSigner = class extends TypeTag {
  toString() {
    return "signer";
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(5 /* Signer */);
  }
  static load(_deserializer) {
    return new TypeTagSigner();
  }
};
var TypeTagReference = class extends TypeTag {
  constructor(value) {
    super();
    this.value = value;
  }
  toString() {
    return `&${this.value.toString()}`;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(254 /* Reference */);
  }
  static load(deserializer) {
    const value = TypeTag.deserialize(deserializer);
    return new TypeTagReference(value);
  }
};
var TypeTagGeneric = class extends TypeTag {
  constructor(value) {
    super();
    this.value = value;
  }
  toString() {
    return `T${this.value}`;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(255 /* Generic */);
    serializer.serializeU32(this.value);
  }
  static load(deserializer) {
    const value = deserializer.deserializeU32();
    return new TypeTagGeneric(value);
  }
};
var TypeTagVector = class extends TypeTag {
  constructor(value) {
    super();
    this.value = value;
  }
  toString() {
    return `vector<${this.value.toString()}>`;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(6 /* Vector */);
    this.value.serialize(serializer);
  }
  static load(deserializer) {
    const value = TypeTag.deserialize(deserializer);
    return new TypeTagVector(value);
  }
};
var TypeTagStruct = class extends TypeTag {
  constructor(value) {
    super();
    this.value = value;
  }
  toString() {
    let typePredicate = "";
    if (this.value.type_args.length > 0) {
      typePredicate = `<${this.value.type_args.map((typeArg) => typeArg.toString()).join(", ")}>`;
    }
    return `${this.value.address.toString()}::${this.value.module_name.identifier}::${this.value.name.identifier}${typePredicate}`;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(7 /* Struct */);
    this.value.serialize(serializer);
  }
  static load(deserializer) {
    const value = StructTag.deserialize(deserializer);
    return new TypeTagStruct(value);
  }
  isTypeTag(address, moduleName, structName) {
    return this.value.module_name.identifier === moduleName && this.value.name.identifier === structName && this.value.address.equals(address);
  }
  isString() {
    return this.isTypeTag(AccountAddress.ONE, "string", "String");
  }
  isOption() {
    return this.isTypeTag(AccountAddress.ONE, "option", "Option");
  }
  isObject() {
    return this.isTypeTag(AccountAddress.ONE, "object", "Object");
  }
};
var StructTag = class extends Serializable {
  constructor(address, module_name, name, type_args) {
    super();
    this.address = address;
    this.module_name = module_name;
    this.name = name;
    this.type_args = type_args;
  }
  serialize(serializer) {
    serializer.serialize(this.address);
    serializer.serialize(this.module_name);
    serializer.serialize(this.name);
    serializer.serializeVector(this.type_args);
  }
  static deserialize(deserializer) {
    const address = AccountAddress.deserialize(deserializer);
    const moduleName = Identifier.deserialize(deserializer);
    const name = Identifier.deserialize(deserializer);
    const typeArgs = deserializer.deserializeVector(TypeTag);
    return new StructTag(address, moduleName, name, typeArgs);
  }
};
function aptosCoinStructTag() {
  return new StructTag(AccountAddress.ONE, new Identifier("aptos_coin"), new Identifier("AptosCoin"), []);
}
function stringStructTag() {
  return new StructTag(AccountAddress.ONE, new Identifier("string"), new Identifier("String"), []);
}
function optionStructTag(typeArg) {
  return new StructTag(AccountAddress.ONE, new Identifier("option"), new Identifier("Option"), [typeArg]);
}
function objectStructTag(typeArg) {
  return new StructTag(AccountAddress.ONE, new Identifier("object"), new Identifier("Object"), [typeArg]);
}

// src/transactions/instances/transactionPayload.ts
function deserializeFromScriptArgument(deserializer) {
  const index = deserializer.deserializeUleb128AsU32();
  switch (index) {
    case 0 /* U8 */:
      return U8.deserialize(deserializer);
    case 1 /* U64 */:
      return U64.deserialize(deserializer);
    case 2 /* U128 */:
      return U128.deserialize(deserializer);
    case 3 /* Address */:
      return AccountAddress.deserialize(deserializer);
    case 4 /* U8Vector */:
      return MoveVector.deserialize(deserializer, U8);
    case 5 /* Bool */:
      return Bool.deserialize(deserializer);
    case 6 /* U16 */:
      return U16.deserialize(deserializer);
    case 7 /* U32 */:
      return U32.deserialize(deserializer);
    case 8 /* U256 */:
      return U256.deserialize(deserializer);
    default:
      throw new Error(`Unknown variant index for ScriptTransactionArgument: ${index}`);
  }
}
var TransactionPayload = class extends Serializable {
  static deserialize(deserializer) {
    const index = deserializer.deserializeUleb128AsU32();
    switch (index) {
      case 0 /* Script */:
        return TransactionPayloadScript.load(deserializer);
      case 2 /* EntryFunction */:
        return TransactionPayloadEntryFunction.load(deserializer);
      case 3 /* Multisig */:
        return TransactionPayloadMultisig.load(deserializer);
      default:
        throw new Error(`Unknown variant index for TransactionPayload: ${index}`);
    }
  }
};
var TransactionPayloadScript = class extends TransactionPayload {
  constructor(script) {
    super();
    this.script = script;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(0 /* Script */);
    this.script.serialize(serializer);
  }
  static load(deserializer) {
    const script = Script.deserialize(deserializer);
    return new TransactionPayloadScript(script);
  }
};
var TransactionPayloadEntryFunction = class extends TransactionPayload {
  constructor(entryFunction) {
    super();
    this.entryFunction = entryFunction;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(2 /* EntryFunction */);
    this.entryFunction.serialize(serializer);
  }
  static load(deserializer) {
    const entryFunction = EntryFunction.deserialize(deserializer);
    return new TransactionPayloadEntryFunction(entryFunction);
  }
};
var TransactionPayloadMultisig = class extends TransactionPayload {
  constructor(multiSig) {
    super();
    this.multiSig = multiSig;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(3 /* Multisig */);
    this.multiSig.serialize(serializer);
  }
  static load(deserializer) {
    const multiSig = MultiSig.deserialize(deserializer);
    return new TransactionPayloadMultisig(multiSig);
  }
};
var EntryFunction = class {
  constructor(module_name, function_name, type_args, args) {
    this.module_name = module_name;
    this.function_name = function_name;
    this.type_args = type_args;
    this.args = args;
  }
  static build(module_id, function_name, type_args, args) {
    return new EntryFunction(ModuleId.fromStr(module_id), new Identifier(function_name), type_args, args);
  }
  serialize(serializer) {
    this.module_name.serialize(serializer);
    this.function_name.serialize(serializer);
    serializer.serializeVector(this.type_args);
    serializer.serializeU32AsUleb128(this.args.length);
    this.args.forEach((item) => {
      item.serializeForEntryFunction(serializer);
    });
  }
  static deserialize(deserializer) {
    const module_name = ModuleId.deserialize(deserializer);
    const function_name = Identifier.deserialize(deserializer);
    const type_args = deserializer.deserializeVector(TypeTag);
    const length = deserializer.deserializeUleb128AsU32();
    const args = new Array();
    for (let i = 0; i < length; i += 1) {
      const fixedBytesLength = deserializer.deserializeUleb128AsU32();
      const fixedBytes = EntryFunctionBytes.deserialize(deserializer, fixedBytesLength);
      args.push(fixedBytes);
    }
    return new EntryFunction(module_name, function_name, type_args, args);
  }
};
var Script = class {
  constructor(bytecode, type_args, args) {
    this.bytecode = bytecode;
    this.type_args = type_args;
    this.args = args;
  }
  serialize(serializer) {
    serializer.serializeBytes(this.bytecode);
    serializer.serializeVector(this.type_args);
    serializer.serializeU32AsUleb128(this.args.length);
    this.args.forEach((item) => {
      item.serializeForScriptFunction(serializer);
    });
  }
  static deserialize(deserializer) {
    const bytecode = deserializer.deserializeBytes();
    const type_args = deserializer.deserializeVector(TypeTag);
    const length = deserializer.deserializeUleb128AsU32();
    const args = new Array();
    for (let i = 0; i < length; i += 1) {
      const scriptArgument = deserializeFromScriptArgument(deserializer);
      args.push(scriptArgument);
    }
    return new Script(bytecode, type_args, args);
  }
};
var MultiSig = class {
  constructor(multisig_address, transaction_payload) {
    this.multisig_address = multisig_address;
    this.transaction_payload = transaction_payload;
  }
  serialize(serializer) {
    this.multisig_address.serialize(serializer);
    if (this.transaction_payload === void 0) {
      serializer.serializeBool(false);
    } else {
      serializer.serializeBool(true);
      this.transaction_payload.serialize(serializer);
    }
  }
  static deserialize(deserializer) {
    const multisig_address = AccountAddress.deserialize(deserializer);
    const payloadPresent = deserializer.deserializeBool();
    let transaction_payload;
    if (payloadPresent) {
      transaction_payload = MultisigTransactionPayload.deserialize(deserializer);
    }
    return new MultiSig(multisig_address, transaction_payload);
  }
};
var MultisigTransactionPayload = class {
  constructor(transaction_payload) {
    this.transaction_payload = transaction_payload;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(0);
    this.transaction_payload.serialize(serializer);
  }
  static deserialize(deserializer) {
    deserializer.deserializeUleb128AsU32();
    return new MultisigTransactionPayload(EntryFunction.deserialize(deserializer));
  }
};

// src/transactions/instances/rawTransaction.ts
var RawTransaction = class extends Serializable {
  constructor(sender, sequence_number, payload, max_gas_amount, gas_unit_price, expiration_timestamp_secs, chain_id) {
    super();
    this.sender = sender;
    this.sequence_number = sequence_number;
    this.payload = payload;
    this.max_gas_amount = max_gas_amount;
    this.gas_unit_price = gas_unit_price;
    this.expiration_timestamp_secs = expiration_timestamp_secs;
    this.chain_id = chain_id;
  }
  serialize(serializer) {
    this.sender.serialize(serializer);
    serializer.serializeU64(this.sequence_number);
    this.payload.serialize(serializer);
    serializer.serializeU64(this.max_gas_amount);
    serializer.serializeU64(this.gas_unit_price);
    serializer.serializeU64(this.expiration_timestamp_secs);
    this.chain_id.serialize(serializer);
  }
  static deserialize(deserializer) {
    const sender = AccountAddress.deserialize(deserializer);
    const sequence_number = deserializer.deserializeU64();
    const payload = TransactionPayload.deserialize(deserializer);
    const max_gas_amount = deserializer.deserializeU64();
    const gas_unit_price = deserializer.deserializeU64();
    const expiration_timestamp_secs = deserializer.deserializeU64();
    const chain_id = ChainId.deserialize(deserializer);
    return new RawTransaction(
      sender,
      sequence_number,
      payload,
      max_gas_amount,
      gas_unit_price,
      expiration_timestamp_secs,
      chain_id
    );
  }
};
var RawTransactionWithData = class extends Serializable {
  static deserialize(deserializer) {
    const index = deserializer.deserializeUleb128AsU32();
    switch (index) {
      case 0 /* MultiAgentTransaction */:
        return MultiAgentRawTransaction.load(deserializer);
      case 1 /* FeePayerTransaction */:
        return FeePayerRawTransaction.load(deserializer);
      default:
        throw new Error(`Unknown variant index for RawTransactionWithData: ${index}`);
    }
  }
};
var MultiAgentRawTransaction = class extends RawTransactionWithData {
  constructor(raw_txn, secondary_signer_addresses) {
    super();
    this.raw_txn = raw_txn;
    this.secondary_signer_addresses = secondary_signer_addresses;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(0 /* MultiAgentTransaction */);
    this.raw_txn.serialize(serializer);
    serializer.serializeVector(this.secondary_signer_addresses);
  }
  static load(deserializer) {
    const rawTxn = RawTransaction.deserialize(deserializer);
    const secondarySignerAddresses = deserializer.deserializeVector(AccountAddress);
    return new MultiAgentRawTransaction(rawTxn, secondarySignerAddresses);
  }
};
var FeePayerRawTransaction = class extends RawTransactionWithData {
  constructor(raw_txn, secondary_signer_addresses, fee_payer_address) {
    super();
    this.raw_txn = raw_txn;
    this.secondary_signer_addresses = secondary_signer_addresses;
    this.fee_payer_address = fee_payer_address;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(1 /* FeePayerTransaction */);
    this.raw_txn.serialize(serializer);
    serializer.serializeVector(this.secondary_signer_addresses);
    this.fee_payer_address.serialize(serializer);
  }
  static load(deserializer) {
    const rawTxn = RawTransaction.deserialize(deserializer);
    const secondarySignerAddresses = deserializer.deserializeVector(AccountAddress);
    const feePayerAddress = AccountAddress.deserialize(deserializer);
    return new FeePayerRawTransaction(rawTxn, secondarySignerAddresses, feePayerAddress);
  }
};

// src/transactions/instances/signedTransaction.ts
var SignedTransaction = class extends Serializable {
  constructor(raw_txn, authenticator) {
    super();
    this.raw_txn = raw_txn;
    this.authenticator = authenticator;
  }
  serialize(serializer) {
    this.raw_txn.serialize(serializer);
    this.authenticator.serialize(serializer);
  }
  static deserialize(deserializer) {
    const raw_txn = RawTransaction.deserialize(deserializer);
    const authenticator = TransactionAuthenticator.deserialize(deserializer);
    return new SignedTransaction(raw_txn, authenticator);
  }
};

// src/transactions/typeTag/parser.ts
function isValidIdentifier(str) {
  return !!str.match(/^[_a-zA-Z0-9]+$/);
}
function isValidWhitespaceCharacter(char) {
  return !!char.match(/\s/);
}
function consumeWhitespace(tagStr, pos) {
  let i = pos;
  for (; i < tagStr.length; i += 1) {
    const innerChar = tagStr[i];
    if (!isValidWhitespaceCharacter(innerChar)) {
      break;
    }
  }
  return i;
}
var TypeTagParserErrorType = /* @__PURE__ */ ((TypeTagParserErrorType2) => {
  TypeTagParserErrorType2["InvalidTypeTag"] = "unknown type";
  TypeTagParserErrorType2["UnexpectedTypeArgumentClose"] = "unexpected '>'";
  TypeTagParserErrorType2["UnexpectedWhitespaceCharacter"] = "unexpected whitespace character";
  TypeTagParserErrorType2["UnexpectedComma"] = "unexpected ','";
  TypeTagParserErrorType2["TypeArgumentCountMismatch"] = "type argument count doesn't match expected amount";
  TypeTagParserErrorType2["MissingTypeArgumentClose"] = "no matching '>' for '<'";
  TypeTagParserErrorType2["UnexpectedPrimitiveTypeArguments"] = "primitive types not expected to have type arguments";
  TypeTagParserErrorType2["UnexpectedVectorTypeArgumentCount"] = "vector type expected to have exactly one type argument";
  TypeTagParserErrorType2["UnexpectedStructFormat"] = "unexpected struct format, must be of the form 0xaddress::module_name::struct_name";
  TypeTagParserErrorType2["InvalidModuleNameCharacter"] = "module name must only contain alphanumeric or '_' characters";
  TypeTagParserErrorType2["InvalidStructNameCharacter"] = "struct name must only contain alphanumeric or '_' characters";
  return TypeTagParserErrorType2;
})(TypeTagParserErrorType || {});
var TypeTagParserError = class extends Error {
  constructor(typeTagStr, invalidReason) {
    super(`Failed to parse typeTag '${typeTagStr}', ${invalidReason}`);
  }
};
function parseTypeTag(typeStr, options) {
  var _a;
  const allowGenerics = (_a = options == null ? void 0 : options.allowGenerics) != null ? _a : false;
  const saved = [];
  let innerTypes = [];
  let curTypes = [];
  let cur = 0;
  let currentStr = "";
  let expectedTypes = 1;
  while (cur < typeStr.length) {
    const char = typeStr[cur];
    if (char === "<") {
      saved.push({
        savedExpectedTypes: expectedTypes,
        savedStr: currentStr,
        savedTypes: curTypes
      });
      currentStr = "";
      curTypes = [];
      expectedTypes = 1;
    } else if (char === ">") {
      if (currentStr !== "") {
        const newType = parseTypeTagInner(currentStr, innerTypes, allowGenerics);
        curTypes.push(newType);
      }
      const savedPop = saved.pop();
      if (savedPop === void 0) {
        throw new TypeTagParserError(typeStr, "unexpected '>'" /* UnexpectedTypeArgumentClose */);
      }
      if (expectedTypes !== curTypes.length) {
        throw new TypeTagParserError(typeStr, "type argument count doesn't match expected amount" /* TypeArgumentCountMismatch */);
      }
      const { savedStr, savedTypes, savedExpectedTypes } = savedPop;
      innerTypes = curTypes;
      curTypes = savedTypes;
      currentStr = savedStr;
      expectedTypes = savedExpectedTypes;
    } else if (char === ",") {
      if (currentStr.length !== 0) {
        const newType = parseTypeTagInner(currentStr, innerTypes, allowGenerics);
        innerTypes = [];
        curTypes.push(newType);
        currentStr = "";
        expectedTypes += 1;
      }
    } else if (isValidWhitespaceCharacter(char)) {
      let parsedTypeTag = false;
      if (currentStr.length !== 0) {
        const newType = parseTypeTagInner(currentStr, innerTypes, allowGenerics);
        innerTypes = [];
        curTypes.push(newType);
        currentStr = "";
        parsedTypeTag = true;
      }
      cur = consumeWhitespace(typeStr, cur);
      const nextChar = typeStr[cur];
      if (cur < typeStr.length && parsedTypeTag && nextChar !== "," && nextChar !== ">") {
        throw new TypeTagParserError(typeStr, "unexpected whitespace character" /* UnexpectedWhitespaceCharacter */);
      }
      continue;
    } else {
      currentStr += char;
    }
    cur += 1;
  }
  if (saved.length > 0) {
    throw new TypeTagParserError(typeStr, "no matching '>' for '<'" /* MissingTypeArgumentClose */);
  }
  switch (curTypes.length) {
    case 0:
      return parseTypeTagInner(currentStr, innerTypes, allowGenerics);
    case 1:
      if (currentStr === "") {
        return curTypes[0];
      }
      throw new TypeTagParserError(typeStr, "unexpected ','" /* UnexpectedComma */);
    default:
      throw new TypeTagParserError(typeStr, "unexpected whitespace character" /* UnexpectedWhitespaceCharacter */);
  }
}
function parseTypeTagInner(str, types, allowGenerics) {
  switch (str) {
    case "&signer":
      if (types.length > 0) {
        throw new TypeTagParserError(str, "primitive types not expected to have type arguments" /* UnexpectedPrimitiveTypeArguments */);
      }
      return new TypeTagReference(new TypeTagSigner());
    case "signer":
      if (types.length > 0) {
        throw new TypeTagParserError(str, "primitive types not expected to have type arguments" /* UnexpectedPrimitiveTypeArguments */);
      }
      return new TypeTagSigner();
    case "bool":
      if (types.length > 0) {
        throw new TypeTagParserError(str, "primitive types not expected to have type arguments" /* UnexpectedPrimitiveTypeArguments */);
      }
      return new TypeTagBool();
    case "address":
      if (types.length > 0) {
        throw new TypeTagParserError(str, "primitive types not expected to have type arguments" /* UnexpectedPrimitiveTypeArguments */);
      }
      return new TypeTagAddress();
    case "u8":
      if (types.length > 0) {
        throw new TypeTagParserError(str, "primitive types not expected to have type arguments" /* UnexpectedPrimitiveTypeArguments */);
      }
      return new TypeTagU8();
    case "u16":
      if (types.length > 0) {
        throw new TypeTagParserError(str, "primitive types not expected to have type arguments" /* UnexpectedPrimitiveTypeArguments */);
      }
      return new TypeTagU16();
    case "u32":
      if (types.length > 0) {
        throw new TypeTagParserError(str, "primitive types not expected to have type arguments" /* UnexpectedPrimitiveTypeArguments */);
      }
      return new TypeTagU32();
    case "u64":
      if (types.length > 0) {
        throw new TypeTagParserError(str, "primitive types not expected to have type arguments" /* UnexpectedPrimitiveTypeArguments */);
      }
      return new TypeTagU64();
    case "u128":
      if (types.length > 0) {
        throw new TypeTagParserError(str, "primitive types not expected to have type arguments" /* UnexpectedPrimitiveTypeArguments */);
      }
      return new TypeTagU128();
    case "u256":
      if (types.length > 0) {
        throw new TypeTagParserError(str, "primitive types not expected to have type arguments" /* UnexpectedPrimitiveTypeArguments */);
      }
      return new TypeTagU256();
    case "vector":
      if (types.length !== 1) {
        throw new TypeTagParserError(str, "vector type expected to have exactly one type argument" /* UnexpectedVectorTypeArgumentCount */);
      }
      return new TypeTagVector(types[0]);
    default:
      if (allowGenerics && str.match(/^T[0-9]+$/)) {
        return new TypeTagGeneric(Number(str.split("T")[1]));
      }
      if (!str.match(/.*:.*/)) {
        throw new TypeTagParserError(str, "unknown type" /* InvalidTypeTag */);
      }
      const structParts = str.split("::");
      if (structParts.length !== 3) {
        throw new TypeTagParserError(str, "unexpected struct format, must be of the form 0xaddress::module_name::struct_name" /* UnexpectedStructFormat */);
      }
      if (!isValidIdentifier(structParts[1])) {
        throw new TypeTagParserError(str, "module name must only contain alphanumeric or '_' characters" /* InvalidModuleNameCharacter */);
      }
      if (!isValidIdentifier(structParts[2])) {
        throw new TypeTagParserError(str, "struct name must only contain alphanumeric or '_' characters" /* InvalidStructNameCharacter */);
      }
      return new TypeTagStruct(
        new StructTag(
          AccountAddress.fromString(structParts[0]),
          new Identifier(structParts[1]),
          new Identifier(structParts[2]),
          types
        )
      );
  }
}

// src/transactions/transactionBuilder/helpers.ts
function isBool(arg) {
  return typeof arg === "boolean";
}
function isString(arg) {
  return typeof arg === "string";
}
function isNumber(arg) {
  return typeof arg === "number";
}
function isLargeNumber(arg) {
  return typeof arg === "number" || typeof arg === "bigint" || typeof arg === "string";
}
function isNull(arg) {
  return arg === null || arg === void 0;
}
function isBcsBool(arg) {
  return arg instanceof Bool;
}
function isBcsAddress(arg) {
  return arg instanceof AccountAddress;
}
function isBcsString(arg) {
  return arg instanceof MoveString;
}
function isBcsFixedBytes(arg) {
  return arg instanceof FixedBytes;
}
function isBcsU8(arg) {
  return arg instanceof U8;
}
function isBcsU16(arg) {
  return arg instanceof U16;
}
function isBcsU32(arg) {
  return arg instanceof U32;
}
function isBcsU64(arg) {
  return arg instanceof U64;
}
function isBcsU128(arg) {
  return arg instanceof U128;
}
function isBcsU256(arg) {
  return arg instanceof U256;
}
function isScriptDataInput(arg) {
  return "bytecode" in arg;
}
function throwTypeMismatch(expectedType, position) {
  throw new Error(`Type mismatch for argument ${position}, expected '${expectedType}'`);
}
function findFirstNonSignerArg(functionAbi) {
  return functionAbi.params.findIndex((param) => param !== "signer" && param !== "&signer");
}
function getFunctionParts(functionArg) {
  const funcNameParts = functionArg.split("::");
  if (funcNameParts.length !== 3) {
    throw new Error(`Invalid function ${functionArg}`);
  }
  const moduleAddress = funcNameParts[0];
  const moduleName = funcNameParts[1];
  const functionName = funcNameParts[2];
  return { moduleAddress, moduleName, functionName };
}

// src/transactions/transactionBuilder/remoteAbi.ts
function standardizeTypeTags(typeArguments) {
  var _a;
  return (_a = typeArguments == null ? void 0 : typeArguments.map((typeArg) => {
    if (isString(typeArg)) {
      return parseTypeTag(typeArg);
    }
    return typeArg;
  })) != null ? _a : [];
}
async function fetchEntryFunctionAbi(moduleAddress, moduleName, functionName, aptosConfig) {
  var _a;
  const module2 = await getModule({ aptosConfig, accountAddress: moduleAddress, moduleName });
  const functionAbi = (_a = module2.abi) == null ? void 0 : _a.exposed_functions.find((func) => func.name === functionName);
  if (!functionAbi) {
    throw new Error(`Could not find entry function ABI for '${moduleAddress}::${moduleName}::${functionName}'`);
  }
  if (!functionAbi.is_entry) {
    throw new Error(`'${moduleAddress}::${moduleName}::${functionName}' is not an entry function`);
  }
  const first = findFirstNonSignerArg(functionAbi);
  const params = [];
  for (let i = first; i < functionAbi.params.length; i += 1) {
    params.push(parseTypeTag(functionAbi.params[i], { allowGenerics: true }));
  }
  return {
    typeParameters: functionAbi.generic_type_params,
    parameters: params
  };
}
function convertArgument(functionName, functionAbi, arg, position, genericTypeParams) {
  if (position >= functionAbi.parameters.length) {
    throw new Error(`Too many arguments for '${functionName}', expected ${functionAbi.parameters.length}`);
  }
  if (isBcsBool(arg) || isBcsU8(arg) || isBcsU16(arg) || isBcsU32(arg) || isBcsU64(arg) || isBcsU128(arg) || isBcsU256(arg) || isBcsAddress(arg) || isBcsString(arg) || isBcsFixedBytes(arg) || arg instanceof MoveVector || arg instanceof MoveOption) {
    checkType(functionAbi, arg, position);
    return arg;
  }
  return parseArg(arg, functionAbi.parameters[position], position, genericTypeParams);
}
function parseArg(arg, param, position, genericTypeParams) {
  if (param.isBool()) {
    if (isBool(arg)) {
      return new Bool(arg);
    }
    throwTypeMismatch("boolean", position);
  }
  if (param.isAddress()) {
    if (isString(arg)) {
      return AccountAddress.fromString(arg);
    }
    throwTypeMismatch("string", position);
  }
  if (param.isU8()) {
    if (isNumber(arg)) {
      return new U8(arg);
    }
    throwTypeMismatch("number", position);
  }
  if (param.isU16()) {
    if (isNumber(arg)) {
      return new U16(arg);
    }
    throwTypeMismatch("number", position);
  }
  if (param.isU32()) {
    if (isNumber(arg)) {
      return new U32(arg);
    }
    throwTypeMismatch("number", position);
  }
  if (param.isU64()) {
    if (isLargeNumber(arg)) {
      return new U64(BigInt(arg));
    }
    throwTypeMismatch("bigint | number | string", position);
  }
  if (param.isU128()) {
    if (isLargeNumber(arg)) {
      return new U128(BigInt(arg));
    }
    throwTypeMismatch("bigint | number | string", position);
  }
  if (param.isU256()) {
    if (isLargeNumber(arg)) {
      return new U256(BigInt(arg));
    }
    throwTypeMismatch("bigint | number | string", position);
  }
  if (param.isGeneric()) {
    const genericIndex = param.value;
    if (genericIndex < 0 || genericIndex >= genericTypeParams.length) {
      throw new Error(`Generic argument ${param.toString()} is invalid for argument ${position}`);
    }
    parseArg(arg, genericTypeParams[genericIndex], position, genericTypeParams);
  }
  if (param.isVector()) {
    if (param.value.isU8() && isString(arg)) {
      return MoveVector.U8(Hex.fromHexInput(arg).toUint8Array());
    }
    if (Array.isArray(arg)) {
      return new MoveVector(arg.map((item) => parseArg(item, param.value, position, genericTypeParams)));
    }
    throw new Error(`Type mismatch for argument ${position}, type '${param.toString()}'`);
  }
  if (param.isStruct()) {
    if (param.isString()) {
      if (isString(arg)) {
        return new MoveString(arg);
      }
      throwTypeMismatch("string", position);
    }
    if (param.isObject()) {
      if (isString(arg)) {
        return AccountAddress.fromString(arg);
      }
      throwTypeMismatch("string", position);
    }
    if (param.isOption()) {
      if (isNull(arg)) {
        return new MoveOption(null);
      }
      return new MoveOption(parseArg(arg, param.value.type_args[0], position, genericTypeParams));
    }
    throw new Error(`Unsupported struct input type for argument ${position}, type '${param.toString()}'`);
  }
  throw new Error(`Type mismatch for argument ${position}, type '${param.toString()}'`);
}
function checkType(functionAbi, arg, position) {
  const param = functionAbi.parameters[position];
  if (param.isBool()) {
    if (isBcsBool(arg)) {
      return;
    }
    throwTypeMismatch("Bool", position);
  }
  if (param.isAddress()) {
    if (isBcsAddress(arg)) {
      return;
    }
    throwTypeMismatch("AccountAddress", position);
  }
  if (param.isU8()) {
    if (isBcsU8(arg)) {
      return;
    }
    throwTypeMismatch("U8", position);
  }
  if (param.isU16()) {
    if (isBcsU16(arg)) {
      return;
    }
    throwTypeMismatch("U16", position);
  }
  if (param.isU32()) {
    if (isBcsU32(arg)) {
      return;
    }
    throwTypeMismatch("U32", position);
  }
  if (param.isU64()) {
    if (isBcsU64(arg)) {
      return;
    }
    throwTypeMismatch("U64", position);
  }
  if (param.isU128()) {
    if (isBcsU128(arg)) {
      return;
    }
    throwTypeMismatch("U128", position);
  }
  if (param.isU256()) {
    if (isBcsU256(arg)) {
      return;
    }
    throwTypeMismatch("U256", position);
  }
  if (param.isVector()) {
    if (arg instanceof MoveVector) {
      return;
    }
    throwTypeMismatch("MoveVector", position);
  }
  if (param instanceof TypeTagStruct) {
    if (param.isString()) {
      if (isBcsString(arg)) {
        return;
      }
      throwTypeMismatch("MoveString", position);
    }
    if (param.isObject()) {
      if (isBcsAddress(arg)) {
        return;
      }
      throwTypeMismatch("AccountAddress", position);
    }
    if (param.isOption()) {
      if (arg instanceof MoveOption) {
        return;
      }
      throwTypeMismatch("MoveOption", position);
    }
  }
  throw new Error(`Type mismatch for argument ${position}, expected '${param.toString()}'`);
}

// src/transactions/transactionBuilder/transactionBuilder.ts
async function generateTransactionPayload(args) {
  if (isScriptDataInput(args)) {
    return generateTransactionPayloadScript(args);
  }
  const { moduleAddress, moduleName, functionName } = getFunctionParts(args.function);
  const functionAbi = await memoizeAsync(
    async () => fetchEntryFunctionAbi(moduleAddress, moduleName, functionName, args.aptosConfig),
    `entry-function-${args.aptosConfig.network}-${moduleAddress}-${moduleName}-${functionName}`,
    1e3 * 60 * 5
  )();
  return generateTransactionPayloadWithABI(args, functionAbi);
}
function generateTransactionPayloadWithABI(args, functionAbi) {
  if (isScriptDataInput(args)) {
    return generateTransactionPayloadScript(args);
  }
  const { moduleAddress, moduleName, functionName } = getFunctionParts(args.function);
  const typeArguments = standardizeTypeTags(args.typeArguments);
  if (typeArguments.length !== functionAbi.typeParameters.length) {
    throw new Error(
      `Type argument count mismatch, expected ${functionAbi.typeParameters.length}, received ${typeArguments.length}`
    );
  }
  const functionArguments = args.functionArguments.map(
    (arg, i) => convertArgument(args.function, functionAbi, arg, i, typeArguments)
  );
  if (functionArguments.length !== functionAbi.parameters.length) {
    throw new Error(
      `Too few arguments for '${moduleAddress}::${moduleName}::${functionName}', expected ${functionAbi.parameters.length} but got ${functionArguments.length}`
    );
  }
  const entryFunctionPayload = EntryFunction.build(
    `${moduleAddress}::${moduleName}`,
    functionName,
    typeArguments,
    functionArguments
  );
  if ("multisigAddress" in args) {
    let multisigAddress;
    if (typeof args.multisigAddress === "string") {
      multisigAddress = AccountAddress.fromString(args.multisigAddress);
    } else {
      multisigAddress = args.multisigAddress;
    }
    return new TransactionPayloadMultisig(
      new MultiSig(multisigAddress, new MultisigTransactionPayload(entryFunctionPayload))
    );
  }
  return new TransactionPayloadEntryFunction(entryFunctionPayload);
}
function generateTransactionPayloadScript(args) {
  var _a;
  return new TransactionPayloadScript(
    new Script(Hex.fromHexInput(args.bytecode).toUint8Array(), (_a = args.typeArguments) != null ? _a : [], args.functionArguments)
  );
}
async function generateRawTransaction(args) {
  const { aptosConfig, sender, payload, options } = args;
  const getSequenceNumber = (options == null ? void 0 : options.accountSequenceNumber) ? Promise.resolve({ sequence_number: options.accountSequenceNumber }) : getInfo({ aptosConfig, accountAddress: sender });
  const getChainId = NetworkToChainId[aptosConfig.network] ? Promise.resolve({ chain_id: NetworkToChainId[aptosConfig.network] }) : getLedgerInfo({ aptosConfig });
  const getGasUnitPrice = (options == null ? void 0 : options.gasUnitPrice) ? Promise.resolve({ gas_estimate: options.gasUnitPrice }) : getGasPriceEstimation({ aptosConfig });
  const [{ sequence_number: sequenceNumber }, { chain_id: chainId }, { gas_estimate: gasEstimate }] = await Promise.all(
    [getSequenceNumber, getChainId, getGasUnitPrice]
  );
  const { maxGasAmount, gasUnitPrice, expireTimestamp } = {
    maxGasAmount: BigInt(DEFAULT_MAX_GAS_AMOUNT),
    gasUnitPrice: BigInt(gasEstimate),
    expireTimestamp: BigInt(Math.floor(Date.now() / 1e3) + DEFAULT_TXN_EXP_SEC_FROM_NOW),
    ...options
  };
  return new RawTransaction(
    AccountAddress.fromHexInput(sender),
    BigInt(sequenceNumber),
    payload,
    BigInt(maxGasAmount),
    BigInt(gasUnitPrice),
    BigInt(expireTimestamp),
    new ChainId(chainId)
  );
}
async function buildTransaction(args) {
  const { aptosConfig, sender, payload, options, secondarySignerAddresses, feePayerAddress } = args;
  const rawTxn = await generateRawTransaction({
    aptosConfig,
    sender,
    payload,
    options
  });
  if (feePayerAddress) {
    const signers = secondarySignerAddresses ? secondarySignerAddresses.map((signer) => AccountAddress.fromHexInput(signer)) : [];
    return {
      rawTransaction: rawTxn.bcsToBytes(),
      secondarySignerAddresses: signers,
      feePayerAddress: AccountAddress.fromHexInput(feePayerAddress)
    };
  }
  if (secondarySignerAddresses) {
    const signers = secondarySignerAddresses.map(
      (signer) => AccountAddress.fromHexInput(signer)
    );
    return {
      rawTransaction: rawTxn.bcsToBytes(),
      secondarySignerAddresses: signers
    };
  }
  return { rawTransaction: rawTxn.bcsToBytes() };
}
function generateSignedTransactionForSimulation(args) {
  var _a, _b;
  const { signerPublicKey, transaction, secondarySignersPublicKeys, feePayerPublicKey } = args;
  const deserializer = new Deserializer(transaction.rawTransaction);
  const deserializedTransaction = RawTransaction.deserialize(deserializer);
  const accountAuthenticator = getAuthenticatorForSimulation(signerPublicKey);
  if (transaction.feePayerAddress) {
    const transactionToSign = new FeePayerRawTransaction(
      deserializedTransaction,
      (_a = transaction.secondarySignerAddresses) != null ? _a : [],
      transaction.feePayerAddress
    );
    let secondaryAccountAuthenticators = [];
    if (secondarySignersPublicKeys) {
      secondaryAccountAuthenticators = secondarySignersPublicKeys.map(
        (publicKey) => getAuthenticatorForSimulation(publicKey)
      );
    }
    const feePayerAuthenticator = getAuthenticatorForSimulation(feePayerPublicKey);
    const transactionAuthenticator2 = new TransactionAuthenticatorFeePayer(
      accountAuthenticator,
      (_b = transaction.secondarySignerAddresses) != null ? _b : [],
      secondaryAccountAuthenticators,
      {
        address: transaction.feePayerAddress,
        authenticator: feePayerAuthenticator
      }
    );
    return new SignedTransaction(transactionToSign.raw_txn, transactionAuthenticator2).bcsToBytes();
  }
  if (transaction.secondarySignerAddresses) {
    const transactionToSign = new MultiAgentRawTransaction(
      deserializedTransaction,
      transaction.secondarySignerAddresses
    );
    let secondaryAccountAuthenticators = [];
    secondaryAccountAuthenticators = secondarySignersPublicKeys.map(
      (publicKey) => getAuthenticatorForSimulation(publicKey)
    );
    const transactionAuthenticator2 = new TransactionAuthenticatorMultiAgent(
      accountAuthenticator,
      transaction.secondarySignerAddresses,
      secondaryAccountAuthenticators
    );
    return new SignedTransaction(transactionToSign.raw_txn, transactionAuthenticator2).bcsToBytes();
  }
  let transactionAuthenticator;
  if (accountAuthenticator instanceof AccountAuthenticatorEd25519) {
    transactionAuthenticator = new TransactionAuthenticatorEd25519(
      accountAuthenticator.public_key,
      accountAuthenticator.signature
    );
  } else if (accountAuthenticator instanceof AccountAuthenticatorSingleKey) {
    transactionAuthenticator = new TransactionAuthenticatorSingleSender(accountAuthenticator);
  } else {
    throw new Error("Invalid public key");
  }
  return new SignedTransaction(deserializedTransaction, transactionAuthenticator).bcsToBytes();
}
function getAuthenticatorForSimulation(publicKey) {
  if (publicKey instanceof AnyPublicKey) {
    if (publicKey.publicKey instanceof Ed25519PublicKey) {
      return new AccountAuthenticatorSingleKey(publicKey, new AnySignature(new Ed25519Signature(new Uint8Array(64))));
    }
    if (publicKey.publicKey instanceof Secp256k1PublicKey) {
      return new AccountAuthenticatorSingleKey(publicKey, new AnySignature(new Secp256k1Signature(new Uint8Array(64))));
    }
  }
  return new AccountAuthenticatorEd25519(
    new Ed25519PublicKey(publicKey.toUint8Array()),
    new Ed25519Signature(new Uint8Array(64))
  );
}
function sign(args) {
  const { signer, transaction } = args;
  const transactionToSign = deriveTransactionType(transaction);
  const message = getSigningMessage(transactionToSign);
  const signerSignature = signer.sign(message);
  switch (signer.signingScheme) {
    case 0 /* Ed25519 */:
      return new AccountAuthenticatorEd25519(
        new Ed25519PublicKey(signer.publicKey.toUint8Array()),
        new Ed25519Signature(signerSignature.toUint8Array())
      );
    case 2 /* SingleKey */:
      return new AccountAuthenticatorSingleKey(signer.publicKey, new AnySignature(signerSignature));
    default:
      throw new Error(`Cannot sign transaction, signing scheme ${signer.signingScheme} not supported`);
  }
}
function generateSignedTransaction(args) {
  const { transaction, senderAuthenticator, secondarySignerAuthenticators } = args;
  const transactionToSubmit = deriveTransactionType(transaction);
  if (secondarySignerAuthenticators) {
    return generateMultiSignersSignedTransaction(
      transactionToSubmit,
      senderAuthenticator,
      secondarySignerAuthenticators
    );
  }
  if (senderAuthenticator instanceof AccountAuthenticatorEd25519) {
    const transactionAuthenticator = new TransactionAuthenticatorEd25519(
      senderAuthenticator.public_key,
      senderAuthenticator.signature
    );
    return new SignedTransaction(transactionToSubmit, transactionAuthenticator).bcsToBytes();
  }
  if (senderAuthenticator instanceof AccountAuthenticatorSingleKey || senderAuthenticator instanceof AccountAuthenticatorMultiKey) {
    const transactionAuthenticator = new TransactionAuthenticatorSingleSender(senderAuthenticator);
    return new SignedTransaction(transactionToSubmit, transactionAuthenticator).bcsToBytes();
  }
  throw new Error(
    `Cannot generate a signed transaction, ${senderAuthenticator} is not a supported account authentication scheme`
  );
}
function deriveTransactionType(transaction) {
  var _a;
  const deserializer = new Deserializer(transaction.rawTransaction);
  const deserializedTransaction = RawTransaction.deserialize(deserializer);
  if (transaction.feePayerAddress) {
    return new FeePayerRawTransaction(
      deserializedTransaction,
      (_a = transaction.secondarySignerAddresses) != null ? _a : [],
      transaction.feePayerAddress
    );
  }
  if (transaction.secondarySignerAddresses) {
    return new MultiAgentRawTransaction(deserializedTransaction, transaction.secondarySignerAddresses);
  }
  return deserializedTransaction;
}
function generateMultiSignersSignedTransaction(transaction, senderAuthenticator, secondarySignerAuthenticators) {
  if (transaction instanceof FeePayerRawTransaction) {
    if (!secondarySignerAuthenticators.feePayerAuthenticator) {
      throw new Error("Must provide a feePayerAuthenticator argument to generate a signed fee payer transaction");
    }
    const { feePayerAuthenticator, additionalSignersAuthenticators } = secondarySignerAuthenticators;
    const txAuthenticatorFeePayer = new TransactionAuthenticatorFeePayer(
      senderAuthenticator,
      transaction.secondary_signer_addresses,
      additionalSignersAuthenticators != null ? additionalSignersAuthenticators : [],
      {
        address: transaction.fee_payer_address,
        authenticator: feePayerAuthenticator
      }
    );
    return new SignedTransaction(transaction.raw_txn, txAuthenticatorFeePayer).bcsToBytes();
  }
  if (transaction instanceof MultiAgentRawTransaction) {
    if (!secondarySignerAuthenticators.additionalSignersAuthenticators) {
      throw new Error(
        "Must provide a additionalSignersAuthenticators argument to generate a signed multi agent transaction"
      );
    }
    const { additionalSignersAuthenticators } = secondarySignerAuthenticators;
    const multiAgentAuthenticator = new TransactionAuthenticatorMultiAgent(
      senderAuthenticator,
      transaction.secondary_signer_addresses,
      additionalSignersAuthenticators != null ? additionalSignersAuthenticators : []
    );
    return new SignedTransaction(transaction.raw_txn, multiAgentAuthenticator).bcsToBytes();
  }
  throw new Error(
    `Cannot prepare multi signers transaction to submission, ${typeof transaction} transaction is not supported`
  );
}
function getSigningMessage(rawTxn) {
  const hash = import_sha33.sha3_256.create();
  if (rawTxn instanceof RawTransaction) {
    hash.update(RAW_TRANSACTION_SALT);
  } else if (rawTxn instanceof MultiAgentRawTransaction) {
    hash.update(RAW_TRANSACTION_WITH_DATA_SALT);
  } else if (rawTxn instanceof FeePayerRawTransaction) {
    hash.update(RAW_TRANSACTION_WITH_DATA_SALT);
  } else {
    throw new Error(`Unknown transaction type to sign on: ${rawTxn}`);
  }
  const prefix = hash.digest();
  const body = rawTxn.bcsToBytes();
  const mergedArray = new Uint8Array(prefix.length + body.length);
  mergedArray.set(prefix);
  mergedArray.set(body, prefix.length);
  return mergedArray;
}

// src/internal/transactionSubmission.ts
async function generateTransaction(args) {
  const { aptosConfig, sender, data, options, secondarySignerAddresses, feePayerAddress } = args;
  let generateTransactionPayloadData;
  if ("bytecode" in data) {
    generateTransactionPayloadData = data;
  } else if ("multisigAddress" in data) {
    generateTransactionPayloadData = {
      aptosConfig,
      multisigAddress: data.multisigAddress,
      function: data.function,
      functionArguments: data.functionArguments,
      typeArguments: data.typeArguments
    };
  } else {
    generateTransactionPayloadData = {
      aptosConfig,
      function: data.function,
      functionArguments: data.functionArguments,
      typeArguments: data.typeArguments
    };
  }
  const payload = await generateTransactionPayload(generateTransactionPayloadData);
  return buildTransaction({
    aptosConfig,
    sender,
    payload,
    options,
    secondarySignerAddresses,
    feePayerAddress
  });
}
function signTransaction(args) {
  const accountAuthenticator = sign({ ...args });
  return accountAuthenticator;
}
async function simulateTransaction(args) {
  var _a, _b, _c, _d, _e, _f;
  const { aptosConfig, transaction, signerPublicKey, secondarySignersPublicKeys, feePayerPublicKey, options } = args;
  const signedTransaction = generateSignedTransactionForSimulation({
    transaction,
    signerPublicKey,
    secondarySignersPublicKeys,
    feePayerPublicKey,
    options
  });
  const { data } = await postAptosFullNode({
    aptosConfig,
    body: signedTransaction,
    path: "transactions/simulate",
    params: {
      estimate_gas_unit_price: (_b = (_a = args.options) == null ? void 0 : _a.estimateGasUnitPrice) != null ? _b : false,
      estimate_max_gas_amount: (_d = (_c = args.options) == null ? void 0 : _c.estimateMaxGasAmount) != null ? _d : false,
      estimate_prioritized_gas_unit_price: (_f = (_e = args.options) == null ? void 0 : _e.estimatePrioritizedGasUnitPrice) != null ? _f : false
    },
    originMethod: "simulateTransaction",
    contentType: "application/x.aptos.signed_transaction+bcs" /* BCS_SIGNED_TRANSACTION */
  });
  return data;
}
async function submitTransaction(args) {
  const { aptosConfig } = args;
  const signedTransaction = generateSignedTransaction({ ...args });
  const { data } = await postAptosFullNode({
    aptosConfig,
    body: signedTransaction,
    path: "transactions",
    originMethod: "submitTransaction",
    contentType: "application/x.aptos.signed_transaction+bcs" /* BCS_SIGNED_TRANSACTION */
  });
  return data;
}
async function signAndSubmitTransaction(args) {
  const { aptosConfig, signer, transaction } = args;
  const authenticator = signTransaction({ signer, transaction });
  return submitTransaction({
    aptosConfig,
    transaction,
    senderAuthenticator: authenticator
  });
}
async function publicPackageTransaction(args) {
  const { aptosConfig, account, metadataBytes, moduleBytecode, options } = args;
  const totalByteCode = moduleBytecode.map((bytecode) => MoveVector.U8(bytecode));
  const transaction = await generateTransaction({
    aptosConfig,
    sender: account,
    data: {
      function: "0x1::code::publish_package_txn",
      functionArguments: [MoveVector.U8(metadataBytes), new MoveVector(totalByteCode)]
    },
    options
  });
  return transaction;
}

// src/internal/coin.ts
async function transferCoinTransaction(args) {
  const { aptosConfig, sender, recipient, amount, coinType, options } = args;
  const coinStructType = coinType != null ? coinType : APTOS_COIN;
  const transaction = await generateTransaction({
    aptosConfig,
    sender: sender.accountAddress.toString(),
    data: {
      function: "0x1::aptos_account::transfer_coins",
      typeArguments: [parseTypeTag(coinStructType)],
      functionArguments: [AccountAddress.fromHexInput(recipient), new U64(amount)]
    },
    options
  });
  return transaction;
}

// src/api/coin.ts
var Coin = class {
  constructor(config) {
    this.config = config;
  }
  async transferCoinTransaction(args) {
    return transferCoinTransaction({ aptosConfig: this.config, ...args });
  }
};

// src/internal/digitalAsset.ts
async function mintTokenTransaction(args) {
  const { aptosConfig, options, creator } = args;
  const transaction = await generateTransaction({
    aptosConfig,
    sender: creator.accountAddress.toString(),
    data: {
      function: "0x4::aptos_token::mint",
      functionArguments: [
        new MoveString(args.collection),
        new MoveString(args.description),
        new MoveString(args.name),
        new MoveString(args.uri),
        MoveVector.MoveString([]),
        MoveVector.MoveString([]),
        new MoveVector([])
      ]
    },
    options
  });
  return transaction;
}
async function getTokenData(args) {
  const { aptosConfig, tokenAddress } = args;
  const whereCondition = {
    token_data_id: { _eq: Hex.fromHexInput(tokenAddress).toString() }
  };
  const graphqlQuery = {
    query: GetTokenData,
    variables: {
      where_condition: whereCondition
    }
  };
  const data = await queryIndexer({
    aptosConfig,
    query: graphqlQuery,
    originMethod: "getTokenData"
  });
  return data.current_token_datas_v2[0];
}
async function getCurrentTokenOwnership(args) {
  const { aptosConfig, tokenAddress } = args;
  const whereCondition = {
    token_data_id: { _eq: Hex.fromHexInput(tokenAddress).toString() }
  };
  const graphqlQuery = {
    query: GetCurrentTokenOwnership,
    variables: {
      where_condition: whereCondition
    }
  };
  const data = await queryIndexer({
    aptosConfig,
    query: graphqlQuery,
    originMethod: "getCurrentTokenOwnership"
  });
  return data.current_token_ownerships_v2[0];
}
async function getOwnedTokens(args) {
  var _a, _b;
  const { aptosConfig, ownerAddress, options } = args;
  const whereCondition = {
    owner_address: { _eq: Hex.fromHexInput(ownerAddress).toString() }
  };
  const graphqlQuery = {
    query: GetCurrentTokenOwnership,
    variables: {
      where_condition: whereCondition,
      offset: (_a = options == null ? void 0 : options.pagination) == null ? void 0 : _a.offset,
      limit: (_b = options == null ? void 0 : options.pagination) == null ? void 0 : _b.limit,
      order_by: options == null ? void 0 : options.orderBy
    }
  };
  const data = await queryIndexer({
    aptosConfig,
    query: graphqlQuery,
    originMethod: "getOwnedTokens"
  });
  return data.current_token_ownerships_v2;
}
async function getTokenActivity(args) {
  var _a, _b;
  const { aptosConfig, tokenAddress, options } = args;
  const whereCondition = {
    token_data_id: { _eq: Hex.fromHexInput(tokenAddress).toString() }
  };
  const graphqlQuery = {
    query: GetTokenActivity,
    variables: {
      where_condition: whereCondition,
      offset: (_a = options == null ? void 0 : options.pagination) == null ? void 0 : _a.offset,
      limit: (_b = options == null ? void 0 : options.pagination) == null ? void 0 : _b.limit,
      order_by: options == null ? void 0 : options.orderBy
    }
  };
  const data = await queryIndexer({
    aptosConfig,
    query: graphqlQuery,
    originMethod: "getTokenActivity"
  });
  return data.token_activities_v2;
}
async function createCollectionTransaction(args) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  const { aptosConfig, options, creator } = args;
  const transaction = await generateTransaction({
    aptosConfig,
    sender: creator.accountAddress.toString(),
    data: {
      function: "0x4::aptos_token::create_collection",
      functionArguments: [
        new MoveString(args.description),
        new U64((_a = args.maxSupply) != null ? _a : MAX_U64_BIG_INT),
        new MoveString(args.name),
        new MoveString(args.uri),
        new Bool((_b = args.mutableDescription) != null ? _b : true),
        new Bool((_c = args.mutableRoyalty) != null ? _c : true),
        new Bool((_d = args.mutableURI) != null ? _d : true),
        new Bool((_e = args.mutableTokenDescription) != null ? _e : true),
        new Bool((_f = args.mutableTokenName) != null ? _f : true),
        new Bool((_g = args.mutableTokenProperties) != null ? _g : true),
        new Bool((_h = args.mutableTokenURI) != null ? _h : true),
        new Bool((_i = args.tokensBurnableByCreator) != null ? _i : true),
        new Bool((_j = args.tokensFreezableByCreator) != null ? _j : true),
        new U64((_k = args.royaltyNumerator) != null ? _k : 0),
        new U64((_l = args.royaltyDenominator) != null ? _l : 1)
      ]
    },
    options
  });
  return transaction;
}
async function getCollectionData(args) {
  var _a;
  const { aptosConfig, creatorAddress, collectionName, options } = args;
  const address = Hex.fromHexInput(creatorAddress).toString();
  const whereCondition = {
    collection_name: { _eq: collectionName },
    creator_address: { _eq: address }
  };
  if (options == null ? void 0 : options.tokenStandard) {
    whereCondition.token_standard = { _eq: (_a = options == null ? void 0 : options.tokenStandard) != null ? _a : "v2" };
  }
  const graphqlQuery = {
    query: GetCollectionData,
    variables: {
      where_condition: whereCondition
    }
  };
  const data = await queryIndexer({
    aptosConfig,
    query: graphqlQuery,
    originMethod: "getCollectionData"
  });
  return data.current_collections_v2[0];
}
async function getCollectionId(args) {
  return (await getCollectionData(args)).collection_id;
}

// src/api/digitalAsset.ts
var DigitalAsset = class {
  constructor(config) {
    this.config = config;
  }
  async createCollectionTransaction(args) {
    return createCollectionTransaction({ aptosConfig: this.config, ...args });
  }
  async getCollectionData(args) {
    return getCollectionData({ aptosConfig: this.config, ...args });
  }
  async getCollectionId(args) {
    return getCollectionId({ aptosConfig: this.config, ...args });
  }
  async mintTokenTransaction(args) {
    return mintTokenTransaction({ aptosConfig: this.config, ...args });
  }
  async getTokenData(args) {
    return getTokenData({ aptosConfig: this.config, ...args });
  }
  async getCurrentTokenOwnership(args) {
    return getCurrentTokenOwnership({ aptosConfig: this.config, ...args });
  }
  async getOwnedTokens(args) {
    return getOwnedTokens({ aptosConfig: this.config, ...args });
  }
  async getTokenActivity(args) {
    return getTokenActivity({ aptosConfig: this.config, ...args });
  }
};

// src/internal/event.ts
async function getAccountEventsByCreationNumber(args) {
  const { accountAddress, aptosConfig, creationNumber } = args;
  const address = AccountAddress.fromHexInput(accountAddress).toString();
  const whereCondition = {
    account_address: { _eq: address },
    creation_number: { _eq: creationNumber }
  };
  return getEvents({ aptosConfig, options: { where: whereCondition } });
}
async function getAccountEventsByEventType(args) {
  const { accountAddress, aptosConfig, eventType, options } = args;
  const address = AccountAddress.fromHexInput(accountAddress).toString();
  const whereCondition = {
    account_address: { _eq: address },
    type: { _eq: eventType }
  };
  const customOptions = {
    where: whereCondition,
    pagination: options == null ? void 0 : options.pagination,
    orderBy: options == null ? void 0 : options.orderBy
  };
  return getEvents({ aptosConfig, options: customOptions });
}
async function getEvents(args) {
  var _a, _b;
  const { aptosConfig, options } = args;
  const graphqlQuery = {
    query: GetEvents,
    variables: {
      where_condition: options == null ? void 0 : options.where,
      offset: (_a = options == null ? void 0 : options.pagination) == null ? void 0 : _a.offset,
      limit: (_b = options == null ? void 0 : options.pagination) == null ? void 0 : _b.limit,
      order_by: options == null ? void 0 : options.orderBy
    }
  };
  const data = await queryIndexer({
    aptosConfig,
    query: graphqlQuery,
    originMethod: "getEvents"
  });
  return data.events;
}

// src/api/event.ts
var Event = class {
  constructor(config) {
    this.config = config;
  }
  async getAccountEventsByCreationNumber(args) {
    return getAccountEventsByCreationNumber({ aptosConfig: this.config, ...args });
  }
  async getAccountEventsByEventType(args) {
    return getAccountEventsByEventType({ aptosConfig: this.config, ...args });
  }
  async getEvents(args) {
    return getEvents({ aptosConfig: this.config, ...args });
  }
};

// src/internal/faucet.ts
async function fundAccount(args) {
  const { aptosConfig, accountAddress, amount, options } = args;
  const timeout = (options == null ? void 0 : options.timeoutSecs) || DEFAULT_TXN_TIMEOUT_SEC;
  const { data } = await postAptosFaucet({
    aptosConfig,
    path: "fund",
    body: {
      address: AccountAddress.fromHexInput(accountAddress).toString(),
      amount
    },
    originMethod: "fundAccount"
  });
  const txnHash = data.txn_hashes[0];
  await waitForTransaction({
    aptosConfig,
    transactionHash: txnHash,
    options: {
      timeoutSecs: timeout,
      checkSuccess: options == null ? void 0 : options.checkSuccess,
      indexerVersionCheck: options == null ? void 0 : options.indexerVersionCheck
    }
  });
  return txnHash;
}

// src/api/faucet.ts
var Faucet = class {
  constructor(config) {
    this.config = config;
  }
  async fundAccount(args) {
    return fundAccount({ aptosConfig: this.config, ...args });
  }
};

// src/internal/fungibleAsset.ts
async function getFungibleAssetMetadata(args) {
  var _a, _b;
  const { aptosConfig, options } = args;
  const graphqlQuery = {
    query: GetFungibleAssetMetadata,
    variables: {
      where_condition: options == null ? void 0 : options.where,
      limit: (_a = options == null ? void 0 : options.pagination) == null ? void 0 : _a.limit,
      offset: (_b = options == null ? void 0 : options.pagination) == null ? void 0 : _b.offset
    }
  };
  const data = await queryIndexer({
    aptosConfig,
    query: graphqlQuery,
    originMethod: "getFungibleAssetMetadata"
  });
  return data.fungible_asset_metadata;
}
async function getFungibleAssetActivities(args) {
  var _a, _b;
  const { aptosConfig, options } = args;
  const graphqlQuery = {
    query: GetFungibleAssetActivities,
    variables: {
      where_condition: options == null ? void 0 : options.where,
      limit: (_a = options == null ? void 0 : options.pagination) == null ? void 0 : _a.limit,
      offset: (_b = options == null ? void 0 : options.pagination) == null ? void 0 : _b.offset
    }
  };
  const data = await queryIndexer({
    aptosConfig,
    query: graphqlQuery,
    originMethod: "getFungibleAssetActivities"
  });
  return data.fungible_asset_activities;
}
async function getCurrentFungibleAssetBalances(args) {
  var _a, _b;
  const { aptosConfig, options } = args;
  const graphqlQuery = {
    query: GetCurrentFungibleAssetBalances,
    variables: {
      where_condition: options == null ? void 0 : options.where,
      limit: (_a = options == null ? void 0 : options.pagination) == null ? void 0 : _a.limit,
      offset: (_b = options == null ? void 0 : options.pagination) == null ? void 0 : _b.offset
    }
  };
  const data = await queryIndexer({
    aptosConfig,
    query: graphqlQuery,
    originMethod: "getCurrentFungibleAssetBalances"
  });
  return data.current_fungible_asset_balances;
}

// src/api/fungibleAsset.ts
var FungibleAsset = class {
  constructor(config) {
    this.config = config;
  }
  async getFungibleAssetMetadata(args) {
    return getFungibleAssetMetadata({ aptosConfig: this.config, ...args });
  }
  async getFungibleAssetMetadataByAssetType(assetType) {
    const data = await getFungibleAssetMetadata({
      aptosConfig: this.config,
      options: {
        where: {
          asset_type: { _eq: assetType }
        }
      }
    });
    return data[0];
  }
  async getFungibleAssetActivities(args) {
    return getFungibleAssetActivities({ aptosConfig: this.config, ...args });
  }
  async getCurrentFungibleAssetBalances(args) {
    return getCurrentFungibleAssetBalances({ aptosConfig: this.config, ...args });
  }
};

// src/api/general.ts
var General = class {
  constructor(config) {
    this.config = config;
  }
  async getLedgerInfo() {
    return getLedgerInfo({ aptosConfig: this.config });
  }
  async getChainId() {
    const result = await this.getLedgerInfo();
    return result.chain_id;
  }
  async getBlockByVersion(args) {
    return getBlockByVersion({
      aptosConfig: this.config,
      ...args
    });
  }
  async getBlockByHeight(args) {
    return getBlockByHeight({ aptosConfig: this.config, ...args });
  }
  async getTableItem(args) {
    return getTableItem({ aptosConfig: this.config, ...args });
  }
  async view(args) {
    return view({ aptosConfig: this.config, ...args });
  }
  async getChainTopUserTransactions(args) {
    return getChainTopUserTransactions({
      aptosConfig: this.config,
      ...args
    });
  }
  async queryIndexer(args) {
    return queryIndexer({
      aptosConfig: this.config,
      ...args
    });
  }
  async getIndexerLastSuccessVersion() {
    return getIndexerLastSuccessVersion({ aptosConfig: this.config });
  }
};

// src/internal/staking.ts
async function getNumberOfDelegators(args) {
  const { aptosConfig, poolAddress } = args;
  const address = Hex.fromHexInput(poolAddress).toString();
  const query = {
    query: GetNumberOfDelegators,
    variables: { where_condition: { pool_address: { _eq: address } } }
  };
  const data = await queryIndexer({ aptosConfig, query });
  if (data.num_active_delegator_per_pool.length === 0) {
    throw Error("Delegator pool not found");
  }
  return data.num_active_delegator_per_pool[0].num_active_delegator;
}
async function getNumberOfDelegatorsForAllPools(args) {
  const { aptosConfig, options } = args;
  const query = {
    query: GetNumberOfDelegators,
    variables: { where_condition: {}, order_by: options == null ? void 0 : options.orderBy }
  };
  const data = await queryIndexer({
    aptosConfig,
    query
  });
  return data.num_active_delegator_per_pool;
}
async function getDelegatedStakingActivities(args) {
  const { aptosConfig, delegatorAddress, poolAddress } = args;
  const query = {
    query: GetDelegatedStakingActivities,
    variables: {
      delegatorAddress: Hex.fromHexInput(delegatorAddress).toString(),
      poolAddress: Hex.fromHexInput(poolAddress).toString()
    }
  };
  const data = await queryIndexer({ aptosConfig, query });
  return data.delegated_staking_activities;
}

// src/api/staking.ts
var Staking = class {
  constructor(config) {
    this.config = config;
  }
  async getNumberOfDelegators(args) {
    return getNumberOfDelegators({ aptosConfig: this.config, ...args });
  }
  async getNumberOfDelegatorsForAllPools(args) {
    return getNumberOfDelegatorsForAllPools({ aptosConfig: this.config, ...args });
  }
  async getDelegatedStakingActivities(args) {
    return getDelegatedStakingActivities({ aptosConfig: this.config, ...args });
  }
};

// src/api/transaction.ts
var Transaction = class {
  constructor(config) {
    this.config = config;
  }
  async getTransactions(args) {
    return getTransactions2({
      aptosConfig: this.config,
      ...args
    });
  }
  async getTransactionByVersion(args) {
    return getTransactionByVersion({
      aptosConfig: this.config,
      ...args
    });
  }
  async getTransactionByHash(args) {
    return getTransactionByHash({
      aptosConfig: this.config,
      ...args
    });
  }
  async isPendingTransaction(args) {
    return isTransactionPending({
      aptosConfig: this.config,
      ...args
    });
  }
  async waitForTransaction(args) {
    return waitForTransaction({
      aptosConfig: this.config,
      ...args
    });
  }
  async getGasPriceEstimation() {
    return getGasPriceEstimation({
      aptosConfig: this.config
    });
  }
};

// src/api/transactionSubmission.ts
var TransactionSubmission = class {
  constructor(config) {
    this.config = config;
  }
  async generateTransaction(args) {
    return generateTransaction({ aptosConfig: this.config, ...args });
  }
  signTransaction(args) {
    return signTransaction({ ...args });
  }
  async simulateTransaction(args) {
    return simulateTransaction({ aptosConfig: this.config, ...args });
  }
  async submitTransaction(args) {
    return submitTransaction({ aptosConfig: this.config, ...args });
  }
  async signAndSubmitTransaction(args) {
    const { signer, transaction } = args;
    return signAndSubmitTransaction({
      aptosConfig: this.config,
      signer,
      transaction
    });
  }
  async publishPackageTransaction(args) {
    return publicPackageTransaction({ aptosConfig: this.config, ...args });
  }
};

// src/api/aptos.ts
var Aptos = class {
  constructor(settings) {
    this.config = new AptosConfig(settings);
    this.account = new Account2(this.config);
    this.coin = new Coin(this.config);
    this.digitalAsset = new DigitalAsset(this.config);
    this.event = new Event(this.config);
    this.faucet = new Faucet(this.config);
    this.fungibleAsset = new FungibleAsset(this.config);
    this.general = new General(this.config);
    this.staking = new Staking(this.config);
    this.transaction = new Transaction(this.config);
    this.transactionSubmission = new TransactionSubmission(this.config);
  }
};
function applyMixin(targetClass, baseClass, baseClassProp) {
  Object.getOwnPropertyNames(baseClass.prototype).forEach((propertyName) => {
    const propertyDescriptor = Object.getOwnPropertyDescriptor(baseClass.prototype, propertyName);
    if (!propertyDescriptor)
      return;
    propertyDescriptor.value = function(...args) {
      return this[baseClassProp][propertyName](...args);
    };
    Object.defineProperty(targetClass.prototype, propertyName, propertyDescriptor);
  });
}
applyMixin(Aptos, Account2, "account");
applyMixin(Aptos, Coin, "coin");
applyMixin(Aptos, DigitalAsset, "digitalAsset");
applyMixin(Aptos, Event, "event");
applyMixin(Aptos, Faucet, "faucet");
applyMixin(Aptos, FungibleAsset, "fungibleAsset");
applyMixin(Aptos, General, "general");
applyMixin(Aptos, Staking, "staking");
applyMixin(Aptos, Transaction, "transaction");
applyMixin(Aptos, TransactionSubmission, "transactionSubmission");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  APTOS_PATH_REGEX,
  Account,
  AccountAddress,
  AccountAuthenticator,
  AccountAuthenticatorEd25519,
  AccountAuthenticatorMultiEd25519,
  AccountAuthenticatorMultiKey,
  AccountAuthenticatorSingleKey,
  AccountAuthenticatorVariant,
  AddressInvalidReason,
  AnyPublicKeyVariant,
  AnySignatureVariant,
  Aptos,
  AptosApiError,
  AptosConfig,
  AuthenticationKey,
  Bool,
  ChainId,
  DeriveScheme,
  Deserializer,
  Ed25519PrivateKey,
  Ed25519PublicKey,
  Ed25519Signature,
  EntryFunction,
  EntryFunctionBytes,
  FeePayerRawTransaction,
  FixedBytes,
  Hex,
  HexInvalidReason,
  Identifier,
  KeyType,
  MimeType,
  ModuleId,
  MoveAbility,
  MoveFunctionVisibility,
  MoveOption,
  MoveString,
  MoveVector,
  MultiAgentRawTransaction,
  MultiEd25519PublicKey,
  MultiEd25519Signature,
  MultiKey,
  MultiSig,
  MultisigTransactionPayload,
  Network,
  NetworkToChainId,
  NetworkToFaucetAPI,
  NetworkToIndexerAPI,
  NetworkToNodeAPI,
  ParsingError,
  PrivateKey,
  PublicKey,
  RawTransaction,
  RawTransactionWithData,
  RoleType,
  Script,
  ScriptTransactionArgumentVariants,
  Secp256k1PrivateKey,
  Secp256k1PublicKey,
  Secp256k1Signature,
  Serializable,
  Serializer,
  Signature,
  SignedTransaction,
  SigningScheme,
  SigningSchemeInput,
  StructTag,
  TransactionAuthenticator,
  TransactionAuthenticatorEd25519,
  TransactionAuthenticatorFeePayer,
  TransactionAuthenticatorMultiAgent,
  TransactionAuthenticatorMultiEd25519,
  TransactionAuthenticatorSingleSender,
  TransactionAuthenticatorVariant,
  TransactionPayload,
  TransactionPayloadEntryFunction,
  TransactionPayloadMultisig,
  TransactionPayloadScript,
  TransactionPayloadVariants,
  TransactionResponseType,
  TransactionVariants,
  TypeTag,
  TypeTagAddress,
  TypeTagBool,
  TypeTagGeneric,
  TypeTagParserError,
  TypeTagParserErrorType,
  TypeTagReference,
  TypeTagSigner,
  TypeTagStruct,
  TypeTagU128,
  TypeTagU16,
  TypeTagU256,
  TypeTagU32,
  TypeTagU64,
  TypeTagU8,
  TypeTagVariants,
  TypeTagVector,
  U128,
  U16,
  U256,
  U32,
  U64,
  U8,
  aptosCoinStructTag,
  aptosRequest,
  buildTransaction,
  convertArgument,
  derivePrivateKeyFromMnemonic,
  deriveTransactionType,
  deserializeFromScriptArgument,
  ensureBoolean,
  fetchEntryFunctionAbi,
  findFirstNonSignerArg,
  generateMultiSignersSignedTransaction,
  generateRawTransaction,
  generateSignedTransaction,
  generateSignedTransactionForSimulation,
  generateTransactionPayload,
  generateTransactionPayloadWithABI,
  get,
  getAptosFullNode,
  getAuthenticatorForSimulation,
  getFunctionParts,
  getSigningMessage,
  isBcsAddress,
  isBcsBool,
  isBcsFixedBytes,
  isBcsString,
  isBcsU128,
  isBcsU16,
  isBcsU256,
  isBcsU32,
  isBcsU64,
  isBcsU8,
  isBool,
  isLargeNumber,
  isNull,
  isNumber,
  isScriptDataInput,
  isString,
  isValidPath,
  objectStructTag,
  optionStructTag,
  outOfRangeErrorMessage,
  paginateWithCursor,
  parseTypeTag,
  post,
  postAptosFaucet,
  postAptosFullNode,
  postAptosIndexer,
  request,
  sign,
  standardizeTypeTags,
  stringStructTag,
  throwTypeMismatch,
  validateNumberInRange
});
//# sourceMappingURL=index.js.map