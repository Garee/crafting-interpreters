import Assignment from "../expressions/assignment";
import Binary from "../expressions/binary";
import Call from "../expressions/call";
import Get from "../expressions/get";
import Grouping from "../expressions/grouping";
import Literal from "../expressions/literal";
import Logical from "../expressions/logical";
import SetExpr from "../expressions/set";
import This from "../expressions/this";
import Unary from "../expressions/unary";
import Var from "../expressions/var";
import Block from "../statements/block";
import Class from "../statements/class";
import ExprStmt from "../statements/expr-stmt";
import Fun from "../statements/fun";
import If from "../statements/if";
import Print from "../statements/print";
import Return from "../statements/return";
import VarStmt from "../statements/var-stmt";
import While from "../statements/while";

abstract class Visitor<T> {
    abstract visitBinaryExpr(expr: Binary): T;
    abstract visitLogicalExpr(expr: Logical): T;
    abstract visitGroupingExpr(expr: Grouping): T;
    abstract visitLiteralExpr(expr: Literal): T;
    abstract visitUnaryExpr(expr: Unary): T;
    abstract visitCallExpr(expr: Call): T;
    abstract visitAssignmentExpr(expr: Assignment): T;
    abstract visitVarExpr(expr: Var): T;
    abstract visitGetExpr(expr: Get): T;
    abstract visitSetExpr(expr: SetExpr): T;
    abstract visitThisExpr(expr: This): T;
    abstract visitPrintStmt(stmt: Print): T;
    abstract visitExprStmt(stmt: ExprStmt): T;
    abstract visitVarStmt(stmt: VarStmt): T;
    abstract visitBlockStmt(stmt: Block): T;
    abstract visitIfStmt(stmt: If): T;
    abstract visitWhileStmt(stmt: While): T;
    abstract visitFunStmt(stmt: Fun): T;
    abstract visitReturnStmt(stmt: Return): T;
    abstract visitClassStmt(stmt: Class): T;
}

export default Visitor;
