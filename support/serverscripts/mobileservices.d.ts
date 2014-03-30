// TypeScript declaration file for Windows Azure Mobile Services server scripts
// WORK IN PROGRESS

interface MobileServiceError {
    message: string;
    innerError: any;
    code: string;
}

interface StatusCodes {
    OK: number;
    CREATED: number;
    ACCEPTED: number;
    NO_CONTENT: number;
    MOVED_PERMANANTLY: number;
    FOUND: number;
    BAD_REQUEST: number;
    UNAUTHORIZED: number;
    FORBIDDEN: number;
    NOT_FOUND: number;
    METHOD_NOT_ALLOWED: number;    
    CONFLICT: number;
    REQUEST_ENTITY_TOO_LARGE: number;
    INTERNAL_SERVER_ERROR: number;
    BAD_GATEWAY: number;
    SERVICE_UNAVAILABLE: number;
}

interface Tables {
    /**
      * Returns a Table instance for working with data
      * @param tableName The name of the table
      */
    getTable(tableName: string): Table;
}

interface CallbackOptions {
    /** Invoked if the async operation was successful */
    success: () => void;

    /**
      * Invoked if the async operation encountered an error 
      * @param err MobileServiceError object with details of the error
      */
    error?: (err: MobileServiceError) => void;
}

interface ReadCallbackOptions {
    /**
      * Invoked if the query was successful
      * @param results An array of results returned by the query
      */
    success: (results: any[]) => void;

    /**
      * Invoked if the query encountered an error 
      * @param err MobileServiceError object with details of the error
      */
    error?: (err: MobileServiceError) => void;
}

interface Query {
    /**
      * Applies ascending order sorting to the query using the specified column(s)
      * @param column The name of the first column to sort by
      * @param ...more Additional column(s) to sort by
      */
    orderBy(column: string, ...more: string[]): Query;

    /**
      * Applies descending order sorting to the query using the specified column(s)
      * @param column The name of the first column to sort by
      * @param ...more Additional column(s) to sort by
      */
    orderByDescending(column: string, ...more: string[]): Query;

    /**
      * Applies a projection to the query. Only the specified column(s) are returned in results
      * @param column The name of the column to include in the results
      * @param ...more Additional column(s) to include in the results
      */
    select(column: string, ...more: string[]): Query;

    /**
      * Applies the specified projection function to the query results.
      * @param projection The function to execute on each returned record      
      */
    select(projection: () => any): Query;
    skip(recordCount: number): Query;
    take(recordCount: number): Query;
    where(exampleObject: {}): Query;
    where(predicate: () => boolean): Query;
    where(predicate: (arg1: any) => boolean, arg1: any): Query;
    where(predicate: (arg1: any, arg2: any) => boolean, arg1: any, arg2: any): Query;
    where(predicate: (arg1: any, arg2: any, arg3: any) => boolean, arg1: any, arg2: any, arg3: any): Query;
    where(predicate: (arg1: any, arg2: any, arg3: any, ...args: any[]) => boolean, arg1: any, arg2: any, arg3: any, ...args: any[]): Query;
    read(options: ReadCallbackOptions): void;
}

interface Table extends Query {
    update(item: {}): void;
    update(item: {}, options: CallbackOptions): void;

    insert(item: {}): void;
    insert(item: {}, options: CallbackOptions): void;

    del(id: number): void;
    del(item: { id: number; }): void;
    del(item: { id: number; }, options: CallbackOptions): void;
}

interface TableRequest {
    respond(): void;
    respond(status: number): void;
    respond(status: number, response: any): void;
    parameters: any;
}

interface CUDRequest extends TableRequest {
    execute(): void;
    execute(options: CallbackOptions): void;
}

interface ReadRequest extends TableRequest {
    execute(): void;
    execute(options: ReadCallbackOptions): void;
}

interface User {
    userId: string;
    level: string;
}

interface Push {
    /** Provides access to APIs for sending push notifications to Windows Store applications via the Windows Push Notification Service. */
    wns: Wns;

    /** Provides access to APIs for sending push notifications to Windows Phone applications via the Microsoft Push Notification Service. */
    mpns: Mpns;

    /** Provides access to APIs for sending push notifications to iOS applications via the Apple Push Notification Service. */
    apns: Apns;

    /** Provides access to APIs for sending push notifications to Android applications via Google Cloud Messaging. */
    gcm: Gcm;
}

interface PushCallbackOptions {
    success: (response: any) => void;
    error?: (err: any) => void;
}

interface Wns {

    sendTileSquareBlock(channel: string, payload: { text1?: string; text2?: string; }, options: WnsCallbackOptions): void;
    sendTileSquareText01(channel: string, payload: { text1?: string; text2?: string; text3?: string; text4?: string; }, options: WnsCallbackOptions): void;
    sendTileWideText01(channel: string, payload: { text1?: string; text2?: string; text3?: string; text4?: string; text5?: string; }, options: WnsCallbackOptions): void;
    sendTileSquareImage(channel: string, payload: { img1src?: string; img1alt?: string; }, options: WnsCallbackOptions): void;
    
    sendToastText01(channel: string, payload: { text1?: string; }, options: WnsToastCallbackOptions): void;
    sendToastImageAndText01(channel: string, payload: { text1?: string; img1src?: string; img1alt?: string; }, options: WnsToastCallbackOptions): void;

    sendBadge(channel: string, value: number, options: WnsCallbackOptions);
    sendBadge(channel: string, value: string, options: WnsCallbackOptions);

    sendRaw(channel: string, value: string, options: WnsCallbackOptions);
    send(channel: string, payload: string, type: string, options: WnsCallbackOptions);

    // TODO
}

interface WnsCallbackOptions extends PushCallbackOptions {
    headers: any;
}

interface WnsToastCallbackOptions extends WnsCallbackOptions {
    launch: string;
    duration: number;
}

interface Mpns {
    sendTile(channel: string, payload: MpnsTilePayload, options: MpnsCallbackOptions): void;
    sendFlipTile(channel: string, payload: MpnsFlipTilePayload, options: MpnsCallbackOptions): void;
    sendToast(channel: string, payload: MpnsToastPayload, options: MpnsCallbackOptions): void;
    sendRaw(channel: string, payload: string, options: MpnsCallbackOptions): void;
}

interface MpnsCallbackOptions {
    success: (response: MpnsResponse) => void;
    error?: (err: any) => void;
}

interface MpnsResponse {
    statusCode: number;
    deviceConnectionStatus: string;
    notificationStatus: string;
    subscriptionStatus: string;
    title: string;
    pushType: string;
    tileTemplate: string;
}

interface MpnsTilePayload {
    backgroundImage?: string;
    count?: number;
    title?: string;
    backBackgroundImage?: string;
    backTitle?: string;
    backContent?: string;
    id?: string;
}

interface MpnsFlipTilePayload extends MpnsTilePayload {
    smallBackgroundImage?: string;
    wideBackgroundImage?: string;
    wideBackContent?: string;
    wideBackBackgroundImage?: string;
}

interface MpnsToastPayload {
    text1?: string;
    text2?: string;
    param?: string;
}

interface Apns {
    send(deviceToken: string, payload: ApnsPayload, options?: ApnsCallbackOptions): void;
    getFeedback(completion: ApnsFeedbackOptions): void;
}

interface ApnsCallbackOptions {    
    error: (err: ApnsError) => void;
}
interface ApnsError {
    statusCode: number;
    deviceToken: string;
    statusDescription: string;
}

interface ApnsPayload {
    badge?: number;
    alert?: string;
    sound?: string;
    payload?: {};
    expiry?: Date;
}

interface ApnsFeedbackOptions {
    success: (devices: ApnsDevice[]) => void;
    error?: (err: any) => void;
}

interface ApnsDevice {
    deviceToken: string;
    timeStamp: string;
}

interface Gcm {
    send(registrationId: string, payload: {}, options: GcmCallbackOptions): void;
    sendAdvanced(content: GcmContent, retryCount: number, options: PushCallbackOptions): void;
}

interface GcmCallbackOptions {
    success: (response: GcmResponse) => void;
    error?: (err: any) => void;
}

interface GcmResponse {
    invalidIds: string[];
    updatedIds: {};
}

interface GcmContent {
    registration_ids: string[];
    notification_key?: string;
    notification_key_name: string;
    collapse_key?: string;
    data?: {};
    delay_while_idle?: boolean;
    time_to_live?: number;
    restricted_package_name?: string;
    dry_run?: boolean;
}

interface MsSql {
    open(connectionString: string, options?: MsSqlOpenOptions): MsSqlConnection;
    query(connectionString: string, query: string, params?: any[], options?: MsSqlQueryOptions): MsSqlEventEmitter;
    queryRaw(connectionString: string, query: string, params?: any[], options?: MsSqlQueryRawOptions): MsSqlEventEmitter;
}

interface MsSqlOpenOptions {
    success?: (connection: MsSqlConnection) => void;
    error?: (err: MobileServiceError) => void;
}

interface MsSqlQueryOptions {
    success?: (results: {}[], more?: boolean) => void;
    error?: (err: MobileServiceError) => void;
}

interface MsSqlQueryRawOptions {
    success?: (results: MsSqlQueryRawResults, more?: boolean) => void;
    error?: (err: MobileServiceError) => void;
}

interface MsSqlQueryRawResults {
    meta: MsSqlMetadataResult[];
    rows: any[][];
}

interface MsSqlMetadataResult {
    name: string;
    size: number;
    nullable: boolean;
    type: string;
    sqlType: string;
}

interface MsSqlConnection {
    close(callback: (err: any) => void );
    close(immediately: boolean, callback: (err: any) => void );
}

interface MsSqlEventEmitter {
}




interface TableScript {
    read(query: Query, user: User, request: ReadRequest): void;
    insert(item: any, user: User, request: CUDRequest): void;
    update(item: { id: number; }, user: User, request: CUDRequest): void;
    del(id: number, user: User, request: CUDRequest): void;
}

declare var statusCodes: StatusCodes;
declare var tables: Tables;
declare var mssql: MsSql;

/** Provides access to APIs for sending push notifications. */
declare var push: Push;

declare var __tableScript: TableScript;
