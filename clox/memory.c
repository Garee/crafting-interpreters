#include <stdlib.h>
#include "memory.h"

void* reallocate(void* pointer, size_t prevSize, size_t nextSize) {
    if (nextSize == 0 && prevSize > 0) {
        free(pointer);
        return NULL;
    }

    void *result = realloc(pointer, nextSize);
    if (result == NULL) {
        exit(1);
    }

    return result;
}
