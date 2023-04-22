export interface B2Config {
    applicationKeyId: string;
    applicationKey: string;
}

export enum HttpMethod {
    CONNECT = "CONNECT",
    DELETE = "DELETE",
    GET = "GET",
    HEAD = "HEAD",
    OPTIONS = "OPTIONS",
    PATCH = "PATCH",
    POST = "POST",
    PUT = "PUT",
    TRACE = "TRACE",
}

export enum KeyCapabilities {
    listKeys = "listKeys",
    writeKeys = "writeKeys",
    deleteKeys = "deleteKeys",
    listBuckets = "listBuckets",
    writeBuckets = "writeBuckets",
    deleteBuckets = "deleteBuckets",
    listFiles = "listFiles",
    readFiles = "readFiles",
    shareFiles = "shareFiles",
    writeFiles = "writeFiles",
    deleteFiles = "deleteFiles",
}

export interface AuthorizeAccountResponse {
    absoluteMinimumPartSize: number;
    accountId: string;
    allowed: {
        bucketId?: string;
        bucketName?: string;
        capabilities?: KeyCapabilities[];
        namePrefix?: string | null;
    };
    apiUrl: string;
    authorizationToken: string;
    downloadUrl: string;
    recommendedPartSize: number;
    s3ApiUrl: string;
}

export interface CancelLargeFileResponse {
    fileId: string;
    accountId: string;
    bucketId: string;
    fileName: string;
}

export interface UploadUrlConfig {
    authorizationToken: string;
    bucketId: string;
    uploadUrl: string;
}

export interface CopyFile {
    sourceFileId: string;
    destinationBucketId: string;
    fileName: string;
    range: string;
    metadataDirective: string;
    contentType: string;
    fileInfo: string;
    fileRetention: string;
    legalHold: string;
    sourceServerSideEncryption: string;
    destinationServerSideEncryption: string;
}

export interface CopyFileResponse {
    sourceFileId: string;
    destinationBucketId: string;
    fileName: string;
    range: string;
    metadataDirective: string;
    contentType: number;
    fileInfo: string;
    fileRetention: string;
    legalHold: string;
    sourceServerSideEncryption: string;
    destinationServerSideEncryption: string;
}

export interface CopyPart {
    sourceFileId: string;
    largeFileId: string;
    partNumber: number;
    ranage?: string;
    sourceServerSideEncryption: string;
    destinationServerSideEncryption: string;
}

export interface CopyPartResponse {
    fileId: string;
    partNumber: number;
    contentLength: number;
    contentSha1: string;
    contentMd5?: string;
    serverSideEncryption: string;
    uploadTimestamp: number;
}

export interface ListBuckets {
    accountId: string;
    bucketId?: string;
    bucketName?: string;
    bucketTypes?: string;
}

export interface ListBucketsResponse {}

export interface ListFileNames {
    bucketId: string;
    delimiter?: string;
    maxFileCount?: number;
    prefix?: string;
    startFileName?: string;
}

export interface File {
    accountId: string;
    action: string;
    bucketId: string;
    contentLength: number;
    contentMd5?: string;
    contentSha1: string;
    contentType: string;
    fileId: string;
    fileInfo: Record<string, string>;
    fileName: string;
    fileRetention: {
        isClientAuthorizedToRead: boolean;
        value: string | null;
    };
    legalHold: {
        isClientAuthorizedToRead: boolean;
        value: string | null;
    };
    replicationStatus: "PENDING" | "COMPLETED" | "FAILED" | "REPLICA";
    serverSideEncryption: {
        algorithm: string | null;
        mode: string | null;
    };
    uploadTimestamp: number;
}

export interface ListFileNamesResponse {
    files: File[];
    nextFileName: string;
}
