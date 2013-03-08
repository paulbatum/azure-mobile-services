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
    BAD_REQUEST: number;
    UNAUTHORIZED: number;
    FORBIDDEN: number;
    NOT_FOUND: number;
    CONFLICT: number;
    INTERNAL_SERVER_ERROR: number;
}

interface Tables {
    getTable(tableName: string): Table;
}

interface CallbackOptions {
    success: () => void;
    error?: (err: MobileServiceError) => void;
}

interface ReadCallbackOptions {
    success: (results: any[]) => void;
    error?: (err: MobileServiceError) => void;
}

interface Query {
    orderBy(column: string, ...more: string[]): Query;
    orderByDescending(column: string, ...more: string[]): Query;
    select(column: string, ...more: string[]): Query;
    select(projection: () => any): Query;
    skip(recordCount: number): Query;
    take(recordCount: number): Query;
    where(exampleObject: {}): Query;
    where(predicate: () => bool): Query;
    where(predicate: (arg1: any) => bool, arg1: any): Query;
    where(predicate: (arg1: any, arg2: any) => bool, arg1: any, arg2: any): Query;
    where(predicate: (arg1: any, arg2: any, arg3: any) => bool, arg1: any, arg2: any, arg3: any): Query;
    where(predicate: (arg1: any, arg2: any, arg3: any, ...args: any[]) => bool, arg1: any, arg2: any, arg3: any, ...args: any[]): Query;
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
    wns: Wns;
    mpns: Mpns;
    apns: Apns;
    gcm: Gcm;
}

interface PushCallbackOptions {
    success: (response: any) => void;
    error?: (err: any) => void;
}

interface WnsCallbackOptions extends PushCallbackOptions {
    headers: any;
}

interface WnsToastCallbackOptions extends WnsCallbackOptions {
    launch: string;
    duration: number;
}

interface Wns {
    sendTileSquareBlock(channel: string, payload: { text1: string; text2: string; }, options: WnsCallbackOptions): void;
    sendTileSquareText01(channel: string, payload: { text1: string; text2: string; text3: string; text4: string; }, options: WnsCallbackOptions): void;
    sendTileWideText01(channel: string, payload: { text1: string; text2: string; text3: string; text4: string; text5: string; }, options: WnsCallbackOptions): void;
    sendTileSquareImage(channel: string, payload: { img1src: string; img1alt: string; }, options: WnsCallbackOptions): void;
    
    sendToastText01(channel: string, payload: { text1: string; }, options: WnsToastCallbackOptions): void;
    sendToastImageAndText01(channel: string, payload: { text1: string; img1src: string; img1alt: string; }, options: WnsToastCallbackOptions): void;

    sendBadge(channel: string, value: number, WnsCallbackOptions);
    sendBadge(channel: string, value: string, WnsCallbackOptions);

    sendRaw(channel: string, value: string, options: WnsCallbackOptions);
    send(channel: string, payload: string, type: string, WnsCallbackOptions);

    // TODO
}

interface Mpns {
    // TODO
}

interface Apns {
    // TODO
}

interface Gcm {
    send(registrationId: string, payload: any, options: PushCallbackOptions): void;
    sendAdvanced(content: GcmContent, retryCount: number, options: PushCallbackOptions): void;
}

interface GcmContent {
    registration_ids: string[];
    // TODO
}

// Table Script function definitions

interface TableScript {
    read(query: Query, user: User, request: ReadRequest): void;
    insert(item: any, user: User, request: CUDRequest): void;
    update(item: { id: number; }, user: User, request: CUDRequest): void;
    del(id: number, user: User, request: CUDRequest): void;
}

// Globals
declare var statusCodes: StatusCodes;
declare var tables: Tables;
declare var push: Push;