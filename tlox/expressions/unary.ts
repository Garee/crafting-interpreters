import Token from "../core/token";
import Visitor from "../visitors/visitor";
import Expr from "./expr";

class Unary extends Expr {
    public operator: Token;
    public right: Expr;

    constructor(operator: Token, right: Expr) {
        super();
        this.operator = operator;
        this.right = right;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitUnaryExpr(this);
    }
}

export default Unary;
