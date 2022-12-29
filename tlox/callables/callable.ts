import Class from "../class";
import Interpreter from "../visitors/interpreter";

abstract class Callable {
    public abstract call(
        interpreter: Interpreter,
        args: Array<string | number | boolean | Callable | Class | null>
    ): string | number | boolean | Callable | Class | null;

    public abstract arity(): number;
}

export default Callable;
