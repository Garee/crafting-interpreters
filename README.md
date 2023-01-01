# Crafting Interpreters

Code and resources for the book [craftinginterpreters.com](https://craftinginterpreters.com/introduction.html)

## TLox

### Install

Requires [Node.js](https://nodejs.org/en/) `>=18`.

```shell
npm run build
```

### Usage

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
cat examples5/lox
fun fib(n) {
  if (n <= 1) return n;
  return fib(n - 2) + fib(n - 1);
}

for (var i = 0; i < 5; i = i + 1) {
  print fib(i);
}
```

```shell
npm run tlox examples/5.lox

0
1
1
2
3
```

### Development

Lint:

```shell
npm run lint
```

Hot compile and typecheck:

```shell
npm run dev
```

Test:

```shell
npm run test
```

## CLox

Requires [gcc](https://gcc.gnu.org/) and [Make](https://www.gnu.org/software/make/).

Compile:

```shell
make
```

Run:

```shell
make clox
```
