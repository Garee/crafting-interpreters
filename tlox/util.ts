export function isDigit(ch: string): boolean {
    const code = ch.charCodeAt(0);
    return code >= "0".charCodeAt(0) && code <= "9".charCodeAt(0);
}

export function isAlpha(s: string): boolean {
    const code = s.charCodeAt(0);
    return (
        (code >= "a".charCodeAt(0) && code <= "z".charCodeAt(0)) ||
        (code >= "A".charCodeAt(0) && code <= "Z".charCodeAt(0)) ||
        code == "_".charCodeAt(0)
    );
}

export function isAlphaNumeric(s: string): boolean {
    return isDigit(s) || isAlpha(s);
}
