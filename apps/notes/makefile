#web app makefile
MY_TARGETDIR := $(APPS_RELEASE_DIR)
MY_TARGET    := $(MY_TARGETDIR)/notes.js
MY_SRCDIR    := $(APPS_DIR)/notes

ifeq ($(call FINDINLIST,$(MY_TARGET),$(ALL)),1)

MY_SRCS := \
	notes.js \

include make/js_lib.mk
endif
