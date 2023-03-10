import Token from "../core/token";
import { ClassType, FunctionType } from "../enums";
import ResolveError from "../errors/resolve-error";
import Assignment from "../expressions/assignment";
import Binary from "../expressions/binary";
import Call from "../expressions/call";
import Expr from "../expressions/expr";
import Get from "../expressions/get";
import Grouping from "../expressions/grouping";
import Literal from "../expressions/literal";
import Logical from "../expressions/logical";
import SetExpr from "../expressions/set";
import Super from "../expressions/super";
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
import Stmt from "../statements/stmt";
import VarStmt from "../statements/var-stmt";
import While from "../statements/while";
import Interpreter from "./interpreter";
import Visitor from "./visitor";

class Resolver extends Visitor<void> {
    private readonly interpreter: Interpreter;
    private scopes: Map<string, boolean>[] = [];
    private currentFunction?: FunctionType;
    private currentClass?: ClassType;

    constructor(interpreter: Interpreter) {
        super();
        this.interpreter = interpreter;
    }

    public visitSuperExpr(expr: Super): void {
        if (!this.currentClass) {
            throw new ResolveError(
                expr.keyword,
                "Can't use 'super' outside of a class."
            );
        }

        if (this.currentClass !== ClassType.Subclass) {
            throw new ResolveError(
                expr.keyword,
                "Can't use 'super' in a class with no superclass."
            );
        }

        this.resolveLocal(expr, expr.keyword);
    }

    public visitThisExpr(expr: This): void {
        if (this.currentClass !== ClassType.Class) {
            throw new ResolveError(
                expr.keyword,
                "Can't use 'this' outside of a class."
            );
        }

        this.resolveLocal(expr, expr.keyword);
    }

    public visitSetExpr(expr: SetExpr): void {
        this.resolveExpr(expr.value);
        this.resolveExpr(expr.object);
    }

    public visitGetExpr(expr: Get): void {
        this.resolveExpr(expr.object);
    }

    public visitClassStmt(stmt: Class): void {
        const enclosingClass = this.currentClass;
        this.currentClass = ClassType.Class;

        this.declare(stmt.name);
        this.define(stmt.name);

        if (stmt.supercls) {
            if (stmt.supercls.name.lexeme === stmt.name.lexeme) {
                throw new ResolveError(
                    stmt.supercls.name,
                    "A class can't inherit from itself."
                );
            }

            this.currentClass = ClassType.Subclass;
            this.resolveExpr(stmt.supercls);

            this.beginScope();
            const scope = this.scopes[this.scopes.length - 1];
            scope.set("super", true);
        }

        this.beginScope();

        const scope = this.scopes[this.scopes.length - 1];
        scope.set("this", true);

        stmt.methods.forEach((m) => {
            let type = FunctionType.Method;
            if (m.name.lexeme === "init") {
                type = FunctionType.Constructor;
            }

            this.resolveFunction(m, type);
        });

        this.endScope();

        if (stmt.supercls) {
            this.endScope();
        }

        this.currentClass = enclosingClass;
    }

    public visitBinaryExpr(expr: Binary): void {
        this.resolveExpr(expr.left);
        this.resolveExpr(expr.right);
    }

    public visitLogicalExpr(expr: Logical): void {
        this.resolveExpr(expr.left);
        this.resolveExpr(expr.right);
    }

    public visitGroupingExpr(expr: Grouping): void {
        this.resolveExpr(expr.expr);
    }

    public visitLiteralExpr(_expr: Literal): void {
        return;
    }

    public visitUnaryExpr(expr: Unary): void {
        this.resolveExpr(expr.right);
    }

    public visitCallExpr(expr: Call): void {
        this.resolveExpr(expr.callee);
        expr.args.forEach((a) => this.resolveExpr(a));
    }

    public visitAssignmentExpr(expr: Assignment): void {
        this.resolveExpr(expr.val);
        this.resolveLocal(expr, expr.name);
    }

    public visitVarExpr(expr: Var): void {
        if (this.scopes.length > 0) {
            const scope = this.scopes[this.scopes.length - 1];
            if (scope.get(expr.name.lexeme) === false) {
                throw new ResolveError(
                    expr.name,
                    "Can't read local variable in its own initialiser."
                );
            }
        }

        this.resolveLocal(expr, expr.name);
    }

    public visitPrintStmt(stmt: Print): void {
        this.resolveExpr(stmt.expr);
    }

    public visitExprStmt(stmt: ExprStmt): void {
        this.resolveExpr(stmt.expr);
    }

    public visitVarStmt(stmt: VarStmt): void {
        this.declare(stmt.name);
        if (stmt.initialiser) {
            this.resolveExpr(stmt.initialiser);
        }
        this.define(stmt.name);
    }

    public visitBlockStmt(stmt: Block): void {
        this.beginScope();
        this.resolveAllStmt(stmt.statements);
        this.endScope();
    }

    public visitIfStmt(stmt: If): void {
        this.resolveExpr(stmt.condition);
        this.resolveStmt(stmt.then);
        if (stmt.else) {
            this.resolveStmt(stmt.else);
        }
    }

    public visitWhileStmt(stmt: While): void {
        this.resolveExpr(stmt.condition);
        this.resolveStmt(stmt.body);
    }

    public visitFunStmt(stmt: Fun): void {
        this.declare(stmt.name);
        this.define(stmt.name);
        this.resolveFunction(stmt, FunctionType.Function);
    }

    public visitReturnStmt(stmt: Return): void {
        if (!this.currentFunction) {
            throw new ResolveError(
                stmt.keyword,
                "Can't return from top-level code."
            );
        }

        if (stmt.value) {
            if (this.currentFunction === FunctionType.Constructor) {
                throw new ResolveError(
                    stmt.keyword,
                    "Can't return a value from a constructor."
                );
            }
            this.resolveExpr(stmt.value);
        }
    }

    private resolveFunction(fun: Fun, type: FunctionType): void {
        const enclosingFunction = this.currentFunction;
        this.currentFunction = type;

        this.beginScope();
        fun.params.forEach((p) => {
            this.declare(p);
            this.define(p);
        });
        this.resolveAllStmt(fun.body.statements);
        this.endScope();

        this.currentFunction = enclosingFunction;
    }

    private resolveLocal(expr: Expr, name: Token): void {
        for (let i = this.scopes.length - 1, n = 0; i >= 0; i--, n++) {
            const scope = this.scopes[i];
            if (scope.has(name.lexeme)) {
                this.interpreter.resolve(expr, n);
                return;
            }
        }
    }

    private declare(name: Token): void {
        if (this.scopes.length === 0) {
            return;
        }

        const scope = this.scopes[this.scopes.length - 1];
        if (scope.has(name.lexeme)) {
            throw new ResolveError(
                name,
                "Already a variable with this name in this scope."
            );
        }

        scope.set(name.lexeme, false);
    }

    private define(name: Token): void {
        if (this.scopes.length === 0) {
            return;
        }

        const scope = this.scopes[this.scopes.length - 1];
        scope.set(name.lexeme, true);
    }

    private beginScope(): void {
        this.scopes.push(new Map());
    }

    private endScope(): void {
        this.scopes.pop();
    }

    public resolveAllStmt(statements: Stmt[]): void {
        statements.forEach((s) => this.resolveStmt(s));
    }

    private resolveStmt(stmt: Stmt): void {
        stmt.accept(this);
    }

    private resolveExpr(expr: Expr): void {
        expr.accept(this);
    }
}

export default Resolver;
