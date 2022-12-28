import { TokenType } from "./enums";

class Token {
    public type: TokenType;
    public lexeme: string;
    public literal: string | number | null;
    public line: number;

    constructor(
        type: TokenType,
        lexeme: string,
        literal: string | number | null,
        line: number
    ) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }

    public toString(): string {
        return `${this.type} ${this.lexeme} ${this.literal}`;
    }
}

export default Token;
