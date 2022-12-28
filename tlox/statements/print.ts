import Expr from "../expressions/expr";
import Visitor from "../visitors/visitor";
import Stmt from "./stmt";

class Print extends Stmt {
    public expr: Expr;

    constructor(expr: Expr) {
        super();
        this.expr = expr;
    }

    public accept<T>(visitor: Visitor<T>): T {
        return visitor.visitPrintStmt(this);
    }
}

export default Print;
