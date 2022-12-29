import Environment from "../environment";
import ReturnError from "../errors/return-error";
import Instance from "../instance";
import Fun from "../statements/fun";
import { LoxValue } from "../types";
import Interpreter from "../visitors/interpreter";
import Callable from "./callable";

class LoxFunction extends Callable {
    private readonly declaration: Fun;
    private readonly closure: Environment;

    constructor(declaration: Fun, closure: Environment) {
        super();
        this.declaration = declaration;
        this.closure = closure;
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
                return err.value;
            }
        }

        return null;
    }

    public bind(instance: Instance): LoxFunction {
        const env = new Environment(this.closure);
        env.define("this", instance);
        return new LoxFunction(this.declaration, env);
    }

    public arity(): number {
        return this.declaration.params.length;
    }

    public override toString(): string {
        return `<fn ${this.declaration.name.lexeme}>`;
    }
}

export default LoxFunction;
