export class NotFoundError extends Error {
    public statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}

export class BadRequestError extends Error {
    public statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'BadRequestError';
        this.statusCode = 400;
    }
}

export class InternalServerError extends Error {
    public statusCode: number;

    constructor(message: string = 'An unexpected error occurred') {
        super(message);
        this.name = 'InternalServerError';
        this.statusCode = 500;
    }
}
