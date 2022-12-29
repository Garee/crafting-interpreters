import Token from "../token";
import Visitor from "../visitors/visitor";
import Block from "./block";
import Stmt from "./stmt";

class Fun extends Stmt {
    public name: Token;
    public params: Token[];
    public body: Block;

    constructor(name: Token, params: Token[], body: Block) {
        super();
        this.name = name;
        this.params = params;
        this.body = body;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitFunStmt(this);
    }
}

export default Fun;
