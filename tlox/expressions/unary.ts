import Token from "../token";
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

    accept(visitor: Visitor) {
        visitor.visit(this);
    }
}

export default Unary;
