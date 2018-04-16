MY_TARGET  :=  $(PIPES_RELEASE_DIR)/xmpp.js
MY_STATIC_TARGET  :=
MY_TARGETDIR := $(PIPES_BUILD_DIR)
MY_SRCDIR :=  $(PIPES_DIR)/xmpp

ifeq ($(call FINDINLIST,$(MY_TARGET),$(ALL)),1)

MY_SRCS := \
	xmpp.js\

MY_INCLUDES :=
MY_CFLAGS := 
MY_CPPFLAGS := 
MY_LINKSCRIPT := 

include make/js_lib.mk

endif
