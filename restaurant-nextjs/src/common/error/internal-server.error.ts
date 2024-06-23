export class InternalServerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "INTERNAL_SERVER_ERROR";
    }
}
