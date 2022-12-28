import Visitor from "../visitors/visitor";
import Expr from "./expr";

class Grouping extends Expr {
    public expr: Expr;

    constructor(expr: Expr) {
        super();
        this.expr = expr;
    }

    accept(visitor: Visitor): string {
        return visitor.visitGroupingExpr(this);
    }
}

export default Grouping;
