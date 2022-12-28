import Visitor from "../visitors/visitor";

abstract class Expr {
    abstract accept(visitor: Visitor): any;
}

export default Expr;
