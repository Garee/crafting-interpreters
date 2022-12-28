import Visitor from "../visitors/visitor";

abstract class Expr {
    abstract accept<T>(visitor: Visitor<T>): T;
}

export default Expr;
