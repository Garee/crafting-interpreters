#ifndef clox_memory_h
#define clox_memory_h

#include "common.h"
#include "memory.h"
#include "object.h"
#include "vm.h"

#define GROW_CAPACITY(capacity) \
    ((capacity) < 8 ? 8 : (capacity)*2)

#define GROW_ARRAY(type, pointer, prevCount, nextCount)    \
    (type*)reallocate(pointer, sizeof(type) * (prevCount), \
                      sizeof(type) * (nextCount))

#define FREE_ARRAY(type, pointer, prevCount) \
    reallocate(pointer, sizeof(type) * (prevCount), 0)

#define ALLOCATE(type, count) \
    (type*)reallocate(NULL, 0, sizeof(type) * (count))

#define FREE(type, pointer) reallocate(pointer, sizeof(type), 0)

extern VM vm;

void* reallocate(void* pointer, size_t prevSize, size_t nextSize);
void freeObjects();
void collectGarbage();
void markObject(Obj* object);
void markValue(Value value);

#endif
