import { B2ApiError, IB2ApiError } from "./B2ApiError";
import {
    AuthorizeAccountResponse,
    UploadUrlConfig,
    B2Config,
    HttpMethod,
    CancelLargeFileResponse,
    CopyFile,
    CopyFileResponse,
    CopyPart,
    CopyPartResponse,
    ListBuckets,
    ListBucketsResponse,
} from "./interface";

const KEY_EXPIRY = 72000;

export class BackblazeB2 {
    private baseApi = "https://api.backblazeb2.com";
    private apiVersion = "/b2api/v2";
    // Provided by b2_authorize_account endpoint
    private apiUrl = "";
    private applicationKeyId: string;
    private applicationKey: string;
    private authenticationConfig: AuthorizeAccountResponse | null = null;
    private uploadUrlConfig: UploadUrlConfig | null = null;

    constructor(options: B2Config) {
        this.applicationKeyId = options.applicationKeyId;
        this.applicationKey = options.applicationKey;
    }

    private async request<T>(path: string, options: RequestInit) {
        try {
            const opts = options as RequestInit;
            const res = await fetch(path, opts);
            if (res.status >= 400) {
                throw new B2ApiError(await res.json<IB2ApiError>());
            }
            return res.json<T>();
        } catch (e) {
            throw new B2ApiError(e as IB2ApiError);
        }
    }

    private url(path: string, base: string = "") {
        return `${base ? base : this.apiUrl}${this.apiVersion}/${path}`;
    }

    private getAuthHeader() {
        if (!this.authenticationConfig?.authorizationToken) {
            throw new Error("No authorizationToken found, please call b2.authorizeAccount() first");
        }
        return { Authorization: this.authenticationConfig.authorizationToken };
    }

    /**
     * Generate SHA1 hashs of files
     */
    public async generateSha1(file: File): Promise<string> {
        const digest = await crypto.subtle.digest("SHA-1", await file.arrayBuffer());
        const array = Array.from(new Uint8Array(digest));

        return array.map((b) => b.toString(16).padStart(2, "0")).join("");
    }

    /**
     * Used to log in to the B2 API. Returns an authorization token that can be used for account-level operations, and a URL that should be used as the base URL for subsequent API calls.
     */
    public async authorizeAccount() {
        const res = await this.request<AuthorizeAccountResponse>(this.url("b2_authorize_account", this.baseApi), {
            method: HttpMethod.GET,
            headers: { Authorization: `Basic ${btoa(`${this.applicationKeyId}:${this.applicationKey}`)}` },
        });
        this.apiUrl = res.apiUrl;
        this.authenticationConfig = res;
        return res;
    }

    /**
     * Cancels the upload of a large file, and deletes all of the parts that have been uploaded.
     */
    public cancelLargeFile(fileId: string) {
        return this.request<CancelLargeFileResponse>(this.url("b2_cancel_large_file"), {
            method: HttpMethod.POST,
            body: JSON.stringify({ fileId }),
            headers: this.getAuthHeader(),
        });
    }

    /**
     * Creates a new file by copying from an existing file.
     */
    public copyFile(params: CopyFile) {
        return this.request<CopyFileResponse>(this.url("b2_copy_file"), {
            method: HttpMethod.POST,
            body: JSON.stringify(params),
            headers: this.getAuthHeader(),
        });
    }

    /**
     * Copies from an existing B2 file, storing it as a part of a large file which has already been started (with b2_start_large_file).
     */
    public copyPart(params: CopyPart) {
        return this.request<CopyPartResponse>(this.url("b2_copy_part"), {
            method: HttpMethod.POST,
            body: JSON.stringify(params),
            headers: this.getAuthHeader(),
        });
    }

    public createBucket() {
        throw new Error("Not yet Implemented");
    }
    public createKey() {
        throw new Error("Not yet Implemented");
    }
    public deleteBucket() {
        throw new Error("Not yet Implemented");
    }
    public deleteFileVersion() {
        throw new Error("Not yet Implemented");
    }
    public deleteKey() {
        throw new Error("Not yet Implemented");
    }
    public downloadFileById() {
        throw new Error("Not yet Implemented");
    }
    public downloadFileByName() {
        throw new Error("Not yet Implemented");
    }
    public finishLargeFile() {
        throw new Error("Not yet Implemented");
    }
    public getDownloadAuthorization() {
        throw new Error("Not yet Implemented");
    }
    public getFileInfo() {
        throw new Error("Not yet Implemented");
    }
    public getUploadPartUrl() {
        throw new Error("Not yet Implemented");
    }

    /**
     * Gets an URL to use for uploading files.
     */
    public async getUploadUrl(bucketId: string) {
        const res = await this.request<UploadUrlConfig>(this.url("b2_get_upload_url"), {
            method: HttpMethod.POST,
            body: JSON.stringify({ bucketId }),
            headers: this.getAuthHeader(),
        });
        this.uploadUrlConfig = res;
        return res;
    }
    public hideFile() {
        throw new Error("Not yet Implemented");
    }
    public listBuckets(params: ListBuckets) {
        throw new Error("Not yet Implemented");
    }
    public listFileNames(params: any) {
        return this.request<ListBucketsResponse>(this.url("b2_list_file_names"), {
            method: HttpMethod.POST,
            body: JSON.stringify(params),
            headers: this.getAuthHeader(),
        });
    }
    public listFileVersions() {
        throw new Error("Not yet Implemented");
    }
    public listKeys() {
        throw new Error("Not yet Implemented");
    }
    public listParts() {
        throw new Error("Not yet Implemented");
    }
    public listUnfinishedLargeFiles() {
        throw new Error("Not yet Implemented");
    }
    public startLargeFile() {
        throw new Error("Not yet Implemented");
    }
    public updateBucket() {
        throw new Error("Not yet Implemented");
    }
    public updateFileLegalHold() {
        throw new Error("Not yet Implemented");
    }
    public updateFileRetention() {
        throw new Error("Not yet Implemented");
    }

    public async uploadFile(file: File, fileName?: string) {
        if (!file) {
            throw new Error("No file provided");
        }
        if (!this.uploadUrlConfig) {
            throw new Error("No authorizationToken found, please call b2.getUploadUrl() first");
        }
        const sha1 = await this.generateSha1(file);
        const res = await this.request<UploadUrlConfig>(this.uploadUrlConfig.uploadUrl, {
            method: HttpMethod.POST,
            body: file.stream(),
            headers: {
                Authorization: this.uploadUrlConfig.authorizationToken,
                "X-Bz-File-Name": fileName ?? file.name,
                "Content-Type": file.type,
                "Content-Length": `${file.size}`,
                "X-Bz-Content-Sha1": sha1,
            },
        });
        this.uploadUrlConfig = res;
        return res;
    }

    public uploadPart() {
        throw new Error("Not yet Implemented");
    }

    public async handleScheduledAuthorization(KV: KVNamespace) {
        // We set expiry when setting this key, if it does exist
        // then we can assume the key is still valid
        const storedDetails = await KV.get("_b2Details", "json");
        if (storedDetails) return storedDetails;
        const details = await this.authorizeAccount();
        await KV.put("_b2Details", JSON.stringify(details), { expirationTtl: KEY_EXPIRY });
        return details;
    }
}
