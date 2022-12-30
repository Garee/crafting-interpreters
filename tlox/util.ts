export function isDigit(ch: string): boolean {
    const code = ch.charCodeAt(0);
    return code >= "0".charCodeAt(0) && code <= "9".charCodeAt(0);
}

export function isAlpha(ch: string, opts = { allowUnderscore: true }): boolean {
    const code = ch.charCodeAt(0);
    return (
        (code >= "a".charCodeAt(0) && code <= "z".charCodeAt(0)) ||
        (code >= "A".charCodeAt(0) && code <= "Z".charCodeAt(0)) ||
        (code == "_".charCodeAt(0) && opts.allowUnderscore)
    );
}

export function isAlphaNumeric(s: string): boolean {
    return isDigit(s) || isAlpha(s);
}

export function isString(val: unknown): val is string {
    return typeof val === "string";
}

export function isNumber(val: unknown): val is number {
    return typeof val === "number";
}
