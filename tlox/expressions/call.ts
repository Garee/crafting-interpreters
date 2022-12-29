import Token from "../token";
import Visitor from "../visitors/visitor";
import Expr from "./expr";

class Call extends Expr {
    public callee: Expr;
    public paren: Token;
    public args: Expr[];

    constructor(callee: Expr, paren: Token, args: Expr[]) {
        super();
        this.callee = callee;
        this.paren = paren;
        this.args = args;
    }

    public accept<T>(visitor: Visitor<T>): T {
        return visitor.visitCallExpr(this);
    }
}

export default Call;
