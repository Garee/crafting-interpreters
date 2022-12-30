import Environment from "../core/environment";
import Token from "../core/token";
import { TokenType } from "../enums";
import ReturnError from "../errors/return-error";
import Instance from "../oo/instance";
import Fun from "../statements/fun";
import { LoxValue } from "../types";
import Interpreter from "../visitors/interpreter";
import Callable from "./callable";

class LoxFunction extends Callable {
    private readonly declaration: Fun;
    private readonly closure: Environment;
    private readonly isConstructor: boolean = false;

    constructor(declaration: Fun, closure: Environment, isConstructor = false) {
        super();
        this.declaration = declaration;
        this.closure = closure;
        this.isConstructor = isConstructor;
    }

    public call(interpreter: Interpreter, args: LoxValue[]): LoxValue {
        const environment = new Environment(this.closure);
        this.declaration.params.forEach((p, i) => {
            environment.define(p.lexeme, args[i]);
        });
        try {
            interpreter.executeBlock(this.declaration.body, environment);
        } catch (err) {
            if (err instanceof ReturnError) {
                if (this.isConstructor) {
                    const token = new Token(TokenType.This, "this", null, 0);
                    return this.closure.getAt(token, 0);
                }
                return err.value;
            }
        }

        if (this.isConstructor) {
            const token = new Token(TokenType.This, "this", null, 0);
            return this.closure.getAt(token, 0);
        }

        return null;
    }

    public bind(instance: Instance): LoxFunction {
        const env = new Environment(this.closure);
        env.define("this", instance);
        return new LoxFunction(this.declaration, env, this.isConstructor);
    }

    public arity(): number {
        return this.declaration.params.length;
    }

    public override toString(): string {
        return `<fn ${this.declaration.name.lexeme}>`;
    }
}

export default LoxFunction;
