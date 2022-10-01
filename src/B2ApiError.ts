export interface IB2ApiError {
    message: string;
    code: string;
    status: number;
}

export class B2ApiError extends Error {
    public code: string;
    public status: number;

    constructor(apiError: IB2ApiError) {
        super(apiError.message);
        this.name = "B2ApiError";
        this.code = apiError.code;
        this.status = apiError.status;
    }
}
