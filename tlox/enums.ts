export enum TokenType {
    LeftParen = "(",
    RightParen = ")",
    LeftBrace = "{",
    RightBrace = "}",
    Comma = ",",
    Dot = ".",
    Minus = "-",
    Plus = "+",
    SemiColon = ";",
    Slash = "/",
    Star = "*",
    Bang = "!",
    BangEqual = "!=",
    Equal = "=",
    EqualEqual = "==",
    Greater = ">",
    GreaterEqual = ">=",
    Less = "<",
    LessEqual = "<=",
    Identifier = "id",
    String = "string",
    Number = "number",
    And = "and",
    Class = "class",
    Else = "else",
    False = "false",
    Fun = "fun",
    For = "for",
    If = "if",
    Nil = "nil",
    Or = "or",
    Print = "print",
    Return = "return",
    Super = "super",
    This = "this",
    True = "true",
    Var = "var",
    While = "while",
    Eof = "\0",
}

export enum FunctionType {
    None,
    Function,
    Constructor,
    Method,
}

export enum ClassType {
    None,
    Class,
}
