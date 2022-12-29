import Expr from "../expressions/expr";
import Visitor from "../visitors/visitor";
import Stmt from "./stmt";

class If extends Stmt {
    public condition: Expr;
    public then: Stmt;
    public else?: Stmt;

    constructor(condition: Expr, then: Stmt, els?: Stmt) {
        super();
        this.condition = condition;
        this.then = then;
        this.else = els;
    }

    public accept<T>(visitor: Visitor<T>): T {
        return visitor.visitIfStmt(this);
    }
}

export default If;
