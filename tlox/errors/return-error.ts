import { LoxValue } from "../types";

class ReturnError extends Error {
    public value: LoxValue;

    constructor(value: LoxValue) {
        super();
        this.value = value;
    }
}

export default ReturnError;
