import { FunctionType, TokenType } from "./enums";
import ParseError from "./errors/parse-error";
import Assignment from "./expressions/assignment";
import Binary from "./expressions/binary";
import Call from "./expressions/call";
import Expr from "./expressions/expr";
import Get from "./expressions/get";
import Grouping from "./expressions/grouping";
import Literal from "./expressions/literal";
import Logical from "./expressions/logical";
import SetExpr from "./expressions/set";
import Super from "./expressions/super";
import This from "./expressions/this";
import Unary from "./expressions/unary";
import Var from "./expressions/var";
import Block from "./statements/block";
import Class from "./statements/class";
import ExprStmt from "./statements/expr-stmt";
import Fun from "./statements/fun";
import If from "./statements/if";
import Print from "./statements/print";
import Return from "./statements/return";
import Stmt from "./statements/stmt";
import VarStmt from "./statements/var-stmt";
import While from "./statements/while";
import Token from "./token";

class Parser {
    public tokens: Token[];
    public current = 0;

    private static readonly MAX_ARGS = 255;

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

    private variable(): VarStmt | undefined {
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

        if (this.match(TokenType.While)) {
            return this.whileStatement();
        }

        if (this.match(TokenType.For)) {
            return this.forStatement();
        }

        if (this.match(TokenType.Fun)) {
            const fun = this.function();
            if (fun) {
                return fun;
            }
        }

        if (this.match(TokenType.Return)) {
            const stmt = this.returnStatement();
            if (stmt) {
                return stmt;
            }
        }
        if (this.match(TokenType.Class)) {
            const cls = this.classDeclaration();
            if (cls) {
                return cls;
            }
        }

        return this.exprStatement();
    }

    private classDeclaration(): Class | undefined {
        const name = this.consume(TokenType.Identifier);

        let supercls: Var | undefined;
        if (this.match(TokenType.Less)) {
            this.consume(TokenType.Identifier);
            supercls = new Var(this.previous());
        }

        this.consume(TokenType.LeftBrace);

        const methods: Fun[] = [];
        while (!this.check(TokenType.RightBrace) && !this.isAtEnd()) {
            const fun = this.function(FunctionType.Method);
            if (fun) {
                methods.push(fun);
            }
        }

        this.consume(TokenType.RightBrace);
        if (name) {
            return new Class(name, methods, supercls);
        }
    }

    private returnStatement(): Return | undefined {
        const keyword = this.previous();
        let val: Expr | undefined;
        if (!this.check(TokenType.SemiColon)) {
            val = this.expr();
        }
        this.consume(TokenType.SemiColon);
        if (val) {
            return new Return(keyword, val);
        }
    }

    private function(_type = FunctionType.Function): Fun | undefined {
        const name = this.consume(TokenType.Identifier);
        this.consume(TokenType.LeftParen);

        const params: Token[] = [];
        if (!this.check(TokenType.RightParen)) {
            do {
                if (params.length >= Parser.MAX_ARGS) {
                    throw new ParseError(
                        this.peek(),
                        `Can't have more than ${Parser.MAX_ARGS} parameters.`
                    );
                }

                const param = this.consume(TokenType.Identifier);
                if (param) {
                    params.push(param);
                }
            } while (this.match(TokenType.Comma));
        }

        this.consume(TokenType.RightParen);
        this.consume(TokenType.LeftBrace);

        const body = this.blockStatement();
        if (name) {
            return new Fun(name, params, body);
        }
    }

    private forStatement(): Stmt {
        this.consume(TokenType.LeftParen);

        let initialiser: Stmt | undefined;
        if (this.match(TokenType.SemiColon)) {
            initialiser = undefined;
        } else if (this.match(TokenType.Var)) {
            initialiser = this.variable();
        } else {
            initialiser = this.expr();
        }

        let condition: Stmt | undefined;
        if (!this.check(TokenType.SemiColon)) {
            condition = this.expr();
        }

        this.consume(TokenType.SemiColon);

        let increment: Stmt | undefined;
        if (!this.check(TokenType.RightParen)) {
            increment = this.expr();
        }

        this.consume(TokenType.RightParen);

        let body = this.statement();
        if (increment) {
            body = new Block([body, increment]);
        }

        if (!condition) {
            condition = new Literal(true);
        }

        body = new While(condition, body);

        if (initialiser) {
            body = new Block([initialiser, body]);
        }

        return body;
    }

    private whileStatement(): While {
        this.consume(TokenType.LeftParen);
        const condition = this.expr();
        this.consume(TokenType.RightParen);
        const body = this.statement();
        return new While(condition, body);
    }

    private ifStatement(): If {
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

    private blockStatement(): Block {
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

    private printStatement(): Print {
        const expr = this.expr();
        this.consume(TokenType.SemiColon);
        return new Print(expr);
    }

    private exprStatement(): ExprStmt {
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

            if (expr instanceof Get) {
                return new SetExpr(expr.object, expr.name, val);
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
        return this.call();
    }

    private call(): Expr {
        let expr = this.primary();

        const parsing = true;
        while (parsing) {
            if (this.match(TokenType.LeftParen)) {
                const result = this.doCall(expr);
                if (result) {
                    expr = result;
                }
            } else if (this.match(TokenType.Dot)) {
                const name = this.consume(TokenType.Identifier);
                if (name) {
                    expr = new Get(expr, name);
                }
            } else {
                break;
            }
        }

        return expr;
    }

    private doCall(callee: Expr): Expr | undefined {
        const args: Expr[] = [];
        if (!this.check(TokenType.RightParen)) {
            do {
                args.push(this.expr());
            } while (this.match(TokenType.Comma));
        }

        if (args.length >= Parser.MAX_ARGS) {
            throw new ParseError(
                this.peek(),
                `Can't have more than ${Parser.MAX_ARGS} arguments.`
            );
        }

        const paren = this.consume(TokenType.RightParen);
        if (paren) {
            return new Call(callee, paren, args);
        }
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

        if (this.match(TokenType.This)) {
            return new This(this.previous());
        }

        if (this.match(TokenType.Super)) {
            const keyword = this.previous();
            this.consume(TokenType.Dot);
            const method = this.consume(TokenType.Identifier);
            if (method) {
                return new Super(keyword, method);
            }
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
