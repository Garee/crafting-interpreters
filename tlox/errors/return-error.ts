import Callable from "../callable";

class ReturnError extends Error {
    public value: string | number | boolean | Callable | null;

    constructor(value: string | number | boolean | Callable | null) {
        super();
        this.value = value;
    }
}

export default ReturnError;
