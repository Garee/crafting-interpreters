import { readFile } from "fs/promises";
import { createInterface } from "readline/promises";
import Parser from "./core/parser";
import Scanner from "./core/scanner";
import { ErrorType } from "./enums";
import ParseError from "./errors/parse-error";
import ResolveError from "./errors/resolve-error";
import RuntimeError from "./errors/runtime-error";
import ScanError from "./errors/scan-error";
import Interpreter from "./visitors/interpreter";
import Resolver from "./visitors/resolver";

class TLox {
    public error?: ErrorType;
    private interpreter = new Interpreter();

    public async runScript(script: string): Promise<void> {
        const contents = await this.readScript(script);
        this.run(contents);
    }

    public async prompt(): Promise<void> {
        const reader = createInterface(process.stdin, process.stdout);
        const prompting = true;
        console.log("Welcome to the Lox interpreter!");
        while (prompting) {
            const code = await reader.question("> ");
            this.run(code);
        }
    }

    public run(code: string): void {
        try {
            const scanner = new Scanner(code);
            const tokens = scanner.scanTokens();

            const parser = new Parser(tokens);
            const statements = parser.parse();

            const resolver = new Resolver(this.interpreter);
            resolver.resolveAllStmt(statements);

            this.interpreter.interpret(statements);
            this.error = undefined;
        } catch (err) {
            if (err instanceof ScanError) {
                this.handleError(err.line, err.message);
            }

            if (err instanceof ParseError) {
                this.handleError(err.token.line, err.message);
            }

            if (err instanceof ResolveError) {
                this.handleError(err.token.line, err.message);
            }

            if (err instanceof RuntimeError) {
                this.handleError(
                    err.token.line,
                    err.message,
                    ErrorType.Runtime
                );
            }
        }
    }

    private async readScript(script: string): Promise<string> {
        return readFile(script, { encoding: "utf8" });
    }

    private handleError(
        line: number,
        message: string,
        type = ErrorType.Default
    ): void {
        this.error = type;
        console.error(`[line ${line}] error: ${message}`);
    }
}

export default TLox;
