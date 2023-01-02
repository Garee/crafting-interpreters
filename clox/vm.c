#include "vm.h"

#include <stdio.h>

#include "common.h"
#include "debug.h"

VM vm;

static void resetStack() {
    vm.stackTop = vm.stack;
}

void push(Value value) {
    *vm.stackTop = value;
    vm.stackTop++;
}

Value pop() {
    vm.stackTop--;
    return *vm.stackTop;
}

void initVM() {
    resetStack();
}

void freeVM() {
}

static uint8_t read_byte() {
    return *vm.ip++;
}

static Value read_constant() {
    return vm.chunk->constants.values[read_byte()];
}

static InterpretResult run() {
#define BINARY_OP(op)     \
    do {                  \
        double b = pop(); \
        double a = pop(); \
        push(a op b);     \
    } while (false)

    while (true) {
#ifdef DEBUG_TRACE_EXECUTION
        printf("          ");
        for (Value* slot = vm.stack; slot < vm.stackTop; slot++) {
            printf("[ ");
            printValue(*slot);
            printf(" ]");
        }
        printf("\n");
        disassembleInstruction(vm.chunk, (int)(vm.ip - vm.chunk->code));
#endif

        uint8_t instruction;
        switch (instruction = read_byte()) {
            case OP_CONSTANT: {
                Value constant = read_constant();
                push(constant);
                printValue(constant);
                printf("\n");
                break;
            }
            case OP_ADD:
                BINARY_OP(+);
                break;
            case OP_SUBTRACT:
                BINARY_OP(-);
                break;
            case OP_MULTIPLY:
                BINARY_OP(*);
                break;
            case OP_DIVIDE:
                BINARY_OP(/);
                break;
            case OP_NEGATE:
                push(-pop());
                break;
            case OP_RETURN:
                printValue(pop());
                printf("\n");
                return INTERPRET_OK;
        }
    }

#undef BINARY_OP
}

InterpretResult interpret(Chunk* chunk) {
    vm.chunk = chunk;
    vm.ip = vm.chunk->code;
    return run();
}