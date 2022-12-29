import RuntimeError from "./errors/runtime-error";
import Token from "./token";

class Environment {
    private values = new Map();
    private enclosing?: Environment;

    constructor(enclosing?: Environment) {
        this.enclosing = enclosing;
    }

    public define(name: Token, val: string | number | boolean | null): void {
        this.values.set(name.lexeme, val);
    }

    public get(name: Token): string | number | boolean | null {
        if (this.values.has(name.lexeme)) {
            return this.values.get(name.lexeme);
        }

        if (this.enclosing) {
            return this.enclosing.get(name);
        }

        throw new RuntimeError(
            name,
            `Undefined variable for '${name.lexeme}'.`
        );
    }

    public assign(name: Token, val: string | number | boolean | null): void {
        if (this.values.has(name.lexeme)) {
            this.values.set(name.lexeme, val);
            return;
        }

        if (this.enclosing) {
            this.enclosing.assign(name, val);
            return;
        }

        throw new RuntimeError(name, `Undefined variable '${name.lexeme}'.`);
    }
}

export default Environment;
