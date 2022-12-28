import Visitor from "../visitors/visitor";
import Expr from "./expr";

class Literal extends Expr {
    public value: number | string | boolean | null;

    constructor(value: number | string | boolean | null) {
        super();
        this.value = value;
    }

    accept(visitor: Visitor): string {
        return visitor.visitLiteralExpr(this);
    }
}

export default Literal;
