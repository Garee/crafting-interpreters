import Visitor from "../visitors/visitor";

abstract class Stmt {
    abstract accept<T>(visitor: Visitor<T>): T;
}

export default Stmt;
