import Instance from "../oo/instance";
import { LoxValue } from "../types";
import Interpreter from "../visitors/interpreter";
import Callable from "./callable";
import LoxFunction from "./function";

class Class extends Callable {
    private readonly name: string;
    private readonly methods = new Map<string, LoxFunction>();
    public supercls?: Class;

    constructor(
        name: string,
        methods: Map<string, LoxFunction>,
        supercls?: Class
    ) {
        super();
        this.name = name;
        this.methods = methods;
        this.supercls = supercls;
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
        const method = this.methods.get(name);
        if (method) {
            return method;
        }

        return this.supercls?.findMethod(name);
    }

    public toString(): string {
        return this.name;
    }
}

export default Class;
