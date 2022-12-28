import Visitor from "../visitors/visitor";
import Expr from "./expr";

class Grouping extends Expr {
    public expr: Expr;

    constructor(expr: Expr) {
        super();
        this.expr = expr;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitGroupingExpr(this);
    }
}

export default Grouping;
