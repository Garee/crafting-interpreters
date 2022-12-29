import Class from "../class";
import Interpreter from "../visitors/interpreter";
import Callable from "./callable";

class Clock extends Callable {
    public call(
        _interpreter: Interpreter,
        _args: (string | number | boolean | Callable | Class | null)[]
    ): string | number | boolean | null {
        return new Date().getTime() / 1000;
    }

    public arity(): number {
        return 0;
    }

    public toString(): string {
        return "<native fn>";
    }
}

export default Clock;
