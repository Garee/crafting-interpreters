import Token from "../core/token";
import Visitor from "../visitors/visitor";
import Expr from "./expr";

class Assignment extends Expr {
    public name: Token;
    public val: Expr;

    constructor(name: Token, val: Expr) {
        super();
        this.name = name;
        this.val = val;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitAssignmentExpr(this);
    }
}

export default Assignment;
