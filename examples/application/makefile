#demo makefile
MY_TARGETDIR := $(EXAMPLES_BUILD_DIR)/demo
MY_SRCDIR := $(EXAMPLES_DIR)/demo
MY_TARGET :=  $(MY_TARGETDIR)/demo
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
