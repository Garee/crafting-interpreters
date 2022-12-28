class ScanError extends Error {
    public ch: string;
    public line: number;

    constructor(ch: string, line: number, message?: string) {
        super(message ?? `Unexpected character '${ch}'`);
        this.ch = ch;
        this.line = line;
    }
}

export default ScanError;
