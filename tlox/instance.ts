import Class from "./callables/class";
import RuntimeError from "./errors/runtime-error";
import Token from "./token";
import { LoxValue } from "./types";

class Instance {
    private cls: Class;
    private fields = new Map<string, LoxValue>();

    constructor(cls: Class) {
        this.cls = cls;
    }

    public get(property: Token): LoxValue {
        if (this.fields.has(property.lexeme)) {
            return this.fields.get(property.lexeme) ?? null;
        }

        const method = this.cls.findMethod(property.lexeme);
        if (method) {
            return method;
        }

        throw new RuntimeError(
            property,
            `Undefined property '${property.lexeme}'.`
        );
    }

    public set(property: Token, val: LoxValue): void {
        this.fields.set(property.lexeme, val);
    }

    public toString(): string {
        return `${this.cls} instance`;
    }
}

export default Instance;
