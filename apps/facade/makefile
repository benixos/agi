#web app makefile
MY_TARGETDIR := $(APPS_RELEASE_DIR)
MY_TARGET    := $(MY_TARGETDIR)/facade.js
MY_SRCDIR    := $(APPS_DIR)/facade

ifeq ($(call FINDINLIST,$(MY_TARGET),$(ALL)),1)

MY_SRCS := \
	facade.js\

include make/js_lib.mk
endif
