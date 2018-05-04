#web app makefile
MY_TARGETDIR := $(APPS_RELEASE_DIR)
MY_TARGET    := $(MY_TARGETDIR)/terminal.js
MY_SRCDIR    := $(APPS_DIR)/terminal

ifeq ($(call FINDINLIST,$(MY_TARGET),$(ALL)),1)

MY_SRCS := \
	terminal.js

include make/js_lib.mk
endif
