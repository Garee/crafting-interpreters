#ifndef clox_chunk_h
#define clox_chunk_h

#include "common.h"

// The kind of instruction we are dealing with.
typedef enum
{
    OP_RETURN,
} OpCode;

// An instruction and associated data.
typedef struct {
    int count;
    int capacity;
    uint8_t *code;
} Chunk;

void initChunk(Chunk *chunk);
void writeChunk(Chunk *chunk, uint8_t byte);
void freeChunk(Chunk *chunk);

#endif
