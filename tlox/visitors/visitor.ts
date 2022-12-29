import Assignment from "../expressions/assignment";
import Binary from "../expressions/binary";
import Grouping from "../expressions/grouping";
import Literal from "../expressions/literal";
import Unary from "../expressions/unary";
import Var from "../expressions/var";
import ExprStmt from "../statements/expr-stmt";
import Print from "../statements/print";
import VarStmt from "../statements/var-stmt";

abstract class Visitor<T> {
    abstract visitBinaryExpr(expr: Binary): T;
    abstract visitGroupingExpr(expr: Grouping): T;
    abstract visitLiteralExpr(expr: Literal): T;
    abstract visitUnaryExpr(expr: Unary): T;
    abstract visitAssignmentExpr(expr: Assignment): T;
    abstract visitVarExpr(expr: Var): T;
    abstract visitPrintStmt(stmt: Print): T;
    abstract visitExprStmt(stmt: ExprStmt): T;
    abstract visitVarStmt(stmt: VarStmt): T;
}

export default Visitor;
