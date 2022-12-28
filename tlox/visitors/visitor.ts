import Binary from "../expressions/binary";
import Grouping from "../expressions/grouping";
import Literal from "../expressions/literal";
import Unary from "../expressions/unary";
import ExprStmt from "../statements/expr-stmt";
import Print from "../statements/print";

abstract class Visitor<T> {
    abstract visitBinaryExpr(expr: Binary): T;
    abstract visitGroupingExpr(expr: Grouping): T;
    abstract visitLiteralExpr(expr: Literal): T;
    abstract visitUnaryExpr(expr: Unary): T;
    abstract visitPrintStmt(stmt: Print): T;
    abstract visitExprStmt(stmt: ExprStmt): T;
}

export default Visitor;
