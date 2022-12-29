import Expr from "../expressions/expr";
import Token from "../token";
import Visitor from "../visitors/visitor";
import Stmt from "./stmt";

class VarStmt extends Stmt {
    public name: Token;
    public initialiser?: Expr;

    constructor(name: Token, initialiser?: Expr) {
        super();
        this.name = name;
        this.initialiser = initialiser;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitVarStmt(this);
    }
}

export default VarStmt;
