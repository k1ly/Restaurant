export class UnprocessableEntityError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UNPROCESSABLE_ENTITY";
    }
}
