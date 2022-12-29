import Instance from "../instance";
import { LoxValue } from "../types";
import Interpreter from "../visitors/interpreter";
import Callable from "./callable";
import LoxFunction from "./function";

class Class extends Callable {
    private readonly name: string;
    private readonly methods = new Map<string, LoxFunction>();

    constructor(name: string, methods: Map<string, LoxFunction>) {
        super();
        this.name = name;
        this.methods = methods;
    }

    public call(interpreter: Interpreter, args: LoxValue[]): LoxValue {
        const instance = new Instance(this);
        const constructor = this.findMethod("init");
        constructor?.bind(instance).call(interpreter, args);
        return instance;
    }

    public arity(): number {
        const constructor = this.findMethod("init");
        return constructor?.arity() ?? 0;
    }

    public findMethod(name: string): LoxFunction | undefined {
        return this.methods.get(name);
    }

    public toString(): string {
        return this.name;
    }
}

export default Class;
