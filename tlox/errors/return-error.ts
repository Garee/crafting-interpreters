import Callable from "../callables/callable";
import Class from "../class";

class ReturnError extends Error {
    public value: string | number | boolean | Callable | Class | null;

    constructor(value: string | number | boolean | Callable | Class | null) {
        super();
        this.value = value;
    }
}

export default ReturnError;
