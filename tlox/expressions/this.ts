import Token from "../token";
import Visitor from "../visitors/visitor";
import Expr from "./expr";

class This extends Expr {
    public keyword: Token;

    constructor(keyword: Token) {
        super();
        this.keyword = keyword;
    }

    public accept<T>(visitor: Visitor<T>): T {
        return visitor.visitThisExpr(this);
    }
}

export default This;
