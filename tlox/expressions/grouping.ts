import Visitor from "../visitors/visitor";
import Expr from "./expr";

class Grouping extends Expr {
    public expr: Expr;

    constructor(expr: Expr) {
        super();
        this.expr = expr;
    }

    accept(visitor: Visitor) {
        visitor.visit(this);
    }
}

export default Grouping;
