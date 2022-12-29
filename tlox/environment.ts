import Callable from "./callable";
import RuntimeError from "./errors/runtime-error";
import Token from "./token";

class Environment {
    private values = new Map<
        string,
        string | number | boolean | Callable | null
    >();
    private enclosing?: Environment;

    constructor(enclosing?: Environment) {
        this.enclosing = enclosing;
    }

    public define(
        name: string,
        val: string | number | boolean | Callable | null
    ): void {
        this.values.set(name, val);
    }

    public get(name: Token): string | number | boolean | Callable | null {
        if (this.values.has(name.lexeme)) {
            return this.values.get(name.lexeme) ?? null;
        }

        if (this.enclosing) {
            return this.enclosing.get(name);
        }

        throw new RuntimeError(
            name,
            `Undefined variable for '${name.lexeme}'.`
        );
    }

    public getAt(
        name: Token,
        depth: number
    ): string | number | boolean | Callable | null {
        return this.ancestor(depth)?.values.get(name.lexeme) ?? null;
    }

    public assignAt(
        name: Token,
        val: string | number | boolean | Callable | null,
        depth: number
    ): void {
        const ancestor = this.ancestor(depth);
        ancestor?.values.set(name.lexeme, val);
    }

    public ancestor(depth: number): Environment | undefined {
        if (depth === 0) {
            return this;
        }

        let env = this.enclosing;
        for (let i = 0; i < depth - 1; i++) {
            env = env?.enclosing;
        }

        return env;
    }

    public assign(
        name: Token,
        val: string | number | boolean | Callable | null
    ): void {
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
