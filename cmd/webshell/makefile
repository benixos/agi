#cmd makefile
MY_TARGETDIR := $(CMD_RELEASE_DIR)/webshell
MY_SRCDIR    := $(CMD_DIR)/webshell
MY_TARGET    := $(CMD_RELEASE_DIR)/webshell

ifeq ($(call FINDINLIST,$(MY_TARGET),$(ALL)),1)

MY_SRCS := \
	index.html\
	rootfs.ini\

MY_INCLUDES := $(STDINCLUDE)
MY_CFLAGS := $(USER_CFLAGS)
MY_LIBS := 
#MY_LIBPATHS :=
#MY_DEPS :=

include make/webapp.mk
endif
