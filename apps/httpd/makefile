#httpd makefile
MY_TARGETDIR := $(APPS_BUILD_DIR)/httpd
MY_TARGET    := $(APPS_RELEASE_DIR)/httpd
MY_SRCDIR    := $(APPS_DIR)/httpd

ifeq ($(call FINDINLIST,$(MY_TARGET),$(ALL)),1)

MY_SRCS := \
	main.c

MY_INCLUDES := $(STDINCLUDE)
MY_CFLAGS := $(USER_CFLAGS)
MY_LIBS := $(LIBHTTP)
MY_LIBPATHS :=
MY_DEPS :=

include make/app.mk

endif
