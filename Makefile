# tool macros
CC ?= gcc
CXX ?= gcc
CFLAGS := -Wall -Wextra -Werror -Wshadow -Wdouble-promotion -Wformat=2 -Wundef -fno-common -g3
CXXFLAGS := -Wall -Wextra -Werror -Wshadow -Wdouble-promotion -Wformat=2 -Wundef -fno-common -g3
DBGFLAGS := -g
COBJFLAGS := $(CFLAGS) -c

# path macros
BIN_PATH := build/clox/bin
OBJ_PATH := build/clox/obj
SRC_PATH := clox
DBG_PATH := build/clox/debug

# compile macros
TARGET_NAME := clox
ifeq ($(OS),Windows_NT)
	TARGET_NAME := $(addsuffix .exe,$(TARGET_NAME))
endif
TARGET := $(BIN_PATH)/$(TARGET_NAME)
TARGET_DEBUG := $(DBG_PATH)/$(TARGET_NAME)

# src files & obj files
SRC := $(foreach x, $(SRC_PATH), $(wildcard $(addprefix $(x)/*,.c*)))
OBJ := $(addprefix $(OBJ_PATH)/, $(addsuffix .o, $(notdir $(basename $(SRC)))))
OBJ_DEBUG := $(addprefix $(DBG_PATH)/, $(addsuffix .o, $(notdir $(basename $(SRC)))))

# clean files list
DISTCLEAN_LIST := $(OBJ) \
                  $(OBJ_DEBUG)
CLEAN_LIST := $(TARGET) \
			  $(TARGET_DEBUG) \
			  $(DISTCLEAN_LIST)

# default rule
default: makedir all

# non-phony targets
$(TARGET): $(OBJ)
	$(CC) -o $@ $(OBJ) $(CFLAGS)

$(OBJ_PATH)/%.o: $(SRC_PATH)/%.c*
	$(CC) $(COBJFLAGS) -o $@ $<

$(DBG_PATH)/%.o: $(SRC_PATH)/%.c*
	$(CC) $(COBJFLAGS) $(DBGFLAGS) -o $@ $<

$(TARGET_DEBUG): $(OBJ_DEBUG)
	$(CC) $(CFLAGS) $(DBGFLAGS) $(OBJ_DEBUG) -o $@

.PHONY: clox
clox:
	./$(BIN_PATH)/$(TARGET_NAME)

# phony rules
.PHONY: makedir
makedir:
	@mkdir -p $(BIN_PATH) $(OBJ_PATH) $(DBG_PATH)

.PHONY: all
all: $(TARGET)

.PHONY: debug
debug: $(TARGET_DEBUG)

.PHONY: clean
clean:
	@echo CLEAN $(CLEAN_LIST)
	@rm -f $(CLEAN_LIST)

.PHONY: distclean
distclean:
	@echo CLEAN $(DISTCLEAN_LIST)
	@rm -f $(DISTCLEAN_LIST)