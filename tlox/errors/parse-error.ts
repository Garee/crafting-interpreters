import Token from "../token";

class ParseError extends Error {
    public token: Token;

    constructor(token: Token, message: string) {
        super(message);
        this.token = token;
    }
}

export default ParseError;
