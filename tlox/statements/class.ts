import Token from "../token";
import Visitor from "../visitors/visitor";
import Fun from "./fun";
import Stmt from "./stmt";

class Class extends Stmt {
    public name: Token;
    public methods: Fun[];

    constructor(name: Token, methods: Fun[]) {
        super();
        this.name = name;
        this.methods = methods;
    }

    public accept<T>(visitor: Visitor<T>): T {
        return visitor.visitClassStmt(this);
    }
}

export default Class;
