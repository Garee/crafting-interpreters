import { TokenType } from "./enums";

class Token {
    private type: TokenType;
    private lexeme: string;
    private literal: string | number | null;
    private line: number;

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
