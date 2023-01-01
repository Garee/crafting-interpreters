#ifndef clox_memory_h
#define clox_memory_h

#include "common.h"

#define GROW_CAPACITY(capacity) \
    ((capacity) < 8 ? 8 : (capacity) * 2)

#define GROW_ARRAY(type, pointer, prevCount, nextCount) \
    (type*)reallocate(pointer, sizeof(type) * (prevCount), \
        sizeof(type) * (nextCount))

#define FREE_ARRAY(type, pointer, prevCount) \
    reallocate(pointer, sizeof(type) * (prevCount), 0)

void* reallocate(void *pointer, size_t prevSize, size_t nextSize);

#endif
