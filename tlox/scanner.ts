import { TokenType } from "./enums";
import Token from "./token";
import { isAlphaNumeric, isDigit } from "./util";

class Scanner {
    private source: string;
    private tokens: Token[] = [];
    private start = 0;
    private current = 0;
    private line = 1;

    constructor(source: string) {
        this.source = source;
    }

    public scanTokens(): Token[] {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }

        const eofToken = new Token(TokenType.Eof, "", null, this.line);
        this.tokens.push(eofToken);
        return this.tokens;
    }

    private scanToken(): void {
        const ch = this.advance();
        let tokenType = TokenType[ch as keyof typeof TokenType];
        switch (ch) {
            case TokenType.LeftParen:
            case TokenType.RightParen:
            case TokenType.LeftBrace:
            case TokenType.RightBrace:
            case TokenType.Comma:
            case TokenType.Dot:
            case TokenType.Minus:
            case TokenType.Plus:
            case TokenType.SemiColon:
            case TokenType.Star:
                this.addToken(tokenType);
                break;
            case TokenType.Bang:
                tokenType = this.advanceIfMatch(TokenType.Equal)
                    ? TokenType.BangEqual
                    : TokenType.Bang;
                this.addToken(tokenType);
                break;
            case TokenType.Equal:
                tokenType = this.advanceIfMatch(TokenType.Equal)
                    ? TokenType.EqualEqual
                    : TokenType.Equal;
                this.addToken(tokenType);
                break;
            case TokenType.Less:
                tokenType = this.advanceIfMatch(TokenType.Equal)
                    ? TokenType.LessEqual
                    : TokenType.Less;
                this.addToken(tokenType);
                break;
            case TokenType.Greater:
                tokenType = this.advanceIfMatch(TokenType.Equal)
                    ? TokenType.GreaterEqual
                    : TokenType.Greater;
                this.addToken(tokenType);
                break;
            case TokenType.Slash:
                if (this.advanceIfMatch(TokenType.Slash)) {
                    this.advanceToEol();
                }
                break;
            case " ":
            case "\r":
            case "\t":
                break;
            case "\n":
                this.line++;
                break;
            case '"':
                this.addStringToken();
                break;
            default:
                if (isDigit(ch)) {
                    this.addNumberToken();
                    return;
                } else if (isAlphaNumeric(ch)) {
                    this.addIdentifierToken();
                    return;
                }

                throw new Error(`Unexpected character '${ch}'.`);
        }
    }

    private advance(): string {
        return this.source.charAt(this.current++);
    }

    private advanceIfMatch(ch: string) {
        if (this.isAtEnd() || this.source.charAt(this.current) !== ch) {
            return false;
        }

        this.current++;
        return true;
    }

    private advanceToEol(): void {
        while (this.peek() !== "\n" && !this.isAtEnd()) {
            this.advance();
        }
    }

    private peek(): string {
        if (this.isAtEnd()) {
            return "\0";
        }
        return this.source.charAt(this.current);
    }

    private peekNext(): string {
        if (this.isAtEnd()) {
            return "\0";
        }
        return this.source.charAt(this.current + 1);
    }

    private addToken(
        type: TokenType,
        literal: string | number | null = null
    ): void {
        const lexeme = this.source.slice(this.start, this.current);
        const token = new Token(type, lexeme, literal, this.line);
        this.tokens.push(token);
    }

    private addStringToken(): void {
        while (this.peek() != '"' && !this.isAtEnd()) {
            if (this.peek() == "\n") {
                this.line++;
            }

            this.advance();
        }

        if (this.isAtEnd()) {
            throw new Error("Unterminated string.");
        }

        this.advance();

        const str = this.source.slice(this.start + 1, this.current - 1);
        this.addToken(TokenType.String, str);
    }

    private addNumberToken(): void {
        while (isDigit(this.peek())) {
            this.advance();
        }

        if (this.peek() == "." && isDigit(this.peekNext())) {
            this.advance();
            while (isDigit(this.peek())) {
                this.advance();
            }
        }

        const num = Number(this.source.slice(this.start + 1, this.current - 1));
        this.addToken(TokenType.Number, num);
    }

    private addIdentifierToken(): void {
        while (isAlphaNumeric(this.peek())) {
            this.advance();
        }

        const text = this.source.slice(this.start, this.current);

        let type = TokenType.Identifier;
        if (text in TokenType) {
            type = TokenType[text as keyof typeof TokenType];
        }

        this.addToken(type);
    }

    private isAtEnd(): boolean {
        return this.current >= this.source.length;
    }
}

export default Scanner;
