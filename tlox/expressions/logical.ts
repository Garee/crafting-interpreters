import Token from "../core/token";
import Visitor from "../visitors/visitor";
import Binary from "./binary";
import Expr from "./expr";

class Logical extends Binary {
    constructor(left: Expr, operator: Token, right: Expr) {
        super(left, operator, right);
    }

    public accept<T>(visitor: Visitor<T>): T {
        return visitor.visitLogicalExpr(this);
    }
}

export default Logical;
