import Binary from "../expressions/binary";
import Expr from "../expressions/expr";
import Grouping from "../expressions/grouping";
import Literal from "../expressions/literal";
import Unary from "../expressions/unary";

abstract class Visitor {
    visit(expr: Expr) {
        console.log(expr);
    }

    abstract visitBinaryExpr(expr: Binary): string;
    abstract visitGroupingExpr(expr: Grouping): string;
    abstract visitLiteralExpr(expr: Literal): string;
    abstract visitUnaryExpr(expr: Unary): string;
}

export default Visitor;
