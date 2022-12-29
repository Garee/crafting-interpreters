import Callable from "../callable";
import Environment from "../environment";
import ReturnError from "../errors/return-error";
import Fun from "../statements/fun";
import Interpreter from "../visitors/interpreter";

class Function extends Callable {
    private readonly declaration: Fun;
    private readonly closure: Environment;

    constructor(declaration: Fun, closure: Environment) {
        super();
        this.declaration = declaration;
        this.closure = closure;
    }

    public call(
        interpreter: Interpreter,
        args: (string | number | boolean | Callable | null)[]
    ): string | number | boolean | Callable | null {
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

    public arity(): number {
        return this.declaration.params.length;
    }

    public override toString(): string {
        return `<fn ${this.declaration.name.lexeme}>`;
    }
}

export default Function;
