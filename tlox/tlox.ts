import { readFile } from "fs/promises";
import { createInterface } from "readline/promises";
import Scanner from "./scanner";

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
        const scanner = new Scanner(code);
        const tokens = scanner.scanTokens();
        for (const t of tokens) {
            console.log(t);
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
