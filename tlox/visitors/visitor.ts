import Binary from "../expressions/binary";
import Grouping from "../expressions/grouping";
import Literal from "../expressions/literal";
import Unary from "../expressions/unary";

abstract class Visitor {
    abstract visitBinaryExpr(expr: Binary): string;
    abstract visitGroupingExpr(expr: Grouping): string;
    abstract visitLiteralExpr(expr: Literal): string;
    abstract visitUnaryExpr(expr: Unary): string;
}

export default Visitor;
