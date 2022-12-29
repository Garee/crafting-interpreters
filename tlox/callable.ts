import Interpreter from "./visitors/interpreter";

abstract class Callable {
    public abstract call(
        interpreter: Interpreter,
        args: Array<string | number | boolean | Callable | null>
    ): string | number | boolean | Callable | null;

    public abstract arity(): number;
}

export default Callable;
