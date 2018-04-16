MY_TARGET  :=  $(PIPES_RELEASE_DIR)/websocket.js
MY_STATIC_TARGET  :=
MY_TARGETDIR := $(PIPES_BUILD_DIR)
MY_SRCDIR :=  $(PIPES_DIR)/websocket

ifeq ($(call FINDINLIST,$(MY_TARGET),$(ALL)),1)

MY_SRCS := \
	websocket.js\

MY_INCLUDES :=
MY_CFLAGS := 
MY_CPPFLAGS := 
MY_LINKSCRIPT := 

include make/js_lib.mk

endif
