import Token from "../core/token";
import Visitor from "../visitors/visitor";
import Expr from "./expr";

class Var extends Expr {
    public name: Token;

    constructor(name: Token) {
        super();
        this.name = name;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitVarExpr(this);
    }
}

export default Var;
