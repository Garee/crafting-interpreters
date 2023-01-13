#ifndef clox_compiler_h
#define clox_compiler_h

#include <stdbool.h>

#include "chunk.h"
#include "object.h"

ObjFunction* compile(const char* source);
void markCompilerRoots();

#endif
