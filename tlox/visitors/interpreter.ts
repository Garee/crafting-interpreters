import Callable from "../callables/callable";
import Class from "../callables/class";
import Clock from "../callables/clock";
import LoxFunction from "../callables/function";
import { TokenType } from "../enums";
import Environment from "../environment";
import ReturnError from "../errors/return-error";
import RuntimeError from "../errors/runtime-error";
import Assignment from "../expressions/assignment";
import Binary from "../expressions/binary";
import Call from "../expressions/call";
import Expr from "../expressions/expr";
import Get from "../expressions/get";
import Grouping from "../expressions/grouping";
import Literal from "../expressions/literal";
import Logical from "../expressions/logical";
import SetExpr from "../expressions/set";
import This from "../expressions/this";
import Unary from "../expressions/unary";
import Var from "../expressions/var";
import Instance from "../instance";
import Block from "../statements/block";
import ClassStmt from "../statements/class";
import ExprStmt from "../statements/expr-stmt";
import Fun from "../statements/fun";
import If from "../statements/if";
import Print from "../statements/print";
import Return from "../statements/return";
import Stmt from "../statements/stmt";
import VarStmt from "../statements/var-stmt";
import While from "../statements/while";
import Token from "../token";
import { LoxValue } from "../types";
import { isNumber, isString } from "../util";
import Visitor from "./visitor";

class Interpreter extends Visitor<LoxValue> {
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

    public visitThisExpr(expr: This): LoxValue {
        return this.lookupVar(expr.keyword, expr);
    }

    public visitSetExpr(expr: SetExpr): LoxValue {
        const object = this.evaluate(expr.object);
        if (object instanceof Instance) {
            const val = this.evaluate(expr.value);
            object.set(expr.name, val);
            return null;
        }

        throw new RuntimeError(expr.name, "Only instances have fields.");
    }

    public visitGetExpr(expr: Get): LoxValue {
        const object = this.evaluate(expr.object);
        if (object instanceof Instance) {
            return object.get(expr.name);
        }

        throw new RuntimeError(expr.name, "Only instances have properties.");
    }

    public visitClassStmt(stmt: ClassStmt): LoxValue {
        this.environment.define(stmt.name.lexeme, null);

        const methods = stmt.methods.reduce((acc, m) => {
            acc.set(m.name.lexeme, new LoxFunction(m, this.environment));
            return acc;
        }, new Map<string, LoxFunction>());

        const cls = new Class(stmt.name.lexeme, methods);
        this.environment.assign(stmt.name, cls);

        return null;
    }

    public visitReturnStmt(stmt: Return): LoxValue {
        let val: LoxValue = null;
        if (stmt.value) {
            val = this.evaluate(stmt.value);
        }

        throw new ReturnError(val);
    }

    public visitFunStmt(stmt: Fun): LoxValue {
        const func = new LoxFunction(stmt, this.environment);
        this.environment.define(stmt.name.lexeme, func);
        return null;
    }

    public visitCallExpr(expr: Call): LoxValue {
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

    public visitWhileStmt(stmt: While): LoxValue {
        while (this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.body);
        }

        return null;
    }

    public visitLogicalExpr(expr: Logical): LoxValue {
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

    public visitIfStmt(stmt: If): LoxValue {
        if (this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.then);
        } else if (stmt.else) {
            this.execute(stmt.else);
        }

        return null;
    }

    public visitBlockStmt(stmt: Block): LoxValue {
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

    public visitAssignmentExpr(expr: Assignment): LoxValue {
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

    public visitVarStmt(stmt: VarStmt): LoxValue {
        let val: LoxValue = null;
        if (stmt.initialiser) {
            val = this.evaluate(stmt.initialiser);
        }

        this.environment.define(stmt.name.lexeme, val);
        return null;
    }

    public visitVarExpr(expr: Var): LoxValue {
        return this.lookupVar(expr.name, expr);
    }

    private lookupVar(name: Token, expr: Expr): LoxValue {
        if (!this.locals.has(expr)) {
            return this.globals.get(name);
        }

        const depth = this.locals.get(expr);
        if (depth !== undefined) {
            return this.environment.getAt(name, depth);
        }

        return null;
    }

    public visitExprStmt(stmt: ExprStmt): LoxValue {
        this.evaluate(stmt.expr);
        return null;
    }

    public visitPrintStmt(stmt: Print): LoxValue {
        const result = this.evaluate(stmt.expr);
        console.log(this.stringify(result));
        return null;
    }

    public visitBinaryExpr(expr: Binary): LoxValue {
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

    public visitGroupingExpr(expr: Grouping): LoxValue {
        return this.evaluate(expr.expr);
    }

    public visitLiteralExpr(expr: Literal): LoxValue {
        return expr.value;
    }

    public visitUnaryExpr(expr: Unary): LoxValue {
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

    private evaluate(expr: Expr): LoxValue {
        return expr.accept(this);
    }

    private isTruthy(val: LoxValue): boolean {
        if (val === null) {
            return false;
        }

        if (typeof val === "boolean") {
            return val;
        }

        return true;
    }

    public stringify(val: LoxValue): string {
        if (val === null) {
            return "nil";
        }

        if (val instanceof Callable || val instanceof Class) {
            return val.toString();
        }

        return `${val}`;
    }
}

export default Interpreter;
