import Expr from "../expressions/expr";
import Visitor from "../visitors/visitor";
import Stmt from "./stmt";

class While extends Stmt {
    public condition: Expr;
    public body: Stmt;

    constructor(condition: Expr, body: Stmt) {
        super();
        this.condition = condition;
        this.body = body;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitWhileStmt(this);
    }
}

export default While;
