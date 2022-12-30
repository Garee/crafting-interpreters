import Token from "../core/token";
import Expr from "../expressions/expr";
import Visitor from "../visitors/visitor";
import Stmt from "./stmt";

class Return extends Stmt {
    public keyword: Token;
    public value: Expr;

    constructor(keyword: Token, value: Expr) {
        super();
        this.keyword = keyword;
        this.value = value;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitReturnStmt(this);
    }
}

export default Return;
