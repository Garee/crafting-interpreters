import Visitor from "../visitors/visitor";
import Expr from "./expr";

class Literal extends Expr {
    public value: number | string | boolean | null;

    constructor(value: number | string | boolean | null) {
        super();
        this.value = value;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitLiteralExpr(this);
    }
}

export default Literal;
