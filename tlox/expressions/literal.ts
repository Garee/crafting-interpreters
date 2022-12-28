import Visitor from "../visitors/visitor";
import Expr from "./expr";

class Literal extends Expr {
    public value: number | string | null;

    constructor(value: number | string | null) {
        super();
        this.value = value;
    }

    accept(visitor: Visitor) {
        visitor.visit(this);
    }
}

export default Literal;
