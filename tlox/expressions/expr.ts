import Visitor from "../visitors/visitor";

abstract class Expr {
    abstract accept(visitor: Visitor): void;
}

export default Expr;
