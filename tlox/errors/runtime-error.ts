import Token from "../core/token";

class RuntimeError extends Error {
    public token: Token;

    constructor(token: Token, message: string) {
        super(message);
        this.token = token;
    }
}

export default RuntimeError;
