MY_TARGET  :=  $(CMD_RELEASE_DIR)/bin.js
#MY_STATIC_TARGET  :=
MY_TARGETDIR := $(CMD_RELEASE_DIR)
MY_SRCDIR :=  $(CMD_DIR)/bin

ifeq ($(call FINDINLIST,$(MY_TARGET),$(ALL)),1)

MY_SRCS := \
	cat.js\
	domglue.js\
	exec.js\
	fsdump.js\
	glue.js\
	image.js\
	init.js\
	login.js\
	ls.js\
	mkdir.js\
	mount.js\
	shell.js\
	stat.js\
	write.js\

#MY_INCLUDES :=
#MY_CFLAGS := 
#MY_CPPFLAGS := 
#MY_LINKSCRIPT := 

include make/js_lib.mk

endif
