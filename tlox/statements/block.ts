import Visitor from "../visitors/visitor";
import Stmt from "./stmt";

class Block extends Stmt {
    public statements: Stmt[];

    constructor(statements: Stmt[]) {
        super();
        this.statements = statements;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitBlockStmt(this);
    }
}

export default Block;
