import { TokenType } from "./enums";
import ParseError from "./errors/parse-error";
import Assignment from "./expressions/assignment";
import Binary from "./expressions/binary";
import Expr from "./expressions/expr";
import Grouping from "./expressions/grouping";
import Literal from "./expressions/literal";
import Logical from "./expressions/logical";
import Unary from "./expressions/unary";
import Var from "./expressions/var";
import Block from "./statements/block";
import ExprStmt from "./statements/expr-stmt";
import If from "./statements/if";
import Print from "./statements/print";
import Stmt from "./statements/stmt";
import VarStmt from "./statements/var-stmt";
import Token from "./token";

class Parser {
    public tokens: Token[];
    public current = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    public parse(): Stmt[] {
        const statements: Stmt[] = [];
        while (!this.isAtEnd()) {
            const dcl = this.declaration();
            if (dcl) {
                statements.push(dcl);
            }
        }
        return statements;
    }

    private declaration(): Stmt | undefined {
        try {
            if (this.match(TokenType.Var)) {
                return this.variable();
            }

            return this.statement();
        } catch (err) {
            if (err instanceof ParseError) {
                console.error(err.message);
                this.synchronise();
            }

            return undefined;
        }
    }

    private variable(): Stmt | undefined {
        const name = this.consume(TokenType.Identifier);

        let initialiser: Expr | undefined = undefined;
        if (this.match(TokenType.Equal)) {
            initialiser = this.expr();
        }

        this.consume(TokenType.SemiColon);
        if (name) {
            return new VarStmt(name, initialiser);
        }
    }

    private statement(): Stmt {
        if (this.match(TokenType.Print)) {
            return this.printStatement();
        }

        if (this.match(TokenType.LeftBrace)) {
            return this.blockStatement();
        }

        if (this.match(TokenType.If)) {
            return this.ifStatement();
        }

        return this.exprStatement();
    }

    private ifStatement(): Stmt {
        this.consume(TokenType.LeftParen);
        const condition = this.expr();
        this.consume(TokenType.RightParen);

        const then = this.statement();
        let els: Stmt | undefined = undefined;
        if (this.match(TokenType.Else)) {
            els = this.statement();
        }

        return new If(condition, then, els);
    }

    private blockStatement(): Stmt {
        const statements: Stmt[] = [];

        while (!this.check(TokenType.RightBrace) && !this.isAtEnd()) {
            const dcl = this.declaration();
            if (dcl) {
                statements.push(dcl);
            }
        }

        this.consume(TokenType.RightBrace);
        return new Block(statements);
    }

    private printStatement(): Stmt {
        const expr = this.expr();
        this.consume(TokenType.SemiColon);
        return new Print(expr);
    }

    private exprStatement(): Stmt {
        const expr = this.expr();
        this.consume(TokenType.SemiColon);
        return new ExprStmt(expr);
    }

    private expr(): Expr {
        return this.assignment();
    }

    private assignment(): Expr {
        const expr = this.or();

        if (this.match(TokenType.Equal)) {
            const equals = this.previous();
            const val = this.assignment();
            if (expr instanceof Var) {
                return new Assignment(expr.name, val);
            }

            this.handleError(equals, "Invalid assignment target.");
        }

        return expr;
    }

    private or(): Expr {
        const expr = this.and();

        while (this.match(TokenType.Or)) {
            const op = this.previous();
            const right = this.and();
            return new Logical(expr, op, right);
        }

        return expr;
    }

    private and(): Expr {
        const expr = this.equality();

        while (this.match(TokenType.And)) {
            const op = this.previous();
            const right = this.equality();
            return new Logical(expr, op, right);
        }

        return expr;
    }

    private equality(): Expr {
        let expr = this.comparison();
        while (this.match(TokenType.BangEqual, TokenType.EqualEqual)) {
            const op = this.previous();
            const right = this.comparison();
            if (op) {
                expr = new Binary(expr, op, right);
            }
        }
        return expr;
    }

    private comparison(): Expr {
        let expr = this.term();
        while (
            this.match(
                TokenType.Greater,
                TokenType.GreaterEqual,
                TokenType.Less,
                TokenType.LessEqual
            )
        ) {
            const op = this.previous();
            const right = this.term();
            if (op) {
                expr = new Binary(expr, op, right);
            }
        }
        return expr;
    }

    private term(): Expr {
        let expr = this.factor();
        while (this.match(TokenType.Minus, TokenType.Plus)) {
            const op = this.previous();
            const right = this.factor();
            if (op) {
                expr = new Binary(expr, op, right);
            }
        }
        return expr;
    }

    private factor(): Expr {
        let expr = this.unary();
        while (this.match(TokenType.Slash, TokenType.Star)) {
            const op = this.previous();
            const right = this.unary();
            if (op) {
                expr = new Binary(expr, op, right);
            }
        }
        return expr;
    }

    private unary(): Expr {
        if (this.match(TokenType.Bang, TokenType.Minus)) {
            const op = this.previous();
            const right = this.unary();
            if (op) {
                return new Unary(op, right);
            }
        }
        return this.primary();
    }

    private primary(): Expr {
        if (this.match(TokenType.False)) {
            return new Literal(false);
        }

        if (this.match(TokenType.True)) {
            return new Literal(true);
        }

        if (this.match(TokenType.Nil)) {
            return new Literal(null);
        }

        if (this.match(TokenType.Number, TokenType.String)) {
            const token = this.previous();
            if (token) {
                return new Literal(token.literal);
            }
        }

        if (this.match(TokenType.LeftParen)) {
            const expr = this.expr();
            this.consume(TokenType.RightParen);
            return new Grouping(expr);
        }

        if (this.match(TokenType.Identifier)) {
            return new Var(this.previous());
        }

        this.handleError(this.peek(), "Expected an expression.");
        return new Literal("");
    }

    private consume(type: TokenType): Token | undefined {
        if (this.check(type)) {
            return this.advance();
        }

        this.handleError(this.peek(), `Expected ${type}`);
    }

    private handleError(token: Token, message: string): void {
        if (token.type == TokenType.Eof) {
            message = `${token.line}, at end ${message}`;
        } else {
            message = `${token.line} at '${token.lexeme}' ${message}`;
        }

        throw new ParseError(token, message);
    }

    private previous(): Token {
        return this.tokens[this.current - 1];
    }

    private peek(): Token {
        return this.tokens[this.current];
    }

    private isAtEnd(): boolean {
        return this.peek()?.type === TokenType.Eof;
    }

    private advance(): Token {
        if (!this.isAtEnd()) {
            this.current++;
        }
        return this.previous();
    }

    private match(...types: TokenType[]): boolean {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    private check(type: TokenType): boolean {
        if (this.isAtEnd()) {
            return false;
        }
        return this.peek().type === type;
    }

    private synchronise() {
        this.advance();

        while (!this.isAtEnd()) {
            if (this.previous()?.type === TokenType.SemiColon) {
                return;
            }

            switch (this.peek().type) {
                case TokenType.Class:
                case TokenType.Fun:
                case TokenType.Var:
                case TokenType.For:
                case TokenType.If:
                case TokenType.While:
                case TokenType.Print:
                case TokenType.Return:
                    return;
                default:
                    break;
            }

            this.advance();
        }
    }
}

export default Parser;
