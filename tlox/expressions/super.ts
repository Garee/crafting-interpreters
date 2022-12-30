import Token from "../token";
import Visitor from "../visitors/visitor";
import Expr from "./expr";

class Super extends Expr {
    public keyword: Token;
    public method: Token;

    constructor(keyword: Token, method: Token) {
        super();
        this.keyword = keyword;
        this.method = method;
    }

    public accept<T>(visitor: Visitor<T>): T {
        return visitor.visitSuperExpr(this);
    }
}

export default Super;
