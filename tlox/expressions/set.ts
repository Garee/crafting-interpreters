import Token from "../core/token";
import Visitor from "../visitors/visitor";
import Expr from "./expr";

class SetExpr extends Expr {
    public object: Expr;
    public name: Token;
    public value: Expr;

    constructor(object: Expr, name: Token, value: Expr) {
        super();
        this.object = object;
        this.name = name;
        this.value = value;
    }

    public accept<T>(visitor: Visitor<T>): T {
        return visitor.visitSetExpr(this);
    }
}

export default SetExpr;
