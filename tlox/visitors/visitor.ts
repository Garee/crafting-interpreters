import Binary from "../expressions/binary";
import Grouping from "../expressions/grouping";
import Literal from "../expressions/literal";
import Unary from "../expressions/unary";

abstract class Visitor<T> {
    abstract visitBinaryExpr(expr: Binary): T;
    abstract visitGroupingExpr(expr: Grouping): T;
    abstract visitLiteralExpr(expr: Literal): T;
    abstract visitUnaryExpr(expr: Unary): T;
}

export default Visitor;
