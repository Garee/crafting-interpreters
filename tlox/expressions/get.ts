import Token from "../token";
import Visitor from "../visitors/visitor";
import Expr from "./expr";

class Get extends Expr {
    public object: Expr;
    public name: Token;

    constructor(object: Expr, name: Token) {
        super();
        this.object = object;
        this.name = name;
    }

    public accept<T>(visitor: Visitor<T>): T {
        return visitor.visitGetExpr(this);
    }
}

export default Get;
