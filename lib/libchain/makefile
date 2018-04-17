MY_TARGET        := $(LIBS_RELEASE_DIR)/libchain.a
#MY_STATIC_TARGET := $(LIBS_RELEASE_DIR)/libchain.a
MY_TARGETDIR     := $(LIBS_BUILD_DIR)/libchain
MY_SRCDIR        := $(LIBS_DIR)/libchain

ifeq ($(call FINDINLIST,$(MY_TARGET),$(ALL)),1)

MY_SRCS := \
	bitblock.c \
	bitchain.c \
	bithash.c \
	blockfile.c \

MY_INCLUDES := $(STDINCLUDE)
MY_CFLAGS := $(USER_CFLAGS) $(LIBC_EXTRA_CFLAGS)
MY_CPPFLAGS := $(USER_CFLAGS) $(LIBC_EXTRA_CFLAGS)
MY_LINKSCRIPT := $(LIBS_LDSCRIPT)

include make/lib.mk

endif
