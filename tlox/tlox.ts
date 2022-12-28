import { readFile } from "fs/promises";
import { createInterface } from "readline/promises";
import ParseError from "./errors/parse-error";
import ScanError from "./errors/scan-error";
import Parser from "./parser";
import Scanner from "./scanner";
import AstPrinter from "./visitors/ast-printer";

class TLox {
    public hasError = false;

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
            console.log(new AstPrinter().print(expr));
        } catch (err) {
            if (err instanceof ScanError) {
                this.handleError(err.line, err.message);
            }

            if (err instanceof ParseError) {
                this.handleError(err.token.line, err.message);
            }
        }
    }

    private async readScript(script: string): Promise<string> {
        return readFile(script, { encoding: "utf8" });
    }

    private handleError(line: number, message: string): void {
        this.hasError = true;
        console.error(`[line ${line}] error: ${message}`);
    }
}

export default TLox;
