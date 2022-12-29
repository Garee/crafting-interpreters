import { LoxValue } from "../types";
import Interpreter from "../visitors/interpreter";

abstract class Callable {
    public abstract call(interpreter: Interpreter, args: LoxValue[]): LoxValue;

    public abstract arity(): number;
}

export default Callable;
