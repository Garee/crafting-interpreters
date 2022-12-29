import Binary from "../expressions/binary";
import Expr from "../expressions/expr";
import Grouping from "../expressions/grouping";
import Literal from "../expressions/literal";
import Unary from "../expressions/unary";
import Var from "../expressions/var";
import ExprStmt from "../statements/expr-stmt";
import Print from "../statements/print";
import VarStmt from "../statements/var-stmt";
import Visitor from "./visitor";

class AstPrinter extends Visitor<string> {
    public print(expr: Expr): string {
        return expr.accept<string>(this);
    }

    public visitVarStmt(_stmt: VarStmt): string {
        // TODO:
        return "";
    }

    public visitVarExpr(_expr: Var): string {
        // TODO:
        return "";
    }

    public visitExprStmt(stmt: ExprStmt): string {
        return this.parenthesise("stmt", stmt.expr);
    }

    public visitPrintStmt(stmt: Print): string {
        return this.parenthesise("print", stmt.expr);
    }

    public visitBinaryExpr(expr: Binary): string {
        return this.parenthesise(expr.operator.lexeme, expr.left, expr.right);
    }

    public visitGroupingExpr(expr: Grouping): string {
        return this.parenthesise("group", expr.expr);
    }

    public visitLiteralExpr(expr: Literal): string {
        if (expr.value == null) {
            return "nil";
        }

        return `${expr.value}`;
    }

    public visitUnaryExpr(expr: Unary): string {
        return this.parenthesise(expr.operator.lexeme, expr.right);
    }

    private parenthesise(name: string, ...exprs: Expr[]): string {
        let s = `(${name}`;
        exprs.forEach((expr) => {
            s += ` ${expr.accept<string>(this)}`;
        });
        return `${s})`;
    }
}

export default AstPrinter;
