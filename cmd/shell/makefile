#cmd makefile
MY_TARGETDIR := $(CMD_BUILD_DIR)/shell
MY_SRCDIR    := $(CMD_DIR)/shell
MY_TARGET    := $(CMD_RELEASE_DIR)/shell

ifeq ($(call FINDINLIST,$(MY_TARGET),$(ALL)),1)

MY_SRCS := \
	main.c

MY_INCLUDES := $(STDINCLUDE)
MY_CFLAGS := $(USER_CFLAGS)
MY_LIBS := 
MY_LIBPATHS :=
MY_DEPS :=

include make/app.mk
endif
