import Token from "../core/token";

class ParseError extends Error {
    public token: Token;

    constructor(token: Token, message: string) {
        super(message);
        this.token = token;
    }
}

export default ParseError;
