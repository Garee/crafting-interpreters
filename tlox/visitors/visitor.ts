import Assignment from "../expressions/assignment";
import Binary from "../expressions/binary";
import Grouping from "../expressions/grouping";
import Literal from "../expressions/literal";
import Logical from "../expressions/logical";
import Unary from "../expressions/unary";
import Var from "../expressions/var";
import Block from "../statements/block";
import ExprStmt from "../statements/expr-stmt";
import If from "../statements/if";
import Print from "../statements/print";
import VarStmt from "../statements/var-stmt";
import While from "../statements/while";

abstract class Visitor<T> {
    abstract visitBinaryExpr(expr: Binary): T;
    abstract visitLogicalExpr(expr: Logical): T;
    abstract visitGroupingExpr(expr: Grouping): T;
    abstract visitLiteralExpr(expr: Literal): T;
    abstract visitUnaryExpr(expr: Unary): T;
    abstract visitAssignmentExpr(expr: Assignment): T;
    abstract visitVarExpr(expr: Var): T;
    abstract visitPrintStmt(stmt: Print): T;
    abstract visitExprStmt(stmt: ExprStmt): T;
    abstract visitVarStmt(stmt: VarStmt): T;
    abstract visitBlockStmt(stmt: Block): T;
    abstract visitIfStmt(stmt: If): T;
    abstract visitWhileStmt(stmt: While): T;
}

export default Visitor;
