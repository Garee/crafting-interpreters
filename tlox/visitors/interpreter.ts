import { TokenType } from "../enums";
import Environment from "../environment";
import RuntimeError from "../errors/runtime-error";
import Binary from "../expressions/binary";
import Expr from "../expressions/expr";
import Grouping from "../expressions/grouping";
import Literal from "../expressions/literal";
import Unary from "../expressions/unary";
import Var from "../expressions/var";
import ExprStmt from "../statements/expr-stmt";
import Print from "../statements/print";
import Stmt from "../statements/stmt";
import VarStmt from "../statements/var-stmt";
import { isNumber, isString } from "../util";
import Visitor from "./visitor";

class Interpreter extends Visitor<string | number | boolean | null> {
    private environment = new Environment();

    public interpret(statements: Stmt[]): void {
        statements.forEach((stmt) => this.execute(stmt));
    }

    public execute(stmt: Stmt): void {
        stmt.accept(this);
    }

    public visitVarStmt(stmt: VarStmt): string | number | boolean | null {
        let val: string | number | boolean | null = null;
        if (stmt.initialiser) {
            val = this.evaluate(stmt.initialiser);
        }

        this.environment.define(stmt.name, val);
        return null;
    }

    public visitVarExpr(expr: Var): string | number | boolean | null {
        return this.environment.get(expr.name);
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

    public visitGroupingExpr(expr: Grouping): string | number | boolean | null {
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

    private evaluate(expr: Expr): string | number | boolean | null {
        return expr.accept(this);
    }

    private isTruthy(val: string | number | boolean | null): boolean {
        if (val === null) {
            return false;
        }

        if (typeof val === "boolean") {
            return val;
        }

        return true;
    }

    public stringify(val: string | number | boolean | null): string {
        if (val === null) {
            return "nil";
        }

        return `${val}`;
    }
}

export default Interpreter;
