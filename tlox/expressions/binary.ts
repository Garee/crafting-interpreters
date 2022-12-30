import Token from "../core/token";
import Visitor from "../visitors/visitor";
import Expr from "./expr";

class Binary extends Expr {
    public left: Expr;
    public operator: Token;
    public right: Expr;

    constructor(left: Expr, operator: Token, right: Expr) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    public accept<T>(visitor: Visitor<T>): T {
        return visitor.visitBinaryExpr(this);
    }
}

export default Binary;
