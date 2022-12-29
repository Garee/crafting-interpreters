import Class from "./callables/class";

class Instance {
    public cls: Class;

    constructor(cls: Class) {
        this.cls = cls;
    }

    public toString(): string {
        return `${this.cls} instance`;
    }
}

export default Instance;
