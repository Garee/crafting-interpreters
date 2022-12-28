import { TokenType } from "../enums";
import RuntimeError from "../errors/runetime-error";
import Binary from "../expressions/binary";
import Expr from "../expressions/expr";
import Grouping from "../expressions/grouping";
import Literal from "../expressions/literal";
import Unary from "../expressions/unary";
import { isNumber, isString } from "../util";
import Visitor from "./visitor";

class Interpreter extends Visitor<string | number | boolean | null> {
    public interpret(expr: Expr): string {
        const result = this.evaluate(expr);

        if (result === null) {
            return "nil";
        }

        return `${result}`;
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
}

export default Interpreter;
