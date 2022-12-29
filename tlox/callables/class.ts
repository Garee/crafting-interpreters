import Instance from "../instance";
import { LoxValue } from "../types";
import Interpreter from "../visitors/interpreter";
import Callable from "./callable";

class Class extends Callable {
    private name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }

    public call(_interpreter: Interpreter, _args: LoxValue[]): LoxValue {
        return new Instance(this);
    }

    public arity(): number {
        return 0;
    }

    public toString(): string {
        return this.name;
    }
}

export default Class;
