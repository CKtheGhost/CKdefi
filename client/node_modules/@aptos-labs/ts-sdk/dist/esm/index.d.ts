declare const NetworkToIndexerAPI: Record<string, string>;
declare const NetworkToNodeAPI: Record<string, string>;
declare const NetworkToFaucetAPI: Record<string, string>;
declare enum Network {
    MAINNET = "mainnet",
    TESTNET = "testnet",
    DEVNET = "devnet",
    LOCAL = "local",
    CUSTOM = "custom"
}
declare const NetworkToChainId: Record<string, number>;

declare type Maybe<T> = T | null;
declare type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
declare type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    bigint: any;
    jsonb: any;
    numeric: any;
    timestamp: any;
    timestamptz: any;
};
/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
declare type BooleanComparisonExp = {
    _eq?: InputMaybe<Scalars["Boolean"]>;
    _gt?: InputMaybe<Scalars["Boolean"]>;
    _gte?: InputMaybe<Scalars["Boolean"]>;
    _in?: InputMaybe<Array<Scalars["Boolean"]>>;
    _is_null?: InputMaybe<Scalars["Boolean"]>;
    _lt?: InputMaybe<Scalars["Boolean"]>;
    _lte?: InputMaybe<Scalars["Boolean"]>;
    _neq?: InputMaybe<Scalars["Boolean"]>;
    _nin?: InputMaybe<Array<Scalars["Boolean"]>>;
};
/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
declare type IntComparisonExp = {
    _eq?: InputMaybe<Scalars["Int"]>;
    _gt?: InputMaybe<Scalars["Int"]>;
    _gte?: InputMaybe<Scalars["Int"]>;
    _in?: InputMaybe<Array<Scalars["Int"]>>;
    _is_null?: InputMaybe<Scalars["Boolean"]>;
    _lt?: InputMaybe<Scalars["Int"]>;
    _lte?: InputMaybe<Scalars["Int"]>;
    _neq?: InputMaybe<Scalars["Int"]>;
    _nin?: InputMaybe<Array<Scalars["Int"]>>;
};
/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
declare type StringComparisonExp = {
    _eq?: InputMaybe<Scalars["String"]>;
    _gt?: InputMaybe<Scalars["String"]>;
    _gte?: InputMaybe<Scalars["String"]>;
    /** does the column match the given case-insensitive pattern */
    _ilike?: InputMaybe<Scalars["String"]>;
    _in?: InputMaybe<Array<Scalars["String"]>>;
    /** does the column match the given POSIX regular expression, case insensitive */
    _iregex?: InputMaybe<Scalars["String"]>;
    _is_null?: InputMaybe<Scalars["Boolean"]>;
    /** does the column match the given pattern */
    _like?: InputMaybe<Scalars["String"]>;
    _lt?: InputMaybe<Scalars["String"]>;
    _lte?: InputMaybe<Scalars["String"]>;
    _neq?: InputMaybe<Scalars["String"]>;
    /** does the column NOT match the given case-insensitive pattern */
    _nilike?: InputMaybe<Scalars["String"]>;
    _nin?: InputMaybe<Array<Scalars["String"]>>;
    /** does the column NOT match the given POSIX regular expression, case insensitive */
    _niregex?: InputMaybe<Scalars["String"]>;
    /** does the column NOT match the given pattern */
    _nlike?: InputMaybe<Scalars["String"]>;
    /** does the column NOT match the given POSIX regular expression, case sensitive */
    _nregex?: InputMaybe<Scalars["String"]>;
    /** does the column NOT match the given SQL regular expression */
    _nsimilar?: InputMaybe<Scalars["String"]>;
    /** does the column match the given POSIX regular expression, case sensitive */
    _regex?: InputMaybe<Scalars["String"]>;
    /** does the column match the given SQL regular expression */
    _similar?: InputMaybe<Scalars["String"]>;
};
/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
declare type BigintComparisonExp = {
    _eq?: InputMaybe<Scalars["bigint"]>;
    _gt?: InputMaybe<Scalars["bigint"]>;
    _gte?: InputMaybe<Scalars["bigint"]>;
    _in?: InputMaybe<Array<Scalars["bigint"]>>;
    _is_null?: InputMaybe<Scalars["Boolean"]>;
    _lt?: InputMaybe<Scalars["bigint"]>;
    _lte?: InputMaybe<Scalars["bigint"]>;
    _neq?: InputMaybe<Scalars["bigint"]>;
    _nin?: InputMaybe<Array<Scalars["bigint"]>>;
};
/** Boolean expression to filter rows from the table "current_aptos_names". All fields are combined with a logical 'AND'. */
declare type CurrentAptosNamesBoolExp = {
    _and?: InputMaybe<Array<CurrentAptosNamesBoolExp>>;
    _not?: InputMaybe<CurrentAptosNamesBoolExp>;
    _or?: InputMaybe<Array<CurrentAptosNamesBoolExp>>;
    domain?: InputMaybe<StringComparisonExp>;
    domain_with_suffix?: InputMaybe<StringComparisonExp>;
    expiration_timestamp?: InputMaybe<TimestampComparisonExp>;
    is_active?: InputMaybe<BooleanComparisonExp>;
    is_domain_owner?: InputMaybe<CurrentAptosNamesBoolExp>;
    is_primary?: InputMaybe<BooleanComparisonExp>;
    last_transaction_version?: InputMaybe<BigintComparisonExp>;
    owner_address?: InputMaybe<StringComparisonExp>;
    registered_address?: InputMaybe<StringComparisonExp>;
    subdomain?: InputMaybe<StringComparisonExp>;
    token_name?: InputMaybe<StringComparisonExp>;
    token_standard?: InputMaybe<StringComparisonExp>;
};
/** Boolean expression to filter rows from the table "current_fungible_asset_balances". All fields are combined with a logical 'AND'. */
declare type CurrentFungibleAssetBalancesBoolExp = {
    _and?: InputMaybe<Array<CurrentFungibleAssetBalancesBoolExp>>;
    _not?: InputMaybe<CurrentFungibleAssetBalancesBoolExp>;
    _or?: InputMaybe<Array<CurrentFungibleAssetBalancesBoolExp>>;
    amount?: InputMaybe<NumericComparisonExp>;
    asset_type?: InputMaybe<StringComparisonExp>;
    is_frozen?: InputMaybe<BooleanComparisonExp>;
    is_primary?: InputMaybe<BooleanComparisonExp>;
    last_transaction_timestamp?: InputMaybe<TimestampComparisonExp>;
    last_transaction_version?: InputMaybe<BigintComparisonExp>;
    metadata?: InputMaybe<FungibleAssetMetadataBoolExp>;
    owner_address?: InputMaybe<StringComparisonExp>;
    storage_id?: InputMaybe<StringComparisonExp>;
    token_standard?: InputMaybe<StringComparisonExp>;
};
/** Boolean expression to filter rows from the table "events". All fields are combined with a logical 'AND'. */
declare type EventsBoolExp = {
    _and?: InputMaybe<Array<EventsBoolExp>>;
    _not?: InputMaybe<EventsBoolExp>;
    _or?: InputMaybe<Array<EventsBoolExp>>;
    account_address?: InputMaybe<StringComparisonExp>;
    creation_number?: InputMaybe<BigintComparisonExp>;
    data?: InputMaybe<JsonbComparisonExp>;
    event_index?: InputMaybe<BigintComparisonExp>;
    sequence_number?: InputMaybe<BigintComparisonExp>;
    transaction_block_height?: InputMaybe<BigintComparisonExp>;
    transaction_version?: InputMaybe<BigintComparisonExp>;
    type?: InputMaybe<StringComparisonExp>;
};
/** Boolean expression to filter rows from the table "fungible_asset_activities". All fields are combined with a logical 'AND'. */
declare type FungibleAssetActivitiesBoolExp = {
    _and?: InputMaybe<Array<FungibleAssetActivitiesBoolExp>>;
    _not?: InputMaybe<FungibleAssetActivitiesBoolExp>;
    _or?: InputMaybe<Array<FungibleAssetActivitiesBoolExp>>;
    amount?: InputMaybe<NumericComparisonExp>;
    asset_type?: InputMaybe<StringComparisonExp>;
    block_height?: InputMaybe<BigintComparisonExp>;
    entry_function_id_str?: InputMaybe<StringComparisonExp>;
    event_index?: InputMaybe<BigintComparisonExp>;
    gas_fee_payer_address?: InputMaybe<StringComparisonExp>;
    is_frozen?: InputMaybe<BooleanComparisonExp>;
    is_gas_fee?: InputMaybe<BooleanComparisonExp>;
    is_transaction_success?: InputMaybe<BooleanComparisonExp>;
    metadata?: InputMaybe<FungibleAssetMetadataBoolExp>;
    owner_address?: InputMaybe<StringComparisonExp>;
    owner_aptos_names?: InputMaybe<CurrentAptosNamesBoolExp>;
    storage_id?: InputMaybe<StringComparisonExp>;
    storage_refund_amount?: InputMaybe<NumericComparisonExp>;
    token_standard?: InputMaybe<StringComparisonExp>;
    transaction_timestamp?: InputMaybe<TimestampComparisonExp>;
    transaction_version?: InputMaybe<BigintComparisonExp>;
    type?: InputMaybe<StringComparisonExp>;
};
/** Boolean expression to filter rows from the table "fungible_asset_metadata". All fields are combined with a logical 'AND'. */
declare type FungibleAssetMetadataBoolExp = {
    _and?: InputMaybe<Array<FungibleAssetMetadataBoolExp>>;
    _not?: InputMaybe<FungibleAssetMetadataBoolExp>;
    _or?: InputMaybe<Array<FungibleAssetMetadataBoolExp>>;
    asset_type?: InputMaybe<StringComparisonExp>;
    creator_address?: InputMaybe<StringComparisonExp>;
    decimals?: InputMaybe<IntComparisonExp>;
    icon_uri?: InputMaybe<StringComparisonExp>;
    last_transaction_timestamp?: InputMaybe<TimestampComparisonExp>;
    last_transaction_version?: InputMaybe<BigintComparisonExp>;
    name?: InputMaybe<StringComparisonExp>;
    project_uri?: InputMaybe<StringComparisonExp>;
    supply_aggregator_table_handle_v1?: InputMaybe<StringComparisonExp>;
    supply_aggregator_table_key_v1?: InputMaybe<StringComparisonExp>;
    symbol?: InputMaybe<StringComparisonExp>;
    token_standard?: InputMaybe<StringComparisonExp>;
};
declare type JsonbCastExp = {
    String?: InputMaybe<StringComparisonExp>;
};
/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
declare type JsonbComparisonExp = {
    _cast?: InputMaybe<JsonbCastExp>;
    /** is the column contained in the given json value */
    _contained_in?: InputMaybe<Scalars["jsonb"]>;
    /** does the column contain the given json value at the top level */
    _contains?: InputMaybe<Scalars["jsonb"]>;
    _eq?: InputMaybe<Scalars["jsonb"]>;
    _gt?: InputMaybe<Scalars["jsonb"]>;
    _gte?: InputMaybe<Scalars["jsonb"]>;
    /** does the string exist as a top-level key in the column */
    _has_key?: InputMaybe<Scalars["String"]>;
    /** do all of these strings exist as top-level keys in the column */
    _has_keys_all?: InputMaybe<Array<Scalars["String"]>>;
    /** do any of these strings exist as top-level keys in the column */
    _has_keys_any?: InputMaybe<Array<Scalars["String"]>>;
    _in?: InputMaybe<Array<Scalars["jsonb"]>>;
    _is_null?: InputMaybe<Scalars["Boolean"]>;
    _lt?: InputMaybe<Scalars["jsonb"]>;
    _lte?: InputMaybe<Scalars["jsonb"]>;
    _neq?: InputMaybe<Scalars["jsonb"]>;
    _nin?: InputMaybe<Array<Scalars["jsonb"]>>;
};
/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
declare type NumericComparisonExp = {
    _eq?: InputMaybe<Scalars["numeric"]>;
    _gt?: InputMaybe<Scalars["numeric"]>;
    _gte?: InputMaybe<Scalars["numeric"]>;
    _in?: InputMaybe<Array<Scalars["numeric"]>>;
    _is_null?: InputMaybe<Scalars["Boolean"]>;
    _lt?: InputMaybe<Scalars["numeric"]>;
    _lte?: InputMaybe<Scalars["numeric"]>;
    _neq?: InputMaybe<Scalars["numeric"]>;
    _nin?: InputMaybe<Array<Scalars["numeric"]>>;
};
/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
declare type TimestampComparisonExp = {
    _eq?: InputMaybe<Scalars["timestamp"]>;
    _gt?: InputMaybe<Scalars["timestamp"]>;
    _gte?: InputMaybe<Scalars["timestamp"]>;
    _in?: InputMaybe<Array<Scalars["timestamp"]>>;
    _is_null?: InputMaybe<Scalars["Boolean"]>;
    _lt?: InputMaybe<Scalars["timestamp"]>;
    _lte?: InputMaybe<Scalars["timestamp"]>;
    _neq?: InputMaybe<Scalars["timestamp"]>;
    _nin?: InputMaybe<Array<Scalars["timestamp"]>>;
};

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
    events: Array<Event$1>;
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
    events: Array<Event$1>;
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
    events: Array<Event$1>;
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
    events: Array<Event$1>;
};
declare type EventGuid = {
    creation_number: string;
    account_address: string;
};
declare type Event$1 = {
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

/**
 * Type of API endpoint for request routing
 */
declare enum AptosApiType {
    FULLNODE = 0,
    INDEXER = 1,
    FAUCET = 2
}

/**
 * This class holds the config information for the SDK client instance.
 */
declare class AptosConfig {
    /** The Network that this SDK is associated with. */
    readonly network: Network;
    /**
     * The client instance the SDK uses
     */
    readonly client: Client;
    /**
     * The optional hardcoded fullnode URL to send requests to instead of using the network
     */
    readonly fullnode?: string;
    /**
     * The optional hardcoded faucet URL to send requests to instead of using the network
     */
    readonly faucet?: string;
    /**
     * The optional hardcoded indexer URL to send requests to instead of using the network
     */
    readonly indexer?: string;
    readonly clientConfig?: ClientConfig;
    constructor(settings?: AptosSettings);
    /**
     * Returns the URL endpoint to send the request to.
     * If a custom URL was provided in the config, that URL is returned.
     * If a custom URL was provided but not URL endpoints, an error is thrown.
     * Otherwise, the URL endpoint is derived from the network.
     *
     * @param apiType - The type of Aptos API to get the URL for.
     *
     * @internal
     */
    getRequestUrl(apiType: AptosApiType): string;
    /**
     * Checks if the URL is a known indexer endpoint
     *
     * @internal
     * */
    isIndexerRequest(url: string): boolean;
}

/**
 * This error is used to explain why parsing failed.
 */
declare class ParsingError<T> extends Error {
    /**
     * This provides a programmatic way to access why parsing failed. Downstream devs
     * might want to use this to build their own error messages if the default error
     * messages are not suitable for their use case. This should be an enum.
     */
    invalidReason: T;
    constructor(message: string, invalidReason: T);
}
/**
 * Whereas ParsingError is thrown when parsing fails, e.g. in a fromString function,
 * this type is returned from "defensive" functions like isValid.
 */
declare type ParsingResult<T> = {
    /**
     * True if valid, false otherwise.
     */
    valid: boolean;
    /**
     * If valid is false, this will be a code explaining why parsing failed.
     */
    invalidReason?: T;
    /**
     * If valid is false, this will be a string explaining why parsing failed.
     */
    invalidReasonMessage?: string;
};

/**
 * This enum is used to explain why parsing might have failed.
 */
declare enum HexInvalidReason {
    TOO_SHORT = "too_short",
    INVALID_LENGTH = "invalid_length",
    INVALID_HEX_CHARS = "invalid_hex_chars"
}
/**
 * NOTE: Do not use this class when working with account addresses, use AccountAddress.
 *
 * NOTE: When accepting hex data as input to a function, prefer to accept HexInput and
 * then use the static helper methods of this class to convert it into the desired
 * format. This enables the greatest flexibility for the developer.
 *
 * Hex is a helper class for working with hex data. Hex data, when represented as a
 * string, generally looks like this, for example: 0xaabbcc, 45cd32, etc.
 *
 * You might use this class like this:
 *
 * ```ts
 * getTransactionByHash(txnHash: HexInput): Promise<Transaction> {
 *   const txnHashString = Hex.fromHexInput(txnHash).toString();
 *   return await getTransactionByHashInner(txnHashString);
 * }
 * ```
 *
 * This call to `Hex.fromHexInput().toString()` converts the HexInput to a hex string
 * with a leading 0x prefix, regardless of what the input format was.
 *
 * These are some other ways to chain the functions together:
 * - `Hex.fromString({ hexInput: "0x1f" }).toUint8Array()`
 * - `new Hex([1, 3]).toStringWithoutPrefix()`
 */
declare class Hex {
    private readonly data;
    /**
     * Create a new Hex instance from a Uint8Array.
     *
     * @param data Uint8Array
     */
    constructor(data: Uint8Array);
    /**
     * Get the inner hex data. The inner data is already a Uint8Array so no conversion
     * is taking place here, it just returns the inner data.
     *
     * @returns Hex data as Uint8Array
     */
    toUint8Array(): Uint8Array;
    /**
     * Get the hex data as a string without the 0x prefix.
     *
     * @returns Hex string without 0x prefix
     */
    toStringWithoutPrefix(): string;
    /**
     * Get the hex data as a string with the 0x prefix.
     *
     * @returns Hex string with 0x prefix
     */
    toString(): string;
    /**
     * Static method to convert a hex string to Hex
     *
     * @param str A hex string, with or without the 0x prefix
     *
     * @returns Hex
     */
    static fromString(str: string): Hex;
    /**
     * Static method to convert an instance of HexInput to Hex
     *
     * @param hexInput A HexInput (string or Uint8Array)
     *
     * @returns Hex
     */
    static fromHexInput(hexInput: HexInput): Hex;
    /**
     * Check if the string is valid hex.
     *
     * @param str A hex string representing byte data.
     *
     * @returns valid = true if the string is valid, false if not. If the string is not
     * valid, invalidReason and invalidReasonMessage will be set explaining why it is
     * invalid.
     */
    static isValid(str: string): ParsingResult<HexInvalidReason>;
    /**
     * Return whether Hex instances are equal. Hex instances are considered equal if
     * their underlying byte data is identical.
     *
     * @param other The Hex instance to compare to.
     * @returns true if the Hex instances are equal, false if not.
     */
    equals(other: Hex): boolean;
}

declare abstract class Serializable {
    abstract serialize(serializer: Serializer): void;
    /**
     * Serializes a `Serializable` value to its BCS representation.
     * This function is the Typescript SDK equivalent of `bcs::to_bytes` in Move.
     * @returns the BCS representation of the Serializable instance as a byte buffer
     */
    bcsToBytes(): Uint8Array;
    /**
     * Helper function to get a value's BCS-serialized bytes as a Hex instance.
     * @returns a Hex instance with the BCS-serialized bytes loaded into its underlying Uint8Array
     */
    bcsToHex(): Hex;
}
declare class Serializer {
    private buffer;
    private offset;
    constructor(length?: number);
    private ensureBufferWillHandleSize;
    protected appendToBuffer(values: Uint8Array): void;
    private serializeWithFunction;
    /**
     * Serializes a string. UTF8 string is supported.
     *
     * The number of bytes in the string content is serialized first, as a uleb128-encoded u32 integer.
     * Then the string content is serialized as UTF8 encoded bytes.
     *
     * BCS layout for "string": string_length | string_content
     * where string_length is a u32 integer encoded as a uleb128 integer, equal to the number of bytes in string_content.
     *
     * @example
     * ```ts
     * const serializer = new Serializer();
     * serializer.serializeStr("1234abcd");
     * assert(serializer.toUint8Array() === new Uint8Array([8, 49, 50, 51, 52, 97, 98, 99, 100]));
     * ```
     */
    serializeStr(value: string): void;
    /**
     * Serializes an array of bytes.
     *
     * BCS layout for "bytes": bytes_length | bytes
     * where bytes_length is a u32 integer encoded as a uleb128 integer, equal to the length of the bytes array.
     */
    serializeBytes(value: Uint8Array): void;
    /**
     * Serializes an array of bytes with known length. Therefore, length doesn't need to be
     * serialized to help deserialization.
     *
     * When deserializing, the number of bytes to deserialize needs to be passed in.
     */
    serializeFixedBytes(value: Uint8Array): void;
    /**
     * Serializes a boolean value.
     *
     * BCS layout for "boolean": One byte. "0x01" for true and "0x00" for false.
     */
    serializeBool(value: boolean): void;
    /**
     * Serializes a uint8 number.
     *
     * BCS layout for "uint8": One byte. Binary format in little-endian representation.
     */
    serializeU8(value: Uint8): void;
    /**
     * Serializes a uint16 number.
     *
     * BCS layout for "uint16": Two bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const serializer = new Serializer();
     * serializer.serializeU16(4660);
     * assert(serializer.toUint8Array() === new Uint8Array([0x34, 0x12]));
     * ```
     */
    serializeU16(value: Uint16): void;
    /**
     * Serializes a uint32 number.
     *
     * BCS layout for "uint32": Four bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const serializer = new Serializer();
     * serializer.serializeU32(305419896);
     * assert(serializer.toUint8Array() === new Uint8Array([0x78, 0x56, 0x34, 0x12]));
     * ```
     */
    serializeU32(value: Uint32): void;
    /**
     * Serializes a uint64 number.
     *
     * BCS layout for "uint64": Eight bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const serializer = new Serializer();
     * serializer.serializeU64(1311768467750121216);
     * assert(serializer.toUint8Array() === new Uint8Array([0x00, 0xEF, 0xCD, 0xAB, 0x78, 0x56, 0x34, 0x12]));
     * ```
     */
    serializeU64(value: AnyNumber): void;
    /**
     * Serializes a uint128 number.
     *
     * BCS layout for "uint128": Sixteen bytes. Binary format in little-endian representation.
     */
    serializeU128(value: AnyNumber): void;
    /**
     * Serializes a uint256 number.
     *
     * BCS layout for "uint256": Sixteen bytes. Binary format in little-endian representation.
     */
    serializeU256(value: AnyNumber): void;
    /**
     * Serializes a uint32 number with uleb128.
     *
     * BCS uses uleb128 encoding in two cases: (1) lengths of variable-length sequences and (2) tags of enum values
     */
    serializeU32AsUleb128(val: Uint32): void;
    /**
     * Returns the buffered bytes
     */
    toUint8Array(): Uint8Array;
    /**
     * Serializes a `Serializable` value, facilitating composable serialization.
     *
     * @param value The Serializable value to serialize
     *
     * @example
     * // Define the MoveStruct class that implements the Serializable interface
     * class MoveStruct extends Serializable {
     *     constructor(
     *         public creatorAddress: AccountAddress, // where AccountAddress extends Serializable
     *         public collectionName: string,
     *         public tokenName: string
     *     ) {}
     *
     *     serialize(serializer: Serializer): void {
     *         serializer.serialize(this.creatorAddress);  // Composable serialization of another Serializable object
     *         serializer.serializeStr(this.collectionName);
     *         serializer.serializeStr(this.tokenName);
     *     }
     * }
     *
     * // Construct a MoveStruct
     * const moveStruct = new MoveStruct(new AccountAddress(...), "MyCollection", "TokenA");
     *
     * // Serialize a string, a u64 number, and a MoveStruct instance.
     * const serializer = new Serializer();
     * serializer.serializeStr("ExampleString");
     * serializer.serializeU64(12345678);
     * serializer.serialize(moveStruct);
     *
     * // Get the bytes from the Serializer instance
     * const serializedBytes = serializer.toUint8Array();
     *
     * @returns the serializer instance
     */
    serialize<T extends Serializable>(value: T): void;
    /**
     * Serializes an array of BCS Serializable values to a serializer instance.
     * Note that this does not return anything. The bytes are added to the serializer instance's byte buffer.
     *
     * @param values The array of BCS Serializable values
     * @example
     * const addresses = new Array<AccountAddress>(
     *   AccountAddress.fromHexInputRelaxed("0x1"),
     *   AccountAddress.fromHexInputRelaxed("0x2"),
     *   AccountAddress.fromHexInputRelaxed("0xa"),
     *   AccountAddress.fromHexInputRelaxed("0xb"),
     * );
     * const serializer = new Serializer();
     * serializer.serializeVector(addresses);
     * const serializedBytes = serializer.toUint8Array();
     * // serializedBytes is now the BCS-serialized bytes
     * // The equivalent value in Move would be:
     * // `bcs::to_bytes(&vector<address> [@0x1, @0x2, @0xa, @0xb])`;
     */
    serializeVector<T extends Serializable>(values: Array<T>): void;
}
declare function ensureBoolean(value: unknown): asserts value is boolean;
declare const outOfRangeErrorMessage: (value: AnyNumber, min: AnyNumber, max: AnyNumber) => string;
declare function validateNumberInRange<T extends AnyNumber>(value: T, minValue: T, maxValue: T): void;

/**
 * This interface exists to define Deserializable<T> inputs for functions that
 * deserialize a byte buffer into a type T.
 * It is not intended to be implemented or extended, because Typescript has no support
 * for static methods in interfaces.
 */
interface Deserializable<T> {
    deserialize(deserializer: Deserializer): T;
}
declare class Deserializer {
    private buffer;
    private offset;
    constructor(data: Uint8Array);
    private read;
    /**
     * Deserializes a string. UTF8 string is supported. Reads the string's bytes length "l" first,
     * and then reads "l" bytes of content. Decodes the byte array into a string.
     *
     * BCS layout for "string": string_length | string_content
     * where string_length is a u32 integer encoded as a uleb128 integer, equal to the number of bytes in string_content.
     *
     * @example
     * ```ts
     * const deserializer = new Deserializer(new Uint8Array([8, 49, 50, 51, 52, 97, 98, 99, 100]));
     * assert(deserializer.deserializeStr() === "1234abcd");
     * ```
     */
    deserializeStr(): string;
    /**
     * Deserializes an array of bytes.
     *
     * BCS layout for "bytes": bytes_length | bytes
     * where bytes_length is a u32 integer encoded as a uleb128 integer, equal to the length of the bytes array.
     */
    deserializeBytes(): Uint8Array;
    /**
     * Deserializes an array of bytes. The number of bytes to read is already known.
     *
     */
    deserializeFixedBytes(len: number): Uint8Array;
    /**
     * Deserializes a boolean value.
     *
     * BCS layout for "boolean": One byte. "0x01" for true and "0x00" for false.
     */
    deserializeBool(): boolean;
    /**
     * Deserializes a uint8 number.
     *
     * BCS layout for "uint8": One byte. Binary format in little-endian representation.
     */
    deserializeU8(): Uint8;
    /**
     * Deserializes a uint16 number.
     *
     * BCS layout for "uint16": Two bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const deserializer = new Deserializer(new Uint8Array([0x34, 0x12]));
     * assert(deserializer.deserializeU16() === 4660);
     * ```
     */
    deserializeU16(): Uint16;
    /**
     * Deserializes a uint32 number.
     *
     * BCS layout for "uint32": Four bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const deserializer = new Deserializer(new Uint8Array([0x78, 0x56, 0x34, 0x12]));
     * assert(deserializer.deserializeU32() === 305419896);
     * ```
     */
    deserializeU32(): Uint32;
    /**
     * Deserializes a uint64 number.
     *
     * BCS layout for "uint64": Eight bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const deserializer = new Deserializer(new Uint8Array([0x00, 0xEF, 0xCD, 0xAB, 0x78, 0x56, 0x34, 0x12]));
     * assert(deserializer.deserializeU64() === 1311768467750121216);
     * ```
     */
    deserializeU64(): Uint64;
    /**
     * Deserializes a uint128 number.
     *
     * BCS layout for "uint128": Sixteen bytes. Binary format in little-endian representation.
     */
    deserializeU128(): Uint128;
    /**
     * Deserializes a uint256 number.
     *
     * BCS layout for "uint256": Thirty-two bytes. Binary format in little-endian representation.
     */
    deserializeU256(): Uint256;
    /**
     * Deserializes a uleb128 encoded uint32 number.
     *
     * BCS use uleb128 encoding in two cases: (1) lengths of variable-length sequences and (2) tags of enum values
     */
    deserializeUleb128AsU32(): Uint32;
    /**
     * Helper function that primarily exists to support alternative syntax for deserialization.
     * That is, if we have a `const deserializer: new Deserializer(...)`, instead of having to use
     * `MyClass.deserialize(deserializer)`, we can call `deserializer.deserialize(MyClass)`.
     *
     * @example const deserializer = new Deserializer(new Uint8Array([1, 2, 3]));
     * const value = deserializer.deserialize(MyClass); // where MyClass has a `deserialize` function
     * // value is now an instance of MyClass
     * // equivalent to `const value = MyClass.deserialize(deserializer)`
     * @param cls The BCS-deserializable class to deserialize the buffered bytes into.
     *
     * @returns the deserialized value of class type T
     */
    deserialize<T>(cls: Deserializable<T>): T;
    /**
     * Deserializes an array of BCS Deserializable values given an existing Deserializer
     * instance with a loaded byte buffer.
     *
     * @param cls The BCS-deserializable class to deserialize the buffered bytes into.
     * @example
     * // serialize a vector of addresses
     * const addresses = new Array<AccountAddress>(
     *   AccountAddress.fromHexInputRelaxed("0x1"),
     *   AccountAddress.fromHexInputRelaxed("0x2"),
     *   AccountAddress.fromHexInputRelaxed("0xa"),
     *   AccountAddress.fromHexInputRelaxed("0xb"),
     * );
     * const serializer = new Serializer();
     * serializer.serializeVector(addresses);
     * const serializedBytes = serializer.toUint8Array();
     *
     * // deserialize the bytes into an array of addresses
     * const deserializer = new Deserializer(serializedBytes);
     * const deserializedAddresses = deserializer.deserializeVector(AccountAddress);
     * // deserializedAddresses is now an array of AccountAddress instances
     * @returns an array of deserialized values of type T
     */
    deserializeVector<T>(cls: Deserializable<T>): Array<T>;
}

interface TransactionArgument extends EntryFunctionArgument, ScriptFunctionArgument {
}
interface EntryFunctionArgument {
    /**
     * Serialize an argument to BCS-serialized bytes.
     */
    serialize(serializer: Serializer): void;
    /**
     * Serialize an argument as a type-agnostic, fixed byte sequence. The byte sequence contains
     * the number of the following bytes followed by the BCS-serialized bytes for a typed argument.
     */
    serializeForEntryFunction(serializer: Serializer): void;
    bcsToBytes(): Uint8Array;
    bcsToHex(): Hex;
}
interface ScriptFunctionArgument {
    /**
     * Serialize an argument to BCS-serialized bytes.
     */
    serialize(serializer: Serializer): void;
    /**
     * Serialize an argument to BCS-serialized bytes as a type aware byte sequence.
     * The byte sequence contains an enum variant index followed by the BCS-serialized
     * bytes for a typed argument.
     */
    serializeForScriptFunction(serializer: Serializer): void;
    bcsToBytes(): Uint8Array;
    bcsToHex(): Hex;
}

/**
 * This enum is used to explain why an address was invalid.
 */
declare enum AddressInvalidReason {
    INCORRECT_NUMBER_OF_BYTES = "incorrect_number_of_bytes",
    INVALID_HEX_CHARS = "invalid_hex_chars",
    TOO_SHORT = "too_short",
    TOO_LONG = "too_long",
    LEADING_ZERO_X_REQUIRED = "leading_zero_x_required",
    LONG_FORM_REQUIRED_UNLESS_SPECIAL = "long_form_required_unless_special",
    INVALID_PADDING_ZEROES = "INVALID_PADDING_ZEROES"
}
/**
 * NOTE: Only use this class for account addresses. For other hex data, e.g. transaction
 * hashes, use the Hex class.
 *
 * AccountAddress is used for working with account addresses. Account addresses, when
 * represented as a string, generally look like these examples:
 * - 0x1
 * - 0xaa86fe99004361f747f91342ca13c426ca0cccb0c1217677180c9493bad6ef0c
 *
 * Proper formatting and parsing of account addresses is defined by AIP-40.
 * To learn more about the standard, read the AIP here:
 * https://github.com/aptos-foundation/AIPs/blob/main/aips/aip-40.md.
 *
 * The comments in this class make frequent reference to the LONG and SHORT formats,
 * as well as "special" addresses. To learn what these refer to see AIP-40.
 */
declare class AccountAddress extends Serializable implements TransactionArgument {
    /**
     * This is the internal representation of an account address.
     */
    readonly data: Uint8Array;
    /**
     * The number of bytes that make up an account address.
     */
    static readonly LENGTH: number;
    /**
     * The length of an address string in LONG form without a leading 0x.
     */
    static readonly LONG_STRING_LENGTH: number;
    static ZERO: AccountAddress;
    static ONE: AccountAddress;
    static TWO: AccountAddress;
    static THREE: AccountAddress;
    static FOUR: AccountAddress;
    /**
     * Creates an instance of AccountAddress from a Uint8Array.
     *
     * @param args.data A Uint8Array representing an account address.
     */
    constructor(args: {
        data: Uint8Array;
    });
    /**
     * Returns whether an address is special, where special is defined as 0x0 to 0xf
     * inclusive. In other words, the last byte of the address must be < 0b10000 (16)
     * and every other byte must be zero.
     *
     * For more information on how special addresses are defined see AIP-40:
     * https://github.com/aptos-foundation/AIPs/blob/main/aips/aip-40.md.
     *
     * @returns true if the address is special, false if not.
     */
    isSpecial(): boolean;
    /**
     * Return the AccountAddress as a string as per AIP-40.
     * https://github.com/aptos-foundation/AIPs/blob/main/aips/aip-40.md.
     *
     * In short, it means that special addresses are represented in SHORT form, meaning
     * 0x0 through to 0xf inclusive, and every other address is represented in LONG form,
     * meaning 0x + 64 hex characters.
     *
     * @returns AccountAddress as a string conforming to AIP-40.
     */
    toString(): `0x${string}`;
    /**
     * NOTE: Prefer to use `toString` where possible.
     *
     * Return the AccountAddress as a string as per AIP-40 but without the leading 0x.
     *
     * Learn more by reading the docstring of `toString`.
     *
     * @returns AccountAddress as a string conforming to AIP-40 but without the leading 0x.
     */
    toStringWithoutPrefix(): string;
    /**
     * NOTE: Prefer to use `toString` where possible.
     *
     * Whereas toString will format special addresses (as defined by isSpecial) using the
     * SHORT form (no leading 0s), this format the address in the LONG format
     * unconditionally.
     *
     * This means it will be 0x + 64 hex characters.
     *
     * @returns AccountAddress as a string in LONG form.
     */
    toStringLong(): `0x${string}`;
    /**
     * NOTE: Prefer to use `toString` where possible.
     *
     * Whereas toString will format special addresses (as defined by isSpecial) using the
     * SHORT form (no leading 0s), this function will include leading zeroes. The string
     * will not have a leading zero.
     *
     * This means it will be 64 hex characters without a leading 0x.
     *
     * @returns AccountAddress as a string in LONG form without a leading 0x.
     */
    toStringLongWithoutPrefix(): string;
    /**
     * Get the inner hex data. The inner data is already a Uint8Array so no conversion
     * is taking place here, it just returns the inner data.
     *
     * @returns Hex data as Uint8Array
     */
    toUint8Array(): Uint8Array;
    /**
     * Serialize the AccountAddress to a Serializer instance's data buffer.
     * @param serializer The serializer to serialize the AccountAddress to.
     * @returns void
     * @example
     * const serializer = new Serializer();
     * const address = AccountAddress.fromString("0x1");
     * address.serialize(serializer);
     * const bytes = serializer.toUint8Array();
     * // `bytes` is now the BCS-serialized address.
     */
    serialize(serializer: Serializer): void;
    serializeForEntryFunction(serializer: Serializer): void;
    serializeForScriptFunction(serializer: Serializer): void;
    /**
     * Deserialize an AccountAddress from the byte buffer in a Deserializer instance.
     * @param deserializer The deserializer to deserialize the AccountAddress from.
     * @returns An instance of AccountAddress.
     * @example
     * const bytes = hexToBytes("0x0102030405060708091011121314151617181920212223242526272829303132");
     * const deserializer = new Deserializer(bytes);
     * const address = AccountAddress.deserialize(deserializer);
     * // `address` is now an instance of AccountAddress.
     */
    static deserialize(deserializer: Deserializer): AccountAddress;
    /**
     * NOTE: This function has strict parsing behavior. For relaxed behavior, please use
     * the `fromStringRelaxed` function.
     *
     * Creates an instance of AccountAddress from a hex string.
     *
     * This function allows only the strictest formats defined by AIP-40. In short this
     * means only the following formats are accepted:
     *
     * - LONG
     * - SHORT for special addresses
     *
     * Where:
     * - LONG is defined as 0x + 64 hex characters.
     * - SHORT for special addresses is 0x0 to 0xf inclusive without padding zeroes.
     *
     * This means the following are not accepted:
     * - SHORT for non-special addresses.
     * - Any address without a leading 0x.
     *
     * Learn more about the different address formats by reading AIP-40:
     * https://github.com/aptos-foundation/AIPs/blob/main/aips/aip-40.md.
     *
     * @param input A hex string representing an account address.
     *
     * @returns An instance of AccountAddress.
     */
    static fromString(input: string): AccountAddress;
    /**
     * NOTE: This function has relaxed parsing behavior. For strict behavior, please use
     * the `fromString` function. Where possible use `fromString` rather than this
     * function, `fromStringRelaxed` is only provided for backwards compatibility.
     *
     * Creates an instance of AccountAddress from a hex string.
     *
     * This function allows all formats defined by AIP-40. In short this means the
     * following formats are accepted:
     *
     * - LONG, with or without leading 0x
     * - SHORT, with or without leading 0x
     *
     * Where:
     * - LONG is 64 hex characters.
     * - SHORT is 1 to 63 hex characters inclusive.
     * - Padding zeroes are allowed, e.g. 0x0123 is valid.
     *
     * Learn more about the different address formats by reading AIP-40:
     * https://github.com/aptos-foundation/AIPs/blob/main/aips/aip-40.md.
     *
     * @param input A hex string representing an account address.
     *
     * @returns An instance of AccountAddress.
     */
    static fromStringRelaxed(input: string): AccountAddress;
    /**
     * Convenience method for creating an AccountAddress from HexInput. For
     * more information on how this works, see the constructor and fromString.
     *
     * @param input A hex string or Uint8Array representing an account address.
     *
     * @returns An instance of AccountAddress.
     */
    static fromHexInput(input: HexInput): AccountAddress;
    /**
     * Convenience method for creating an AccountAddress from HexInput. For
     * more information on how this works, see the constructor and fromStringRelaxed.
     *
     * @param hexInput A hex string or Uint8Array representing an account address.
     *
     * @returns An instance of AccountAddress.
     */
    static fromHexInputRelaxed(hexInput: HexInput): AccountAddress;
    /**
     * Check if the string is a valid AccountAddress.
     *
     * @param args.input A hex string representing an account address.
     * @param args.relaxed If true, use relaxed parsing behavior. If false, use strict parsing behavior.
     *
     * @returns valid = true if the string is valid, valid = false if not. If the string
     * is not valid, invalidReason will be set explaining why it is invalid.
     */
    static isValid(args: {
        input: string;
        relaxed?: boolean;
    }): ParsingResult<AddressInvalidReason>;
    /**
     * Return whether AccountAddresses are equal. AccountAddresses are considered equal
     * if their underlying byte data is identical.
     *
     * @param other The AccountAddress to compare to.
     * @returns true if the AccountAddresses are equal, false if not.
     */
    equals(other: AccountAddress): boolean;
}

/**
 *  This class exists to represent a contiguous sequence of already serialized BCS-bytes.
 *
 *  It differs from most other Serializable classes in that its internal byte buffer is serialized to BCS
 *  bytes exactly as-is, without prepending the length of the bytes.
 *
 *  If you want to write your own serialization function and pass the bytes as a transaction argument,
 *  you should use this class.
 *
 *  This class is also more generally used to represent type-agnostic BCS bytes as a vector<u8>.
 *
 *  An example of this is the bytes resulting from entry function arguments that have been serialized
 *  for an entry function.
 *
 *  @example
 *  const yourCustomSerializedBytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
 *  const fixedBytes = new FixedBytes(yourCustomSerializedBytes);
 *  const payload = await generateTransactionPayload({
 *    function: "0xbeefcafe::your_module::your_function_that_requires_custom_serialization",
 *    functionArguments: [yourCustomBytes],
 *  });
 *
 *  For example, if you store each of the 32 bytes for an address as a U8 in a MoveVector<U8>, when you
 *  serialize that MoveVector<U8>, it will be serialized to 33 bytes. If you solely want to pass around
 *  the 32 bytes as a Serializable class that *does not* prepend the length to the BCS-serialized representation,
 *  use this class.
 *
 * @params value: HexInput representing a sequence of Uint8 bytes
 * @returns a Serializable FixedBytes instance, which when serialized, does not prepend the length of the bytes
 * @see EntryFunctionBytes
 */
declare class FixedBytes extends Serializable implements TransactionArgument {
    value: Uint8Array;
    constructor(value: HexInput);
    serialize(serializer: Serializer): void;
    serializeForEntryFunction(serializer: Serializer): void;
    serializeForScriptFunction(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer, length: number): FixedBytes;
}

/**
 * This class exists solely to represent a sequence of fixed bytes as a serialized entry function, because
 * serializing an entry function appends a prefix that's *only* used for entry function arguments.
 *
 * NOTE: Attempting to use this class for a serialized script function will result in erroneous
 * and unexpected behavior.
 *
 * If you wish to convert this class back to a TransactionArgument, you must know the type
 * of the argument beforehand, and use the appropriate class to deserialize the bytes within
 * an instance of this class.
 */
declare class EntryFunctionBytes extends Serializable implements EntryFunctionArgument {
    readonly value: FixedBytes;
    private constructor();
    serialize(serializer: Serializer): void;
    serializeForEntryFunction(serializer: Serializer): void;
    /**
     * The only way to create an instance of this class is to use this static method.
     *
     * This function should only be used when deserializing a sequence of EntryFunctionPayload arguments.
     * @param deserializer the deserializer instance with the buffered bytes
     * @param length the length of the bytes to deserialize
     * @returns an instance of this class, which will now only be usable as an EntryFunctionArgument
     */
    static deserialize(deserializer: Deserializer, length: number): EntryFunctionBytes;
}

declare class Bool extends Serializable implements TransactionArgument {
    readonly value: boolean;
    constructor(value: boolean);
    serialize(serializer: Serializer): void;
    serializeForEntryFunction(serializer: Serializer): void;
    serializeForScriptFunction(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Bool;
}
declare class U8 extends Serializable implements TransactionArgument {
    readonly value: Uint8;
    constructor(value: Uint8);
    serialize(serializer: Serializer): void;
    serializeForEntryFunction(serializer: Serializer): void;
    serializeForScriptFunction(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): U8;
}
declare class U16 extends Serializable implements TransactionArgument {
    readonly value: Uint16;
    constructor(value: Uint16);
    serialize(serializer: Serializer): void;
    serializeForEntryFunction(serializer: Serializer): void;
    serializeForScriptFunction(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): U16;
}
declare class U32 extends Serializable implements TransactionArgument {
    readonly value: Uint32;
    constructor(value: Uint32);
    serialize(serializer: Serializer): void;
    serializeForEntryFunction(serializer: Serializer): void;
    serializeForScriptFunction(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): U32;
}
declare class U64 extends Serializable implements TransactionArgument {
    readonly value: bigint;
    constructor(value: AnyNumber);
    serialize(serializer: Serializer): void;
    serializeForEntryFunction(serializer: Serializer): void;
    serializeForScriptFunction(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): U64;
}
declare class U128 extends Serializable implements TransactionArgument {
    readonly value: bigint;
    constructor(value: AnyNumber);
    serialize(serializer: Serializer): void;
    serializeForEntryFunction(serializer: Serializer): void;
    serializeForScriptFunction(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): U128;
}
declare class U256 extends Serializable implements TransactionArgument {
    readonly value: bigint;
    constructor(value: AnyNumber);
    serialize(serializer: Serializer): void;
    serializeForEntryFunction(serializer: Serializer): void;
    serializeForScriptFunction(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): U256;
}

/**
 * This class is the Aptos Typescript SDK representation of a Move `vector<T>`,
 * where `T` represents either a primitive type (`bool`, `u8`, `u64`, ...)
 * or a BCS-serializable struct itself.
 *
 * It is a BCS-serializable, array-like type that contains an array of values of type `T`,
 * where `T` is a class that implements `Serializable`.
 *
 * The purpose of this class is to facilitate easy construction of BCS-serializable
 * Move `vector<T>` types.
 *
 * @example
 * // in Move: `vector<u8> [1, 2, 3, 4];`
 * const vecOfU8s = new MoveVector<U8>([new U8(1), new U8(2), new U8(3), new U8(4)]);
 * // in Move: `std::bcs::to_bytes(vector<u8> [1, 2, 3, 4]);`
 * const bcsBytes = vecOfU8s.toUint8Array();
 *
 * // vector<vector<u8>> [ vector<u8> [1], vector<u8> [1, 2, 3, 4], vector<u8> [5, 6, 7, 8] ];
 * const vecOfVecs = new MoveVector<MoveVector<U8>>([
 *   new MoveVector<U8>([new U8(1)]),
 *   MoveVector.U8([1, 2, 3, 4]),
 *   MoveVector.U8([5, 6, 7, 8]),
 * ]);
 *
 * // vector<Option<u8>> [ std::option::some<u8>(1), std::option::some<u8>(2) ];
 * const vecOfOptionU8s = new MoveVector<MoveOption<U8>>([
 *    MoveOption.U8(1),
 *    MoveOption.U8(2),
 * ]);
 *
 * // vector<MoveString> [ std::string::utf8(b"hello"), std::string::utf8(b"world") ];
 * const vecOfStrings = new MoveVector([new MoveString("hello"), new MoveString("world")]);
 * const vecOfStrings2 = MoveVector.MoveString(["hello", "world"]);
 *
 * // where MySerializableStruct is a class you've made that implements Serializable
 * const vecOfSerializableValues = new MoveVector<MySerializableStruct>([
 *   new MySerializableStruct("hello", "world"),
 *   new MySerializableStruct("foo", "bar"),
 * ]);
 * @params
 * values: an Array<T> of values where T is a class that implements Serializable
 * @returns a `MoveVector<T>` with the values `values`
 */
declare class MoveVector<T extends Serializable & EntryFunctionArgument> extends Serializable implements TransactionArgument {
    values: Array<T>;
    constructor(values: Array<T>);
    serializeForEntryFunction(serializer: Serializer): void;
    /**
     * NOTE: This function will only work when the inner values in the `MoveVector` are `U8`s.
     * @param serializer
     */
    serializeForScriptFunction(serializer: Serializer): void;
    /**
     * Factory method to generate a MoveVector of U8s from an array of numbers.
     *
     * @example
     * const v = MoveVector.U8([1, 2, 3, 4]);
     * @params values: an array of `numbers` to convert to U8s
     * @returns a `MoveVector<U8>`
     */
    static U8(values: Array<number> | HexInput): MoveVector<U8>;
    /**
     * Factory method to generate a MoveVector of U16s from an array of numbers.
     *
     * @example
     * const v = MoveVector.U16([1, 2, 3, 4]);
     * @params values: an array of `numbers` to convert to U16s
     * @returns a `MoveVector<U16>`
     */
    static U16(values: Array<number>): MoveVector<U16>;
    /**
     * Factory method to generate a MoveVector of U32s from an array of numbers.
     *
     * @example
     * const v = MoveVector.U32([1, 2, 3, 4]);
     * @params values: an array of `numbers` to convert to U32s
     * @returns a `MoveVector<U32>`
     */
    static U32(values: Array<number>): MoveVector<U32>;
    /**
     * Factory method to generate a MoveVector of U64s from an array of numbers or bigints.
     *
     * @example
     * const v = MoveVector.U64([1, 2, 3, 4]);
     * @params values: an array of numbers of type `number | bigint` to convert to U64s
     * @returns a `MoveVector<U64>`
     */
    static U64(values: Array<AnyNumber>): MoveVector<U64>;
    /**
     * Factory method to generate a MoveVector of U128s from an array of numbers or bigints.
     *
     * @example
     * const v = MoveVector.U128([1, 2, 3, 4]);
     * @params values: an array of numbers of type `number | bigint` to convert to U128s
     * @returns a `MoveVector<U128>`
     */
    static U128(values: Array<AnyNumber>): MoveVector<U128>;
    /**
     * Factory method to generate a MoveVector of U256s from an array of numbers or bigints.
     *
     * @example
     * const v = MoveVector.U256([1, 2, 3, 4]);
     * @params values: an array of numbers of type `number | bigint` to convert to U256s
     * @returns a `MoveVector<U256>`
     */
    static U256(values: Array<AnyNumber>): MoveVector<U256>;
    /**
     * Factory method to generate a MoveVector of Bools from an array of booleans.
     *
     * @example
     * const v = MoveVector.Bool([true, false, true, false]);
     * @params values: an array of `numbers` to convert to Bools
     * @returns a `MoveVector<Bool>`
     */
    static Bool(values: Array<boolean>): MoveVector<Bool>;
    /**
     * Factory method to generate a MoveVector of MoveStrings from an array of strings.
     *
     * @example
     * const v = MoveVector.MoveString(["hello", "world"]);
     * @params values: an array of `numbers` to convert to MoveStrings
     * @returns a `MoveVector<MoveString>`
     */
    static MoveString(values: Array<string>): MoveVector<MoveString>;
    serialize(serializer: Serializer): void;
    /**
     * Deserialize a MoveVector of type T, specifically where T is a Serializable and Deserializable type.
     *
     * NOTE: This only works with a depth of one. Generics will not work.
     *
     * NOTE: This will not work with types that aren't of the Serializable class.
     *
     * If you want to use types that merely implement Deserializable,
     * please use the deserializeVector function in the Deserializer class.
     * @example
     * const vec = MoveVector.deserialize(deserializer, U64);
     * @params deserializer: the Deserializer instance to use, with bytes loaded into it already.
     * cls: the class to typecast the input values to, must be a Serializable and Deserializable type.
     * @returns a MoveVector of the corresponding class T
     * *
     */
    static deserialize<T extends Serializable & EntryFunctionArgument>(deserializer: Deserializer, cls: Deserializable<T>): MoveVector<T>;
}
declare class MoveString extends Serializable implements TransactionArgument {
    value: string;
    constructor(value: string);
    serialize(serializer: Serializer): void;
    serializeForEntryFunction(serializer: Serializer): void;
    serializeForScriptFunction(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): MoveString;
}
declare class MoveOption<T extends Serializable & EntryFunctionArgument> extends Serializable implements EntryFunctionArgument {
    private vec;
    readonly value?: T;
    constructor(value?: T | null);
    serializeForEntryFunction(serializer: Serializer): void;
    /**
     * Retrieves the inner value of the MoveOption.
     *
     * This method is inspired by Rust's `Option<T>.unwrap()`.
     * In Rust, attempting to unwrap a `None` value results in a panic.
     *
     * Similarly, this method will throw an error if the value is not present.
     *
     * @example
     * const option = new MoveOption<Bool>(new Bool(true));
     * const value = option.unwrap();  // Returns the Bool instance
     *
     * @throws {Error} Throws an error if the MoveOption does not contain a value.
     *
     * @returns {T} The contained value if present.
     */
    unwrap(): T;
    isSome(): boolean;
    serialize(serializer: Serializer): void;
    /**
     * Factory method to generate a MoveOption<U8> from a `number` or `undefined`.
     *
     * @example
     * MoveOption.U8(1).isSome() === true;
     * MoveOption.U8().isSome() === false;
     * MoveOption.U8(undefined).isSome() === false;
     * @params value: the value used to fill the MoveOption. If `value` is undefined
     * the resulting MoveOption's .isSome() method will return false.
     * @returns a MoveOption<U8> with an inner value `value`
     */
    static U8(value?: number | null): MoveOption<U8>;
    /**
     * Factory method to generate a MoveOption<U16> from a `number` or `undefined`.
     *
     * @example
     * MoveOption.U16(1).isSome() === true;
     * MoveOption.U16().isSome() === false;
     * MoveOption.U16(undefined).isSome() === false;
     * @params value: the value used to fill the MoveOption. If `value` is undefined
     * the resulting MoveOption's .isSome() method will return false.
     * @returns a MoveOption<U16> with an inner value `value`
     */
    static U16(value?: number | null): MoveOption<U16>;
    /**
     * Factory method to generate a MoveOption<U32> from a `number` or `undefined`.
     *
     * @example
     * MoveOption.U32(1).isSome() === true;
     * MoveOption.U32().isSome() === false;
     * MoveOption.U32(undefined).isSome() === false;
     * @params value: the value used to fill the MoveOption. If `value` is undefined
     * the resulting MoveOption's .isSome() method will return false.
     * @returns a MoveOption<U32> with an inner value `value`
     */
    static U32(value?: number | null): MoveOption<U32>;
    /**
     * Factory method to generate a MoveOption<U64> from a `number` or a `bigint` or `undefined`.
     *
     * @example
     * MoveOption.U64(1).isSome() === true;
     * MoveOption.U64().isSome() === false;
     * MoveOption.U64(undefined).isSome() === false;
     * @params value: the value used to fill the MoveOption. If `value` is undefined
     * the resulting MoveOption's .isSome() method will return false.
     * @returns a MoveOption<U64> with an inner value `value`
     */
    static U64(value?: AnyNumber | null): MoveOption<U64>;
    /**
     * Factory method to generate a MoveOption<U128> from a `number` or a `bigint` or `undefined`.
     *
     * @example
     * MoveOption.U128(1).isSome() === true;
     * MoveOption.U128().isSome() === false;
     * MoveOption.U128(undefined).isSome() === false;
     * @params value: the value used to fill the MoveOption. If `value` is undefined
     * the resulting MoveOption's .isSome() method will return false.
     * @returns a MoveOption<U128> with an inner value `value`
     */
    static U128(value?: AnyNumber | null): MoveOption<U128>;
    /**
     * Factory method to generate a MoveOption<U256> from a `number` or a `bigint` or `undefined`.
     *
     * @example
     * MoveOption.U256(1).isSome() === true;
     * MoveOption.U256().isSome() === false;
     * MoveOption.U256(undefined).isSome() === false;
     * @params value: the value used to fill the MoveOption. If `value` is undefined
     * the resulting MoveOption's .isSome() method will return false.
     * @returns a MoveOption<U256> with an inner value `value`
     */
    static U256(value?: AnyNumber | null): MoveOption<U256>;
    /**
     * Factory method to generate a MoveOption<Bool> from a `boolean` or `undefined`.
     *
     * @example
     * MoveOption.Bool(true).isSome() === true;
     * MoveOption.Bool().isSome() === false;
     * MoveOption.Bool(undefined).isSome() === false;
     * @params value: the value used to fill the MoveOption. If `value` is undefined
     * the resulting MoveOption's .isSome() method will return false.
     * @returns a MoveOption<Bool> with an inner value `value`
     */
    static Bool(value?: boolean | null): MoveOption<Bool>;
    /**
     * Factory method to generate a MoveOption<MoveString> from a `string` or `undefined`.
     *
     * @example
     * MoveOption.MoveString("hello").isSome() === true;
     * MoveOption.MoveString("").isSome() === true;
     * MoveOption.MoveString().isSome() === false;
     * MoveOption.MoveString(undefined).isSome() === false;
     * @params value: the value used to fill the MoveOption. If `value` is undefined
     * the resulting MoveOption's .isSome() method will return false.
     * @returns a MoveOption<MoveString> with an inner value `value`
     */
    static MoveString(value?: string | null): MoveOption<MoveString>;
    static deserialize<U extends Serializable & EntryFunctionArgument>(deserializer: Deserializer, cls: Deserializable<U>): MoveOption<U>;
}

/**
 * An abstract representation of a public key.  All Asymmetric key pairs will use this to
 * verify signatures and for authentication keys.
 */
declare abstract class PublicKey extends Serializable {
    /**
     * Verifies that the private key associated with this public key signed the message with the given signature.
     * @param args.message The message that was signed
     * @param args.signature The signature to verify
     */
    abstract verifySignature(args: {
        message: HexInput;
        signature: Signature;
    }): boolean;
    /**
     * Get the raw public key bytes
     */
    abstract toUint8Array(): Uint8Array;
    /**
     * Get the public key as a hex string with a 0x prefix e.g. 0x123456...
     */
    abstract toString(): string;
    abstract serialize(serializer: Serializer): void;
}
/**
 * An abstract representation of a private key.  This is used to sign transactions and
 * derive the public key associated.
 */
declare abstract class PrivateKey extends Serializable {
    /**
     * Sign a message with the key
     * @param message The message to sign
     */
    abstract sign(message: HexInput): Signature;
    /**
     * Get the raw private key bytes
     */
    abstract toUint8Array(): Uint8Array;
    /**
     * Get the private key as a hex string with a 0x prefix e.g. 0x123456...
     */
    abstract toString(): string;
    abstract serialize(serializer: Serializer): void;
    /**
     * Derives the public key associated with the private key
     */
    abstract publicKey(): PublicKey;
}
/**
 * An abstract representation of a signature.  This is the product of signing a
 * message and can be used with the PublicKey to verify the signature.
 */
declare abstract class Signature extends Serializable {
    /**
     * Get the raw signature bytes
     */
    abstract toUint8Array(): Uint8Array;
    /**
     * Get the signature as a hex string with a 0x prefix e.g. 0x123456...
     */
    abstract toString(): string;
    abstract serialize(serializer: Serializer): void;
}

/**
 * Class for creating and managing account on Aptos network
 *
 * Use this class to create accounts, sign transactions, and more.
 * Note: Creating an account instance does not create the account on-chain.
 *
 * Since [AIP-55](https://github.com/aptos-foundation/AIPs/pull/263) Aptos supports
 * `Legacy` and `Unified` authentications.
 *
 * @Legacy includes `ED25519` and `MultiED25519`
 * @Unified includes `SingleSender` and `MultiSender`, where currently
 * `SingleSender` supports `ED25519` and `Secp256k1`, and `MultiSender` supports
 * `MultiED25519`.
 *
 * In TypeScript SDK, we support all of these options
 * @generate default to generate Unified keys, with an optional `legacy` boolean argument
 * that lets you generate new keys conforming to the Legacy authentication.
 * @fromPrivateKey derives an account by a provided private key and address, with an optional
 * `legacy` boolean argument that lets you generate new keys conforming to the Legacy authentication.
 * @fromDerivationPath derives an account with bip44 path and mnemonics,
 *
 */
declare class Account$1 {
    /**
     * Public key associated with the account
     */
    readonly publicKey: PublicKey;
    /**
     * Private key associated with the account
     */
    readonly privateKey: PrivateKey;
    /**
     * Account address associated with the account
     */
    readonly accountAddress: AccountAddress;
    /**
     * Signing scheme used to sign transactions
     */
    readonly signingScheme: SigningScheme;
    /**
     * constructor for Account
     *
     * Need to update this to use the new crypto library if new schemes are added.
     *
     * @param args.privateKey PrivateKey - private key of the account
     * @param args.address AccountAddress - address of the account
     * @param args.legacy optional. If set to true, the keypair authentication keys will be derived with a Legacy scheme.
     * Defaults to deriving an authentication key with a Unified scheme
     *
     * This method is private because it should only be called by the factory static methods.
     * @returns Account
     */
    private constructor();
    /**
     * Derives an account with random private key and address.
     * Default generation is using the Unified flow with ED25519 key
     *
     * @param args optional. Unify GenerateAccount type for Legacy and Unified keys
     *
     * Account input type to generate an account using Legacy
     * Ed25519 or MultiEd25519 keys or without a specified `scheme`.
     * ```
     * GenerateAccountWithLegacyKey = {
     *  scheme?: SigningSchemeInput.Ed25519 | SigningSchemeInput.MultiEd25519;
     *  legacy: true;
     * };
     * ```
     *
     * Account input type to generate an account using Unified
     * Secp256k1Ecdsa key
     * In this case `legacy` is always false
     * ```
     * GenerateAccountWithUnifiedKey = {
     *  scheme: SigningSchemeInput.Secp256k1Ecdsa;
     *  legacy?: false;
     * };
     * ```
     *
     * @returns Account with the given signing scheme
     */
    static generate(args?: GenerateAccount): Account$1;
    /**
     * Instantiates an account given a private key and a specified account address.
     * This is primarily used to instantiate an `Account` that has had its authentication key rotated.
     *
     * @param privateKey PrivateKey - private key of the account
     * @param address The account address
     * @param args.legacy optional. If set to true, the keypair authentication keys will be derived with a Legacy scheme.
     * Defaults to deriving an authentication key with a Unified scheme
     *
     * @returns Account
     */
    static fromPrivateKeyAndAddress(args: {
        privateKey: PrivateKey;
        address: AccountAddress;
        legacy?: boolean;
    }): Account$1;
    /**
     * Derives an account with bip44 path and mnemonics,
     *
     * @param args.path the BIP44 derive path (e.g. m/44'/637'/0'/0'/0')
     * Detailed description: {@link https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki}
     * @param args.mnemonic the mnemonic seed phrase of the account
     * @returns AptosAccount
     */
    static fromDerivationPath(args: {
        path: string;
        mnemonic: string;
    }): Account$1;
    /**
     * This key enables account owners to rotate their private key(s)
     * associated with the account without changing the address that hosts their account.
     * See here for more info: {@link https://aptos.dev/concepts/accounts#single-signer-authentication}
     *
     * @param args.publicKey PublicKey - public key of the account
     * @returns Authentication key for the associated account
     */
    static authKey(args: {
        publicKey: PublicKey;
    }): Hex;
    /**
     * Sign the given message with the private key.
     *
     * TODO: Add sign transaction or specific types
     *
     * @param data in HexInput format
     * @returns Signature
     */
    sign(data: HexInput): Signature;
    /**
     * Verify the given message and signature with the public key.
     *
     * @param args.message raw message data in HexInput format
     * @param args.signature signed message Signature
     * @returns
     */
    verifySignature(args: {
        message: HexInput;
        signature: Signature;
    }): boolean;
}

/**
 * Each account stores an authentication key. Authentication key enables account owners to rotate
 * their private key(s) associated with the account without changing the address that hosts their account.
 * @see {@link https://aptos.dev/concepts/accounts | Account Basics}
 *
 * Note: AuthenticationKey only supports Ed25519 and MultiEd25519 public keys for now.
 *
 * Account addresses can be derived from AuthenticationKey
 */
declare class AuthenticationKey extends Serializable {
    /**
     * An authentication key is always a SHA3-256 hash of data, and is always 32 bytes.
     */
    static readonly LENGTH: number;
    /**
     * The raw bytes of the authentication key.
     */
    readonly data: Hex;
    constructor(args: {
        data: HexInput;
    });
    serialize(serializer: Serializer): void;
    /**
     * Deserialize an AuthenticationKey from the byte buffer in a Deserializer instance.
     * @param deserializer The deserializer to deserialize the AuthenticationKey from.
     * @returns An instance of AuthenticationKey.
     */
    static deserialize(deserializer: Deserializer): AuthenticationKey;
    toString(): string;
    toUint8Array(): Uint8Array;
    /**
     * Creates an AuthenticationKey from seed bytes and a scheme
     *
     * This allows for the creation of AuthenticationKeys that are not derived from Public Keys directly
     * @param args
     */
    static fromPublicKeyAndScheme(args: {
        publicKey: PublicKey;
        scheme: AuthenticationKeyScheme;
    }): AuthenticationKey;
    /**
     * Converts a PublicKey(s) to AuthenticationKey
     *
     * @param args.publicKey
     * @returns AuthenticationKey
     */
    static fromPublicKey(args: {
        publicKey: PublicKey;
    }): AuthenticationKey;
    /**
     * Derives an account address from AuthenticationKey. Since current AccountAddress is 32 bytes,
     * AuthenticationKey bytes are directly translated to AccountAddress.
     *
     * @returns AccountAddress
     */
    derivedAddress(): AccountAddress;
}

/**
 * Represents the public key of an Ed25519 key pair.
 *
 * Since [AIP-55](https://github.com/aptos-foundation/AIPs/pull/263) Aptos supports
 * `Legacy` and `Unified` authentication keys.
 *
 * Ed25519 scheme is represented in the SDK as `Legacy authentication key` and also
 * as `AnyPublicKey` that represents any `Unified authentication key`
 */
declare class Ed25519PublicKey extends PublicKey {
    /**
     * Length of an Ed25519 public key
     */
    static readonly LENGTH: number;
    /**
     * Bytes of the public key
     * @private
     */
    private readonly key;
    /**
     * Create a new PublicKey instance from a Uint8Array or String.
     *
     * @param hexInput A HexInput (string or Uint8Array)
     */
    constructor(hexInput: HexInput);
    /**
     * Get the public key in bytes (Uint8Array).
     *
     * @returns Uint8Array representation of the public key
     */
    toUint8Array(): Uint8Array;
    /**
     * Get the public key as a hex string with the 0x prefix.
     *
     * @returns string representation of the public key
     */
    toString(): string;
    /**
     * Verifies a signed data with a public key
     * @param args.message a signed message
     * @param args.signature the signature of the message
     */
    verifySignature(args: {
        message: HexInput;
        signature: Ed25519Signature;
    }): boolean;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Ed25519PublicKey;
    static load(deserializer: Deserializer): Ed25519PublicKey;
}
/**
 * Represents the private key of an Ed25519 key pair.
 */
declare class Ed25519PrivateKey extends PrivateKey {
    /**
     * Length of an Ed25519 private key
     */
    static readonly LENGTH: number;
    /**
     * The Ed25519 signing key
     * @private
     */
    private readonly signingKeyPair;
    /**
     * Create a new PrivateKey instance from a Uint8Array or String.
     *
     * @param hexInput HexInput (string or Uint8Array)
     */
    constructor(hexInput: HexInput);
    /**
     * Get the private key in bytes (Uint8Array).
     *
     * @returns Uint8Array representation of the private key
     */
    toUint8Array(): Uint8Array;
    /**
     * Get the private key as a hex string with the 0x prefix.
     *
     * @returns string representation of the private key
     */
    toString(): string;
    /**
     * Sign the given message with the private key.
     *
     * @param message in HexInput format
     * @returns Signature
     */
    sign(message: HexInput): Ed25519Signature;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Ed25519PrivateKey;
    /**
     * Generate a new random private key.
     *
     * @returns Ed25519PrivateKey
     */
    static generate(): Ed25519PrivateKey;
    /**
     * Derive the Ed25519PublicKey for this private key.
     *
     * @returns Ed25519PublicKey
     */
    publicKey(): Ed25519PublicKey;
}
/**
 * A signature of a message signed using an Ed25519 private key
 */
declare class Ed25519Signature extends Signature {
    /**
     * Length of an Ed25519 signature
     */
    static readonly LENGTH = 64;
    /**
     * The signature bytes
     * @private
     */
    private readonly data;
    constructor(hexInput: HexInput);
    /**
     * Get the signature in bytes (Uint8Array).
     *
     * @returns Uint8Array representation of the signature
     */
    toUint8Array(): Uint8Array;
    /**
     * Get the signature as a hex string with the 0x prefix.
     *
     * @returns string representation of the signature
     */
    toString(): string;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Ed25519Signature;
    static load(deserializer: Deserializer): Ed25519Signature;
}

/**
 * Represents the public key of a K-of-N Ed25519 multi-sig transaction.
 */
declare class MultiEd25519PublicKey extends PublicKey {
    /**
     * Maximum number of public keys supported
     */
    static readonly MAX_KEYS = 32;
    /**
     * Minimum number of public keys needed
     */
    static readonly MIN_KEYS = 2;
    /**
     * Minimum threshold for the number of valid signatures required
     */
    static readonly MIN_THRESHOLD = 1;
    /**
     * List of Ed25519 public keys for this MultiEd25519PublicKey
     */
    readonly publicKeys: Ed25519PublicKey[];
    /**
     * The minimum number of valid signatures required, for the number of public keys specified
     */
    readonly threshold: number;
    /**
     * Public key for a K-of-N multi-sig transaction. A K-of-N multi-sig transaction means that for such a
     * transaction to be executed, at least K out of the N authorized signers have signed the transaction
     * and passed the check conducted by the chain.
     *
     * @see {@link
     * https://aptos.dev/integration/creating-a-signed-transaction/ | Creating a Signed Transaction}
     *
     * @param args.publicKeys A list of public keys
     * @param args.threshold At least "threshold" signatures must be valid
     */
    constructor(args: {
        publicKeys: Ed25519PublicKey[];
        threshold: number;
    });
    /**
     * Converts a PublicKeys into Uint8Array (bytes) with: bytes = p1_bytes | ... | pn_bytes | threshold
     */
    toUint8Array(): Uint8Array;
    toString(): string;
    verifySignature(args: {
        message: HexInput;
        signature: MultiEd25519Signature;
    }): boolean;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): MultiEd25519PublicKey;
}
/**
 * Represents the signature of a K-of-N Ed25519 multi-sig transaction.
 */
declare class MultiEd25519Signature extends Signature {
    /**
     * Maximum number of Ed25519 signatures supported
     */
    static MAX_SIGNATURES_SUPPORTED: number;
    /**
     * Number of bytes in the bitmap representing who signed the transaction (32-bits)
     */
    static BITMAP_LEN: number;
    /**
     * The list of underlying Ed25519 signatures
     */
    readonly signatures: Ed25519Signature[];
    /**
     * 32-bit Bitmap representing who signed the transaction
     *
     * This is represented where each public key can be masked to determine whether the message was signed by that key.
     */
    readonly bitmap: Uint8Array;
    /**
     * Signature for a K-of-N multi-sig transaction.
     *
     * @see {@link
     * https://aptos.dev/integration/creating-a-signed-transaction/#multisignature-transactions | Creating a Signed Transaction}
     *
     * @param args.signatures A list of signatures
     * @param args.bitmap 4 bytes, at most 32 signatures are supported. If Nth bit value is `1`, the Nth
     * signature should be provided in `signatures`. Bits are read from left to right
     */
    constructor(args: {
        signatures: Ed25519Signature[];
        bitmap: Uint8Array;
    });
    /**
     * Converts a MultiSignature into Uint8Array (bytes) with `bytes = s1_bytes | ... | sn_bytes | bitmap`
     */
    toUint8Array(): Uint8Array;
    toString(): string;
    /**
     * Helper method to create a bitmap out of the specified bit positions
     * @param args.bits The bitmap positions that should be set. A position starts at index 0.
     * Valid position should range between 0 and 31.
     * @example
     * Here's an example of valid `bits`
     * ```
     * [0, 2, 31]
     * ```
     * `[0, 2, 31]` means the 1st, 3rd and 32nd bits should be set in the bitmap.
     * The result bitmap should be 0b1010000000000000000000000000001
     *
     * @returns bitmap that is 32bit long
     */
    static createBitmap(args: {
        bits: number[];
    }): Uint8Array;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): MultiEd25519Signature;
}

/**
 * Represents the Secp256k1 ecdsa public key
 *
 * Secp256k1 authentication key is represented in the SDK as `AnyPublicKey`.
 */
declare class Secp256k1PublicKey extends PublicKey {
    static readonly LENGTH: number;
    private readonly key;
    /**
     * Create a new PublicKey instance from a Uint8Array or String.
     *
     * @param hexInput A HexInput (string or Uint8Array)
     */
    constructor(hexInput: HexInput);
    /**
     * Get the public key in bytes (Uint8Array).
     *
     * @returns Uint8Array representation of the public key
     */
    toUint8Array(): Uint8Array;
    /**
     * Get the public key as a hex string with the 0x prefix.
     *
     * @returns string representation of the public key
     */
    toString(): string;
    /**
     * Verifies a signed data with a public key
     *
     * @param args.message message
     * @param args.signature The signature
     * @returns true if the signature is valid
     */
    verifySignature(args: {
        message: HexInput;
        signature: Secp256k1Signature;
    }): boolean;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Secp256k1PublicKey;
    static load(deserializer: Deserializer): Secp256k1PublicKey;
}
/**
 * A Secp256k1 ecdsa private key
 */
declare class Secp256k1PrivateKey extends PrivateKey {
    /**
     * Length of Secp256k1 ecdsa private key
     */
    static readonly LENGTH: number;
    /**
     * The private key bytes
     * @private
     */
    private readonly key;
    /**
     * Create a new PrivateKey instance from a Uint8Array or String.
     *
     * @param hexInput A HexInput (string or Uint8Array)
     */
    constructor(hexInput: HexInput);
    /**
     * Get the private key in bytes (Uint8Array).
     *
     * @returns
     */
    toUint8Array(): Uint8Array;
    /**
     * Get the private key as a hex string with the 0x prefix.
     *
     * @returns string representation of the private key
     */
    toString(): string;
    /**
     * Sign the given message with the private key.
     *
     * @param message in HexInput format
     * @returns Signature
     */
    sign(message: HexInput): Secp256k1Signature;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Secp256k1PrivateKey;
    /**
     * Generate a new random private key.
     *
     * @returns Secp256k1PrivateKey
     */
    static generate(): Secp256k1PrivateKey;
    /**
     * Derive the Secp256k1PublicKey from this private key.
     *
     * @returns Secp256k1PublicKey
     */
    publicKey(): Secp256k1PublicKey;
}
/**
 * A signature of a message signed using an Secp256k1 ecdsa private key
 */
declare class Secp256k1Signature extends Signature {
    /**
     * Secp256k1 ecdsa signatures are 256-bit.
     */
    static readonly LENGTH = 64;
    /**
     * The signature bytes
     * @private
     */
    private readonly data;
    /**
     * Create a new Signature instance from a Uint8Array or String.
     *
     * @param hexInput A HexInput (string or Uint8Array)
     */
    constructor(hexInput: HexInput);
    /**
     * Get the signature in bytes (Uint8Array).
     *
     * @returns Uint8Array representation of the signature
     */
    toUint8Array(): Uint8Array;
    /**
     * Get the signature as a hex string with the 0x prefix.
     *
     * @returns string representation of the signature
     */
    toString(): string;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Secp256k1Signature;
    static load(deserializer: Deserializer): Secp256k1Signature;
}

declare class AnySignature extends Signature {
    readonly signature: Signature;
    constructor(signature: Signature);
    /**
     * Get the public key in bytes (Uint8Array).
     *
     * @returns Uint8Array representation of the public key
     */
    toUint8Array(): Uint8Array;
    /**
     * Get the public key as a hex string with the 0x prefix.
     *
     * @returns string representation of the public key
     */
    toString(): string;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): AnySignature;
}

/**
 * Represents any public key supported by Aptos.
 *
 * Since [AIP-55](https://github.com/aptos-foundation/AIPs/pull/263) Aptos supports
 * `Legacy` and `Unified` authentication keys.
 *
 * Any unified authentication key is represented in the SDK as `AnyPublicKey`.
 */
declare class AnyPublicKey extends PublicKey {
    /**
     * Reference to the inner public key
     */
    readonly publicKey: PublicKey;
    constructor(publicKey: PublicKey);
    /**
     * Get the public key in bytes (Uint8Array).
     *
     * @returns Uint8Array representation of the public key
     */
    toUint8Array(): Uint8Array;
    /**
     * Get the public key as a hex string with the 0x prefix.
     *
     * @returns string representation of the public key
     */
    toString(): string;
    /**
     * Verifies a signed data with a public key
     *
     * @param args.message message
     * @param args.signature The signature
     * @returns true if the signature is valid
     */
    verifySignature(args: {
        message: HexInput;
        signature: AnySignature;
    }): boolean;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): AnyPublicKey;
}

declare class MultiKey extends PublicKey {
    /**
     * List of any public keys
     */
    readonly publicKeys: AnyPublicKey[];
    /**
     * The minimum number of valid signatures required, for the number of public keys specified
     */
    readonly signaturesRequired: number;
    constructor(args: {
        publicKeys: PublicKey[];
        signaturesRequired: number;
    });
    toUint8Array(): Uint8Array;
    /**
     * Create a bitmap that holds the mapping from the original public keys
     * to the signatures passed in
     *
     * @param args.bits array of the index mapping to the matching public keys
     * @returns Uint8array bit map
     */
    createBitmap(args: {
        bits: number[];
    }): Uint8Array;
    /**
     * Hex string representation the multi key bytes
     *
     * @returns string
     */
    toString(): string;
    verifySignature(args: {
        message: HexInput;
        signature: AnySignature;
    }): boolean;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): MultiKey;
}

/**
 * A class to query all `Account` related queries on Aptos.
 */
declare class Account {
    readonly config: AptosConfig;
    constructor(config: AptosConfig);
    /**
     * Queries the current state for an Aptos account given its account address
     *
     * @param args.accountAddress Aptos account address
     *
     * @returns The account data
     *
     * @example An example of the returned account
     * ```
     * {
     *    sequence_number: "1",
     *    authentication_key: "0x5307b5f4bc67829097a8ba9b43dba3b88261eeccd1f709d9bde240fc100fbb69"
     * }
     * ```
     */
    getAccountInfo(args: {
        accountAddress: HexInput;
    }): Promise<AccountData>;
    /**
     * Queries for all modules in an account given an account address
     *
     * Note: In order to get all account modules, this function may call the API
     * multiple times as it auto paginates.
     *
     * @param args.accountAddress Aptos account address
     * @param args.options.offset The number module to start returning results from
     * @param args.options.limit The number of results to return
     * @param args.options.ledgerVersion The ledger version to query, if not provided it will get the latest version
     *
     * @returns Account modules
     */
    getAccountModules(args: {
        accountAddress: HexInput;
        options?: PaginationArgs & LedgerVersion;
    }): Promise<MoveModuleBytecode[]>;
    /**
     * Queries for a specific account module given account address and module name
     *
     * @param args.accountAddress Aptos account address
     * @param args.moduleName The name of the module
     * @param args.options.ledgerVersion The ledger version to query, if not provided it will get the latest version
     *
     * @returns Account module
     *
     * @example An example of an account module
     * ```
     * {
     *    bytecode: "0xa11ceb0b0600000006010002030206050807070f0d081c200",
     *    abi: { address: "0x1" }
     * }
     * ```
     */
    getAccountModule(args: {
        accountAddress: HexInput;
        moduleName: string;
        options?: LedgerVersion;
    }): Promise<MoveModuleBytecode>;
    /**
     * Queries account transactions given an account address
     *
     * Note: In order to get all account transactions, this function may call the API
     * multiple times as it auto paginates.
     *
     * @param args.accountAddress Aptos account address
     * @param args.options.offset The number transaction to start returning results from
     * @param args.options.limit The number of results to return
     *
     * @returns The account transactions
     */
    getAccountTransactions(args: {
        accountAddress: HexInput;
        options?: PaginationArgs;
    }): Promise<TransactionResponse[]>;
    /**
     * Queries all account resources given an account address
     *
     * Note: In order to get all account resources, this function may call the API
     * multiple times as it auto paginates.
     *
     * @param args.accountAddress Aptos account address
     * @param args.options.offset The number resource to start returning results from
     * @param args.options.limit The number of results to return
     * @param args.options.ledgerVersion The ledger version to query, if not provided it will get the latest version
     * @returns Account resources
     */
    getAccountResources(args: {
        accountAddress: HexInput;
        options?: PaginationArgs & LedgerVersion;
    }): Promise<MoveResource[]>;
    /**
     * Queries a specific account resource given account address and resource type. Note that the default is `any` in order
     * to allow for ease of accessing properties of the object.
     *
     * @type The typed output of the resource
     * @param args.accountAddress Aptos account address
     * @param args.resourceType String representation of an on-chain Move struct type, i.e "0x1::aptos_coin::AptosCoin"
     * @param args.options.ledgerVersion The ledger version to query, if not provided it will get the latest version
     *
     * @returns Account resource
     *
     * @example An example of an account resource
     * ```
     * {
     *    data: { value: 6 }
     * }
     * ```
     */
    getAccountResource<T extends {} = any>(args: {
        accountAddress: HexInput;
        resourceType: MoveStructType;
        options?: LedgerVersion;
    }): Promise<T>;
    /**
     * Looks up the account address for a given authentication key
     *
     * This handles both if the account's authentication key has been rotated or not.
     *
     * @param args.authenticationKey The authentication key
     * @param args.options.ledgerVersion The ledger version to query, if not provided it will get the latest version
     * @returns Promise<AccountAddress> The accountAddress associated with the authentication key
     */
    lookupOriginalAccountAddress(args: {
        authenticationKey: HexInput;
        options?: LedgerVersion;
    }): Promise<AccountAddress>;
    /**
     * Queries the current count of tokens owned by an account
     *
     * @param args.accountAddress The account address
     * @returns Current count of tokens owned by the account
     */
    getAccountTokensCount(args: {
        accountAddress: HexInput;
    }): Promise<number>;
    /**
     * Queries the account's current owned tokens.
     *
     * This query returns all tokens (v1 and v2 standards) an account owns, including NFTs, fungible, soulbound, etc.
     * If you want to get only the token from a specific standard, you can pass an optional tokenStandard param
     *
     * @param args.accountAddress The account address we want to get the tokens for
     * @param args.options.tokenStandard The NFT standard to query for
     * @param args.options.pagination.offset The number token to start returning results from
     * @param args.options.pagination.limit The number of results to return
     * @param args.options.orderBy The order to sort the tokens by
     * @returns Tokens array with the token data
     */
    getAccountOwnedTokens(args: {
        accountAddress: HexInput;
        options?: {
            tokenStandard?: TokenStandard;
            pagination?: PaginationArgs;
            orderBy?: OrderBy<GetAccountOwnedTokensQueryResponse[0]>;
        };
    }): Promise<GetAccountOwnedTokensQueryResponse>;
    /**
     * Queries all current tokens of a specific collection that an account owns by the collection address
     *
     * This query returns all tokens (v1 and v2 standards) an account owns, including NFTs, fungible, soulbound, etc.
     * If you want to get only the token from a specific standard, you can pass an optional tokenStandard param
     *
     * @param args.accountAddress The account address we want to get the tokens for
     * @param args.collectionAddress The address of the collection being queried
     * @param args.options.tokenStandard The NFT standard to query for
     * @param args.options.pagination.offset The number token to start returning results from
     * @param args.options.pagination.limit The number of results to return
     * @param args.options.orderBy The order to sort the tokens by
     * @returns Tokens array with the token data
     */
    getAccountOwnedTokensFromCollectionAddress(args: {
        accountAddress: HexInput;
        collectionAddress: HexInput;
        options?: {
            tokenStandard?: TokenStandard;
            pagination?: PaginationArgs;
            orderBy?: OrderBy<GetAccountOwnedTokensFromCollectionResponse[0]>;
        };
    }): Promise<GetAccountOwnedTokensFromCollectionResponse>;
    /**
     * Queries for all collections that an account currently has tokens for.
     *
     * This query returns all tokens (v1 and v2 standards) an account owns, including NFTs, fungible, soulbound, etc.
     * If you want to get only the token from a specific standard, you can pass an optional tokenStandard param
     *
     * @param args.accountAddress The account address we want to get the collections for
     * @param args.options.tokenStandard The NFT standard to query for
     * @param args.options.pagination.offset The number collection to start returning results from
     * @param args.options.pagination.limit The number of results to return
     * @param args.options.orderBy The order to sort the tokens by
     * @returns Collections array with the collections data
     */
    getAccountCollectionsWithOwnedTokens(args: {
        accountAddress: HexInput;
        options?: {
            tokenStandard?: TokenStandard;
            pagination?: PaginationArgs;
            orderBy?: OrderBy<GetAccountCollectionsWithOwnedTokenResponse[0]>;
        };
    }): Promise<GetAccountCollectionsWithOwnedTokenResponse>;
    /**
     * Queries the current count of transactions submitted by an account
     *
     * @param args.accountAddress The account address we want to get the total count for
     * @returns Current count of transactions made by an account
     */
    getAccountTransactionsCount(args: {
        accountAddress: HexInput;
    }): Promise<number>;
    /**
     * Queries an account's coins data
     *
     * @param args.accountAddress The account address we want to get the coins data for
     * @param args.options.pagination.offset The number coin to start returning results from
     * @param args.options.pagination.limit The number of results to return
     * @param args.options.orderBy The order to sort the coins by
     * @returns Array with the coins data
     */
    getAccountCoinsData(args: {
        accountAddress: HexInput;
        options?: {
            pagination?: PaginationArgs;
            orderBy?: OrderBy<GetAccountCoinsDataResponse[0]>;
        };
    }): Promise<GetAccountCoinsDataResponse>;
    /**
     * Queries the current count of an account's coins aggregated
     *
     * @param args.accountAddress The account address we want to get the total count for
     * @returns Current count of the aggregated count of all account's coins
     */
    getAccountCoinsCount(args: {
        accountAddress: HexInput;
    }): Promise<number>;
    /**
     * Queries an account's owned objects
     *
     * @param args.accountAddress The account address we want to get the objects for
     * @param args.options.pagination.offset The number coin to start returning results from
     * @param args.options.pagination.limit The number of results to return
     * @param args.options.orderBy The order to sort the coins by
     * @returns Objects array with the object data
     */
    getAccountOwnedObjects(args: {
        accountAddress: HexInput;
        options?: {
            pagination?: PaginationArgs;
            orderBy?: OrderBy<GetAccountOwnedObjectsResponse[0]>;
        };
    }): Promise<GetAccountOwnedObjectsResponse>;
    /**
     * Derives an account by providing a private key.
     * This functions resolves the provided private key type and derives the public key from it.
     *
     * If the privateKey is a Secp256k1 type, it derives the account using the derived public key and
     * auth key using the SingleKey scheme locally.
     *
     * If the privateKey is a ED25519 type, it looks up the authentication key on chain, and uses it to resolve
     * whether it is a Legacy ED25519 key or a Unified ED25519 key. It then derives the account based
     * on that.
     *
     * @param args.privateKey An account private key
     * @returns Account type
     */
    deriveAccountFromPrivateKey(args: {
        privateKey: PrivateKey;
    }): Promise<Account$1>;
}

/**
 * Representation of a ChainId that can serialized and deserialized
 */
declare class ChainId extends Serializable {
    readonly chainId: number;
    constructor(chainId: number);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): ChainId;
}

/**
 * Representation of an Identifier that can serialized and deserialized.
 * We use Identifier to represent the module "name" in "ModuleId" and
 * the "function name" in "EntryFunction"
 */
declare class Identifier extends Serializable {
    identifier: string;
    constructor(identifier: string);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Identifier;
}

/**
 * Representation of a ModuleId that can serialized and deserialized
 * ModuleId means the module address (e.g "0x1") and the module name (e.g "coin")
 */
declare class ModuleId extends Serializable {
    readonly address: AccountAddress;
    readonly name: Identifier;
    /**
     * Full name of a module.
     * @param address The account address. e.g "0x1"
     * @param name The module name under the "address". e.g "coin"
     */
    constructor(address: AccountAddress, name: Identifier);
    /**
     * Converts a string literal to a ModuleId
     * @param moduleId String literal in format "account_address::module_name", e.g. "0x1::coin"
     * @returns ModuleId
     */
    static fromStr(moduleId: MoveModuleId): ModuleId;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): ModuleId;
}

declare abstract class TypeTag extends Serializable {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): TypeTag;
    abstract toString(): string;
    isBool(): this is TypeTagBool;
    isAddress(): this is TypeTagAddress;
    isGeneric(): this is TypeTagGeneric;
    isSigner(): this is TypeTagSigner;
    isVector(): this is TypeTagVector;
    isStruct(): this is TypeTagStruct;
    isU8(): this is TypeTagU8;
    isU16(): this is TypeTagU16;
    isU32(): this is TypeTagU32;
    isU64(): this is TypeTagU64;
    isU128(): this is TypeTagU128;
    isU256(): this is TypeTagU256;
}
declare class TypeTagBool extends TypeTag {
    toString(): string;
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagBool;
}
declare class TypeTagU8 extends TypeTag {
    toString(): string;
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU8;
}
declare class TypeTagU16 extends TypeTag {
    toString(): string;
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU16;
}
declare class TypeTagU32 extends TypeTag {
    toString(): string;
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU32;
}
declare class TypeTagU64 extends TypeTag {
    toString(): string;
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU64;
}
declare class TypeTagU128 extends TypeTag {
    toString(): string;
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU128;
}
declare class TypeTagU256 extends TypeTag {
    toString(): string;
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU256;
}
declare class TypeTagAddress extends TypeTag {
    toString(): string;
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagAddress;
}
declare class TypeTagSigner extends TypeTag {
    toString(): string;
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagSigner;
}
declare class TypeTagReference extends TypeTag {
    readonly value: TypeTag;
    toString(): `&${string}`;
    constructor(value: TypeTag);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TypeTagReference;
}
/**
 * Generics are used for type parameters in entry functions.  However,
 * they are not actually serialized into a real type, so they cannot be
 * used as a type directly.
 */
declare class TypeTagGeneric extends TypeTag {
    readonly value: number;
    toString(): `T${number}`;
    constructor(value: number);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TypeTagGeneric;
}
declare class TypeTagVector extends TypeTag {
    readonly value: TypeTag;
    toString(): `vector<${string}>`;
    constructor(value: TypeTag);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TypeTagVector;
}
declare class TypeTagStruct extends TypeTag {
    readonly value: StructTag;
    toString(): `0x${string}::${string}::${string}`;
    constructor(value: StructTag);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TypeTagStruct;
    isTypeTag(address: AccountAddress, moduleName: string, structName: string): boolean;
    isString(): boolean;
    isOption(): boolean;
    isObject(): boolean;
}
declare class StructTag extends Serializable {
    readonly address: AccountAddress;
    readonly module_name: Identifier;
    readonly name: Identifier;
    readonly type_args: Array<TypeTag>;
    constructor(address: AccountAddress, module_name: Identifier, name: Identifier, type_args: Array<TypeTag>);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): StructTag;
}
declare function aptosCoinStructTag(): StructTag;
declare function stringStructTag(): StructTag;
declare function optionStructTag(typeArg: TypeTag): StructTag;
declare function objectStructTag(typeArg: TypeTag): StructTag;

/**
 * Deserialize a Script Transaction Argument
 */
declare function deserializeFromScriptArgument(deserializer: Deserializer): TransactionArgument;
/**
 * Representation of the supported Transaction Payload
 * that can serialized and deserialized
 */
declare abstract class TransactionPayload extends Serializable {
    /**
     * Serialize a Transaction Payload
     */
    abstract serialize(serializer: Serializer): void;
    /**
     * Deserialize a Transaction Payload
     */
    static deserialize(deserializer: Deserializer): TransactionPayload;
}
/**
 * Representation of a Transaction Payload Script that can serialized and deserialized
 */
declare class TransactionPayloadScript extends TransactionPayload {
    readonly script: Script;
    constructor(script: Script);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionPayloadScript;
}
/**
 * Representation of a Transaction Payload Entry Function that can serialized and deserialized
 */
declare class TransactionPayloadEntryFunction extends TransactionPayload {
    readonly entryFunction: EntryFunction;
    constructor(entryFunction: EntryFunction);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionPayloadEntryFunction;
}
/**
 * Representation of a Transaction Payload Multi-sig that can serialized and deserialized
 */
declare class TransactionPayloadMultisig extends TransactionPayload {
    readonly multiSig: MultiSig;
    constructor(multiSig: MultiSig);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionPayloadMultisig;
}
/**
 * Representation of a EntryFunction that can serialized and deserialized
 */
declare class EntryFunction {
    readonly module_name: ModuleId;
    readonly function_name: Identifier;
    readonly type_args: Array<TypeTag>;
    readonly args: Array<EntryFunctionArgument>;
    /**
     * Contains the payload to run a function within a module.
     * @param module_name Fully qualified module name in format "account_address::module_name" e.g. "0x1::coin"
     * @param function_name The function name. e.g "transfer"
     * @param type_args Type arguments that move function requires.
     *
     * @example
     * A coin transfer function has one type argument "CoinType".
     * ```
     * public entry fun transfer<CoinType>(from: &signer, to: address, amount: u64)
     * ```
     * @param args arguments to the move function.
     *
     * @example
     * A coin transfer function has three arguments "from", "to" and "amount".
     * ```
     * public entry fun transfer<CoinType>(from: &signer, to: address, amount: u64)
     * ```
     */
    constructor(module_name: ModuleId, function_name: Identifier, type_args: Array<TypeTag>, args: Array<EntryFunctionArgument>);
    /**
     * A helper function to build a EntryFunction payload from raw primitive values
     *
     * @param module_id Fully qualified module name in format "AccountAddress::module_id" e.g. "0x1::coin"
     * @param function_name Function name
     * @param type_args Type arguments that move function requires.
     *
     * @example
     * A coin transfer function has one type argument "CoinType".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     * @param args Arguments to the move function.
     *
     * @example
     * A coin transfer function has three arguments "from", "to" and "amount".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     * @returns EntryFunction
     */
    static build(module_id: MoveModuleId, function_name: string, type_args: Array<TypeTag>, args: Array<EntryFunctionArgument>): EntryFunction;
    serialize(serializer: Serializer): void;
    /**
     * Deserializes an entry function payload with the arguments represented as EntryFunctionBytes instances.
     * @see EntryFunctionBytes
     *
     * NOTE: When you deserialize an EntryFunction payload with this method, the entry function
     * arguments are populated into the deserialized instance as type-agnostic, raw fixed bytes
     * in the form of the EntryFunctionBytes class.
     *
     * In order to correctly deserialize these arguments as their actual type representations, you
     * must know the types of the arguments beforehand and deserialize them yourself individually.
     *
     * One way you could achieve this is by using the ABIs for an entry function and deserializing each
     * argument as its given, corresponding type.
     *
     * @param deserializer
     * @returns A deserialized EntryFunction payload for a transaction.
     *
     */
    static deserialize(deserializer: Deserializer): EntryFunction;
}
/**
 * Representation of a Script that can serialized and deserialized
 */
declare class Script {
    /**
     * The move module bytecode
     */
    readonly bytecode: Uint8Array;
    /**
     * The type arguments that the bytecode function requires.
     */
    readonly type_args: Array<TypeTag>;
    /**
     * The arguments that the bytecode function requires.
     */
    readonly args: Array<ScriptFunctionArgument>;
    /**
     * Scripts contain the Move bytecodes payload that can be submitted to Aptos chain for execution.
     *
     * @param bytecode The move module bytecode
     * @param type_args The type arguments that the bytecode function requires.
     *
     * @example
     * A coin transfer function has one type argument "CoinType".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     * @param args The arguments that the bytecode function requires.
     *
     * @example
     * A coin transfer function has three arguments "from", "to" and "amount".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     */
    constructor(bytecode: Uint8Array, type_args: Array<TypeTag>, args: Array<ScriptFunctionArgument>);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Script;
}
/**
 * Representation of a MultiSig that can serialized and deserialized
 */
declare class MultiSig {
    readonly multisig_address: AccountAddress;
    readonly transaction_payload?: MultisigTransactionPayload;
    /**
     * Contains the payload to run a multi-sig account transaction.
     *
     * @param multisig_address The multi-sig account address the transaction will be executed as.
     *
     * @param transaction_payload The payload of the multi-sig transaction. This is optional when executing a multi-sig
     *  transaction whose payload is already stored on chain.
     */
    constructor(multisig_address: AccountAddress, transaction_payload?: MultisigTransactionPayload);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): MultiSig;
}
/**
 * Representation of a MultiSig Transaction Payload from `multisig_account.move`
 * that can be serialized and deserialized

 * This class exists right now to represent an extensible transaction payload class for
 * transactions used in `multisig_account.move`. Eventually, this class will be able to
 * support script payloads when the `multisig_account.move` module supports them.
 */
declare class MultisigTransactionPayload {
    readonly transaction_payload: EntryFunction;
    /**
     * Contains the payload to run a multi-sig account transaction.
     *
     * @param transaction_payload The payload of the multi-sig transaction.
     * This can only be EntryFunction for now but,
     * Script might be supported in the future.
     */
    constructor(transaction_payload: EntryFunction);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): MultisigTransactionPayload;
}

/**
 * Representation of a Raw Transaction that can serialized and deserialized
 */
declare class RawTransaction extends Serializable {
    readonly sender: AccountAddress;
    readonly sequence_number: bigint;
    readonly payload: TransactionPayload;
    readonly max_gas_amount: bigint;
    readonly gas_unit_price: bigint;
    readonly expiration_timestamp_secs: bigint;
    readonly chain_id: ChainId;
    /**
     * RawTransactions contain the metadata and payloads that can be submitted to Aptos chain for execution.
     * RawTransactions must be signed before Aptos chain can execute them.
     *
     * @param sender The sender Account Address
     * @param sequence_number Sequence number of this transaction. This must match the sequence number stored in
     *   the sender's account at the time the transaction executes.
     * @param payload Instructions for the Aptos Blockchain, including publishing a module,
     *   execute an entry function or execute a script payload.
     * @param max_gas_amount Maximum total gas to spend for this transaction. The account must have more
     *   than this gas or the transaction will be discarded during validation.
     * @param gas_unit_price Price to be paid per gas unit.
     * @param expiration_timestamp_secs The blockchain timestamp at which the blockchain would discard this transaction.
     * @param chain_id The chain ID of the blockchain that this transaction is intended to be run on.
     */
    constructor(sender: AccountAddress, sequence_number: bigint, payload: TransactionPayload, max_gas_amount: bigint, gas_unit_price: bigint, expiration_timestamp_secs: bigint, chain_id: ChainId);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): RawTransaction;
}
/**
 * Representation of a Raw Transaction With Data that can serialized and deserialized
 */
declare abstract class RawTransactionWithData extends Serializable {
    /**
     * Serialize a Raw Transaction With Data
     */
    abstract serialize(serializer: Serializer): void;
    /**
     * Deserialize a Raw Transaction With Data
     */
    static deserialize(deserializer: Deserializer): RawTransactionWithData;
}
/**
 * Representation of a Multi Agent Transaction that can serialized and deserialized
 */
declare class MultiAgentRawTransaction extends RawTransactionWithData {
    /**
     * The raw transaction
     */
    readonly raw_txn: RawTransaction;
    /**
     * The secondary signers on this transaction
     */
    readonly secondary_signer_addresses: Array<AccountAddress>;
    constructor(raw_txn: RawTransaction, secondary_signer_addresses: Array<AccountAddress>);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): MultiAgentRawTransaction;
}
/**
 * Representation of a Fee Payer Transaction that can serialized and deserialized
 */
declare class FeePayerRawTransaction extends RawTransactionWithData {
    /**
     * The raw transaction
     */
    readonly raw_txn: RawTransaction;
    /**
     * The secondary signers on this transaction - optional and can be empty
     */
    readonly secondary_signer_addresses: Array<AccountAddress>;
    /**
     * The fee payer account address
     */
    readonly fee_payer_address: AccountAddress;
    constructor(raw_txn: RawTransaction, secondary_signer_addresses: Array<AccountAddress>, fee_payer_address: AccountAddress);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): FeePayerRawTransaction;
}

declare abstract class AccountAuthenticator extends Serializable {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): AccountAuthenticator;
}
/**
 * Transaction authenticator Ed25519 for a multi signer transaction
 *
 * @param public_key Account's Ed25519 public key.
 * @param signature Account's Ed25519 signature
 *
 */
declare class AccountAuthenticatorEd25519 extends AccountAuthenticator {
    readonly public_key: Ed25519PublicKey;
    readonly signature: Ed25519Signature;
    constructor(public_key: Ed25519PublicKey, signature: Ed25519Signature);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): AccountAuthenticatorEd25519;
}
/**
 * Transaction authenticator Multi Ed25519 for a multi signers transaction
 *
 * @param public_key Account's MultiEd25519 public key.
 * @param signature Account's MultiEd25519 signature
 *
 */
declare class AccountAuthenticatorMultiEd25519 extends AccountAuthenticator {
    readonly public_key: MultiEd25519PublicKey;
    readonly signature: MultiEd25519Signature;
    constructor(public_key: MultiEd25519PublicKey, signature: MultiEd25519Signature);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): AccountAuthenticatorMultiEd25519;
}
/**
 * AccountAuthenticatorSingleKey for a single signer
 *
 * @param public_key AnyPublicKey
 * @param signature AnySignature
 *
 */
declare class AccountAuthenticatorSingleKey extends AccountAuthenticator {
    readonly public_key: AnyPublicKey;
    readonly signature: AnySignature;
    constructor(public_key: AnyPublicKey, signature: AnySignature);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): AccountAuthenticatorSingleKey;
}
/**
 * AccountAuthenticatorMultiKey for a multi signer
 *
 * @param public_keys MultiKey
 * @param signatures Signature
 *
 */
declare class AccountAuthenticatorMultiKey extends AccountAuthenticator {
    readonly public_keys: MultiKey;
    readonly signatures: Array<AnySignature>;
    readonly signatures_bitmap: Uint8Array;
    constructor(public_keys: MultiKey, signatures: Array<AnySignature>, signatures_bitmap: Uint8Array);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): AccountAuthenticatorMultiKey;
}

declare abstract class TransactionAuthenticator extends Serializable {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): TransactionAuthenticator;
}
/**
 * Transaction authenticator Ed25519 for a single signer transaction
 *
 * @param public_key Client's public key.
 * @param signature Ed25519 signature of a raw transaction.
 * @see {@link https://aptos.dev/integration/creating-a-signed-transaction | Creating a Signed Transaction}
 * for details about generating a signature.
 */
declare class TransactionAuthenticatorEd25519 extends TransactionAuthenticator {
    readonly public_key: Ed25519PublicKey;
    readonly signature: Ed25519Signature;
    constructor(public_key: Ed25519PublicKey, signature: Ed25519Signature);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionAuthenticatorEd25519;
}
/**
 * Transaction authenticator Ed25519 for a multi signers transaction
 *
 * @param public_key Client's public key.
 * @param signature Multi Ed25519 signature of a raw transaction.
 *
 */
declare class TransactionAuthenticatorMultiEd25519 extends TransactionAuthenticator {
    readonly public_key: MultiEd25519PublicKey;
    readonly signature: MultiEd25519Signature;
    constructor(public_key: MultiEd25519PublicKey, signature: MultiEd25519Signature);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionAuthenticatorMultiEd25519;
}
/**
 * Transaction authenticator for a multi-agent transaction
 *
 * @param sender Sender account authenticator
 * @param secondary_signer_addresses Secondary signers address
 * @param secondary_signers Secondary signers account authenticators
 *
 */
declare class TransactionAuthenticatorMultiAgent extends TransactionAuthenticator {
    readonly sender: AccountAuthenticator;
    readonly secondary_signer_addresses: Array<AccountAddress>;
    readonly secondary_signers: Array<AccountAuthenticator>;
    constructor(sender: AccountAuthenticator, secondary_signer_addresses: Array<AccountAddress>, secondary_signers: Array<AccountAuthenticator>);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionAuthenticatorMultiAgent;
}
/**
 * Transaction authenticator for a fee payer transaction
 *
 * @param sender Sender account authenticator
 * @param secondary_signer_addresses Secondary signers address
 * @param secondary_signers Secondary signers account authenticators
 * @param fee_payer Object of the fee payer account address and the fee payer authentication
 *
 */
declare class TransactionAuthenticatorFeePayer extends TransactionAuthenticator {
    readonly sender: AccountAuthenticator;
    readonly secondary_signer_addresses: Array<AccountAddress>;
    readonly secondary_signers: Array<AccountAuthenticator>;
    readonly fee_payer: {
        address: AccountAddress;
        authenticator: AccountAuthenticator;
    };
    constructor(sender: AccountAuthenticator, secondary_signer_addresses: Array<AccountAddress>, secondary_signers: Array<AccountAuthenticator>, fee_payer: {
        address: AccountAddress;
        authenticator: AccountAuthenticator;
    });
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionAuthenticatorMultiAgent;
}
/**
 * Single Sender authenticator for a single signer transaction
 *
 * @param sender AccountAuthenticator
 */
declare class TransactionAuthenticatorSingleSender extends TransactionAuthenticator {
    readonly sender: AccountAuthenticator;
    constructor(sender: AccountAuthenticator);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionAuthenticatorSingleSender;
}

declare class SignedTransaction extends Serializable {
    readonly raw_txn: RawTransaction;
    readonly authenticator: TransactionAuthenticator;
    /**
     * A SignedTransaction consists of a raw transaction and an authenticator. The authenticator
     * contains a client's public key and the signature of the raw transaction.
     *
     * @see {@link https://aptos.dev/integration/creating-a-signed-transaction | Creating a Signed Transaction}
     *
     * @param raw_txn
     * @param authenticator Contains a client's public key and the signature of the raw transaction.
     * Authenticator has 3 flavors: single signature, multi-signature and multi-agent.
     * @see {@link https://github.com/aptos-labs/aptos-core/blob/main/types/src/transaction/authenticator.rs} for details.
     */
    constructor(raw_txn: RawTransaction, authenticator: TransactionAuthenticator);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): SignedTransaction;
}

/**
 * Entry function arguments to be used when building a raw transaction using remote ABI
 */
declare type SimpleEntryFunctionArgumentTypes = boolean | number | bigint | string | null | undefined | Uint8Array | Array<SimpleEntryFunctionArgumentTypes>;
/**
 * Entry function arguments to be used when building a raw transaction using BCS serialized arguments
 */
declare type EntryFunctionArgumentTypes = Bool | U8 | U16 | U32 | U64 | U128 | U256 | AccountAddress | MoveVector<EntryFunctionArgumentTypes> | MoveOption<EntryFunctionArgumentTypes> | MoveString | FixedBytes;
/**
 * Script function arguments to be used when building a raw transaction using BCS serialized arguments
 */
declare type ScriptFunctionArgumentTypes = Bool | U8 | U16 | U32 | U64 | U128 | U256 | AccountAddress | MoveVector<U8> | MoveString | FixedBytes;
/**
 * Type that holds all raw transaction instances Aptos SDK supports
 */
declare type AnyRawTransactionInstance = RawTransaction | MultiAgentRawTransaction | FeePayerRawTransaction;
/**
 * Optional options to set when generating a transaction
 */
declare type InputGenerateTransactionOptions = {
    maxGasAmount?: AnyNumber;
    gasUnitPrice?: AnyNumber;
    expireTimestamp?: AnyNumber;
    accountSequenceNumber?: AnyNumber;
};
/**
 * The generated transaction payload type that was produces from `generateTransactionPayload()` function.
 */
declare type AnyTransactionPayloadInstance = TransactionPayloadEntryFunction | TransactionPayloadScript | TransactionPayloadMultisig;
/**
 * Unified type for the data needed to generate a transaction payload of types:
 * Entry Function | Script | Multi Sig
 */
declare type InputGenerateTransactionPayloadData = InputEntryFunctionData | InputScriptData | InputMultiSigData;
declare type InputGenerateTransactionPayloadDataWithRemoteABI = (InputScriptData & {
    aptosConfig?: undefined;
}) | InputEntryFunctionDataWithRemoteABI | InputMultiSigDataWithRemoteABI;
/**
 * The data needed to generate an Entry Function payload
 */
declare type InputEntryFunctionData = {
    function: MoveStructType;
    typeArguments?: Array<TypeTag>;
    functionArguments: Array<EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes>;
};
declare type InputEntryFunctionDataWithRemoteABI = InputEntryFunctionData & {
    aptosConfig: AptosConfig;
};
/**
 * The data needed to generate a Multi Sig payload
 */
declare type InputMultiSigData = {
    multisigAddress: AccountAddress;
} & InputEntryFunctionData;
/**
 * The data needed to generate a Multi Sig payload
 */
declare type InputMultiSigDataWithRemoteABI = {
    multisigAddress: AccountAddress | string;
} & InputEntryFunctionDataWithRemoteABI;
/**
 * The data needed to generate a Script payload
 */
declare type InputScriptData = {
    bytecode: HexInput;
    typeArguments?: Array<TypeTag>;
    functionArguments: Array<ScriptFunctionArgumentTypes>;
};
/**
 * Interface of an Entry function's ABI.
 *
 * This is used to provide type checking and simple input conversion on ABI based transaction submission.
 */
declare type EntryFunctionABI = {
    typeParameters: Array<MoveFunctionGenericTypeParam>;
    parameters: Array<TypeTag>;
};
/**
 * Interface of the arguments to generate a single signer transaction.
 * Used to provide to `generateTransaction()` method in the transaction builder flow
 */
interface InputGenerateSingleSignerRawTransactionArgs {
    aptosConfig: AptosConfig;
    sender: HexInput;
    payload: AnyTransactionPayloadInstance;
    feePayerAddress?: undefined;
    secondarySignerAddresses?: undefined;
    options?: InputGenerateTransactionOptions;
}
/**
 * Interface of the arguments to generate a fee payer transaction.
 * Used to provide to `generateTransaction()` method in the transaction builder flow
 */
interface InputGenerateFeePayerRawTransactionArgs {
    aptosConfig: AptosConfig;
    sender: HexInput;
    payload: AnyTransactionPayloadInstance;
    feePayerAddress: HexInput;
    secondarySignerAddresses?: HexInput[];
    options?: InputGenerateTransactionOptions;
}
/**
 * Interface of the arguments to generate a multi-agent transaction.
 * Used to provide to `generateTransaction()` method in the transaction builder flow
 */
interface InputGenerateMultiAgentRawTransactionArgs {
    aptosConfig: AptosConfig;
    sender: HexInput;
    payload: AnyTransactionPayloadInstance;
    secondarySignerAddresses: HexInput[];
    feePayerAddress?: undefined;
    options?: InputGenerateTransactionOptions;
}
/**
 * Unified type that holds all the interfaces to generate different transaction types
 */
declare type InputGenerateRawTransactionArgs = InputGenerateSingleSignerRawTransactionArgs | InputGenerateFeePayerRawTransactionArgs | InputGenerateMultiAgentRawTransactionArgs;
/**
 * Interface that holds the return data when generating a single signer transaction
 *
 * @param rawTransaction a bcs serialized raw transaction
 */
interface InputSingleSignerTransaction {
    rawTransaction: Uint8Array;
    feePayerAddress?: undefined;
    secondarySignerAddresses?: undefined;
}
/**
 * Interface that holds the return data when generating a fee payer transaction
 *
 * @param rawTransaction a bcs serialized raw transaction
 * @param secondarySignerAddresses optional. secondary signer addresses for multi-agent transaction
 * @param feePayerAddress fee payer address for a fee payer transaction (aka Sponsored Transaction)
 */
interface InputFeePayerTransaction {
    rawTransaction: Uint8Array;
    feePayerAddress: AccountAddress;
    secondarySignerAddresses?: AccountAddress[];
}
/**
 * Interface that holds the return data when generating a multi-agent transaction.
 *
 * @param rawTransaction a bcs serialized raw transaction
 * @param secondarySignerAddresses secondary signer addresses for multi-agent transaction
 */
interface InputMultiAgentTransaction {
    rawTransaction: Uint8Array;
    secondarySignerAddresses: AccountAddress[];
    feePayerAddress?: undefined;
}
/**
 * Unified type that holds all the return interfaces when generating different transaction types
 */
declare type AnyRawTransaction = InputSingleSignerTransaction | InputFeePayerTransaction | InputMultiAgentTransaction;
declare type InputSimulateTransactionData = {
    /**
     * The transaction to simulate, probably generated by `generateTransaction()`
     */
    transaction: AnyRawTransaction;
    /**
     * For a single signer transaction
     */
    signerPublicKey: PublicKey;
    /**
     * For a fee payer or multi-agent transaction that requires additional signers in
     */
    secondarySignersPublicKeys?: Array<PublicKey>;
    /**
     * For a fee payer transaction (aka Sponsored Transaction)
     */
    feePayerPublicKey?: PublicKey;
    options?: InputSimulateTransactionOptions;
};
declare type InputSimulateTransactionOptions = {
    estimateGasUnitPrice?: boolean;
    estimateMaxGasAmount?: boolean;
    estimatePrioritizedGasUnitPrice?: boolean;
};
/**
 * Interface that holds the user data input when generating a single signer transaction
 */
interface InputGenerateSingleSignerRawTransactionData {
    sender: HexInput;
    feePayerAddress?: undefined;
    secondarySignerAddresses?: undefined;
    options?: InputGenerateTransactionOptions;
    data: InputGenerateTransactionPayloadData;
}
/**
 * Interface that holds the user data input when generating a fee payer transaction
 */
interface InputGenerateFeePayerRawTransactionData {
    sender: HexInput;
    feePayerAddress: HexInput;
    secondarySignerAddresses?: HexInput[];
    options?: InputGenerateTransactionOptions;
    data: InputGenerateTransactionPayloadData;
}
/**
 * Interface that holds the user data input when generating a multi-agent transaction
 */
interface InputGenerateMultiAgentRawTransactionData {
    sender: HexInput;
    secondarySignerAddresses: HexInput[];
    feePayerAddress?: undefined;
    options?: InputGenerateTransactionOptions;
    data: InputGenerateTransactionPayloadData;
}
/**
 * Unified type that holds all the user data input interfaces when generating different transaction types
 */
declare type InputGenerateTransactionData = InputGenerateMultiAgentRawTransactionData | InputGenerateFeePayerRawTransactionData | InputGenerateSingleSignerRawTransactionData;

/**
 * A class to handle all `Coin` operations
 */
declare class Coin {
    readonly config: AptosConfig;
    constructor(config: AptosConfig);
    /**
     * Generate a transfer coin transaction that can be simulated and/or signed and submitted
     *
     * @param args.sender The sender account
     * @param args.recipient The recipient address
     * @param args.amount The amount to transfer
     * @param args.coinType optional. The coin struct type to transfer. Defaults to 0x1::aptos_coin::AptosCoin
     *
     * @returns SingleSignerTransaction
     */
    transferCoinTransaction(args: {
        sender: Account$1;
        recipient: HexInput;
        amount: AnyNumber;
        coinType?: MoveStructType;
        options?: InputGenerateTransactionOptions;
    }): Promise<InputSingleSignerTransaction>;
}

/**
 * This file contains the underlying implementations for exposed API surface in
 * the {@link api/digitalAsset}. By moving the methods out into a separate file,
 * other namespaces and processes can access these methods without depending on the entire
 * digitalAsset namespace and without having a dependency cycle error.
 */

interface CreateCollectionOptions {
    maxSupply?: AnyNumber;
    mutableDescription?: boolean;
    mutableRoyalty?: boolean;
    mutableURI?: boolean;
    mutableTokenDescription?: boolean;
    mutableTokenName?: boolean;
    mutableTokenProperties?: boolean;
    mutableTokenURI?: boolean;
    tokensBurnableByCreator?: boolean;
    tokensFreezableByCreator?: boolean;
    royaltyNumerator?: number;
    royaltyDenominator?: number;
}

/**
 * A class to query all `DigitalAsset` related queries on Aptos.
 */
declare class DigitalAsset {
    readonly config: AptosConfig;
    constructor(config: AptosConfig);
    /**
     * Creates a new collection within the specified account
     *
     * @param args.creator the account of the collection's creator
     * @param args.description the description of the collection
     * @param args.name the name of the collection
     * @param args.uri the URI to additional info about the collection
     *
     * The parameters below are optional.
     * @param args.maxSupply controls the max supply of the tokens - defaults MAX_U64_BIG_INT
     * @param args.mutableDescription controls mutability of the collection's description - defaults true
     * @param args.mutableRoyalty controls mutability of the collection's description - defaults true
     * @param args.mutableUri controls mutability of the collection's URI - defaults true
     * @param args.mutableTokenDescription controls mutability of the token's description - defaults true
     * @param args.mutableTokenName controls mutability of the token's name - defaults true
     * @param args.mutableTokenProperties controls mutability of token's properties - defaults true
     * @param args.mutableTokenUri controls mutability of the token's URI - defaults true
     * @param args.tokensBurnableByCreator controls whether tokens can be burnable by the creator - defaults true
     * @param args.tokensFreezableByCreator controls whether tokens can be frozen by the creator - defaults true
     * @param args.royaltyNumerator the numerator of the royalty to be paid to the creator when a token is transferred - defaults 0
     * @param args.royaltyDenominator the denominator of the royalty to be paid to the creator when a token is transferred -
     *    defaults 1
     *
     * @returns A SingleSignerTransaction that when submitted will create the collection.
     */
    createCollectionTransaction(args: {
        creator: Account$1;
        description: string;
        name: string;
        uri: string;
        options?: InputGenerateTransactionOptions;
    } & CreateCollectionOptions): Promise<InputSingleSignerTransaction>;
    /**
     * Queries data of a specific collection by the collection creator address and the collection name.
     *
     * If, for some reason, a creator account has 2 collections with the same name in v1 and v2,
     * can pass an optional `tokenStandard` parameter to query a specific standard
     *
     * @param args.creatorAddress the address of the collection's creator
     * @param args.collectionName the name of the collection
     * @param args.options.tokenStandard the token standard to query
     * @returns GetCollectionDataResponse response type
     */
    getCollectionData(args: {
        creatorAddress: HexInput;
        collectionName: string;
        options?: {
            tokenStandard?: TokenStandard;
        };
    }): Promise<GetCollectionDataResponse>;
    /**
     * Queries a collection's ID.
     *
     * This is the same as the collection's object address in V2, but V1 does
     * not use objects, and does not have an address
     *
     * @param args.creatorAddress the address of the collection's creator
     * @param args.collectionName the name of the collection
     * @param args.options.tokenStandard the token standard to query
     * @returns the collection id
     */
    getCollectionId(args: {
        creatorAddress: HexInput;
        collectionName: string;
        options?: {
            tokenStandard?: TokenStandard;
        };
    }): Promise<string>;
    /**
     * Create a transaction to mint a token into the creators account within an existing collection.
     *
     * @param args.creator the creator of the collection
     * @param args.collection the name of the collection the token belongs to
     * @param args.description the description of the token
     * @param args.name the name of the token
     * @param args.uri the URI to additional info about the token
     *
     * @returns A SingleSignerTransaction that can be simulated or submitted to chain
     */
    mintTokenTransaction(args: {
        creator: Account$1;
        collection: string;
        description: string;
        name: string;
        uri: string;
        options?: InputGenerateTransactionOptions;
    }): Promise<InputSingleSignerTransaction>;
    /**
     * Gets token data given the address of a token.
     *
     * @param args.tokenAddress The address of the token
     * @returns GetTokenDataResponse containing relevant data to the token.
     */
    getTokenData(args: {
        tokenAddress: HexInput;
    }): Promise<GetTokenDataResponse>;
    /**
     * Gets token ownership data given the address of a token.
     *
     * @param args.tokenAddress The address of the token
     * @returns GetCurrentTokenOwnershipResponse containing relevant ownership data of the token.
     */
    getCurrentTokenOwnership(args: {
        tokenAddress: HexInput;
    }): Promise<GetCurrentTokenOwnershipResponse>;
    /**
     * Gets the tokens that the given address owns.
     *
     * @param args.ownerAddress The address of the owner
     * @returns GetOwnedTokensResponse containing ownership data of the tokens belonging to the ownerAddresss.
     */
    getOwnedTokens(args: {
        ownerAddress: HexInput;
        options?: {
            pagination?: PaginationArgs;
            orderBy?: OrderBy<GetOwnedTokensResponse[0]>;
        };
    }): Promise<GetOwnedTokensResponse>;
    /**
     * Gets the activity data given the address of a token.
     *
     * @param args.tokenAddress The address of the token
     * @returns GetTokenActivityResponse containing relevant activity data to the token.
     */
    getTokenActivity(args: {
        tokenAddress: HexInput;
        options?: {
            pagination?: PaginationArgs;
            orderBy?: OrderBy<GetTokenActivityResponse[0]>;
        };
    }): Promise<GetTokenActivityResponse>;
}

/**
 * A class to query all `Event` Aptos related queries
 */
declare class Event {
    readonly config: AptosConfig;
    constructor(config: AptosConfig);
    /**
     * Get events by creation number and an account address
     *
     * @param args.accountAddress - The account address
     * @param args.creationNumber - The event creation number
     *
     * @returns Promise<GetEventsResponse>
     */
    getAccountEventsByCreationNumber(args: {
        accountAddress: HexInput;
        creationNumber: AnyNumber;
    }): Promise<GetEventsResponse>;
    /**
     * Get events by event type and an account address
     *
     * @param args.accountAddress - The account address
     * @param args.eventType - The event type
     *
     * @returns Promise<GetEventsResponse>
     */
    getAccountEventsByEventType(args: {
        accountAddress: HexInput;
        eventType: MoveStructType;
        options?: {
            pagination?: PaginationArgs;
            orderBy?: OrderBy<GetEventsResponse[0]>;
        };
    }): Promise<GetEventsResponse>;
    /**
     * Get all events
     *
     * An optional `where` can be passed in to filter out the response.
     *
     * @example
     * ```
     * { where:
     *  {
     *   transaction_version: { _eq: 123456 },
     *  }
     * }
     * ```
     *
     * @returns GetEventsQuery response type
     */
    getEvents(args?: {
        options?: {
            where?: EventsBoolExp;
            pagination?: PaginationArgs;
            orderBy?: OrderBy<GetEventsResponse[0]>;
        };
    }): Promise<GetEventsResponse>;
}

/**
 * A class to query all `Faucet` related queries on Aptos.
 */
declare class Faucet {
    readonly config: AptosConfig;
    constructor(config: AptosConfig);
    /**
     * This creates an account if it does not exist and mints the specified amount of
     * coins into that account
     *
     * @param args.accountAddress Address of the account to fund
     * @param args.amount Amount of tokens to fund the account with
     * @param args.options Configuration options for waitForTransaction
     * @returns Transaction hash of the transaction that funded the account
     */
    fundAccount(args: {
        accountAddress: HexInput;
        amount: number;
        options?: WaitForTransactionOptions;
    }): Promise<string>;
}

/**
 * A class to query all `FungibleAsset` related queries on Aptos.
 */
declare class FungibleAsset {
    readonly config: AptosConfig;
    constructor(config: AptosConfig);
    /**
     * Queries the current fungible asset metadata.
     *
     * This query returns the fungible asset metadata for all fungible assets.
     * It can be filtered by creator address and asset type.
     *
     * @returns getFungibleAssetMetadata A list of fungible asset metadata
     */
    getFungibleAssetMetadata(args?: {
        options?: {
            pagination?: PaginationArgs;
            where?: FungibleAssetMetadataBoolExp;
        };
    }): Promise<GetFungibleAssetMetadataResponse>;
    /**
     * Queries the current specific fungible asset metadata
     *
     * This query returns the fungible asset metadata for a specific fungible asset.
     *
     * @param assetType The asset type of the fungible asset.
     * e.g
     * "0x1::aptos_coin::AptosCoin" for Aptos Coin
     * "0xc2948283c2ce03aafbb294821de7ee684b06116bb378ab614fa2de07a99355a8" - address format if this is fungible asset
     *
     * @returns getFungibleAssetMetadata A fungible asset metadata item
     */
    getFungibleAssetMetadataByAssetType(assetType: string): Promise<GetFungibleAssetMetadataResponse[0]>;
    /**
     * Queries the fungible asset activities
     *
     * This query returns the fungible asset activities.
     * It can be filtered by owner address, asset type, and type.
     *
     * @returns GetFungibleAssetActivitiesResponse A list of fungible asset metadata
     */
    getFungibleAssetActivities(args?: {
        options?: {
            pagination?: PaginationArgs;
            where?: FungibleAssetActivitiesBoolExp;
        };
    }): Promise<GetFungibleAssetActivitiesResponse>;
    /**
     * Queries the fungible asset balance
     *
     * This query returns the fungible asset balance.
     * It can be filtered by owner address, and asset type
     *
     * @returns GetCurrentFungibleAssetBalancesResponse A list of fungible asset metadata
     */
    getCurrentFungibleAssetBalances(args?: {
        options?: {
            pagination?: PaginationArgs;
            where?: CurrentFungibleAssetBalancesBoolExp;
        };
    }): Promise<GetCurrentFungibleAssetBalancesResponse>;
}

/**
 * A class to query all `General` Aptos related queries
 */
declare class General {
    readonly config: AptosConfig;
    constructor(config: AptosConfig);
    /**
     * Queries for the Aptos ledger info
     *
     * @returns Aptos Ledger Info
     *
     * @example An example of the returned data
     * ```
     * {
     * "chain_id": 4,
     * "epoch": "8",
     * "ledger_version": "714",
     * "oldest_ledger_version": "0",
     * "ledger_timestamp": "1694695496521775",
     * "node_role": "validator",
     * "oldest_block_height": "0",
     * "block_height": "359",
     * "git_hash": "c82193f36f4e185fed9f68c4ad21f6c6dd390c6e"
     * }
     * ```
     */
    getLedgerInfo(): Promise<LedgerInfo>;
    /**
     * Queries for the chain id
     *
     * @returns The chain id
     */
    getChainId(): Promise<number>;
    /**
     * Queries for block by transaction version
     *
     * @param args.ledgerVersion Ledger version to lookup block information for
     * @param args.options.withTransactions If set to true, include all transactions in the block
     *
     * @returns Block information with optional transactions
     */
    getBlockByVersion(args: {
        ledgerVersion: AnyNumber;
        options?: {
            withTransactions?: boolean;
        };
    }): Promise<Block>;
    /**
     * Get block by block height
     *
     * @param args.blockHeight Block height to lookup.  Starts at 0
     * @param args.options.withTransactions If set to true, include all transactions in the block
     *
     * @returns Block with optional transactions
     */
    getBlockByHeight(args: {
        blockHeight: AnyNumber;
        options?: {
            withTransactions?: boolean;
        };
    }): Promise<Block>;
    /**
     * Queries for a table item for a table identified by the handle and the key for the item.
     * Key and value types need to be passed in to help with key serialization and value deserialization.
     * @param args.handle A pointer to where that table is stored
     * @param args.data Object that describes table item
     * @param args.options.ledgerVersion The ledger version to query, if not provided it will get the latest version
     *
     * @example https://fullnode.devnet.aptoslabs.com/v1/accounts/0x1/resource/0x1::coin::CoinInfo%3C0x1::aptos_coin::AptosCoin%3E
     * {
     *  data.key_type = "address" // Move type of table key
     *  data.value_type = "u128" // Move type of table value
     *  data.key = "0x619dc29a0aac8fa146714058e8dd6d2d0f3bdf5f6331907bf91f3acd81e6935" // Value of table key
     * }
     *
     * @returns Table item value rendered in JSON
     */
    getTableItem(args: {
        handle: string;
        data: TableItemRequest;
        options?: LedgerVersion;
    }): Promise<any>;
    /**
     * Queries for a Move view function
     * @param args.payload Payload for the view function
     * @param args.options.ledgerVersion The ledger version to query, if not provided it will get the latest version
     * @example
     * `
     * const payload: ViewRequest = {
     *  function: "0x1::coin::balance",
     *  typeArguments: ["0x1::aptos_coin::AptosCoin"],
     *  functionArguments: [accountAddress],
     * };
     * `
     *
     * @returns an array of Move values
     */
    view(args: {
        payload: ViewRequestData;
        options?: LedgerVersion;
    }): Promise<Array<MoveValue>>;
    /**
     * Queries top user transactions
     *
     * @param args.limit The number of transactions to return
     * @returns GetChainTopUserTransactionsResponse
     */
    getChainTopUserTransactions(args: {
        limit: number;
    }): Promise<GetChainTopUserTransactionsResponse>;
    /**
     * A generic function for retrieving data from Aptos Indexer.
     * For more detailed queries specification see
     * {@link https://cloud.hasura.io/public/graphiql?endpoint=https://indexer.mainnet.aptoslabs.com/v1/graphql}
     *
     * @param args.query.query A GraphQL query
     * @param args.query.variables The variables for the query
     * @example
     * ```
     * {
     *  query: `query MyQuery {
          ledger_infos {
            chain_id
          }
        }`;
     * }
     * ```
     *
     * @return The provided T type
     */
    queryIndexer<T>(args: {
        query: GraphqlQuery;
    }): Promise<T>;
    /**
     * Queries for the last successful indexer version
     *
     * This is useful to tell what ledger version the indexer is updated to, as it can be behind the full nodes.
     */
    getIndexerLastSuccessVersion(): Promise<number>;
}

/**
 * A class to query all `Staking` related queries on Aptos.
 */
declare class Staking {
    readonly config: AptosConfig;
    constructor(config: AptosConfig);
    /**
     * Queries current number of delegators in a pool.  Throws an error if the pool is not found.
     *
     * @param args.poolAddress Pool address
     * @returns The number of delegators for the given pool
     */
    getNumberOfDelegators(args: {
        poolAddress: HexInput;
    }): Promise<number>;
    /**
     * Queries current number of delegators in a pool.  Throws an error if the pool is not found.
     *
     * @returns GetNumberOfDelegatorsForAllPoolsResponse response type
     */
    getNumberOfDelegatorsForAllPools(args?: {
        options?: {
            orderBy?: OrderBy<GetNumberOfDelegatorsResponse[0]>;
        };
    }): Promise<GetNumberOfDelegatorsResponse>;
    /**
     * Queries delegated staking activities
     *
     * @param args.delegatorAddress Delegator address
     * @param args.poolAddress Pool address
     * @returns GetDelegatedStakingActivitiesResponse response type
     */
    getDelegatedStakingActivities(args: {
        delegatorAddress: HexInput;
        poolAddress: HexInput;
    }): Promise<GetDelegatedStakingActivitiesResponse>;
}

declare class Transaction {
    readonly config: AptosConfig;
    constructor(config: AptosConfig);
    /**
     * Queries on-chain transactions. This function will not return pending
     * transactions. For that, use `getTransactionsByHash`.
     *
     * @param args.options.offset The number transaction to start with
     * @param args.options.limit Number of results to return
     *
     * @returns Array of on-chain transactions
     */
    getTransactions(args?: {
        options?: PaginationArgs;
    }): Promise<TransactionResponse[]>;
    /**
     * Queries on-chain transaction by version. This function will not return pending transactions.
     *
     * @param args.ledgerVersion - Transaction version is an unsigned 64-bit number.
     * @returns On-chain transaction. Only on-chain transactions have versions, so this
     * function cannot be used to query pending transactions.
     */
    getTransactionByVersion(args: {
        ledgerVersion: AnyNumber;
    }): Promise<TransactionResponse>;
    /**
     * Queries on-chain transaction by transaction hash. This function will return pending transactions.
     * @param args.transactionHash - Transaction hash should be hex-encoded bytes string with 0x prefix.
     * @returns Transaction from mempool (pending) or on-chain (committed) transaction
     */
    getTransactionByHash(args: {
        transactionHash: HexInput;
    }): Promise<TransactionResponse>;
    /**
     * Defines if specified transaction is currently in pending state
     *
     * To create a transaction hash:
     *
     * 1. Create a hash message from the bytes: "Aptos::Transaction" bytes + the BCS-serialized Transaction bytes.
     * 2. Apply hash algorithm SHA3-256 to the hash message bytes.
     * 3. Hex-encode the hash bytes with 0x prefix.
     *
     * @param args.transactionHash A hash of transaction
     * @returns `true` if transaction is in pending state and `false` otherwise
     */
    isPendingTransaction(args: {
        transactionHash: HexInput;
    }): Promise<boolean>;
    /**
     * Waits for a transaction to move past the pending state.
     *
     * There are 4 cases.
     * 1. Transaction is successfully processed and committed to the chain.
     *    - The function will resolve with the transaction response from the API.
     * 2. Transaction is rejected for some reason, and is therefore not committed to the blockchain.
     *    - The function will throw an AptosApiError with an HTTP status code indicating some problem with the request.
     * 3. Transaction is committed but execution failed, meaning no changes were
     *    written to the blockchain state.
     *    - If `checkSuccess` is true, the function will throw a FailedTransactionError
     *      If `checkSuccess` is false, the function will resolve with the transaction response where the `success` field is false.
     * 4. Transaction does not move past the pending state within `args.options.timeoutSecs` seconds.
     *    - The function will throw a WaitForTransactionError
     *
     *
     * @param args.transactionHash The hash of a transaction previously submitted to the blockchain.
     * @param args.options.timeoutSecs Timeout in seconds. Defaults to 20 seconds.
     * @param args.options.checkSuccess A boolean which controls whether the function will error if the transaction failed.
     *   Defaults to true.  See case 3 above.
     * @returns The transaction on-chain.  See above for more details.
     */
    waitForTransaction(args: {
        transactionHash: HexInput;
        options?: WaitForTransactionOptions;
    }): Promise<TransactionResponse>;
    /**
     * Gives an estimate of the gas unit price required to get a
     * transaction on chain in a reasonable amount of time.
     * For more information {@link https://fullnode.mainnet.aptoslabs.com/v1/spec#/operations/estimate_gas_price}
     *
     * @returns Object holding the outputs of the estimate gas API
     * @example
     * ```
     * {
     *  gas_estimate: number;
     *  deprioritized_gas_estimate?: number;
     *  prioritized_gas_estimate?: number;
     * }
     * ```
     */
    getGasPriceEstimation(): Promise<GasEstimation>;
}

declare class TransactionSubmission {
    readonly config: AptosConfig;
    constructor(config: AptosConfig);
    /**
     * We are defining function signatures, each with its specific input and output.
     * These are the possible function signature for `generateTransaction` function.
     * When we call `generateTransaction` function with the relevant type properties,
     * Typescript can infer the return type based on the appropriate function overload.
     */
    generateTransaction(args: InputGenerateSingleSignerRawTransactionData): Promise<InputSingleSignerTransaction>;
    generateTransaction(args: InputGenerateFeePayerRawTransactionData): Promise<InputFeePayerTransaction>;
    generateTransaction(args: InputGenerateMultiAgentRawTransactionData): Promise<InputMultiAgentTransaction>;
    generateTransaction(args: InputGenerateTransactionData): Promise<AnyRawTransaction>;
    /**
     * Sign a transaction that can later be submitted to chain
     *
     * @param args.signer The signer account to sign the transaction
     * @param args.transaction A raw transaction type (note that it holds the raw transaction as a bcs serialized data)
     * ```
     * {
     *  rawTransaction: Uint8Array,
     *  secondarySignerAddresses? : Array<AccountAddress>,
     *  feePayerAddress?: AccountAddress
     * }
     * ```
     *
     * @return The signer AccountAuthenticator
     */
    signTransaction(args: {
        signer: Account$1;
        transaction: AnyRawTransaction;
    }): AccountAuthenticator;
    /**
     * Simulates a transaction before singing it.
     *
     * @param args.signerPublicKey The signer public key
     * @param args.transaction The raw transaction to simulate
     * @param args.secondarySignersPublicKeys optional. For when the transaction is a multi signers transaction
     * @param args.feePayerPublicKey optional. For when the transaction is a fee payer (aka sponsored) transaction
     * @param args.options optional. A config to simulate the transaction with
     */
    simulateTransaction(args: InputSimulateTransactionData): Promise<Array<UserTransactionResponse>>;
    /**
     * Submit transaction to chain
     *
     * @param args.transaction A aptos transaction type
     * @param args.senderAuthenticator The account authenticator of the transaction sender
     * @param args.secondarySignerAuthenticators optional. For when the transaction is a multi signers transaction
     *
     * @return PendingTransactionResponse
     */
    submitTransaction(args: {
        transaction: AnyRawTransaction;
        senderAuthenticator: AccountAuthenticator;
        secondarySignerAuthenticators?: {
            feePayerAuthenticator?: AccountAuthenticator;
            additionalSignersAuthenticators?: Array<AccountAuthenticator>;
        };
    }): Promise<PendingTransactionResponse>;
    /**
     * Sign and submit a single signer transaction to chain
     *
     * @param args.signer The signer account to sign the transaction
     * @param args.transaction A raw transaction type (note that it holds the raw transaction as a bcs serialized data)
     * ```
     * {
     *  rawTransaction: Uint8Array,
     *  secondarySignerAddresses? : Array<AccountAddress>,
     *  feePayerAddress?: AccountAddress
     * }
     * ```
     *
     * @return PendingTransactionResponse
     */
    signAndSubmitTransaction(args: {
        signer: Account$1;
        transaction: AnyRawTransaction;
    }): Promise<PendingTransactionResponse>;
    /**
     * Generates a transaction to publish a move package to chain.
     *
     * To get the `metadataBytes` and `byteCode`, can compile using Aptos CLI with command
     * `aptos move compile --save-metadata ...`,
     * For more info {@link https://aptos.dev/tutorials/your-first-dapp/#step-4-publish-a-move-module}
     *
     * @param args.account The publisher account
     * @param args.metadataBytes The package metadata bytes
     * @param args.moduleBytecode An array of the bytecode of each module in the package in compiler output order
     *
     * @returns A SingleSignerTransaction that can be simulated or submitted to chain
     */
    publishPackageTransaction(args: {
        account: HexInput;
        metadataBytes: HexInput;
        moduleBytecode: Array<HexInput>;
        options?: InputGenerateTransactionOptions;
    }): Promise<InputSingleSignerTransaction>;
}

/**
 * This class is the main entry point into Aptos's
 * APIs and separates functionality into different namespaces.
 *
 * To use the SDK, create a new Aptos instance to get access
 * to all the sdk functionality.
 */
declare class Aptos {
    readonly config: AptosConfig;
    readonly account: Account;
    readonly coin: Coin;
    readonly digitalAsset: DigitalAsset;
    readonly event: Event;
    readonly faucet: Faucet;
    readonly fungibleAsset: FungibleAsset;
    readonly general: General;
    readonly staking: Staking;
    readonly transaction: Transaction;
    readonly transactionSubmission: TransactionSubmission;
    constructor(settings?: AptosConfig);
}
interface Aptos extends Account, Coin, DigitalAsset, Event, Faucet, FungibleAsset, General, Staking, Transaction, TransactionSubmission {
}

/**
 * The API response type
 *
 * @param status - the response status. i.e. 200
 * @param statusText - the response message
 * @param data the response data
 * @param url the url the request was made to
 * @param headers the response headers
 * @param config (optional) - the request object
 * @param request (optional) - the request object
 */
interface AptosResponse<Req, Res> {
    status: number;
    statusText: string;
    data: Res;
    url: string;
    headers: any;
    config?: any;
    request?: Req;
}
/**
 * The type returned from an API error
 *
 * @param name - the error name "AptosApiError"
 * @param url the url the request was made to
 * @param status - the response status. i.e. 400
 * @param statusText - the response message
 * @param data the response data
 * @param request - the AptosRequest
 */
declare class AptosApiError extends Error {
    readonly url: string;
    readonly status: number;
    readonly statusText: string;
    readonly data: any;
    readonly request: AptosRequest;
    constructor(request: AptosRequest, response: AptosResponse<any, any>, message: string);
}

/**
 * Given a url and method, sends the request with axios and
 * returns the response.
 */
declare function request<Req, Res>(options: ClientRequest<Req>, client: Client): Promise<ClientResponse<Res>>;
/**
 * The main function to use when doing an API request.
 *
 * @param options AptosRequest
 * @param aptosConfig The config information for the SDK client instance
 * @returns the response or AptosApiError
 */
declare function aptosRequest<Req, Res>(options: AptosRequest, aptosConfig: AptosConfig): Promise<AptosResponse<Req, Res>>;

declare type GetRequestOptions = {
    /**
     * The config for the API client
     */
    aptosConfig: AptosConfig;
    /**
     * The type of API endpoint to call e.g. fullnode, indexer, etc
     */
    type: AptosApiType;
    /**
     * The name of the API method
     */
    originMethod: string;
    /**
     * The URL path to the API method
     */
    path: string;
    /**
     * The content type of the request body
     */
    contentType?: MimeType;
    /**
     * The accepted content type of the response of the API
     */
    acceptType?: MimeType;
    /**
     * The query parameters for the request
     */
    params?: Record<string, string | AnyNumber | boolean | undefined>;
    /**
     * Specific client overrides for this request to override aptosConfig
     */
    overrides?: ClientConfig;
};
declare type GetAptosRequestOptions = Omit<GetRequestOptions, "type">;
/**
 * Main function to do a Get request
 *
 * @param options GetRequestOptions
 * @returns
 */
declare function get<Req, Res>(options: GetRequestOptions): Promise<AptosResponse<Req, Res>>;
declare function getAptosFullNode<Req, Res>(options: GetAptosRequestOptions): Promise<AptosResponse<Req, Res>>;
declare function paginateWithCursor<Req extends Record<string, any>, Res extends any[]>(options: GetAptosRequestOptions): Promise<Res>;

declare type PostRequestOptions = {
    /**
     * The config for the API client
     */
    aptosConfig: AptosConfig;
    /**
     * The type of API endpoint to call e.g. fullnode, indexer, etc
     */
    type: AptosApiType;
    /**
     * The name of the API method
     */
    originMethod: string;
    /**
     * The URL path to the API method
     */
    path: string;
    /**
     * The content type of the request body
     */
    contentType?: MimeType;
    /**
     * The accepted content type of the response of the API
     */
    acceptType?: MimeType;
    /**
     * The query parameters for the request
     */
    params?: Record<string, string | AnyNumber | boolean | undefined>;
    /**
     * The body of the request, should match the content type of the request
     */
    body?: any;
    /**
     * Specific client overrides for this request to override aptosConfig
     */
    overrides?: ClientConfig;
};
declare type PostAptosRequestOptions = Omit<PostRequestOptions, "type">;
/**
 * Main function to do a Post request
 *
 * @param options PostRequestOptions
 * @returns
 */
declare function post<Req, Res>(options: PostRequestOptions): Promise<AptosResponse<Req, Res>>;
declare function postAptosFullNode<Req, Res>(options: PostAptosRequestOptions): Promise<AptosResponse<Req, Res>>;
declare function postAptosIndexer<Req, Res>(options: PostAptosRequestOptions): Promise<AptosResponse<Req, Res>>;
declare function postAptosFaucet<Req, Res>(options: PostAptosRequestOptions): Promise<AptosResponse<Req, Res>>;

declare function isBool(arg: SimpleEntryFunctionArgumentTypes): arg is boolean;
declare function isString(arg: any): arg is string;
declare function isNumber(arg: SimpleEntryFunctionArgumentTypes): arg is number;
declare function isLargeNumber(arg: SimpleEntryFunctionArgumentTypes): arg is number | bigint | string;
declare function isNull(arg: SimpleEntryFunctionArgumentTypes): arg is null | undefined;
declare function isBcsBool(arg: EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes): arg is Bool;
declare function isBcsAddress(arg: EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes): arg is AccountAddress;
declare function isBcsString(arg: EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes): arg is MoveString;
declare function isBcsFixedBytes(arg: EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes): arg is FixedBytes;
declare function isBcsU8(arg: EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes): arg is U8;
declare function isBcsU16(arg: EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes): arg is U16;
declare function isBcsU32(arg: EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes): arg is U32;
declare function isBcsU64(arg: EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes): arg is U64;
declare function isBcsU128(arg: EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes): arg is U128;
declare function isBcsU256(arg: EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes): arg is U256;
declare function isScriptDataInput(arg: InputGenerateTransactionPayloadDataWithRemoteABI | InputGenerateTransactionPayloadData): arg is InputScriptData;
declare function throwTypeMismatch(expectedType: string, position: number): void;
/**
 * Finds first non-signer arg.
 *
 * A function is often defined with a `signer` or `&signer` arguments at the start, which are filled in
 * by signatures, and not by the caller.
 * @param functionAbi
 */
declare function findFirstNonSignerArg(functionAbi: MoveFunction): number;
declare function getFunctionParts(functionArg: MoveStructType): {
    moduleAddress: string;
    moduleName: string;
    functionName: string;
};

/**
 * We are defining function signatures, each with its specific input and output.
 * These are the possible function signature for our `generateTransactionPayload` function.
 * When we call our `generateTransactionPayload` function with the relevant type properties,
 * Typescript can infer the return type based on the appropriate function overload.
 */
declare function generateTransactionPayload(args: InputScriptData & {
    aptosConfig?: undefined;
}): Promise<TransactionPayloadScript>;
declare function generateTransactionPayload(args: InputEntryFunctionDataWithRemoteABI): Promise<TransactionPayloadEntryFunction>;
declare function generateTransactionPayload(args: InputMultiSigDataWithRemoteABI): Promise<TransactionPayloadMultisig>;
declare function generateTransactionPayload(args: InputGenerateTransactionPayloadDataWithRemoteABI): Promise<AnyTransactionPayloadInstance>;
declare function generateTransactionPayloadWithABI(args: InputEntryFunctionData, functionAbi: EntryFunctionABI): TransactionPayloadEntryFunction;
declare function generateTransactionPayloadWithABI(args: InputMultiSigData, functionAbi: EntryFunctionABI): TransactionPayloadMultisig;
declare function generateTransactionPayloadWithABI(args: InputGenerateTransactionPayloadData, functionAbi: EntryFunctionABI): AnyTransactionPayloadInstance;
/**
 * Generates a raw transaction
 *
 * @param args.aptosConfig AptosConfig
 * @param args.sender The transaction's sender account address as a hex input
 * @param args.payload The transaction payload - can create by using generateTransactionPayload()
 *
 * @returns RawTransaction
 */
declare function generateRawTransaction(args: {
    aptosConfig: AptosConfig;
    sender: HexInput;
    payload: AnyTransactionPayloadInstance;
    options?: InputGenerateTransactionOptions;
}): Promise<RawTransaction>;
/**
 * We are defining function signatures, each with its specific input and output.
 * These are the possible function signature for our `generateTransaction` function.
 * When we call our `generateTransaction` function with the relevant type properties,
 * Typescript can infer the return type based on the appropriate function overload.
 */
declare function buildTransaction(args: InputGenerateSingleSignerRawTransactionArgs): Promise<InputSingleSignerTransaction>;
declare function buildTransaction(args: InputGenerateFeePayerRawTransactionArgs): Promise<InputFeePayerTransaction>;
declare function buildTransaction(args: InputGenerateMultiAgentRawTransactionArgs): Promise<InputMultiAgentTransaction>;
declare function buildTransaction(args: InputGenerateRawTransactionArgs): Promise<AnyRawTransaction>;
/**
 * Simulate a transaction before signing and submit to chain
 *
 * @param args.transaction A aptos transaction type to sign
 * @param args.signerPublicKey The signer public key
 * @param args.secondarySignersPublicKeys optional. The secondary signers public keys if multi signers transaction
 * @param args.feePayerPublicKey optional. The fee payer public key is a fee payer (aka sponsored) transaction
 * @param args.options optional. SimulateTransactionOptions
 *
 * @returns A signed serialized transaction that can be simulated
 */
declare function generateSignedTransactionForSimulation(args: InputSimulateTransactionData): Uint8Array;
declare function getAuthenticatorForSimulation(publicKey: PublicKey): AccountAuthenticatorEd25519 | AccountAuthenticatorSingleKey;
/**
 * Sign a transaction that can later be submitted to chain
 *
 * @param args.signer The signer account to sign the transaction
 * @param args.transaction A aptos transaction type to sign
 *
 * @return The signer AccountAuthenticator
 */
declare function sign(args: {
    signer: Account$1;
    transaction: AnyRawTransaction;
}): AccountAuthenticator;
/**
 * Prepare a transaction to be submitted to chain
 *
 * @param args.transaction A aptos transaction type
 * @param args.senderAuthenticator The account authenticator of the transaction sender
 * @param args.secondarySignerAuthenticators optional. For when the transaction is a multi signers transaction
 *
 * @returns A SignedTransaction
 */
declare function generateSignedTransaction(args: {
    transaction: AnyRawTransaction;
    senderAuthenticator: AccountAuthenticator;
    secondarySignerAuthenticators?: {
        feePayerAuthenticator?: AccountAuthenticator;
        additionalSignersAuthenticators?: Array<AccountAuthenticator>;
    };
}): Uint8Array;
/**
 * Derive the raw transaction type - FeePayerRawTransaction or MultiAgentRawTransaction or RawTransaction
 *
 * @param transaction A aptos transaction type
 *
 * @returns FeePayerRawTransaction | MultiAgentRawTransaction | RawTransaction
 */
declare function deriveTransactionType(transaction: AnyRawTransaction): AnyRawTransactionInstance;
/**
 * Generate a multi signers signed transaction that can be submitted to chain
 *
 * @param transaction MultiAgentRawTransaction | FeePayerRawTransaction
 * @param senderAuthenticator The account authenticator of the transaction sender
 * @param secondarySignerAuthenticators The extra signers account Authenticators
 *
 * @returns A SignedTransaction
 */
declare function generateMultiSignersSignedTransaction(transaction: MultiAgentRawTransaction | FeePayerRawTransaction, senderAuthenticator: AccountAuthenticator, secondarySignerAuthenticators: {
    feePayerAuthenticator?: AccountAuthenticator;
    additionalSignersAuthenticators?: Array<AccountAuthenticator>;
}): Uint8Array;
declare function getSigningMessage(rawTxn: AnyRawTransactionInstance): Uint8Array;

/**
 * Convert type arguments to only type tags, allowing for string representations of type tags
 */
declare function standardizeTypeTags(typeArguments?: Array<TypeTag | string>): Array<TypeTag>;
/**
 * Fetches the ABI for an entry function from the module
 *
 * @param moduleAddress
 * @param moduleName
 * @param functionName
 * @param aptosConfig
 */
declare function fetchEntryFunctionAbi(moduleAddress: string, moduleName: string, functionName: string, aptosConfig: AptosConfig): Promise<EntryFunctionABI>;
/**
 * Converts a non-BCS encoded argument into BCS encoded, if necessary
 * @param functionName
 * @param functionAbi
 * @param arg
 * @param position
 */
declare function convertArgument(functionName: string, functionAbi: EntryFunctionABI, arg: EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes, position: number, genericTypeParams: Array<TypeTag>): EntryFunctionArgumentTypes;

declare enum TypeTagParserErrorType {
    InvalidTypeTag = "unknown type",
    UnexpectedTypeArgumentClose = "unexpected '>'",
    UnexpectedWhitespaceCharacter = "unexpected whitespace character",
    UnexpectedComma = "unexpected ','",
    TypeArgumentCountMismatch = "type argument count doesn't match expected amount",
    MissingTypeArgumentClose = "no matching '>' for '<'",
    UnexpectedPrimitiveTypeArguments = "primitive types not expected to have type arguments",
    UnexpectedVectorTypeArgumentCount = "vector type expected to have exactly one type argument",
    UnexpectedStructFormat = "unexpected struct format, must be of the form 0xaddress::module_name::struct_name",
    InvalidModuleNameCharacter = "module name must only contain alphanumeric or '_' characters",
    InvalidStructNameCharacter = "struct name must only contain alphanumeric or '_' characters"
}
declare class TypeTagParserError extends Error {
    constructor(typeTagStr: string, invalidReason: TypeTagParserErrorType);
}
/**
 * All types are made of a few parts they're either:
 * 1. A simple type e.g. u8
 * 2. A standalone struct e.g. 0x1::account::Account
 * 3. A nested struct e.g. 0x1::coin::Coin<0x1234::coin::MyCoin>
 *
 * There are a few more special cases that need to be handled, however.
 * 1. Multiple generics e.g 0x1::pair::Pair<u8, u16>
 * 2. Spacing in the generics e.g. 0x1::pair::Pair< u8 , u16>
 * 3. Nested generics of different depths e.g. 0x1::pair::Pair<0x1::coin::Coin<0x1234::coin::MyCoin>, u8>
 * 4. Generics for types in ABIs are filled in with placeholders e.g T1, T2, T3
 */
declare function parseTypeTag(typeStr: string, options?: {
    allowGenerics?: boolean;
}): TypeTag;

declare type DerivedKeys = {
    key: Uint8Array;
    chainCode: Uint8Array;
};
/**
 * Aptos derive path is 637
 *
 * See https://github.com/satoshilabs/slips/blob/master/slip-0044.md
 */
declare const APTOS_PATH_REGEX: RegExp;
/**
 * A list of supported key types and associated seeds
 */
declare enum KeyType {
    ED25519 = "ed25519 seed"
}
/**
 * Checks if the BIP44 path is valid for Aptos
 * @param path the BIP44 path
 *
 * @returns true if the path is a valid Aptos path
 */
declare const isValidPath: (path: string) => boolean;
/**
 * Derives a private key from a mnemonic seed phrase.
 *
 * To derive multiple keys from the same phrase, change the path
 * @param keyType the key type seed used to derive keys
 * @param path the BIP44 path
 * @param seedPhrase the mnemonic seed phrase
 * @param offset the offset used for key derivation, defaults to [HARDENED_OFFSET]
 */
declare const derivePrivateKeyFromMnemonic: (keyType: KeyType, path: string, seedPhrase: string, offset?: number) => DerivedKeys;

export { APTOS_PATH_REGEX, Account$1 as Account, AccountAddress, AccountAuthenticator, AccountAuthenticatorEd25519, AccountAuthenticatorMultiEd25519, AccountAuthenticatorMultiKey, AccountAuthenticatorSingleKey, AccountAuthenticatorVariant, AccountData, AccountEd25519Signature, AccountMultiEd25519Signature, AccountSecp256k1Signature, AccountSignature, AddressInvalidReason, AnyNumber, AnyPublicKeyVariant, AnyRawTransaction, AnyRawTransactionInstance, AnySignatureVariant, AnyTransactionPayloadInstance, Aptos, AptosApiError, AptosConfig, AptosRequest, AptosResponse, AptosSettings, AuthenticationKey, AuthenticationKeyScheme, Block, BlockMetadataTransactionResponse, Bool, ChainId, Client, ClientConfig, ClientRequest, ClientResponse, DecodedTableData, DeletedTableData, DeriveScheme, DerivedKeys, Deserializable, Deserializer, DirectWriteSet, Ed25519PrivateKey, Ed25519PublicKey, Ed25519Signature, EntryFunction, EntryFunctionABI, EntryFunctionArgument, EntryFunctionArgumentTypes, EntryFunctionBytes, EntryFunctionPayloadResponse, Event$1 as Event, EventGuid, FeePayerRawTransaction, FixedBytes, GasEstimation, GenerateAccount, GenerateAccountWithLegacyKey, GenerateAccountWithUnifiedKey, GenesisPayload, GenesisTransactionResponse, GetAccountCoinsDataResponse, GetAccountCollectionsWithOwnedTokenResponse, GetAccountOwnedObjectsResponse, GetAccountOwnedTokensFromCollectionResponse, GetAccountOwnedTokensQueryResponse, GetAptosRequestOptions, GetChainTopUserTransactionsResponse, GetCollectionDataResponse, GetCurrentFungibleAssetBalancesResponse, GetCurrentTokenOwnershipResponse, GetDelegatedStakingActivitiesResponse, GetEventsResponse, GetFungibleAssetActivitiesResponse, GetFungibleAssetMetadataResponse, GetNumberOfDelegatorsResponse, GetOwnedTokensResponse, GetProcessorStatusResponse, GetRequestOptions, GetTokenActivityResponse, GetTokenDataResponse, GraphqlQuery, Hex, HexInput, HexInvalidReason, Identifier, InputEntryFunctionData, InputEntryFunctionDataWithRemoteABI, InputFeePayerTransaction, InputGenerateFeePayerRawTransactionArgs, InputGenerateFeePayerRawTransactionData, InputGenerateMultiAgentRawTransactionArgs, InputGenerateMultiAgentRawTransactionData, InputGenerateRawTransactionArgs, InputGenerateSingleSignerRawTransactionArgs, InputGenerateSingleSignerRawTransactionData, InputGenerateTransactionData, InputGenerateTransactionOptions, InputGenerateTransactionPayloadData, InputGenerateTransactionPayloadDataWithRemoteABI, InputMultiAgentTransaction, InputMultiSigData, InputMultiSigDataWithRemoteABI, InputScriptData, InputSimulateTransactionData, InputSimulateTransactionOptions, InputSingleSignerTransaction, KeyType, LedgerInfo, LedgerVersion, MimeType, ModuleId, MoveAbility, MoveAddressType, MoveFunction, MoveFunctionGenericTypeParam, MoveFunctionVisibility, MoveModule, MoveModuleBytecode, MoveModuleId, MoveObjectType, MoveOption, MoveOptionType, MoveResource, MoveScriptBytecode, MoveString, MoveStruct, MoveStructField, MoveStructType, MoveType, MoveUint128Type, MoveUint16Type, MoveUint256Type, MoveUint32Type, MoveUint64Type, MoveUint8Type, MoveValue, MoveVector, MultiAgentRawTransaction, MultiEd25519PublicKey, MultiEd25519Signature, MultiKey, MultiSig, MultisigPayloadResponse, MultisigTransactionPayload, Network, NetworkToChainId, NetworkToFaucetAPI, NetworkToIndexerAPI, NetworkToNodeAPI, OrderBy, OrderByValue, PaginationArgs, ParsingError, ParsingResult, PendingTransactionResponse, PostAptosRequestOptions, PostRequestOptions, PrivateKey, PublicKey, RawTransaction, RawTransactionWithData, RoleType, Script, ScriptFunctionArgument, ScriptFunctionArgumentTypes, ScriptPayloadResponse, ScriptTransactionArgumentVariants, ScriptWriteSet, Secp256k1PrivateKey, Secp256k1PublicKey, Secp256k1Signature, Serializable, Serializer, Signature, SignedTransaction, SigningScheme, SigningSchemeInput, SimpleEntryFunctionArgumentTypes, StateCheckpointTransactionResponse, StructTag, TableItemRequest, TokenStandard, TransactionArgument, TransactionAuthenticator, TransactionAuthenticatorEd25519, TransactionAuthenticatorFeePayer, TransactionAuthenticatorMultiAgent, TransactionAuthenticatorMultiEd25519, TransactionAuthenticatorSingleSender, TransactionAuthenticatorVariant, TransactionEd25519Signature, TransactionFeePayerSignature, TransactionMultiAgentSignature, TransactionMultiEd25519Signature, TransactionPayload, TransactionPayloadEntryFunction, TransactionPayloadMultisig, TransactionPayloadResponse, TransactionPayloadScript, TransactionPayloadVariants, TransactionResponse, TransactionResponseType, TransactionSecp256k1Signature, TransactionSignature, TransactionVariants, TypeTag, TypeTagAddress, TypeTagBool, TypeTagGeneric, TypeTagParserError, TypeTagParserErrorType, TypeTagReference, TypeTagSigner, TypeTagStruct, TypeTagU128, TypeTagU16, TypeTagU256, TypeTagU32, TypeTagU64, TypeTagU8, TypeTagVariants, TypeTagVector, U128, U16, U256, U32, U64, U8, Uint128, Uint16, Uint256, Uint32, Uint64, Uint8, UserTransactionResponse, ViewRequest, ViewRequestData, WaitForTransactionOptions, WriteSet, WriteSetChange, WriteSetChangeDeleteModule, WriteSetChangeDeleteResource, WriteSetChangeDeleteTableItem, WriteSetChangeWriteModule, WriteSetChangeWriteResource, WriteSetChangeWriteTableItem, aptosCoinStructTag, aptosRequest, buildTransaction, convertArgument, derivePrivateKeyFromMnemonic, deriveTransactionType, deserializeFromScriptArgument, ensureBoolean, fetchEntryFunctionAbi, findFirstNonSignerArg, generateMultiSignersSignedTransaction, generateRawTransaction, generateSignedTransaction, generateSignedTransactionForSimulation, generateTransactionPayload, generateTransactionPayloadWithABI, get, getAptosFullNode, getAuthenticatorForSimulation, getFunctionParts, getSigningMessage, isBcsAddress, isBcsBool, isBcsFixedBytes, isBcsString, isBcsU128, isBcsU16, isBcsU256, isBcsU32, isBcsU64, isBcsU8, isBool, isLargeNumber, isNull, isNumber, isScriptDataInput, isString, isValidPath, objectStructTag, optionStructTag, outOfRangeErrorMessage, paginateWithCursor, parseTypeTag, post, postAptosFaucet, postAptosFullNode, postAptosIndexer, request, sign, standardizeTypeTags, stringStructTag, throwTypeMismatch, validateNumberInRange };
