import { ErrorType } from "./enums";
import TLox from "./tlox";

if (process.argv.length > 3) {
    console.log(process.argv);
    console.log("Usage: tlox [script]");
    process.exit(1);
}

const tlox = new TLox();
if (process.argv.length == 3) {
    const script: string = process.argv[2];
    tlox.runScript(script);
    if (tlox.error) {
        process.exit(tlox.error === ErrorType.Runtime ? 70 : 65);
    }
} else {
    tlox.prompt();
}
