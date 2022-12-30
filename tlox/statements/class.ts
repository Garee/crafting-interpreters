import Var from "../expressions/var";
import Token from "../token";
import Visitor from "../visitors/visitor";
import Fun from "./fun";
import Stmt from "./stmt";

class Class extends Stmt {
    public name: Token;
    public methods: Fun[];
    public supercls?: Var;

    constructor(name: Token, methods: Fun[], supercls?: Var) {
        super();
        this.name = name;
        this.methods = methods;
        this.supercls = supercls;
    }

    public accept<T>(visitor: Visitor<T>): T {
        return visitor.visitClassStmt(this);
    }
}

export default Class;
