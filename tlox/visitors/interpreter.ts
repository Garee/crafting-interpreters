import Callable from "../callable";
import Clock from "../callables/clock";
import Function from "../callables/function";
import { TokenType } from "../enums";
import Environment from "../environment";
import ReturnError from "../errors/return-error";
import RuntimeError from "../errors/runtime-error";
import Assignment from "../expressions/assignment";
import Binary from "../expressions/binary";
import Call from "../expressions/call";
import Expr from "../expressions/expr";
import Grouping from "../expressions/grouping";
import Literal from "../expressions/literal";
import Logical from "../expressions/logical";
import Unary from "../expressions/unary";
import Var from "../expressions/var";
import Block from "../statements/block";
import ExprStmt from "../statements/expr-stmt";
import Fun from "../statements/fun";
import If from "../statements/if";
import Print from "../statements/print";
import Return from "../statements/return";
import Stmt from "../statements/stmt";
import VarStmt from "../statements/var-stmt";
import While from "../statements/while";
import Token from "../token";
import { isNumber, isString } from "../util";
import Visitor from "./visitor";

class Interpreter extends Visitor<string | number | boolean | Callable | null> {
    private readonly globals = new Environment();
    private readonly locals = new Map<Expr, number>();
    private environment = this.globals;

    constructor() {
        super();
        this.globals.define("clock", new Clock());
    }

    public interpret(statements: Stmt[]): void {
        statements.forEach((stmt) => this.execute(stmt));
    }

    public execute(stmt: Stmt): void {
        stmt.accept(this);
    }

    public resolve(expr: Expr, scopeDepth: number): void {
        this.locals.set(expr, scopeDepth);
    }

    public visitReturnStmt(
        stmt: Return
    ): string | number | boolean | Callable | null {
        let val: string | number | boolean | Callable | null = null;
        if (stmt.value) {
            val = this.evaluate(stmt.value);
        }

        throw new ReturnError(val);
    }

    public visitFunStmt(
        stmt: Fun
    ): string | number | boolean | Callable | null {
        const func = new Function(stmt, this.environment);
        this.environment.define(stmt.name.lexeme, func);
        return null;
    }

    public visitCallExpr(
        expr: Call
    ): string | number | boolean | Callable | null {
        const callee = this.evaluate(expr.callee);
        if (!(callee instanceof Callable)) {
            throw new RuntimeError(
                expr.paren,
                "Can only call functions and classes."
            );
        }

        const args = expr.args.map((a) => this.evaluate(a));
        if (args.length != callee.arity()) {
            throw new RuntimeError(
                expr.paren,
                `Expected ${callee.arity()} arguments but got ${args.length}.`
            );
        }

        return callee.call(this, args);
    }

    public visitWhileStmt(stmt: While): string | number | boolean | null {
        while (this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.body);
        }

        return null;
    }

    public visitLogicalExpr(
        expr: Logical
    ): string | number | boolean | Callable | null {
        const result = this.evaluate(expr.left);
        if (expr.operator.type === TokenType.Or) {
            if (this.isTruthy(result)) {
                return result;
            }
        } else if (!this.isTruthy(result)) {
            return result;
        }

        return this.evaluate(expr.right);
    }

    public visitIfStmt(stmt: If): string | number | boolean | null {
        if (this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.then);
        } else if (stmt.else) {
            this.execute(stmt.else);
        }

        return null;
    }

    public visitBlockStmt(stmt: Block): string | number | boolean | null {
        this.executeBlock(stmt, new Environment(this.environment));
        return null;
    }

    public executeBlock(stmt: Block, environment: Environment): void {
        const prev = this.environment;
        this.environment = environment;

        try {
            stmt.statements.forEach((s) => this.execute(s));
        } finally {
            this.environment = prev;
        }
    }

    public visitAssignmentExpr(
        expr: Assignment
    ): string | number | boolean | Callable | null {
        const val = this.evaluate(expr.val);

        if (this.locals.has(expr)) {
            const depth = this.locals.get(expr);
            if (depth !== undefined) {
                this.environment.assignAt(expr.name, val, depth);
            }
        } else {
            this.globals.assign(expr.name, val);
        }

        return val;
    }

    public visitVarStmt(stmt: VarStmt): string | number | boolean | null {
        let val: string | number | boolean | Callable | null = null;
        if (stmt.initialiser) {
            val = this.evaluate(stmt.initialiser);
        }

        this.environment.define(stmt.name.lexeme, val);
        return null;
    }

    public visitVarExpr(
        expr: Var
    ): string | number | boolean | Callable | null {
        return this.lookupVar(expr.name, expr);
    }

    private lookupVar(
        name: Token,
        expr: Expr
    ): string | number | boolean | Callable | null {
        if (!this.locals.has(expr)) {
            return this.globals.get(name);
        }

        const depth = this.locals.get(expr);
        if (depth !== undefined) {
            return this.environment.getAt(name, depth);
        }

        return null;
    }

    public visitExprStmt(stmt: ExprStmt): string | number | boolean | null {
        this.evaluate(stmt.expr);
        return null;
    }

    public visitPrintStmt(stmt: Print): string | number | boolean | null {
        const result = this.evaluate(stmt.expr);
        console.log(this.stringify(result));
        return null;
    }

    public visitBinaryExpr(expr: Binary): string | number | boolean | null {
        const left = this.evaluate(expr.left);
        const right = this.evaluate(expr.right);

        switch (expr.operator.type) {
            case TokenType.Minus:
                if (isNumber(left) && isNumber(right)) {
                    return left - right;
                }
                throw new RuntimeError(
                    expr.operator,
                    "Operands must be numbers."
                );
            case TokenType.Slash:
                if (isNumber(left) && isNumber(right)) {
                    return left / right;
                }
                throw new RuntimeError(
                    expr.operator,
                    "Operands must be numbers."
                );
            case TokenType.Star:
                if (isNumber(left) && isNumber(right)) {
                    return left * right;
                }
                throw new RuntimeError(
                    expr.operator,
                    "Operands must be numbers."
                );
            case TokenType.Plus:
                if (isNumber(left) && isNumber(right)) {
                    return left + right;
                }

                if (isString(left) && isString(right)) {
                    return left + right;
                }

                throw new RuntimeError(
                    expr.operator,
                    "Operands must both be numbers or both be strings."
                );
            case TokenType.Greater:
                if (isNumber(left) && isNumber(right)) {
                    return left > right;
                }
                throw new RuntimeError(
                    expr.operator,
                    "Operands must be numbers."
                );
            case TokenType.GreaterEqual:
                if (isNumber(left) && isNumber(right)) {
                    return left >= right;
                }
                throw new RuntimeError(
                    expr.operator,
                    "Operands must be numbers."
                );
            case TokenType.Less:
                if (isNumber(left) && isNumber(right)) {
                    return left < right;
                }
                throw new RuntimeError(
                    expr.operator,
                    "Operands must be numbers."
                );
            case TokenType.LessEqual:
                if (isNumber(left) && isNumber(right)) {
                    return left <= right;
                }
                throw new RuntimeError(
                    expr.operator,
                    "Operands must be numbers."
                );
            case TokenType.EqualEqual:
                return left === right;
            case TokenType.BangEqual:
                return left !== right;
            default:
                break;
        }

        return null;
    }

    public visitGroupingExpr(
        expr: Grouping
    ): string | number | boolean | Callable | null {
        return this.evaluate(expr.expr);
    }

    public visitLiteralExpr(expr: Literal): string | number | boolean | null {
        return expr.value;
    }

    public visitUnaryExpr(expr: Unary): string | number | boolean | null {
        const right = this.evaluate(expr.right);

        switch (expr.operator.type) {
            case TokenType.Minus:
                if (typeof right === "number") {
                    return -right;
                }
                throw new RuntimeError(
                    expr.operator,
                    "Operand must be a number."
                );
            case TokenType.Bang:
                return this.isTruthy(right);
            default:
                break;
        }

        return null;
    }

    private evaluate(expr: Expr): string | number | boolean | Callable | null {
        return expr.accept(this);
    }

    private isTruthy(
        val: string | number | boolean | Callable | null
    ): boolean {
        if (val === null) {
            return false;
        }

        if (typeof val === "boolean") {
            return val;
        }

        return true;
    }

    public stringify(val: string | number | boolean | Callable | null): string {
        if (val === null) {
            return "nil";
        }

        if (val instanceof Callable) {
            return val.toString();
        }

        return `${val}`;
    }
}

export default Interpreter;
