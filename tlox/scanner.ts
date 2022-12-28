import { TokenType } from "./enums";
import ScanError from "./errors/scan-error";
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
        let tokenType: TokenType;
        switch (ch) {
            case TokenType.LeftParen:
                this.addToken(TokenType.LeftParen);
                break;
            case TokenType.RightParen:
                this.addToken(TokenType.RightParen);
                break;
            case TokenType.LeftBrace:
                this.addToken(TokenType.LeftBrace);
                break;
            case TokenType.RightBrace:
                this.addToken(TokenType.RightBrace);
                break;
            case TokenType.Comma:
                this.addToken(TokenType.Comma);
                break;
            case TokenType.Dot:
                this.addToken(TokenType.Dot);
                break;
            case TokenType.Minus:
                this.addToken(TokenType.Minus);
                break;
            case TokenType.Plus:
                this.addToken(TokenType.Plus);
                break;
            case TokenType.SemiColon:
                this.addToken(TokenType.SemiColon);
                break;
            case TokenType.Star:
                this.addToken(TokenType.Star);
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
                } else {
                    this.addToken(TokenType.Slash);
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

                throw new ScanError(ch, this.line);
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
            throw new ScanError(this.peek(), this.line, "Unterminated string.");
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

        const num = Number(this.source.slice(this.start, this.current));
        this.addToken(TokenType.Number, num);
    }

    private addIdentifierToken(): void {
        while (isAlphaNumeric(this.peek())) {
            this.advance();
        }

        const text = this.source.slice(this.start, this.current);

        let type = TokenType.Identifier;

        switch (text) {
            case "print":
                type = TokenType.Print;
                break;
            case "and":
                type = TokenType.And;
                break;
            case "class":
                type = TokenType.Class;
                break;
            case "else":
                type = TokenType.Else;
                break;
            case "true":
                type = TokenType.True;
                break;
            case "false":
                type = TokenType.False;
                break;
            case "fun":
                type = TokenType.Fun;
                break;
            case "for":
                type = TokenType.For;
                break;
            case "if":
                type = TokenType.If;
                break;
            case "nil":
                type = TokenType.Nil;
                break;
            case "or":
                type = TokenType.Or;
                break;
            case "return":
                type = TokenType.Return;
                break;
            case "super":
                type = TokenType.Super;
                break;
            case "this":
                type = TokenType.This;
                break;
            case "var":
                type = TokenType.Var;
                break;
            case "while":
                type = TokenType.While;
                break;
            default:
                break;
        }

        this.addToken(type);
    }

    private isAtEnd(): boolean {
        return this.current >= this.source.length;
    }
}

export default Scanner;
