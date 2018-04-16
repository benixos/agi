MY_TARGET  :=  $(FIXTURES_RELEASE_DIR)/stdio.js
MY_STATIC_TARGET  :=
MY_TARGETDIR := $(FIXTURES_BUILD_DIR)
MY_SRCDIR :=  $(FIXTURES_DIR)/stdio

ifeq ($(call FINDINLIST,$(MY_TARGET),$(ALL)),1)

MY_SRCS := \
	stdio.js\
	stdout.js\

MY_INCLUDES :=
MY_CFLAGS := 
MY_CPPFLAGS := 
MY_LINKSCRIPT := 

include make/js_lib.mk

endif
