declare enum Network {
    MAINNET = "mainnet",
    TESTNET = "testnet",
    DEVNET = "devnet",
    LOCAL = "local",
    CUSTOM = "custom"
}

declare type GetAccountCoinsDataQuery = {
    current_fungible_asset_balances: Array<{
        amount: any;
        asset_type: string;
        is_frozen: boolean;
        is_primary: boolean;
        last_transaction_timestamp: any;
        last_transaction_version: any;
        owner_address: string;
        storage_id: string;
        token_standard: string;
        metadata?: {
            token_standard: string;
            symbol: string;
            supply_aggregator_table_key_v1?: string | null;
            supply_aggregator_table_handle_v1?: string | null;
            project_uri?: string | null;
            name: string;
            last_transaction_version: any;
            last_transaction_timestamp: any;
            icon_uri?: string | null;
            decimals: number;
            creator_address: string;
            asset_type: string;
        } | null;
    }>;
};
declare type GetAccountCollectionsWithOwnedTokensQuery = {
    current_collection_ownership_v2_view: Array<{
        collection_id?: string | null;
        collection_name?: string | null;
        collection_uri?: string | null;
        creator_address?: string | null;
        distinct_tokens?: any | null;
        last_transaction_version?: any | null;
        owner_address?: string | null;
        single_token_uri?: string | null;
        current_collection?: {
            collection_id: string;
            collection_name: string;
            creator_address: string;
            current_supply: any;
            description: string;
            last_transaction_timestamp: any;
            last_transaction_version: any;
            mutable_description?: boolean | null;
            max_supply?: any | null;
            mutable_uri?: boolean | null;
            table_handle_v1?: string | null;
            token_standard: string;
            total_minted_v2?: any | null;
            uri: string;
        } | null;
    }>;
};
declare type GetAccountOwnedObjectsQuery = {
    current_objects: Array<{
        allow_ungated_transfer: boolean;
        state_key_hash: string;
        owner_address: string;
        object_address: string;
        last_transaction_version: any;
        last_guid_creation_num: any;
        is_deleted: boolean;
    }>;
};
declare type GetAccountOwnedTokensQuery = {
    current_token_ownerships_v2: Array<{
        token_standard: string;
        token_properties_mutated_v1?: any | null;
        token_data_id: string;
        table_type_v1?: string | null;
        storage_id: string;
        property_version_v1: any;
        owner_address: string;
        last_transaction_version: any;
        last_transaction_timestamp: any;
        is_soulbound_v2?: boolean | null;
        is_fungible_v2?: boolean | null;
        amount: any;
        current_token_data?: {
            collection_id: string;
            description: string;
            is_fungible_v2?: boolean | null;
            largest_property_version_v1?: any | null;
            last_transaction_timestamp: any;
            last_transaction_version: any;
            maximum?: any | null;
            supply: any;
            token_data_id: string;
            token_name: string;
            token_properties: any;
            token_standard: string;
            token_uri: string;
            current_collection?: {
                collection_id: string;
                collection_name: string;
                creator_address: string;
                current_supply: any;
                description: string;
                last_transaction_timestamp: any;
                last_transaction_version: any;
                max_supply?: any | null;
                mutable_description?: boolean | null;
                mutable_uri?: boolean | null;
                table_handle_v1?: string | null;
                token_standard: string;
                total_minted_v2?: any | null;
                uri: string;
            } | null;
        } | null;
    }>;
};
declare type GetAccountOwnedTokensFromCollectionQuery = {
    current_token_ownerships_v2: Array<{
        token_standard: string;
        token_properties_mutated_v1?: any | null;
        token_data_id: string;
        table_type_v1?: string | null;
        storage_id: string;
        property_version_v1: any;
        owner_address: string;
        last_transaction_version: any;
        last_transaction_timestamp: any;
        is_soulbound_v2?: boolean | null;
        is_fungible_v2?: boolean | null;
        amount: any;
        current_token_data?: {
            collection_id: string;
            description: string;
            is_fungible_v2?: boolean | null;
            largest_property_version_v1?: any | null;
            last_transaction_timestamp: any;
            last_transaction_version: any;
            maximum?: any | null;
            supply: any;
            token_data_id: string;
            token_name: string;
            token_properties: any;
            token_standard: string;
            token_uri: string;
            current_collection?: {
                collection_id: string;
                collection_name: string;
                creator_address: string;
                current_supply: any;
                description: string;
                last_transaction_timestamp: any;
                last_transaction_version: any;
                max_supply?: any | null;
                mutable_description?: boolean | null;
                mutable_uri?: boolean | null;
                table_handle_v1?: string | null;
                token_standard: string;
                total_minted_v2?: any | null;
                uri: string;
            } | null;
        } | null;
    }>;
};
declare type GetChainTopUserTransactionsQuery = {
    user_transactions: Array<{
        version: any;
    }>;
};
declare type GetCollectionDataQuery = {
    current_collections_v2: Array<{
        collection_id: string;
        collection_name: string;
        creator_address: string;
        current_supply: any;
        description: string;
        last_transaction_timestamp: any;
        last_transaction_version: any;
        max_supply?: any | null;
        mutable_description?: boolean | null;
        mutable_uri?: boolean | null;
        table_handle_v1?: string | null;
        token_standard: string;
        total_minted_v2?: any | null;
        uri: string;
    }>;
};
declare type GetCurrentFungibleAssetBalancesQuery = {
    current_fungible_asset_balances: Array<{
        amount: any;
        asset_type: string;
        is_frozen: boolean;
        is_primary: boolean;
        last_transaction_timestamp: any;
        last_transaction_version: any;
        owner_address: string;
        storage_id: string;
        token_standard: string;
    }>;
};
declare type GetDelegatedStakingActivitiesQuery = {
    delegated_staking_activities: Array<{
        amount: any;
        delegator_address: string;
        event_index: any;
        event_type: string;
        pool_address: string;
        transaction_version: any;
    }>;
};
declare type GetEventsQuery = {
    events: Array<{
        account_address: string;
        creation_number: any;
        data: any;
        event_index: any;
        sequence_number: any;
        transaction_block_height: any;
        transaction_version: any;
        type: string;
    }>;
};
declare type GetFungibleAssetActivitiesQuery = {
    fungible_asset_activities: Array<{
        amount?: any | null;
        asset_type: string;
        block_height: any;
        entry_function_id_str?: string | null;
        event_index: any;
        gas_fee_payer_address?: string | null;
        is_frozen?: boolean | null;
        is_gas_fee: boolean;
        is_transaction_success: boolean;
        owner_address: string;
        storage_id: string;
        storage_refund_amount: any;
        token_standard: string;
        transaction_timestamp: any;
        transaction_version: any;
        type: string;
    }>;
};
declare type GetFungibleAssetMetadataQuery = {
    fungible_asset_metadata: Array<{
        icon_uri?: string | null;
        project_uri?: string | null;
        supply_aggregator_table_handle_v1?: string | null;
        supply_aggregator_table_key_v1?: string | null;
        creator_address: string;
        asset_type: string;
        decimals: number;
        last_transaction_timestamp: any;
        last_transaction_version: any;
        name: string;
        symbol: string;
        token_standard: string;
    }>;
};
declare type GetNumberOfDelegatorsQuery = {
    num_active_delegator_per_pool: Array<{
        num_active_delegator?: any | null;
        pool_address?: string | null;
    }>;
};
declare type GetProcessorStatusQuery = {
    processor_status: Array<{
        last_success_version: any;
        processor: string;
        last_updated: any;
    }>;
};
declare type GetTokenActivityQuery = {
    token_activities_v2: Array<{
        after_value?: string | null;
        before_value?: string | null;
        entry_function_id_str?: string | null;
        event_account_address: string;
        event_index: any;
        from_address?: string | null;
        is_fungible_v2?: boolean | null;
        property_version_v1: any;
        to_address?: string | null;
        token_amount: any;
        token_data_id: string;
        token_standard: string;
        transaction_timestamp: any;
        transaction_version: any;
        type: string;
    }>;
};
declare type GetCurrentTokenOwnershipQuery = {
    current_token_ownerships_v2: Array<{
        token_standard: string;
        token_properties_mutated_v1?: any | null;
        token_data_id: string;
        table_type_v1?: string | null;
        storage_id: string;
        property_version_v1: any;
        owner_address: string;
        last_transaction_version: any;
        last_transaction_timestamp: any;
        is_soulbound_v2?: boolean | null;
        is_fungible_v2?: boolean | null;
        amount: any;
        current_token_data?: {
            collection_id: string;
            description: string;
            is_fungible_v2?: boolean | null;
            largest_property_version_v1?: any | null;
            last_transaction_timestamp: any;
            last_transaction_version: any;
            maximum?: any | null;
            supply: any;
            token_data_id: string;
            token_name: string;
            token_properties: any;
            token_standard: string;
            token_uri: string;
            current_collection?: {
                collection_id: string;
                collection_name: string;
                creator_address: string;
                current_supply: any;
                description: string;
                last_transaction_timestamp: any;
                last_transaction_version: any;
                max_supply?: any | null;
                mutable_description?: boolean | null;
                mutable_uri?: boolean | null;
                table_handle_v1?: string | null;
                token_standard: string;
                total_minted_v2?: any | null;
                uri: string;
            } | null;
        } | null;
    }>;
};
declare type GetTokenDataQuery = {
    current_token_datas_v2: Array<{
        collection_id: string;
        description: string;
        is_fungible_v2?: boolean | null;
        largest_property_version_v1?: any | null;
        last_transaction_timestamp: any;
        last_transaction_version: any;
        maximum?: any | null;
        supply: any;
        token_data_id: string;
        token_name: string;
        token_properties: any;
        token_standard: string;
        token_uri: string;
        current_collection?: {
            collection_id: string;
            collection_name: string;
            creator_address: string;
            current_supply: any;
            description: string;
            last_transaction_timestamp: any;
            last_transaction_version: any;
            max_supply?: any | null;
            mutable_description?: boolean | null;
            mutable_uri?: boolean | null;
            table_handle_v1?: string | null;
            token_standard: string;
            total_minted_v2?: any | null;
            uri: string;
        } | null;
    }>;
};

/**
 * GENERATED QUERY TYPES FROM GRAPHQL SCHEMA
 *
 * generated types we generate from graphql schema that match the structure of the
 * response type when querying from Hasura schema.
 *
 * These types are used as the return type when making the actual request (usually
 * under the /internal/ folder)
 */

/**
 * CUSTOM RESPONSE TYPES FOR THE END USER
 *
 * To provide a good dev exp, we build custom types derived from the
 * query types to be the response type the end developer/user will
 * work with.
 *
 * These types are used as the return type when calling a sdk api function
 * that calls the function that queries the server (usually under the /api/ folder)
 */
declare type GetAccountOwnedObjectsResponse = GetAccountOwnedObjectsQuery["current_objects"];
declare type GetAccountOwnedTokensQueryResponse = GetAccountOwnedTokensQuery["current_token_ownerships_v2"];
declare type GetAccountOwnedTokensFromCollectionResponse = GetAccountOwnedTokensFromCollectionQuery["current_token_ownerships_v2"];
declare type GetAccountCollectionsWithOwnedTokenResponse = GetAccountCollectionsWithOwnedTokensQuery["current_collection_ownership_v2_view"];
declare type GetAccountCoinsDataResponse = GetAccountCoinsDataQuery["current_fungible_asset_balances"];
declare type GetChainTopUserTransactionsResponse = GetChainTopUserTransactionsQuery["user_transactions"];
declare type GetEventsResponse = GetEventsQuery["events"];
declare type GetNumberOfDelegatorsResponse = GetNumberOfDelegatorsQuery["num_active_delegator_per_pool"];
declare type GetDelegatedStakingActivitiesResponse = GetDelegatedStakingActivitiesQuery["delegated_staking_activities"];
declare type GetCollectionDataResponse = GetCollectionDataQuery["current_collections_v2"][0];
declare type GetTokenDataResponse = GetTokenDataQuery["current_token_datas_v2"][0];
declare type GetProcessorStatusResponse = GetProcessorStatusQuery["processor_status"];
declare type GetFungibleAssetMetadataResponse = GetFungibleAssetMetadataQuery["fungible_asset_metadata"];
declare type GetFungibleAssetActivitiesResponse = GetFungibleAssetActivitiesQuery["fungible_asset_activities"];
declare type GetCurrentFungibleAssetBalancesResponse = GetCurrentFungibleAssetBalancesQuery["current_fungible_asset_balances"];
declare type GetTokenActivityResponse = GetTokenActivityQuery["token_activities_v2"];
declare type GetCurrentTokenOwnershipResponse = GetCurrentTokenOwnershipQuery["current_token_ownerships_v2"][0];
declare type GetOwnedTokensResponse = GetCurrentTokenOwnershipQuery["current_token_ownerships_v2"];
/**
 * A generic type that being passed by each function and holds an
 * array of properties we can sort the query by
 */
declare type OrderBy<T> = Array<{
    [K in keyof T]?: OrderByValue;
}>;
declare type OrderByValue = "asc" | "asc_nulls_first" | "asc_nulls_last" | "desc" | "desc_nulls_first" | "desc_nulls_last";
/**
 * Refers to the token standard we want to query for
 */
declare type TokenStandard = "v1" | "v2";
/**
 * The graphql query type to pass into the `queryIndexer` function
 */
declare type GraphqlQuery = {
    query: string;
    variables?: {};
};

declare enum MimeType {
    /**
     * JSON representation, used for transaction submission and accept type JSON output
     */
    JSON = "application/json",
    /**
     * BCS representation, used for accept type BCS output
     */
    BCS = "application/x-bcs",
    /**
     * BCS representation, used for transaction submission in BCS input
     */
    BCS_SIGNED_TRANSACTION = "application/x.aptos.signed_transaction+bcs"
}
/**
 * Hex data as input to a function
 */
declare type HexInput = string | Uint8Array;
/**
 * TypeTag enum as they are represented in Rust
 * {@link https://github.com/aptos-labs/aptos-core/blob/main/third_party/move/move-core/types/src/language_storage.rs#L27}
 */
declare enum TypeTagVariants {
    Bool = 0,
    U8 = 1,
    U64 = 2,
    U128 = 3,
    Address = 4,
    Signer = 5,
    Vector = 6,
    Struct = 7,
    U16 = 8,
    U32 = 9,
    U256 = 10,
    Reference = 254,
    Generic = 255
}
/**
 * Script transaction arguments enum as they are represented in Rust
 * {@link https://github.com/aptos-labs/aptos-core/blob/main/third_party/move/move-core/types/src/transaction_argument.rs#L11}
 */
declare enum ScriptTransactionArgumentVariants {
    U8 = 0,
    U64 = 1,
    U128 = 2,
    Address = 3,
    U8Vector = 4,
    Bool = 5,
    U16 = 6,
    U32 = 7,
    U256 = 8
}
/**
 * Transaction payload enum as they are represented in Rust
 * {@link https://github.com/aptos-labs/aptos-core/blob/main/types/src/transaction/mod.rs#L478}
 */
declare enum TransactionPayloadVariants {
    Script = 0,
    EntryFunction = 2,
    Multisig = 3
}
/**
 * Transaction variants enum as they are represented in Rust
 * {@link https://github.com/aptos-labs/aptos-core/blob/main/types/src/transaction/mod.rs#L440}
 */
declare enum TransactionVariants {
    MultiAgentTransaction = 0,
    FeePayerTransaction = 1
}
/**
 * Transaction Authenticator enum as they are represented in Rust
 * {@link https://github.com/aptos-labs/aptos-core/blob/main/types/src/transaction/authenticator.rs#L44}
 */
declare enum TransactionAuthenticatorVariant {
    Ed25519 = 0,
    MultiEd25519 = 1,
    MultiAgent = 2,
    FeePayer = 3,
    SingleSender = 4
}
/**
 * Transaction Authenticator enum as they are represented in Rust
 * {@link https://github.com/aptos-labs/aptos-core/blob/main/types/src/transaction/authenticator.rs#L414}
 */
declare enum AccountAuthenticatorVariant {
    Ed25519 = 0,
    MultiEd25519 = 1,
    SingleKey = 2,
    MultiKey = 3
}
declare enum AnyPublicKeyVariant {
    Ed25519 = 0,
    Secp256k1 = 1
}
declare enum AnySignatureVariant {
    Ed25519 = 0,
    Secp256k1 = 1
}
/**
 * BCS types
 */
declare type Uint8 = number;
declare type Uint16 = number;
declare type Uint32 = number;
declare type Uint64 = bigint;
declare type Uint128 = bigint;
declare type Uint256 = bigint;
declare type AnyNumber = number | bigint;
/**
 * Set of configuration options that can be provided when initializing the SDK.
 * The purpose of these options is to configure various aspects of the SDK's
 * behavior and interaction with the Aptos network
 */
declare type AptosSettings = {
    readonly network?: Network;
    readonly fullnode?: string;
    readonly faucet?: string;
    readonly indexer?: string;
    readonly clientConfig?: ClientConfig;
    readonly client?: Client;
};
/**
 *
 * Controls the number of results that are returned and the starting position of those results.
 * @param offset parameter specifies the starting position of the query result within the set of data. Default is 0.
 * @param limit specifies the maximum number of items or records to return in a query result. Default is 25.
 */
interface PaginationArgs {
    offset?: AnyNumber;
    limit?: number;
}
/**
 * QUERY TYPES
 */
/**
 * A configuration object we can pass with the request to the server.
 *
 * @param TOKEN - an auth token to send with the request
 * @param HEADERS - extra headers we want to send with the request
 * @param WITH_CREDENTIALS - whether to carry cookies. By default, it is set to true and cookies will be sent
 */
declare type ClientConfig = {
    TOKEN?: string;
    HEADERS?: Record<string, string | number | boolean>;
    WITH_CREDENTIALS?: boolean;
};
interface ClientRequest<Req> {
    url: string;
    method: "GET" | "POST";
    body?: Req;
    contentType?: string;
    params?: any;
    overrides?: ClientConfig;
    headers?: Record<string, any>;
}
interface ClientResponse<Res> {
    status: number;
    statusText: string;
    data: Res;
    config?: any;
    request?: any;
    response?: any;
    headers?: any;
}
interface Client {
    provider<Req, Res>(requestOptions: ClientRequest<Req>): Promise<ClientResponse<Res>>;
}
/**
 * The API request type
 *
 * @param url - the url to make the request to, i.e https://fullnode.aptoslabs.devnet.com/v1
 * @param method - the request method "GET" | "POST"
 * @param endpoint (optional) - the endpoint to make the request to, i.e transactions
 * @param body (optional) - the body of the request
 * @param contentType (optional) - the content type to set the `content-type` header to,
 * by default is set to `application/json`
 * @param params (optional) - query params to add to the request
 * @param originMethod (optional) - the local method the request came from
 * @param overrides (optional) - a `ClientConfig` object type to override request data
 */
declare type AptosRequest = {
    url: string;
    method: "GET" | "POST";
    path?: string;
    body?: any;
    contentType?: string;
    acceptType?: string;
    params?: Record<string, string | AnyNumber | boolean | undefined>;
    originMethod?: string;
    overrides?: ClientConfig;
};
/**
 * Specifies ledger version of transactions. By default latest version will be used
 */
declare type LedgerVersion = {
    ledgerVersion?: AnyNumber;
};
/**
 * RESPONSE TYPES
 */
/**
 * Type holding the outputs of the estimate gas API
 */
declare type GasEstimation = {
    /**
     * The deprioritized estimate for the gas unit price
     */
    deprioritized_gas_estimate?: number;
    /**
     * The current estimate for the gas unit price
     */
    gas_estimate: number;
    /**
     * The prioritized estimate for the gas unit price
     */
    prioritized_gas_estimate?: number;
};
declare type MoveResource = {
    type: MoveStructType;
    data: {};
};
declare type AccountData = {
    sequence_number: string;
    authentication_key: string;
};
declare type MoveModuleBytecode = {
    bytecode: string;
    abi?: MoveModule;
};
/**
 * TRANSACTION TYPES
 */
declare enum TransactionResponseType {
    Pending = "pending_transaction",
    User = "user_transaction",
    Genesis = "genesis_transaction",
    BlockMetadata = "block_metadata_transaction",
    StateCheckpoint = "state_checkpoint_transaction"
}
declare type TransactionResponse = PendingTransactionResponse | UserTransactionResponse | GenesisTransactionResponse | BlockMetadataTransactionResponse | StateCheckpointTransactionResponse;
declare type PendingTransactionResponse = {
    type: TransactionResponseType.Pending;
    hash: string;
    sender: string;
    sequence_number: string;
    max_gas_amount: string;
    gas_unit_price: string;
    expiration_timestamp_secs: string;
    payload: TransactionPayloadResponse;
    signature?: TransactionSignature;
};
declare type UserTransactionResponse = {
    type: TransactionResponseType.User;
    version: string;
    hash: string;
    state_change_hash: string;
    event_root_hash: string;
    state_checkpoint_hash?: string;
    gas_used: string;
    /**
     * Whether the transaction was successful
     */
    success: boolean;
    /**
     * The VM status of the transaction, can tell useful information in a failure
     */
    vm_status: string;
    accumulator_root_hash: string;
    /**
     * Final state of resources changed by the transaction
     */
    changes: Array<WriteSetChange>;
    sender: string;
    sequence_number: string;
    max_gas_amount: string;
    gas_unit_price: string;
    expiration_timestamp_secs: string;
    payload: TransactionPayloadResponse;
    signature?: TransactionSignature;
    /**
     * Events generated by the transaction
     */
    events: Array<Event>;
    timestamp: string;
};
declare type GenesisTransactionResponse = {
    type: TransactionResponseType.Genesis;
    version: string;
    hash: string;
    state_change_hash: string;
    event_root_hash: string;
    state_checkpoint_hash?: string;
    gas_used: string;
    /**
     * Whether the transaction was successful
     */
    success: boolean;
    /**
     * The VM status of the transaction, can tell useful information in a failure
     */
    vm_status: string;
    accumulator_root_hash: string;
    /**
     * Final state of resources changed by the transaction
     */
    changes: Array<WriteSetChange>;
    payload: GenesisPayload;
    /**
     * Events emitted during genesis
     */
    events: Array<Event>;
};
declare type BlockMetadataTransactionResponse = {
    type: TransactionResponseType.BlockMetadata;
    version: string;
    hash: string;
    state_change_hash: string;
    event_root_hash: string;
    state_checkpoint_hash?: string;
    gas_used: string;
    /**
     * Whether the transaction was successful
     */
    success: boolean;
    /**
     * The VM status of the transaction, can tell useful information in a failure
     */
    vm_status: string;
    accumulator_root_hash: string;
    /**
     * Final state of resources changed by the transaction
     */
    changes: Array<WriteSetChange>;
    id: string;
    epoch: string;
    round: string;
    /**
     * The events emitted at the block creation
     */
    events: Array<Event>;
    /**
     * Previous block votes
     */
    previous_block_votes_bitvec: Array<number>;
    proposer: string;
    /**
     * The indices of the proposers who failed to propose
     */
    failed_proposer_indices: Array<number>;
    timestamp: string;
};
declare type StateCheckpointTransactionResponse = {
    type: TransactionResponseType.StateCheckpoint;
    version: string;
    hash: string;
    state_change_hash: string;
    event_root_hash: string;
    state_checkpoint_hash?: string;
    gas_used: string;
    /**
     * Whether the transaction was successful
     */
    success: boolean;
    /**
     * The VM status of the transaction, can tell useful information in a failure
     */
    vm_status: string;
    accumulator_root_hash: string;
    /**
     * Final state of resources changed by the transaction
     */
    changes: Array<WriteSetChange>;
    timestamp: string;
};
/**
 * WRITESET CHANGE TYPES
 */
declare type WriteSetChange = WriteSetChangeDeleteModule | WriteSetChangeDeleteResource | WriteSetChangeDeleteTableItem | WriteSetChangeWriteModule | WriteSetChangeWriteResource | WriteSetChangeWriteTableItem;
declare type WriteSetChangeDeleteModule = {
    type: string;
    address: string;
    /**
     * State key hash
     */
    state_key_hash: string;
    module: MoveModuleId;
};
declare type WriteSetChangeDeleteResource = {
    type: string;
    address: string;
    state_key_hash: string;
    resource: string;
};
declare type WriteSetChangeDeleteTableItem = {
    type: string;
    state_key_hash: string;
    handle: string;
    key: string;
    data?: DeletedTableData;
};
declare type WriteSetChangeWriteModule = {
    type: string;
    address: string;
    state_key_hash: string;
    data: MoveModuleBytecode;
};
declare type WriteSetChangeWriteResource = {
    type: string;
    address: string;
    state_key_hash: string;
    data: MoveResource;
};
declare type WriteSetChangeWriteTableItem = {
    type: string;
    state_key_hash: string;
    handle: string;
    key: string;
    value: string;
    data?: DecodedTableData;
};
declare type DecodedTableData = {
    /**
     * Key of table in JSON
     */
    key: any;
    /**
     * Type of key
     */
    key_type: string;
    /**
     * Value of table in JSON
     */
    value: any;
    /**
     * Type of value
     */
    value_type: string;
};
/**
 * Deleted table data
 */
declare type DeletedTableData = {
    /**
     * Deleted key
     */
    key: any;
    /**
     * Deleted key type
     */
    key_type: string;
};
declare type TransactionPayloadResponse = EntryFunctionPayloadResponse | ScriptPayloadResponse | MultisigPayloadResponse;
declare type EntryFunctionPayloadResponse = {
    type: string;
    function: MoveStructType;
    /**
     * Type arguments of the function
     */
    type_arguments: Array<string>;
    /**
     * Arguments of the function
     */
    arguments: Array<any>;
};
declare type ScriptPayloadResponse = {
    type: string;
    code: MoveScriptBytecode;
    /**
     * Type arguments of the function
     */
    type_arguments: Array<string>;
    /**
     * Arguments of the function
     */
    arguments: Array<any>;
};
declare type MultisigPayloadResponse = {
    type: string;
    multisig_address: string;
    transaction_payload?: EntryFunctionPayloadResponse;
};
declare type GenesisPayload = {
    type: string;
    write_set: WriteSet;
};
/**
 * Move script bytecode
 */
declare type MoveScriptBytecode = {
    bytecode: string;
    abi?: MoveFunction;
};
/**
 * These are the JSON representations of transaction signatures returned from the node API.
 */
declare type TransactionSignature = TransactionEd25519Signature | TransactionSecp256k1Signature | TransactionMultiEd25519Signature | TransactionMultiAgentSignature | TransactionFeePayerSignature;
declare type TransactionEd25519Signature = {
    type: string;
    public_key: string;
    signature: "ed25519_signature";
};
declare type TransactionSecp256k1Signature = {
    type: string;
    public_key: string;
    signature: "secp256k1_ecdsa_signature";
};
declare type TransactionMultiEd25519Signature = {
    type: "multi_ed25519_signature";
    /**
     * The public keys for the Ed25519 signature
     */
    public_keys: Array<string>;
    /**
     * Signature associated with the public keys in the same order
     */
    signatures: Array<string>;
    /**
     * The number of signatures required for a successful transaction
     */
    threshold: number;
    bitmap: string;
};
declare type TransactionMultiAgentSignature = {
    type: "multi_agent_signature";
    sender: AccountSignature;
    /**
     * The other involved parties' addresses
     */
    secondary_signer_addresses: Array<string>;
    /**
     * The associated signatures, in the same order as the secondary addresses
     */
    secondary_signers: Array<AccountSignature>;
};
declare type TransactionFeePayerSignature = {
    type: "fee_payer_signature";
    sender: AccountSignature;
    /**
     * The other involved parties' addresses
     */
    secondary_signer_addresses: Array<string>;
    /**
     * The associated signatures, in the same order as the secondary addresses
     */
    secondary_signers: Array<AccountSignature>;
    fee_payer_address: string;
    fee_payer_signer: AccountSignature;
};
/**
 * The union of all single account signatures.
 */
declare type AccountSignature = AccountEd25519Signature | AccountSecp256k1Signature | AccountMultiEd25519Signature;
declare type AccountEd25519Signature = TransactionEd25519Signature;
declare type AccountSecp256k1Signature = TransactionSecp256k1Signature;
declare type AccountMultiEd25519Signature = TransactionMultiEd25519Signature;
declare type WriteSet = ScriptWriteSet | DirectWriteSet;
declare type ScriptWriteSet = {
    type: string;
    execute_as: string;
    script: ScriptPayloadResponse;
};
declare type DirectWriteSet = {
    type: string;
    changes: Array<WriteSetChange>;
    events: Array<Event>;
};
declare type EventGuid = {
    creation_number: string;
    account_address: string;
};
declare type Event = {
    guid: EventGuid;
    sequence_number: string;
    type: string;
    /**
     * The JSON representation of the event
     */
    data: any;
};
/**
 * Map of Move types to local TypeScript types
 */
declare type MoveUint8Type = number;
declare type MoveUint16Type = number;
declare type MoveUint32Type = number;
declare type MoveUint64Type = string;
declare type MoveUint128Type = string;
declare type MoveUint256Type = string;
declare type MoveAddressType = string;
declare type MoveObjectType = string;
declare type MoveOptionType = MoveType | null | undefined;
/**
 * This is the format for a fully qualified struct, resource, or entry function in Move.
 */
declare type MoveStructType = `${string}::${string}::${string}`;
declare type MoveType = boolean | string | MoveUint8Type | MoveUint16Type | MoveUint32Type | MoveUint64Type | MoveUint128Type | MoveUint256Type | MoveAddressType | MoveObjectType | MoveStructType | Array<MoveType>;
/**
 * Possible Move values acceptable by move functions (entry, view)
 *
 * Map of a Move value to the corresponding TypeScript value
 *
 * `Bool -> boolean`
 *
 * `u8, u16, u32 -> number`
 *
 * `u64, u128, u256 -> string`
 *
 * `String -> string`
 *
 * `Address -> 0x${string}`
 *
 * `Struct - 0x${string}::${string}::${string}`
 *
 * `Object -> 0x${string}`
 *
 * `Vector -> Array<MoveValue>`
 *
 * `Option -> MoveValue | null | undefined`
 */
declare type MoveValue = boolean | string | MoveUint8Type | MoveUint16Type | MoveUint32Type | MoveUint64Type | MoveUint128Type | MoveUint256Type | MoveAddressType | MoveObjectType | MoveStructType | MoveOptionType | Array<MoveValue>;
/**
 * Move module id is a string representation of Move module.
 * Module name is case-sensitive.
 */
declare type MoveModuleId = `${string}::${string}`;
/**
 * Move function visibility
 */
declare enum MoveFunctionVisibility {
    PRIVATE = "private",
    PUBLIC = "public",
    FRIEND = "friend"
}
/**
 * Move function ability
 */
declare enum MoveAbility {
    STORE = "store",
    DROP = "drop",
    KEY = "key",
    COPY = "copy"
}
/**
 * Move abilities tied to the generic type param and associated with the function that uses it
 */
declare type MoveFunctionGenericTypeParam = {
    constraints: Array<MoveAbility>;
};
/**
 * Move struct field
 */
declare type MoveStructField = {
    name: string;
    type: string;
};
/**
 * A Move module
 */
declare type MoveModule = {
    address: string;
    name: string;
    /**
     * Friends of the module
     */
    friends: Array<MoveModuleId>;
    /**
     * Public functions of the module
     */
    exposed_functions: Array<MoveFunction>;
    /**
     * Structs of the module
     */
    structs: Array<MoveStruct>;
};
/**
 * A move struct
 */
declare type MoveStruct = {
    name: string;
    /**
     * Whether the struct is a native struct of Move
     */
    is_native: boolean;
    /**
     * Abilities associated with the struct
     */
    abilities: Array<MoveAbility>;
    /**
     * Generic types associated with the struct
     */
    generic_type_params: Array<MoveFunctionGenericTypeParam>;
    /**
     * Fields associated with the struct
     */
    fields: Array<MoveStructField>;
};
/**
 * Move function
 */
declare type MoveFunction = {
    name: string;
    visibility: MoveFunctionVisibility;
    /**
     * Whether the function can be called as an entry function directly in a transaction
     */
    is_entry: boolean;
    /**
     * Whether the function is a view function or not
     */
    is_view: boolean;
    /**
     * Generic type params associated with the Move function
     */
    generic_type_params: Array<MoveFunctionGenericTypeParam>;
    /**
     * Parameters associated with the move function
     */
    params: Array<string>;
    /**
     * Return type of the function
     */
    return: Array<string>;
};
declare enum RoleType {
    VALIDATOR = "validator",
    FULL_NODE = "full_node"
}
declare type LedgerInfo = {
    /**
     * Chain ID of the current chain
     */
    chain_id: number;
    epoch: string;
    ledger_version: string;
    oldest_ledger_version: string;
    ledger_timestamp: string;
    node_role: RoleType;
    oldest_block_height: string;
    block_height: string;
    /**
     * Git hash of the build of the API endpoint.  Can be used to determine the exact
     * software version used by the API endpoint.
     */
    git_hash?: string;
};
/**
 * A Block type
 */
declare type Block = {
    block_height: string;
    block_hash: string;
    block_timestamp: string;
    first_version: string;
    last_version: string;
    /**
     * The transactions in the block in sequential order
     */
    transactions?: Array<TransactionResponse>;
};
/**
 * The data needed to generate a View Request payload
 */
declare type ViewRequestData = {
    function: MoveStructType;
    typeArguments?: Array<MoveStructType>;
    functionArguments?: Array<MoveValue>;
};
/**
 * View request for the Move view function API
 *
 * `type MoveStructType = ${string}::${string}::${string}`;
 */
declare type ViewRequest = {
    function: MoveStructType;
    /**
     * Type arguments of the function
     */
    type_arguments: Array<MoveStructType>;
    /**
     * Arguments of the function
     */
    functionArguments: Array<MoveValue>;
};
/**
 * Table Item request for the GetTableItem API
 */
declare type TableItemRequest = {
    key_type: MoveValue;
    value_type: MoveValue;
    /**
     * The value of the table item's key
     */
    key: any;
};
/**
 * A list of Authentication Key schemes that are supported by Aptos.
 *
 * They are combinations of signing schemes and derive schemes.
 */
declare type AuthenticationKeyScheme = SigningScheme | DeriveScheme;
declare enum SigningScheme {
    /**
     * For Ed25519PublicKey
     */
    Ed25519 = 0,
    /**
     * For MultiEd25519PublicKey
     */
    MultiEd25519 = 1,
    /**
     * For SingleKey ecdsa
     */
    SingleKey = 2,
    MultiKey = 3
}
declare enum SigningSchemeInput {
    /**
     * For Ed25519PublicKey
     */
    Ed25519 = 0,
    /**
     * For Secp256k1Ecdsa
     */
    Secp256k1Ecdsa = 2
}
/**
 * Scheme used for deriving account addresses from other data
 */
declare enum DeriveScheme {
    /**
     * Derives an address using an AUID, used for objects
     */
    DeriveAuid = 251,
    /**
     * Derives an address from another object address
     */
    DeriveObjectAddressFromObject = 252,
    /**
     * Derives an address from a GUID, used for objects
     */
    DeriveObjectAddressFromGuid = 253,
    /**
     * Derives an address from seed bytes, used for named objects
     */
    DeriveObjectAddressFromSeed = 254,
    /**
     * Derives an address from seed bytes, used for resource accounts
     */
    DeriveResourceAccountAddress = 255
}
/**
 * Option properties to pass for waitForTransaction() function
 */
declare type WaitForTransactionOptions = {
    timeoutSecs?: number;
    checkSuccess?: boolean;
    indexerVersionCheck?: boolean;
};
/**
 * Account input type to generate an account using Legacy
 * Ed25519 or MultiEd25519 keys or without a specified `scheme`.
 * If `scheme` is not specified, we default to ED25519
 * In this case `legacy` is always true
 */
declare type GenerateAccountWithLegacyKey = {
    scheme?: SigningSchemeInput.Ed25519;
    legacy: true;
};
/**
 * Account input type to generate an account using Unified
 * Secp256k1Ecdsa key
 * In this case `legacy` is always false
 */
declare type GenerateAccountWithUnifiedKey = {
    scheme: SigningSchemeInput.Secp256k1Ecdsa | SigningSchemeInput.Ed25519;
    legacy?: false;
};
/**
 * Unify GenerateAccount type for Legacy and Unified keys
 */
declare type GenerateAccount = GenerateAccountWithLegacyKey | GenerateAccountWithUnifiedKey;

export { AccountAuthenticatorVariant, AccountData, AccountEd25519Signature, AccountMultiEd25519Signature, AccountSecp256k1Signature, AccountSignature, AnyNumber, AnyPublicKeyVariant, AnySignatureVariant, AptosRequest, AptosSettings, AuthenticationKeyScheme, Block, BlockMetadataTransactionResponse, Client, ClientConfig, ClientRequest, ClientResponse, DecodedTableData, DeletedTableData, DeriveScheme, DirectWriteSet, EntryFunctionPayloadResponse, Event, EventGuid, GasEstimation, GenerateAccount, GenerateAccountWithLegacyKey, GenerateAccountWithUnifiedKey, GenesisPayload, GenesisTransactionResponse, GetAccountCoinsDataResponse, GetAccountCollectionsWithOwnedTokenResponse, GetAccountOwnedObjectsResponse, GetAccountOwnedTokensFromCollectionResponse, GetAccountOwnedTokensQueryResponse, GetChainTopUserTransactionsResponse, GetCollectionDataResponse, GetCurrentFungibleAssetBalancesResponse, GetCurrentTokenOwnershipResponse, GetDelegatedStakingActivitiesResponse, GetEventsResponse, GetFungibleAssetActivitiesResponse, GetFungibleAssetMetadataResponse, GetNumberOfDelegatorsResponse, GetOwnedTokensResponse, GetProcessorStatusResponse, GetTokenActivityResponse, GetTokenDataResponse, GraphqlQuery, HexInput, LedgerInfo, LedgerVersion, MimeType, MoveAbility, MoveAddressType, MoveFunction, MoveFunctionGenericTypeParam, MoveFunctionVisibility, MoveModule, MoveModuleBytecode, MoveModuleId, MoveObjectType, MoveOptionType, MoveResource, MoveScriptBytecode, MoveStruct, MoveStructField, MoveStructType, MoveType, MoveUint128Type, MoveUint16Type, MoveUint256Type, MoveUint32Type, MoveUint64Type, MoveUint8Type, MoveValue, MultisigPayloadResponse, OrderBy, OrderByValue, PaginationArgs, PendingTransactionResponse, RoleType, ScriptPayloadResponse, ScriptTransactionArgumentVariants, ScriptWriteSet, SigningScheme, SigningSchemeInput, StateCheckpointTransactionResponse, TableItemRequest, TokenStandard, TransactionAuthenticatorVariant, TransactionEd25519Signature, TransactionFeePayerSignature, TransactionMultiAgentSignature, TransactionMultiEd25519Signature, TransactionPayloadResponse, TransactionPayloadVariants, TransactionResponse, TransactionResponseType, TransactionSecp256k1Signature, TransactionSignature, TransactionVariants, TypeTagVariants, Uint128, Uint16, Uint256, Uint32, Uint64, Uint8, UserTransactionResponse, ViewRequest, ViewRequestData, WaitForTransactionOptions, WriteSet, WriteSetChange, WriteSetChangeDeleteModule, WriteSetChangeDeleteResource, WriteSetChangeDeleteTableItem, WriteSetChangeWriteModule, WriteSetChangeWriteResource, WriteSetChangeWriteTableItem };
