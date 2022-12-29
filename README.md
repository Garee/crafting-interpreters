# Crafting Interpreters

Code and resources for the book [craftinginterpreters.com](https://craftinginterpreters.com/introduction.html)

## Install

Requires [Node.js](https://nodejs.org/en/) `>=18`.

```shell
npm run build
```

## Usage

REPL:

```shell
npm run tlox

Welcome to the Lox interpreter!
> 2 + 2
4
>
```

Run a script:

```shell
npm run tlox examples/1.lox

one
true
3
```

## Development

Lint:

```shell
npm run lint
```

Hot compile:

```shell
npm run dev
```

Typecheck:

```shell
npm run tsc:watch
```
