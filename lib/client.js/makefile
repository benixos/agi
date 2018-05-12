MY_TARGET :=  $(LIBS_RELEASE_DIR)/libagi.js
MY_STATIC_TARGET :=
MY_TARGETDIR := $(LIBS_BUILD_DIR)
MY_SRCDIR := $(LIBS_DIR)/client.js

ifeq ($(call FINDINLIST,$(MY_TARGET),$(ALL)),1)

MY_SRCS := \
	types.js\
	channel.js\
	filenode.js\
	filesystem.js\
	agi.js\

include make/js_lib.mk

MY_TARGET :=
MY_STATIC_TARGET :=
MY_TARGET_DIR :=
MY_SRCDIR := 
MY_SRCS :=
MY_INCLUDES :=
MY_CFLAGS := 
MY_CPPFLAGS := 
MY_LINKSCRIPT := 

endif
