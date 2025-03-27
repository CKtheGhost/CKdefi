"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/types/index.ts
var types_exports = {};
__export(types_exports, {
  AccountAuthenticatorVariant: () => AccountAuthenticatorVariant,
  AnyPublicKeyVariant: () => AnyPublicKeyVariant,
  AnySignatureVariant: () => AnySignatureVariant,
  DeriveScheme: () => DeriveScheme,
  MimeType: () => MimeType,
  MoveAbility: () => MoveAbility,
  MoveFunctionVisibility: () => MoveFunctionVisibility,
  RoleType: () => RoleType,
  ScriptTransactionArgumentVariants: () => ScriptTransactionArgumentVariants,
  SigningScheme: () => SigningScheme,
  SigningSchemeInput: () => SigningSchemeInput,
  TransactionAuthenticatorVariant: () => TransactionAuthenticatorVariant,
  TransactionPayloadVariants: () => TransactionPayloadVariants,
  TransactionResponseType: () => TransactionResponseType,
  TransactionVariants: () => TransactionVariants,
  TypeTagVariants: () => TypeTagVariants
});
module.exports = __toCommonJS(types_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AccountAuthenticatorVariant,
  AnyPublicKeyVariant,
  AnySignatureVariant,
  DeriveScheme,
  MimeType,
  MoveAbility,
  MoveFunctionVisibility,
  RoleType,
  ScriptTransactionArgumentVariants,
  SigningScheme,
  SigningSchemeInput,
  TransactionAuthenticatorVariant,
  TransactionPayloadVariants,
  TransactionResponseType,
  TransactionVariants,
  TypeTagVariants
});
//# sourceMappingURL=index.js.map