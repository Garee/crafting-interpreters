import Expr from "../expressions/expr";
import Visitor from "../visitors/visitor";
import Stmt from "./stmt";

class ExprStmt extends Stmt {
    public expr: Expr;

    constructor(expr: Expr) {
        super();
        this.expr = expr;
    }

    public accept<T>(visitor: Visitor<T>): T {
        return visitor.visitExprStmt(this);
    }
}

export default ExprStmt;
