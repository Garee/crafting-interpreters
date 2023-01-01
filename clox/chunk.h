#ifndef clox_chunk_h
#define clox_chunk_h

#include "common.h"
#include "value.h"

// The kind of instruction we are dealing with.
typedef enum
{
    OP_CONSTANT,
    OP_RETURN,
} OpCode;

// An instruction and associated data.
typedef struct {
    int count;
    int capacity;
    uint8_t *code;
    ValueArray constants;
    int* lines;
} Chunk;

void initChunk(Chunk *chunk);
void writeChunk(Chunk *chunk, uint8_t byte, int line);
void freeChunk(Chunk *chunk);
int addConstant(Chunk* chunk, Value value);

#endif
