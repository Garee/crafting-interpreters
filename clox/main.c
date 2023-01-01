#include "common.h"
#include "chunk.h"
#include "debug.h"

int main() {
    Chunk chunk;
    initChunk(&chunk);

    int line = 123;
    int constant = addConstant(&chunk, 1.2);
    writeChunk(&chunk, OP_CONSTANT, line);
    writeChunk(&chunk, constant, line);

    writeChunk(&chunk, OP_RETURN, line + 1);
    disassembleChunk(&chunk, "test chunk");
    freeChunk(&chunk);
    return 0;
}
