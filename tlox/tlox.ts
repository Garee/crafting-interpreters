import { readFile } from "fs/promises";
import { createInterface } from "readline/promises";
import ParseError from "./errors/parse-error";
import RuntimeError from "./errors/runetime-error";
import ScanError from "./errors/scan-error";
import Parser from "./parser";
import Scanner from "./scanner";
import Interpreter from "./visitors/interpreter";

class TLox {
    public hasError = false;
    public hasRuntimeError = false;
    private interpreter = new Interpreter();

    public async runScript(script: string): Promise<void> {
        const contents = await this.readScript(script);
        this.run(contents);
    }

    public async prompt(): Promise<void> {
        const reader = createInterface(process.stdin);
        const prompting = true;
        while (prompting) {
            const code = await reader.question("> ");
            this.run(code);
            this.hasError = false;
        }
    }

    private run(code: string): void {
        try {
            const scanner = new Scanner(code);
            const tokens = scanner.scanTokens();
            const parser = new Parser(tokens);
            const expr = parser.parse();
            const result = this.interpreter.interpret(expr);
            console.log(result);
        } catch (err) {
            if (err instanceof ScanError) {
                this.handleError(err.line, err.message);
            }

            if (err instanceof ParseError) {
                this.handleError(err.token.line, err.message);
            }

            if (err instanceof RuntimeError) {
                this.handleError(err.token.line, err.message);
            }
        }
    }

    private async readScript(script: string): Promise<string> {
        return readFile(script, { encoding: "utf8" });
    }

    private handleError(
        line: number,
        message: string,
        opts = { runtime: true }
    ): void {
        this.hasError = true;
        if (opts.runtime) {
            this.hasRuntimeError = true;
        }
        console.error(`[line ${line}] error: ${message}`);
    }
}

export default TLox;
